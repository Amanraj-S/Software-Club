import { spawn } from 'child_process';
import { ROUND2_PROBLEMS_BACKEND } from '../data/questions/round2ProblemsBackend.js';

/**
 * Execute Python solution code against a set of test cases.
 * @param {string} code - Python source code submitted by student
 * @param {object} problem - Problem object from backend dataset
 * @param {array} testCases - List of test cases ({ id, input, expected })
 * @returns {Promise<{ testResults: array, passedCount: number, totalCount: number, executionTimeMs: number, error: string|null }>}
 */
export const executePythonCode = (code, problem, testCases) => {
  return new Promise((resolve) => {
    const startTime = Date.now();

    // Prepare Python wrapper code
    const testInputs = testCases.map(tc => tc.input);

    const pythonHarness = `
import sys
import json
import ast

# --- STUDENT CODE BEGIN ---
${code}
# --- STUDENT CODE END ---

test_inputs = ${JSON.stringify(testInputs)}

results = []
func_name = "${problem.functionName}"

for raw_input in test_inputs:
    try:
        if func_name not in globals():
            results.append({"success": False, "error": f"Function '{func_name}' is not defined."})
            continue

        func = globals()[func_name]
        
        # Parse input safely
        try:
            arg = json.loads(raw_input)
        except Exception:
            try:
                arg = ast.literal_eval(raw_input)
            except Exception:
                arg = raw_input

        if isinstance(arg, tuple):
            res = func(*arg)
        else:
            res = func(arg)

        # Normalize output string representation
        if isinstance(res, bool):
            out_str = "True" if res else "False"
        elif isinstance(res, dict):
            # Format dict keys/values consistently
            out_str = json.dumps(res, sort_keys=True)
        elif isinstance(res, (list, tuple)):
            out_str = json.dumps(res)
        elif res is None:
            out_str = "None"
        else:
            out_str = str(res)

        results.append({"success": True, "output": out_str})
    except Exception as e:
        results.append({"success": False, "error": f"{type(e).__name__}: {str(e)}"})

print("===TEST_RESULTS_START===")
print(json.dumps(results))
print("===TEST_RESULTS_END===")
`;

    // Determine python command ('python' or 'python3')
    const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';

    const child = spawn(pythonCmd, ['-c', pythonHarness], {
      timeout: 5000, // 5s timeout limit
      maxBuffer: 1024 * 1024 * 2 // 2MB buffer limit
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (err) => {
      const elapsed = Date.now() - startTime;
      resolve({
        testResults: testCases.map(tc => ({
          id: tc.id,
          input: tc.input,
          expected: tc.expected,
          actual: "Execution Error",
          passed: false,
          error: err.message
        })),
        passedCount: 0,
        totalCount: testCases.length,
        executionTimeMs: elapsed,
        error: `Process error: ${err.message}`
      });
    });

    child.on('close', (codeExit) => {
      const elapsed = Date.now() - startTime;

      if (stderr && !stdout.includes("===TEST_RESULTS_START===")) {
        return resolve({
          testResults: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: "Syntax/Runtime Error",
            passed: false,
            error: stderr.trim()
          })),
          passedCount: 0,
          totalCount: testCases.length,
          executionTimeMs: elapsed,
          error: stderr.trim()
        });
      }

      try {
        const startMarker = "===TEST_RESULTS_START===";
        const endMarker = "===TEST_RESULTS_END===";

        const startIdx = stdout.indexOf(startMarker);
        const endIdx = stdout.indexOf(endMarker);

        if (startIdx === -1 || endIdx === -1) {
          throw new Error("Invalid python output structure");
        }

        const jsonStr = stdout.substring(startIdx + startMarker.length, endIdx).trim();
        const rawResults = JSON.parse(jsonStr);

        let passedCount = 0;
        const processedTestResults = testCases.map((tc, idx) => {
          const raw = rawResults[idx] || { success: False, error: "No output" };

          let passed = false;
          let actualOutput = raw.output || raw.error || "No Output";

          if (raw.success) {
            // Compare normalized output with expected
            const normExpected = tc.expected.trim();
            const normActual = actualOutput.trim();

            if (normExpected === normActual) {
              passed = true;
            } else {
              // Attempt JSON parsed equality if dict or array
              try {
                const expParsed = JSON.parse(normExpected);
                const actParsed = JSON.parse(normActual);
                if (JSON.stringify(expParsed) === JSON.stringify(actParsed)) {
                  passed = true;
                }
              } catch (_) {
                passed = (normExpected === normActual);
              }
            }
          }

          if (passed) passedCount++;

          return {
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: actualOutput,
            passed: passed,
            error: raw.success ? null : raw.error
          };
        });

        resolve({
          testResults: processedTestResults,
          passedCount,
          totalCount: testCases.length,
          executionTimeMs: elapsed,
          error: null
        });

      } catch (err) {
        resolve({
          testResults: testCases.map(tc => ({
            id: tc.id,
            input: tc.input,
            expected: tc.expected,
            actual: "Output Parsing Error",
            passed: false,
            error: stderr || err.message
          })),
          passedCount: 0,
          totalCount: testCases.length,
          executionTimeMs: elapsed,
          error: stderr || err.message
        });
      }
    });
  });
};
