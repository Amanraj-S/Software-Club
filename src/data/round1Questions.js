export const ROUND1_QUESTIONS = [
  {
    id: 1,
    topic: "Output Prediction",
    question: "What will be the output?\n\narr = [10, 20, 30, 40]\nprint(arr[1] + arr[3])",
    options: ["40", "60", "50", "70"],
    correctIndex: 1,
    explanation: "arr[1] is 20 and arr[3] is 40. 20 + 40 = 60."
  },
  {
    id: 2,
    topic: "List Slicing",
    question: "What will be the output?\n\narr = [1, 2, 3, 4, 5]\nprint(arr[1:4])",
    options: ["[1, 2, 3]", "[2, 3, 4, 5]", "[1, 2, 3, 4]", "[2, 3, 4]"],
    correctIndex: 3,
    explanation: "arr[1:4] slices from index 1 up to index 3 (values 2, 3, 4), resulting in [2, 3, 4]."
  },
  {
    id: 3,
    topic: "Output Prediction",
    question: "What will be the output?\n\narr = [5, 10, 15]\narr.append(20)\nprint(len(arr))",
    options: ["4", "3", "20", "5"],
    correctIndex: 0,
    explanation: "Appending 20 to [5, 10, 15] makes length 4."
  },
  {
    id: 4,
    topic: "Negative Indexing",
    question: "What will be the output?\n\narr = [3, 6, 9, 12]\nprint(arr[-1])",
    options: ["3", "6", "12", "9"],
    correctIndex: 2,
    explanation: "Negative index -1 returns the last element of the list, which is 12."
  },
  {
    id: 5,
    topic: "List Methods",
    question: "Which method removes the last element from a Python list?",
    options: ["remove()", "pop()", "delete()", "clear()"],
    correctIndex: 1,
    explanation: "pop() without arguments removes and returns the last element from a list."
  },
  {
    id: 6,
    topic: "Sorting",
    question: "What will be the output?\n\narr = [4, 2, 8, 1]\narr.sort()\nprint(arr[0])",
    options: ["2", "4", "8", "1"],
    correctIndex: 3,
    explanation: "arr.sort() arranges elements in ascending order [1, 2, 4, 8], so arr[0] is 1."
  },
  {
    id: 7,
    topic: "String Indexing",
    question: "What will be the output?\n\ns = \"PYTHON\"\nprint(s[2])",
    options: ["T", "P", "Y", "H"],
    correctIndex: 0,
    explanation: "Python indexing starts at 0: s[0]='P', s[1]='Y', s[2]='T'."
  },
  {
    id: 8,
    topic: "Membership Operator",
    question: "What will be the output?\n\narr = [2, 4, 6, 8]\nprint(6 in arr)",
    options: ["6", "False", "True", "None"],
    correctIndex: 2,
    explanation: "6 is present in arr, so 6 in arr evaluates to True."
  },
  {
    id: 9,
    topic: "Stack",
    question: "Which data structure follows LIFO?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correctIndex: 1,
    explanation: "Stack operates on Last In First Out (LIFO) principle."
  },
  {
    id: 10,
    topic: "Queue",
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Set", "Tree", "Queue"],
    correctIndex: 3,
    explanation: "Queue operates on First In First Out (FIFO) principle."
  },
  {
    id: 11,
    topic: "List Insertion",
    question: "What will be the output?\n\narr = [1, 2, 3]\narr.insert(1, 10)\nprint(arr)",
    options: ["[1, 10, 2, 3]", "[10, 1, 2, 3]", "[1, 2, 10, 3]", "[1, 2, 3, 10]"],
    correctIndex: 0,
    explanation: "arr.insert(1, 10) inserts value 10 at index 1, yielding [1, 10, 2, 3]."
  },
  {
    id: 12,
    topic: "List Methods",
    question: "What will be the output?\n\narr = [1, 2, 2, 3]\nprint(arr.count(2))",
    options: ["1", "3", "2", "4"],
    correctIndex: 2,
    explanation: "count(2) returns the number of occurrences of 2 in the list, which is 2."
  },
  {
    id: 13,
    topic: "Data Structures",
    question: "Which data structure is best suited for storing unique elements?",
    options: ["List", "Set", "Tuple", "String"],
    correctIndex: 1,
    explanation: "A set stores only unique elements and automatically eliminates duplicates."
  },
  {
    id: 14,
    topic: "List Reversing",
    question: "What will be the output?\n\narr = [10, 20, 30]\narr.reverse()\nprint(arr)",
    options: ["[10, 20, 30]", "[20, 30, 10]", "[30, 10, 20]", "[30, 20, 10]"],
    correctIndex: 3,
    explanation: "arr.reverse() reverses the list in-place, resulting in [30, 20, 10]."
  },
  {
    id: 15,
    topic: "Searching Algorithms",
    question: "Which searching algorithm checks elements one by one?",
    options: ["Linear Search", "Binary Search", "Bubble Sort", "Selection Sort"],
    correctIndex: 0,
    explanation: "Linear search checks each element in the array sequentially until the target is found."
  },
  {
    id: 16,
    topic: "Looping & Slicing",
    question: "What will be the output?\n\narr = [10, 20, 30, 40, 50]\n\nfor i in range(1, 4):\n    print(arr[i], end=\" \")",
    options: ["10 20 30", "10 20 30 40", "20 30 40", "20 30 40 50"],
    correctIndex: 2,
    explanation: "range(1, 4) produces indices 1, 2, 3, printing arr[1], arr[2], arr[3] which are 20 30 40."
  },
  {
    id: 17,
    topic: "Looping & Conditionals",
    question: "What will be the output?\n\narr = [1, 2, 3, 4, 5]\nresult = []\n\nfor x in arr:\n    if x % 2 == 0:\n        result.append(x)\n\nprint(result)",
    options: ["[1, 3, 5]", "[2, 4]", "[1, 2, 4]", "[2, 3, 5]"],
    correctIndex: 1,
    explanation: "Filters even numbers from the list, returning [2, 4]."
  },
  {
    id: 18,
    topic: "List Mutation",
    question: "What will be the output?\n\narr = [5, 10, 15, 20]\n\nfor i in range(len(arr)):\n    arr[i] = arr[i] + 5\n\nprint(arr)",
    options: ["[5, 10, 15, 20]", "[6, 11, 16, 21]", "[10, 20, 30, 40]", "[10, 15, 20, 25]"],
    correctIndex: 3,
    explanation: "Adds 5 to each element in arr, producing [10, 15, 20, 25]."
  },
  {
    id: 19,
    topic: "Reverse Looping",
    question: "What will be the output?\n\narr = [1, 2, 3, 4]\n\nfor i in range(len(arr) - 1, -1, -1):\n    print(arr[i], end=\" \")",
    options: ["4 3 2 1", "1 2 3 4", "3 2 1 4", "4 1 2 3"],
    correctIndex: 0,
    explanation: "range(len(arr)-1, -1, -1) iterates backwards through indices 3, 2, 1, 0, printing 4 3 2 1."
  },
  {
    id: 20,
    topic: "Accumulation",
    question: "What will be the output?\n\narr = [2, 4, 6, 8]\ntotal = 0\n\nfor x in arr:\n    total += x\n\nprint(total)",
    options: ["16", "18", "20", "24"],
    correctIndex: 2,
    explanation: "Calculates the sum of all elements: 2 + 4 + 6 + 8 = 20."
  },
  {
    id: 21,
    topic: "List Slicing",
    question: "What will be the output?\n\narr = [1, 2, 3, 4, 5]\nprint(arr[::2])",
    options: ["[2, 4]", "[1, 3, 5]", "[1, 2, 3]", "[5, 3, 1]"],
    correctIndex: 1,
    explanation: "arr[::2] selects elements at step 2 (indices 0, 2, 4), which are [1, 3, 5]."
  },
  {
    id: 22,
    topic: "Stack Operations",
    question: "What will be the output?\n\nstack = []\n\nstack.append(10)\nstack.append(20)\nstack.append(30)\n\nprint(stack.pop())",
    options: ["10", "20", "Empty", "30"],
    correctIndex: 3,
    explanation: "stack.pop() removes and returns the most recently appended element, which is 30."
  },
  {
    id: 23,
    topic: "Counting Occurrences",
    question: "What will be the output?\n\narr = [3, 1, 3, 2, 3]\ncount = 0\n\nfor x in arr:\n    if x == 3:\n        count += 1\n\nprint(count)",
    options: ["3", "2", "4", "5"],
    correctIndex: 0,
    explanation: "The number 3 appears 3 times in the array."
  },
  {
    id: 24,
    topic: "Dictionaries",
    question: "What will be the output?\n\nd = {\"a\": 10, \"b\": 20, \"c\": 30}\n\nprint(d[\"b\"] + d[\"c\"])",
    options: ["30", "40", "50", "60"],
    correctIndex: 2,
    explanation: "d[\"b\"] is 20 and d[\"c\"] is 30. 20 + 30 = 50."
  },
  {
    id: 25,
    topic: "Time Complexity",
    question: "Which search algorithm has O(log n) time complexity in the worst case when the data is sorted?",
    options: ["Linear Search", "Binary Search", "Bubble Sort", "Selection Sort"],
    correctIndex: 1,
    explanation: "Binary search operates in logarithmic time O(log n) on sorted arrays."
  },
  {
    id: 26,
    topic: "Sorting & Indexing",
    question: "What will be the output?\n\narr = [5, 1, 4, 2]\n\narr.sort()\n\nprint(arr[-2])",
    options: ["1", "2", "5", "4"],
    correctIndex: 3,
    explanation: "arr.sort() produces [1, 2, 4, 5]. Index -2 accesses the second last item, which is 4."
  },
  {
    id: 27,
    topic: "Time Complexity",
    question: "What is the time complexity of the following code?\n\nfor i in range(n):\n    print(i)",
    options: ["O(n)", "O(1)", "O(log n)", "O(n²)"],
    correctIndex: 0,
    explanation: "A single loop from 0 to n runs in linear time O(n)."
  },
  {
    id: 28,
    topic: "Linear Search Index",
    question: "What is the output?\n\narr = [1, 2, 3, 4, 5]\n\nfor i in range(len(arr)):\n    if arr[i] == 3:\n        print(i)",
    options: ["3", "1", "2", "4"],
    correctIndex: 2,
    explanation: "The element 3 is located at index 2 in arr."
  },
  {
    id: 29,
    topic: "List Transformation",
    question: "What will be the output?\n\narr = [1, 2, 3, 4]\nresult = []\n\nfor x in arr:\n    result.append(x * 2)\n\nprint(result)",
    options: ["[1, 2, 3, 4]", "[2, 4, 6, 8]", "[1, 4, 9, 16]", "[2, 3, 4, 5]"],
    correctIndex: 1,
    explanation: "Multiplies each element by 2, producing [2, 4, 6, 8]."
  },
  {
    id: 30,
    topic: "Time Complexity",
    question: "What is the time complexity of this code?\n\nfor i in range(n):\n    for j in range(n):\n        print(i, j)",
    options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
    correctIndex: 3,
    explanation: "Two nested loops each iterating n times result in quadratic complexity O(n²)."
  }
];
