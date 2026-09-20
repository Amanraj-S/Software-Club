// Storage & Persistence Manager for Student Sessions and Admin Reports

const STORAGE_KEYS = {
  CURRENT_STUDENT: 'sathyabama_dsa_student',
  ROUND1_STATE: 'sathyabama_dsa_round1',
  ROUND2_STATE: 'sathyabama_dsa_round2',
  ALL_SUBMISSIONS: 'sathyabama_dsa_submissions',
  ADMIN_AUTH: 'sathyabama_dsa_admin_auth'
};

// Default Initial Student State
export const getStudentSession = () => {
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
  return data ? JSON.parse(data) : null;
};

export const saveStudentSession = (studentInfo) => {
  const session = {
    ...studentInfo,
    id: studentInfo.registerNo || `STU_${Date.now()}`,
    registeredAt: new Date().toISOString(),
    status: 'REGISTERED', // REGISTERED, ROUND1_IN_PROGRESS, ROUND1_COMPLETED, ROUND2_IN_PROGRESS, FINAL_COMPLETED
    violations: 0,
    round1Score: 0,
    round1Correct: 0,
    round1Incorrect: 0,
    round1Unanswered: 30,
    qualified: false,
    round2Score: 0,
    round2SolvedCount: 0,
    round2TestCasesPassed: 0,
    round2TotalTestCases: 25,
    finalScore: 0
  };
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(session));
  syncToSubmissionsList(session);
  return session;
};

export const updateStudentSession = (updates) => {
  const current = getStudentSession() || {};
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(updated));
  syncToSubmissionsList(updated);
  return updated;
};

// Round 1 Quiz Persistence
export const getRound1State = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ROUND1_STATE);
  return data ? JSON.parse(data) : {
    answers: {},
    markedForReview: [],
    currentQuestionIndex: 0,
    timeRemaining: 2400, // 40 minutes in seconds
    isSubmitted: false
  };
};

export const saveRound1State = (state) => {
  localStorage.setItem(STORAGE_KEYS.ROUND1_STATE, JSON.stringify(state));
};

// Round 2 Coding Persistence
export const getRound2State = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ROUND2_STATE);
  return data ? JSON.parse(data) : {
    currentProblemId: 1,
    codeSubmissions: {},
    testResults: {},
    timeRemaining: 5400, // 90 minutes in seconds
    isSubmitted: false
  };
};

export const saveRound2State = (state) => {
  localStorage.setItem(STORAGE_KEYS.ROUND2_STATE, JSON.stringify(state));
};

// All Submissions Storage (for Admin Portal)
export const getAllSubmissions = () => {
  const data = localStorage.getItem(STORAGE_KEYS.ALL_SUBMISSIONS);
  if (!data) {
    // Seed initial mock records if empty for demonstration
    const sampleStudents = [
      {
        id: "42110001",
        name: "Aravind Swaminathan",
        registerNo: "42110001",
        department: "CSE",
        year: "3rd Year",
        registeredAt: "2026-09-23T13:15:00Z",
        status: "FINAL_COMPLETED",
        violations: 0,
        round1Score: 24,
        round1Correct: 24,
        round1Incorrect: 6,
        round1Unanswered: 0,
        qualified: true,
        round2Score: 80,
        round2SolvedCount: 4,
        round2TestCasesPassed: 20,
        round2TotalTestCases: 25,
        finalScore: 104
      },
      {
        id: "42110045",
        name: "Harini Sundaram",
        registerNo: "42110045",
        department: "IT",
        year: "2nd Year",
        registeredAt: "2026-09-23T13:18:00Z",
        status: "FINAL_COMPLETED",
        violations: 1,
        round1Score: 28,
        round1Correct: 28,
        round1Incorrect: 2,
        round1Unanswered: 0,
        qualified: true,
        round2Score: 100,
        round2SolvedCount: 5,
        round2TestCasesPassed: 25,
        round2TotalTestCases: 25,
        finalScore: 128
      },
      {
        id: "42110089",
        name: "Karthik Raja",
        registerNo: "42110089",
        department: "AI & DS",
        year: "3rd Year",
        registeredAt: "2026-09-23T13:20:00Z",
        status: "ROUND1_COMPLETED",
        violations: 0,
        round1Score: 11,
        round1Correct: 11,
        round1Incorrect: 19,
        round1Unanswered: 0,
        qualified: false,
        round2Score: 0,
        round2SolvedCount: 0,
        round2TestCasesPassed: 0,
        round2TotalTestCases: 25,
        finalScore: 11
      }
    ];
    localStorage.setItem(STORAGE_KEYS.ALL_SUBMISSIONS, JSON.stringify(sampleStudents));
    return sampleStudents;
  }
  return JSON.parse(data);
};

export const syncToSubmissionsList = (studentRecord) => {
  const submissions = getAllSubmissions();
  const existingIdx = submissions.findIndex(s => s.registerNo === studentRecord.registerNo);
  
  if (existingIdx >= 0) {
    submissions[existingIdx] = { ...submissions[existingIdx], ...studentRecord };
  } else {
    submissions.unshift(studentRecord);
  }
  localStorage.setItem(STORAGE_KEYS.ALL_SUBMISSIONS, JSON.stringify(submissions));
};

export const exportSubmissionsToCSV = () => {
  const submissions = getAllSubmissions();
  const headers = ["Register No", "Name", "Department", "Year", "Status", "Violations", "Round 1 Score (out of 30)", "Qualified", "Round 2 Score (out of 100)", "Total Score", "Registered At"];
  
  const rows = submissions.map(s => [
    `"${s.registerNo || ''}"`,
    `"${s.name || ''}"`,
    `"${s.department || ''}"`,
    `"${s.year || ''}"`,
    `"${s.status || ''}"`,
    s.violations || 0,
    s.round1Score || 0,
    s.qualified ? "YES" : "NO",
    s.round2Score || 0,
    s.finalScore || 0,
    `"${s.registeredAt || ''}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Sathyabama_DSA_Event_Results_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
