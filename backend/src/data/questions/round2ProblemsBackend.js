export const ROUND2_PROBLEMS_BACKEND = [
  {
    id: 1,
    title: "Find Largest Element",
    difficulty: "Easy",
    points: 20,
    functionName: "find_largest",
    shortDesc: "Find the maximum integer in an array.",
    description: `Write a Python function \`find_largest(arr)\` that accepts a list of integers and returns the largest element in the array.`,
    inputFormat: "A list of integers `arr` (1 <= len(arr) <= 10^5).",
    outputFormat: "Return a single integer representing the largest element in `arr`.",
    constraints: [
      "1 <= len(arr) <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    starterCode: `def find_largest(arr):\n    # Write your Python solution here\n    pass\n`,
    sampleInput: "[3, 7, 2, 9, 5]",
    sampleOutput: "9",
    publicTestCases: [
      { id: 1, input: "[3, 7, 2, 9, 5]", expected: "9" },
      { id: 2, input: "[-10, -5, -2, -20]", expected: "-2" },
      { id: 3, input: "[42]", expected: "42" }
    ],
    hiddenTestCases: [
      { id: 4, input: "[100, 200, 50, 400, 300]", expected: "400" },
      { id: 5, input: "[-1, 0, 1]", expected: "1" }
    ]
  },
  {
    id: 2,
    title: "Second Largest Element",
    difficulty: "Easy - Medium",
    points: 20,
    functionName: "second_largest",
    shortDesc: "Find the second distinct largest element in an array of integers.",
    description: `Given an array of integers \`arr\`, write a Python function \`second_largest(arr)\` to return the second distinct largest element in the array.\n\nIf no second distinct largest element exists, return \`-1\`.`,
    inputFormat: "A list of integers `arr`.",
    outputFormat: "Return the second distinct largest integer, or -1 if it does not exist.",
    constraints: [
      "1 <= len(arr) <= 10^5",
      "-10^9 <= arr[i] <= 10^9"
    ],
    starterCode: `def second_largest(arr):\n    # Write your Python solution here\n    pass\n`,
    sampleInput: "[12, 35, 1, 10, 34, 1]",
    sampleOutput: "34",
    publicTestCases: [
      { id: 1, input: "[12, 35, 1, 10, 34, 1]", expected: "34" },
      { id: 2, input: "[10, 10, 10]", expected: "-1" },
      { id: 3, input: "[5, 2]", expected: "2" }
    ],
    hiddenTestCases: [
      { id: 4, input: "[7, 7, 5, 5, 3]", expected: "5" },
      { id: 5, input: "[-5, -2, -10, -1]", expected: "-2" }
    ]
  },
  {
    id: 3,
    title: "Element Frequencies Using Dictionary",
    difficulty: "Medium",
    points: 20,
    functionName: "get_frequencies",
    shortDesc: "Compute the frequency count of each element in an array using a Python dictionary.",
    description: `Write a Python function \`get_frequencies(arr)\` that takes a list of numbers or strings \`arr\` and returns a Python dictionary where each key is an element from \`arr\` and the value is its occurrence count.`,
    inputFormat: "A list of numbers/strings `arr`.",
    outputFormat: "Return a dictionary mapping each distinct element to its integer frequency.",
    constraints: [
      "0 <= len(arr) <= 10^5"
    ],
    starterCode: `def get_frequencies(arr):\n    # Write your Python solution here\n    pass\n`,
    sampleInput: "[\"apple\", \"banana\", \"apple\", \"cherry\", \"banana\", \"apple\"]",
    sampleOutput: "{\"apple\": 3, \"banana\": 2, \"cherry\": 1}",
    publicTestCases: [
      { id: 1, input: "[\"apple\", \"banana\", \"apple\", \"cherry\", \"banana\", \"apple\"]", expected: "{\"apple\": 3, \"banana\": 2, \"cherry\": 1}" },
      { id: 2, input: "[1, 2, 2, 3, 3, 3]", expected: "{\"1\": 1, \"2\": 2, \"3\": 3}" },
      { id: 3, input: "[]", expected: "{}" }
    ],
    hiddenTestCases: [
      { id: 4, input: "[\"x\", \"y\", \"z\"]", expected: "{\"x\": 1, \"y\": 1, \"z\": 1}" },
      { id: 5, input: "[5, 5, 5, 5, 5]", expected: "{\"5\": 5}" }
    ]
  },
  {
    id: 4,
    title: "Palindrome String Verification",
    difficulty: "Easy",
    points: 20,
    functionName: "is_palindrome",
    shortDesc: "Check if a given string reads the same forward and backward.",
    description: `Write a Python function \`is_palindrome(s)\` that accepts a string \`s\` and returns \`True\` if string \`s\` is a palindrome (reads the same forward and backward), and \`False\` otherwise.`,
    inputFormat: "A single string `s`.",
    outputFormat: "Return True or False (boolean).",
    constraints: [
      "1 <= len(s) <= 1000"
    ],
    starterCode: `def is_palindrome(s):\n    # Write your Python solution here\n    pass\n`,
    sampleInput: "\"mom\"",
    sampleOutput: "True",
    publicTestCases: [
      { id: 1, input: "\"mom\"", expected: "True" },
      { id: 2, input: "\"gnd\"", expected: "False" },
      { id: 3, input: "\"racecar\"", expected: "True" }
    ],
    hiddenTestCases: [
      { id: 4, input: "\"noon\"", expected: "True" },
      { id: 5, input: "\"python\"", expected: "False" }
    ]
  },
  {
    id: 5,
    title: "Single Number in Duplicate Array",
    difficulty: "Medium - Hard",
    points: 20,
    functionName: "single_number",
    shortDesc: "Find the single element in an array where every other element appears twice.",
    description: `Given a non-empty array of integers \`nums\`, every element appears **twice** except for one element which appears **exactly once**.\n\nFind and return that single element.`,
    inputFormat: "A list of integers `nums`.",
    outputFormat: "Return the single integer that appears only once.",
    constraints: [
      "1 <= len(nums) <= 3 * 10^4",
      "Each element appears twice except for one which appears once."
    ],
    starterCode: `def single_number(nums):\n    # Write your Python solution here\n    pass\n`,
    sampleInput: "[4, 1, 2, 1, 2]",
    sampleOutput: "4",
    publicTestCases: [
      { id: 1, input: "[4, 1, 2, 1, 2]", expected: "4" },
      { id: 2, input: "[2, 2, 1]", expected: "1" },
      { id: 3, input: "[1]", expected: "1" }
    ],
    hiddenTestCases: [
      { id: 4, input: "[-1, -1, -2]", expected: "-2" },
      { id: 5, input: "[10, 20, 30, 20, 10]", expected: "30" }
    ]
  }
];

// Helper to strip hidden test cases for student API delivery
export const getStudentRound2Problems = () => {
  return ROUND2_PROBLEMS_BACKEND.map(({ id, title, difficulty, points, shortDesc, description, inputFormat, outputFormat, constraints, starterCode, sampleInput, sampleOutput, publicTestCases }) => ({
    id,
    title,
    difficulty,
    points,
    shortDesc,
    description,
    inputFormat,
    outputFormat,
    constraints,
    starterCode,
    sampleInput,
    sampleOutput,
    publicTestCases
  }));
};
