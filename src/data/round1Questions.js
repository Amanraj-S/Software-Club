export const ROUND1_QUESTIONS = [
  {
    id: 1,
    topic: "Python Lists",
    question: "What is the time complexity of appending an element to the end of a Python list (list.append(x))?",
    options: ["O(1) amortized", "O(n)", "O(log n)", "O(n^2)"],
    correctIndex: 0,
    explanation: "Python lists are dynamic arrays, so appending to the end runs in O(1) amortized time."
  },
  {
    id: 2,
    topic: "Python Output Prediction",
    question: "What will be the output of the following Python code snippet?\n\nnums = [1, 2, 3, 4, 5]\nprint(nums[1:4:2])",
    options: ["[2, 4]", "[2, 3]", "[1, 3]", "[2, 4, 5]"],
    correctIndex: 0,
    explanation: "The slice starts at index 1 (value 2), stops before index 4, with step 2. Selecting indices 1 and 3 gives [2, 4]."
  },
  {
    id: 3,
    topic: "Sets",
    question: "Which of the following operations on a Python set has an average time complexity of O(1)?",
    options: ["Element lookup (x in my_set)", "Sorting the set", "Converting to a sorted list", "Iterating over all elements"],
    correctIndex: 0,
    explanation: "Python sets are implemented using hash tables, offering average O(1) time complexity for membership testing."
  },
  {
    id: 4,
    topic: "Dictionaries",
    question: "What will happen if you attempt to access a non-existent key using my_dict.get('missing_key') in Python?",
    options: ["It returns None (or default specified)", "It raises a KeyError exception", "It raises an IndexError exception", "It inserts the key with None"],
    correctIndex: 0,
    explanation: "dict.get(key) safely returns None if the key is not present, avoiding a KeyError."
  },
  {
    id: 5,
    topic: "Stack",
    question: "Which Data Structure follows the LIFO (Last In, First Out) principle?",
    options: ["Queue", "Stack", "Binary Tree", "Array"],
    correctIndex: 1,
    explanation: "A Stack operates on a Last In, First Out (LIFO) basis."
  },
  {
    id: 6,
    topic: "Queue",
    question: "In Python, which module provides an efficient double-ended queue (deque) suitable for Queue operations in O(1) time for popleft()?",
    options: ["collections", "sys", "queue_lib", "algorithms"],
    correctIndex: 0,
    explanation: "collections.deque provides O(1) time complexity for appending and popping from both ends."
  },
  {
    id: 7,
    topic: "Binary Search",
    question: "What prerequisite MUST be satisfied before performing Binary Search on an array?",
    options: ["Array must be sorted", "Array must contain even number of elements", "Array must contain positive numbers only", "Array must be initialized with zeros"],
    correctIndex: 0,
    explanation: "Binary Search requires the target array/list to be sorted in ascending or descending order."
  },
  {
    id: 8,
    topic: "Linear Search",
    question: "What is the worst-case time complexity of Linear Search in an unsorted array of size n?",
    options: ["O(log n)", "O(1)", "O(n)", "O(n log n)"],
    correctIndex: 2,
    explanation: "In the worst case, linear search checks every single element from 1 to n, resulting in O(n) complexity."
  },
  {
    id: 9,
    topic: "Bubble Sort",
    question: "What is the average and worst-case time complexity of Bubble Sort?",
    options: ["O(n log n)", "O(n^2)", "O(n)", "O(1)"],
    correctIndex: 1,
    explanation: "Bubble Sort compares adjacent elements in nested loops, giving a time complexity of O(n^2)."
  },
  {
    id: 10,
    topic: "Selection Sort",
    question: "How does Selection Sort repeatedly build the sorted array?",
    options: [
      "By swapping adjacent out-of-order elements repeatedly",
      "By finding the minimum element from the unsorted part and placing it at the beginning",
      "By dividing the array into two halves recursively",
      "By building a max-heap structure"
    ],
    correctIndex: 1,
    explanation: "Selection Sort repeatedly selects the smallest (or largest) element from the unsorted portion and moves it to the sorted portion."
  },
  {
    id: 11,
    topic: "Recursion",
    question: "What essential condition prevents a recursive function from calling itself indefinitely and causing a StackOverflow / RecursionError?",
    options: ["Loop counter", "Base case", "Global variable", "Try-Except block"],
    correctIndex: 1,
    explanation: "The base case defines the condition under which the recursive calls terminate."
  },
  {
    id: 12,
    topic: "Arrays & Memory",
    question: "Why does array index lookup (e.g., arr[i]) take O(1) constant time in contiguous memory?",
    options: [
      "Because the computer searches sequentially",
      "Because the memory address is calculated directly via base_address + i * element_size",
      "Because Python caches all array elements",
      "Because array elements are stored in a binary search tree"
    ],
    correctIndex: 1,
    explanation: "Contiguous allocation enables direct address calculation via arithmetic offset in O(1) time."
  },
  {
    id: 13,
    topic: "Strings",
    question: "In Python, strings are immutable. What does this imply when performing s = s + 'a' in a loop of size n?",
    options: [
      "It modifies s in-place in O(1) total time",
      "It creates a new string object each time, leading to O(n^2) total time complexity",
      "It causes a TypeError at runtime",
      "It automatically converts s into a list"
    ],
    correctIndex: 1,
    explanation: "Because strings cannot be changed in-place, string concatenation in a loop creates a new string every time, accumulating to O(n^2) time."
  },
  {
    id: 14,
    topic: "Time Complexity",
    question: "Which of the following time complexities represents the fastest growth / best efficiency for large inputs n?",
    options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"],
    correctIndex: 3,
    explanation: "Logarithmic time O(log n) grows much slower than linear O(n), linearithmic O(n log n), or quadratic O(n^2)."
  },
  {
    id: 15,
    topic: "BFS (Breadth First Search)",
    question: "Which data structure is typically used to implement Breadth First Search (BFS) on a graph or tree?",
    options: ["Stack", "Queue", "Priority Queue", "Disjoint Set"],
    correctIndex: 1,
    explanation: "BFS explores nodes level-by-level using a FIFO Queue to track unvisited nodes."
  },
  {
    id: 16,
    topic: "DFS (Depth First Search)",
    question: "Which data structure (or programming mechanism) is fundamentally used by Depth First Search (DFS)?",
    options: ["Queue", "Call Stack / Explicit Stack", "Hash Map", "Linked List"],
    correctIndex: 1,
    explanation: "DFS explores as deep as possible along each branch before backtracking, utilizing a Stack (either explicit or call stack recursion)."
  },
  {
    id: 17,
    topic: "Python Output Prediction",
    question: "What is the output of the following Python code?\n\nd = {'a': 1, 'b': 2}\nprint(d.get('c', 42))",
    options: ["KeyError", "None", "42", "0"],
    correctIndex: 2,
    explanation: "dict.get(key, default) returns default value '42' if the key 'c' is absent."
  },
  {
    id: 18,
    topic: "Python Output Prediction",
    question: "What will be printed by this Python snippet?\n\nval = [x * 2 for x in range(4) if x % 2 == 0]\nprint(val)",
    options: ["[0, 4]", "[0, 2, 4, 6]", "[2, 6]", "[0, 1, 2, 3]"],
    correctIndex: 0,
    explanation: "range(4) produces 0, 1, 2, 3. Even numbers are 0 and 2. Multiplied by 2 gives 0 and 4. Output: [0, 4]."
  },
  {
    id: 19,
    topic: "Recursion",
    question: "What is the default maximum recursion depth in standard Python implementations (CPython)?",
    options: ["100", "1000", "10000", "Unlimited"],
    correctIndex: 1,
    explanation: "By default, sys.getrecursionlimit() in CPython is set to 1000 to prevent C stack overflow."
  },
  {
    id: 20,
    topic: "Stack",
    question: "When evaluates postfix expressions (RPN) or checking balanced parentheses, which data structure is most appropriate?",
    options: ["Queue", "Stack", "Binary Heap", "Hash Table"],
    correctIndex: 1,
    explanation: "A Stack naturally tracks nested structures (parentheses) and postfix operands due to its LIFO property."
  },
  {
    id: 21,
    topic: "Python Output Prediction",
    question: "What is the result of the following Python code?\n\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))",
    options: ["3", "4", "Error", "1"],
    correctIndex: 1,
    explanation: "In Python, 'b = a' creates a reference to the same list object. Mutating 'b' also mutates 'a', making len(a) = 4."
  },
  {
    id: 22,
    topic: "Binary Search",
    question: "In Binary Search, if low = 0 and high = n - 1, how do we calculate mid to avoid potential integer overflow in languages with fixed integer sizes?",
    options: [
      "mid = (low + high) // 2",
      "mid = low + (high - low) // 2",
      "mid = (high - low) // 2",
      "mid = low * 2 + high"
    ],
    correctIndex: 1,
    explanation: "mid = low + (high - low) // 2 prevents potential (low + high) arithmetic overflow while computing the exact midpoint."
  },
  {
    id: 23,
    topic: "Sorting Algorithms",
    question: "Which of the following sorting algorithms is STABLE and has a worst-case time complexity of O(n log n)?",
    options: ["Quick Sort", "Merge Sort", "Heap Sort", "Selection Sort"],
    correctIndex: 1,
    explanation: "Merge Sort guarantees O(n log n) time complexity in all cases and preserves the relative order of equal elements (Stable)."
  },
  {
    id: 24,
    topic: "Queue",
    question: "What is the term used for inserting an element into a Queue and removing an element from a Queue?",
    options: ["Push & Pop", "Enqueue & Dequeue", "Insert & Extract", "Add & Delete"],
    correctIndex: 1,
    explanation: "Queue operations are standardized as Enqueue (add to rear) and Dequeue (remove from front)."
  },
  {
    id: 25,
    topic: "Time Complexity",
    question: "What is the time complexity of looking up an element in a Python list of length n by value (e.g., if x in my_list)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
    correctIndex: 2,
    explanation: "Searching for a value in an unsorted list requires linear search over elements, taking O(n) time."
  },
  {
    id: 26,
    topic: "Python Output Prediction",
    question: "What will the following code snippet output?\n\ns = 'SATHYABAMA'\nprint(s[::-2])",
    options: ["AMABAYHTAS", "AMAYT", "AMAYH", "AMABY"],
    correctIndex: 1,
    explanation: "Slicing with step -2 reverses the string and selects every second character starting from index -1 ('A'): A, M, A, Y, T -> 'AMAYT'."
  },
  {
    id: 27,
    topic: "Graph Traversal",
    question: "In an unweighted graph, which graph traversal algorithm guarantees finding the shortest path (minimum number of edges) from a source node to all other nodes?",
    options: ["DFS", "BFS", "Preorder Traversal", "Postorder Traversal"],
    correctIndex: 1,
    explanation: "BFS explores nodes in increasing order of distance from the root, guaranteeing the shortest path in unweighted graphs."
  },
  {
    id: 28,
    topic: "Python Output Prediction",
    question: "What is the output of the code below?\n\ns1 = {1, 2, 3}\ns2 = {3, 4, 5}\nprint(s1 & s2)",
    options: ["{1, 2, 3, 4, 5}", "{3}", "{1, 2, 4, 5}", "SetUnionError"],
    correctIndex: 1,
    explanation: "The '&' operator performs set intersection, returning elements common to both sets ({3})."
  },
  {
    id: 29,
    topic: "Dictionaries",
    question: "Which of the following data types CANNOT be used as a key in a Python dictionary?",
    options: ["int", "string", "tuple (containing immutables)", "list"],
    correctIndex: 3,
    explanation: "Dictionary keys must be hashable and immutable. Lists are mutable and unhashable, so they cannot serve as keys."
  },
  {
    id: 30,
    topic: "Time Complexity",
    question: "What is the space complexity of a recursive implementation of Fibonacci that does not use memoization, with recursive depth n?",
    options: ["O(1)", "O(n)", "O(2^n)", "O(log n)"],
    correctIndex: 1,
    explanation: "The space complexity is determined by the maximum depth of the call stack, which is O(n)."
  }
];
