export const ROUND1_QUESTIONS_BACKEND = [
  {
    id: 1,
    topic: "Python Lists",
    question: "What is the time complexity of appending an element to the end of a Python list (list.append(x))?",
    options: ["O(n^2)", "O(n)", "O(log n)", "O(1) amortized"],
    correctIndex: 3
  },
  {
    id: 2,
    topic: "Python Output Prediction",
    question: "What will be the output of the following Python code snippet?\n\nnums = [1, 2, 3, 4, 5]\nprint(nums[1:4:2])",
    options: ["[2, 4]", "[2, 3]", "[1, 3]", "[2, 4, 5]"],
    correctIndex: 0
  },
  {
    id: 3,
    topic: "Sets",
    question: "Which of the following operations on a Python set has an average time complexity of O(1)?",
    options: ["Sorting the set", "Converting to a sorted list", "Element lookup (x in my_set)", "Iterating over all elements"],
    correctIndex: 2
  },
  {
    id: 4,
    topic: "Dictionaries",
    question: "What will happen if you attempt to access a non-existent key using my_dict.get('missing_key') in Python?",
    options: ["It raises a KeyError exception", "It returns None (or default specified)", "It raises an IndexError exception", "It inserts the key with None"],
    correctIndex: 1
  },
  {
    id: 5,
    topic: "Stack",
    question: "Which Data Structure follows the LIFO (Last In, First Out) principle?",
    options: ["Stack", "Queue", "Binary Tree", "Array"],
    correctIndex: 0
  },
  {
    id: 6,
    topic: "Queue",
    question: "In Python, which module provides an efficient double-ended queue (deque) suitable for Queue operations in O(1) time for popleft()?",
    options: ["sys", "queue_lib", "algorithms", "collections"],
    correctIndex: 3
  },
  {
    id: 7,
    topic: "Binary Search",
    question: "What prerequisite MUST be satisfied before performing Binary Search on an array?",
    options: ["Array must contain even number of elements", "Array must be sorted", "Array must contain positive numbers only", "Array must be initialized with zeros"],
    correctIndex: 1
  },
  {
    id: 8,
    topic: "Linear Search",
    question: "What is the worst-case time complexity of Linear Search in an unsorted array of size n?",
    options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
    correctIndex: 2
  },
  {
    id: 9,
    topic: "Bubble Sort",
    question: "What is the average and worst-case time complexity of Bubble Sort?",
    options: ["O(n^2)", "O(n log n)", "O(n)", "O(1)"],
    correctIndex: 0
  },
  {
    id: 10,
    topic: "Selection Sort",
    question: "How does Selection Sort repeatedly build the sorted array?",
    options: [
      "By swapping adjacent out-of-order elements repeatedly",
      "By dividing the array into two halves recursively",
      "By building a max-heap structure",
      "By finding the minimum element from the unsorted part and placing it at the beginning"
    ],
    correctIndex: 3
  },
  {
    id: 11,
    topic: "Recursion",
    question: "What essential condition prevents a recursive function from calling itself indefinitely and causing a StackOverflow / RecursionError?",
    options: ["Loop counter", "Base case", "Global variable", "Try-Except block"],
    correctIndex: 1
  },
  {
    id: 12,
    topic: "Arrays & Memory",
    question: "Why does array index lookup (e.g., arr[i]) take O(1) constant time in contiguous memory?",
    options: [
      "Because the computer searches sequentially",
      "Because Python caches all array elements",
      "Because the memory address is calculated directly via base_address + i * element_size",
      "Because array elements are stored in a binary search tree"
    ],
    correctIndex: 2
  },
  {
    id: 13,
    topic: "Strings",
    question: "In Python, strings are immutable. What does this imply when performing s = s + 'a' in a loop of size n?",
    options: [
      "It creates a new string object each time, leading to O(n^2) total time complexity",
      "It modifies s in-place in O(1) total time",
      "It causes a TypeError at runtime",
      "It automatically converts s into a list"
    ],
    correctIndex: 0
  },
  {
    id: 14,
    topic: "Time Complexity",
    question: "Which of the following time complexities represents the fastest growth / best efficiency for large inputs n?",
    options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"],
    correctIndex: 3
  },
  {
    id: 15,
    topic: "BFS (Breadth First Search)",
    question: "Which data structure is typically used to implement Breadth First Search (BFS) on a graph or tree?",
    options: ["Stack", "Queue", "Priority Queue", "Disjoint Set"],
    correctIndex: 1
  },
  {
    id: 16,
    topic: "DFS (Depth First Search)",
    question: "Which data structure (or programming mechanism) is fundamentally used by Depth First Search (DFS)?",
    options: ["Queue", "Hash Map", "Call Stack / Explicit Stack", "Linked List"],
    correctIndex: 2
  },
  {
    id: 17,
    topic: "Python Output Prediction",
    question: "What is the output of the following Python code?\n\nd = {'a': 1, 'b': 2}\nprint(d.get('c', 42))",
    options: ["42", "KeyError", "None", "0"],
    correctIndex: 0
  },
  {
    id: 18,
    topic: "Python Output Prediction",
    question: "What will be printed by this Python snippet?\n\nval = [x * 2 for x in range(4) if x % 2 == 0]\nprint(val)",
    options: ["[0, 2, 4, 6]", "[2, 6]", "[0, 1, 2, 3]", "[0, 4]"],
    correctIndex: 3
  },
  {
    id: 19,
    topic: "Recursion",
    question: "What is the default maximum recursion depth in standard Python implementations (CPython)?",
    options: ["100", "1000", "10000", "Unlimited"],
    correctIndex: 1
  },
  {
    id: 20,
    topic: "Stack",
    question: "When evaluating postfix expressions (RPN) or checking balanced parentheses, which data structure is most appropriate?",
    options: ["Queue", "Binary Heap", "Stack", "Hash Table"],
    correctIndex: 2
  },
  {
    id: 21,
    topic: "Python Output Prediction",
    question: "What is the result of the following Python code?\n\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
    options: ["4", "3", "Error", "1"],
    correctIndex: 0
  },
  {
    id: 22,
    topic: "Binary Search",
    question: "In Binary Search, if low = 0 and high = n - 1, how do we calculate mid to avoid potential integer overflow in languages with fixed integer sizes?",
    options: [
      "mid = (low + high) // 2",
      "mid = (high - low) // 2",
      "mid = low * 2 + high",
      "mid = low + (high - low) // 2"
    ],
    correctIndex: 3
  },
  {
    id: 23,
    topic: "Sorting Algorithms",
    question: "Which of the following sorting algorithms is STABLE and has a worst-case time complexity of O(n log n)?",
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"],
    correctIndex: 1
  },
  {
    id: 24,
    topic: "Queue",
    question: "What is the term used for inserting an element into a Queue and removing an element from a Queue?",
    options: ["Push & Pop", "Insert & Extract", "Enqueue & Dequeue", "Add & Delete"],
    correctIndex: 2
  },
  {
    id: 25,
    topic: "Time Complexity",
    question: "What is the time complexity of looking up an element in a Python list of length n by value (e.g., if x in my_list)?",
    options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
    correctIndex: 0
  },
  {
    id: 26,
    topic: "Python Output Prediction",
    question: "What will the following code snippet output?\n\ns = 'SATHYABAMA'\nprint(s[::-2])",
    options: ["AMABAYHTAS", "AMAYH", "AMABY", "AMAYT"],
    correctIndex: 3
  },
  {
    id: 27,
    topic: "Graph Traversal",
    question: "In an unweighted graph, which graph traversal algorithm guarantees finding the shortest path (minimum number of edges) from a source node to all other nodes?",
    options: ["DFS", "BFS", "Preorder Traversal", "Postorder Traversal"],
    correctIndex: 1
  },
  {
    id: 28,
    topic: "Python Output Prediction",
    question: "What is the output of the code below?\n\ns1 = {1, 2, 3}\ns2 = {3, 4, 5}\nprint(s1 & s2)",
    options: ["{1, 2, 3, 4, 5}", "{1, 2, 4, 5}", "{3}", "SetUnionError"],
    correctIndex: 2
  },
  {
    id: 29,
    topic: "Dictionaries",
    question: "Which of the following data types CANNOT be used as a key in a Python dictionary?",
    options: ["list", "int", "string", "tuple (containing immutables)"],
    correctIndex: 0
  },
  {
    id: 30,
    topic: "Time Complexity",
    question: "What is the space complexity of a recursive implementation of Fibonacci that does not use memoization, with recursive depth n?",
    options: ["O(1)", "O(2^n)", "O(log n)", "O(n)"],
    correctIndex: 3
  }
];

// Helper to strip correct answers for student API delivery
export const getStudentRound1Questions = () => {
  return ROUND1_QUESTIONS_BACKEND.map(({ id, topic, question, options }) => ({
    id,
    topic,
    question,
    options
  }));
};
