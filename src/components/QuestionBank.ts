export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
}

export interface QuestionSet {
  concept: string;
  difficulty: string;
  questions: Question[];
}

export const questionBank: QuestionSet[] = [
  // STACK - EASY
  {
    concept: 'stack',
    difficulty: 'easy',
    questions: [
      {
        id: 'stack_easy_1',
        text: 'What does LIFO stand for in the context of stacks?',
        options: ['Last In First Out', 'Last In Forever Out', 'Long In Fast Out', 'List In First Out'],
        correctAnswer: 0,
      },
      {
        id: 'stack_easy_2',
        text: 'Which operation adds an element to a stack?',
        options: ['Push', 'Pop', 'Peek', 'Insert'],
        correctAnswer: 0,
      },
      {
        id: 'stack_easy_3',
        text: 'Which operation removes an element from a stack?',
        options: ['Push', 'Pop', 'Peek', 'Delete'],
        correctAnswer: 1,
      },
      {
        id: 'stack_easy_4',
        text: 'What does the peek operation do in a stack?',
        options: ['Removes top element', 'Adds new element', 'Views top element without removing', 'Clears the stack'],
        correctAnswer: 2,
      },
      {
        id: 'stack_easy_5',
        text: 'From which end are elements added and removed in a stack?',
        options: ['Bottom', 'Middle', 'Top', 'Any end'],
        correctAnswer: 2,
      },
      {
        id: 'stack_easy_6',
        text: 'What is the time complexity of push operation in a stack?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
      },
      {
        id: 'stack_easy_7',
        text: 'What happens when you try to pop from an empty stack?',
        options: ['Returns null', 'Stack overflow', 'Stack underflow', 'Nothing happens'],
        correctAnswer: 2,
      },
      {
        id: 'stack_easy_8',
        text: 'Which real-world analogy best represents a stack?',
        options: ['Queue at a ticket counter', 'Stack of plates', 'Circular buffer', 'Linked chain'],
        correctAnswer: 1,
      },
      {
        id: 'stack_easy_9',
        text: 'What is the time complexity of pop operation in a stack?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
      },
      {
        id: 'stack_easy_10',
        text: 'In which order are elements removed from a stack?',
        options: ['First added, first removed', 'Last added, first removed', 'Random order', 'Middle first'],
        correctAnswer: 1,
      },
      {
        id: 'stack_easy_11',
        text: 'Can a stack be implemented using an array?',
        options: ['Yes', 'No', 'Only with linked lists', 'Only with trees'],
        correctAnswer: 0,
      },
      {
        id: 'stack_easy_12',
        text: 'What is the maximum number of elements a stack can hold?',
        options: ['Unlimited', 'Depends on available memory', '100', '1000'],
        correctAnswer: 1,
      },
      {
        id: 'stack_easy_13',
        text: 'Which pointer is used to track the top of a stack?',
        options: ['Head pointer', 'Tail pointer', 'Top pointer', 'Bottom pointer'],
        correctAnswer: 2,
      },
      {
        id: 'stack_easy_14',
        text: 'Is stack a linear or non-linear data structure?',
        options: ['Linear', 'Non-linear', 'Both', 'Neither'],
        correctAnswer: 0,
      },
      {
        id: 'stack_easy_15',
        text: 'What is returned when peek is called on an empty stack?',
        options: ['Null or error', 'Bottom element', 'Random element', '0'],
        correctAnswer: 0,
      },
    ],
  },
  
  // STACK - MEDIUM
  {
    concept: 'stack',
    difficulty: 'medium',
    questions: [
      {
        id: 'stack_medium_1',
        text: 'Which of the following applications uses a stack?',
        options: ['CPU scheduling', 'Function call management', 'Disk scheduling', 'Memory allocation'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_2',
        text: 'What is the space complexity of a stack with n elements?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_3',
        text: 'In expression evaluation, which notation uses stacks?',
        options: ['Infix', 'Postfix', 'Prefix', 'All of the above'],
        correctAnswer: 3,
      },
      {
        id: 'stack_medium_4',
        text: 'How is recursion internally managed by computers?',
        options: ['Using queues', 'Using stacks', 'Using trees', 'Using arrays'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_5',
        text: 'What is the result of pushing 1, 2, 3 and then popping twice?',
        options: ['Stack contains 1', 'Stack contains 2', 'Stack contains 3', 'Stack is empty'],
        correctAnswer: 0,
      },
      {
        id: 'stack_medium_6',
        text: 'Which operation is NOT typically supported by a basic stack?',
        options: ['Push', 'Pop', 'Peek', 'Search middle element'],
        correctAnswer: 3,
      },
      {
        id: 'stack_medium_7',
        text: 'Can two stacks be implemented in a single array efficiently?',
        options: ['Yes, starting from opposite ends', 'No, impossible', 'Only if array is very large', 'Only with dynamic resizing'],
        correctAnswer: 0,
      },
      {
        id: 'stack_medium_8',
        text: 'What is the minimum number of stacks needed to implement a queue?',
        options: ['1', '2', '3', '4'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_9',
        text: 'In a stack implemented using linked list, where should new nodes be inserted?',
        options: ['At the beginning', 'At the end', 'In the middle', 'Anywhere'],
        correctAnswer: 0,
      },
      {
        id: 'stack_medium_10',
        text: 'What is the auxiliary space needed for reversing a string using stack?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_11',
        text: 'Which of the following can be efficiently checked using a stack?',
        options: ['Palindrome', 'Balanced parentheses', 'Prime numbers', 'Sorting'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_12',
        text: 'What is the postfix notation of (A + B) * C?',
        options: ['ABC*+', 'AB+C*', 'ABC+*', 'A+BC*'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_13',
        text: 'In browser back button functionality, which data structure is used?',
        options: ['Queue', 'Stack', 'Tree', 'Graph'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_14',
        text: 'What happens when push is called on a full stack (fixed size)?',
        options: ['Stack underflow', 'Stack overflow', 'Segmentation fault', 'Nothing happens'],
        correctAnswer: 1,
      },
      {
        id: 'stack_medium_15',
        text: 'Can a stack be used to convert infix to postfix notation?',
        options: ['Yes', 'No', 'Only for simple expressions', 'Only with operators'],
        correctAnswer: 0,
      },
    ],
  },
  
  // STACK - HARD
  {
    concept: 'stack',
    difficulty: 'hard',
    questions: [
      {
        id: 'stack_hard_1',
        text: 'What is the time complexity of finding the minimum element in a stack at any point?',
        options: ['O(1) with special stack design', 'O(n) always', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
      },
      {
        id: 'stack_hard_2',
        text: 'How can you implement getMin() operation in O(1) time complexity?',
        options: ['Scan entire stack', 'Use auxiliary stack', 'Sort the stack', 'Impossible'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_3',
        text: 'What is the maximum number of stacks needed to sort a given stack?',
        options: ['1', '2', '3', 'Depends on input'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_4',
        text: 'In the Tower of Hanoi problem with n disks, how many moves are required?',
        options: ['2^n', '2^n - 1', 'n^2', 'n!'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_5',
        text: 'What is the space complexity of converting recursion to iteration using stack?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'Same as recursion depth'],
        correctAnswer: 3,
      },
      {
        id: 'stack_hard_6',
        text: 'Can a stack be implemented with O(1) push, pop, and findMiddle operations?',
        options: ['Yes, using doubly linked list', 'No, impossible', 'Yes, using array', 'Only with trees'],
        correctAnswer: 0,
      },
      {
        id: 'stack_hard_7',
        text: 'What is the Celebrity Problem in stack algorithms?',
        options: ['Finding most popular element', 'Finding person known by all but knows none', 'Finding tallest element', 'Finding median'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_8',
        text: 'How many stacks are needed to implement a priority queue efficiently?',
        options: ['1', '2', '3', 'Not possible with stacks'],
        correctAnswer: 3,
      },
      {
        id: 'stack_hard_9',
        text: 'What is the optimal approach for the Stock Span Problem?',
        options: ['Nested loops', 'Using stack', 'Using queue', 'Using sorting'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_10',
        text: 'In the Largest Rectangle in Histogram problem, what is the time complexity using stack?',
        options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
        correctAnswer: 2,
      },
      {
        id: 'stack_hard_11',
        text: 'Can you implement a queue that supports getMin() in O(1)?',
        options: ['Yes, using two special stacks', 'No, impossible', 'Yes, but only for small queues', 'Only with sorting'],
        correctAnswer: 0,
      },
      {
        id: 'stack_hard_12',
        text: 'What is the Next Greater Element problem optimal solution?',
        options: ['Brute force O(n²)', 'Stack based O(n)', 'Sorting O(n log n)', 'Binary search O(n log n)'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_13',
        text: 'In expression tree construction, stacks are used for which notation?',
        options: ['Infix only', 'Prefix and Postfix', 'All notations', 'None'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_14',
        text: 'What is the space complexity of solving N-Queens using stack-based backtracking?',
        options: ['O(1)', 'O(n)', 'O(n²)', 'O(2^n)'],
        correctAnswer: 1,
      },
      {
        id: 'stack_hard_15',
        text: 'Can you design a data structure that supports push, pop, and max in O(1)?',
        options: ['Yes, with auxiliary stack', 'No, impossible', 'Yes, but complex', 'Only with sorting'],
        correctAnswer: 0,
      },
    ],
  },

  // QUEUE - EASY
  {
    concept: 'queue',
    difficulty: 'easy',
    questions: [
      {
        id: 'queue_easy_1',
        text: 'What does FIFO stand for in the context of queues?',
        options: ['First In First Out', 'First In Forever Out', 'Fast In Fast Out', 'Final In First Out'],
        correctAnswer: 0,
      },
      {
        id: 'queue_easy_2',
        text: 'Which operation adds an element to a queue?',
        options: ['Enqueue', 'Dequeue', 'Push', 'Pop'],
        correctAnswer: 0,
      },
      {
        id: 'queue_easy_3',
        text: 'Which operation removes an element from a queue?',
        options: ['Enqueue', 'Dequeue', 'Push', 'Pop'],
        correctAnswer: 1,
      },
      {
        id: 'queue_easy_4',
        text: 'From which end are elements added in a queue?',
        options: ['Front', 'Rear', 'Middle', 'Any end'],
        correctAnswer: 1,
      },
      {
        id: 'queue_easy_5',
        text: 'From which end are elements removed in a queue?',
        options: ['Front', 'Rear', 'Middle', 'Any end'],
        correctAnswer: 0,
      },
      {
        id: 'queue_easy_6',
        text: 'What is the time complexity of enqueue operation?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
      },
      {
        id: 'queue_easy_7',
        text: 'What is the time complexity of dequeue operation?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 0,
      },
      {
        id: 'queue_easy_8',
        text: 'Which real-world scenario represents a queue?',
        options: ['Stack of books', 'People waiting in line', 'Nested function calls', 'Undo operation'],
        correctAnswer: 1,
      },
      {
        id: 'queue_easy_9',
        text: 'What happens when dequeue is called on an empty queue?',
        options: ['Returns null', 'Queue overflow', 'Queue underflow', 'Segmentation fault'],
        correctAnswer: 2,
      },
      {
        id: 'queue_easy_10',
        text: 'Is queue a linear or non-linear data structure?',
        options: ['Linear', 'Non-linear', 'Both', 'Neither'],
        correctAnswer: 0,
      },
      {
        id: 'queue_easy_11',
        text: 'Can a queue be implemented using arrays?',
        options: ['Yes', 'No', 'Only with linked lists', 'Only with stacks'],
        correctAnswer: 0,
      },
      {
        id: 'queue_easy_12',
        text: 'What pointers are maintained in a queue?',
        options: ['Top', 'Front and Rear', 'Head and Tail', 'Start and End'],
        correctAnswer: 1,
      },
      {
        id: 'queue_easy_13',
        text: 'In which order are elements removed from a queue?',
        options: ['Last added, first removed', 'First added, first removed', 'Random order', 'Middle first'],
        correctAnswer: 1,
      },
      {
        id: 'queue_easy_14',
        text: 'What is the front operation in a queue?',
        options: ['Removes element', 'Adds element', 'Views front element', 'Clears queue'],
        correctAnswer: 2,
      },
      {
        id: 'queue_easy_15',
        text: 'Can a queue be implemented using a linked list?',
        options: ['Yes', 'No', 'Only circular', 'Only with arrays'],
        correctAnswer: 0,
      },
    ],
  },

  // QUEUE - MEDIUM
  {
    concept: 'queue',
    difficulty: 'medium',
    questions: [
      {
        id: 'queue_medium_1',
        text: 'What is a circular queue?',
        options: ['Queue in a circle', 'Queue where rear connects to front', 'Round-robin queue', 'Rotating queue'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_2',
        text: 'What is the main advantage of a circular queue over a linear queue?',
        options: ['Faster operations', 'Better space utilization', 'Easier to implement', 'No advantage'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_3',
        text: 'In which algorithm is a queue primarily used?',
        options: ['Depth First Search', 'Breadth First Search', 'Binary Search', 'Quick Sort'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_4',
        text: 'What is a double-ended queue (deque)?',
        options: ['Two queues', 'Queue with two fronts', 'Queue allowing insertion/deletion at both ends', 'Circular queue'],
        correctAnswer: 2,
      },
      {
        id: 'queue_medium_5',
        text: 'How can you implement a queue using two stacks?',
        options: ['Impossible', 'Use one for enqueue, one for dequeue', 'Stack operations only', 'Requires three stacks'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_6',
        text: 'What is a priority queue?',
        options: ['Faster queue', 'Queue where elements have priorities', 'Queue with multiple fronts', 'Circular queue'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_7',
        text: 'In CPU scheduling, which data structure is used for ready queue?',
        options: ['Stack', 'Queue', 'Tree', 'Array'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_8',
        text: 'What is the space complexity of a queue with n elements?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_9',
        text: 'In a circular queue with size 5, if front=2 and rear=4, how many elements are there?',
        options: ['2', '3', '4', '5'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_10',
        text: 'Can a stack be implemented using queues?',
        options: ['Yes, using two queues', 'No, impossible', 'Yes, using one queue', 'Requires three queues'],
        correctAnswer: 0,
      },
      {
        id: 'queue_medium_11',
        text: 'What is the condition for a circular queue being full?',
        options: ['front == rear', '(rear+1)%size == front', 'rear == size-1', 'front == 0'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_12',
        text: 'Which operation is NOT typically supported by a basic queue?',
        options: ['Enqueue', 'Dequeue', 'Front', 'Access middle element'],
        correctAnswer: 3,
      },
      {
        id: 'queue_medium_13',
        text: 'In level-order traversal of a tree, which data structure is used?',
        options: ['Stack', 'Queue', 'Array', 'Linked List'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_14',
        text: 'What is an input-restricted deque?',
        options: ['Input only at front', 'Input only at rear', 'No input allowed', 'Limited inputs'],
        correctAnswer: 1,
      },
      {
        id: 'queue_medium_15',
        text: 'In a printer spooler, which data structure manages print jobs?',
        options: ['Stack', 'Queue', 'Tree', 'Graph'],
        correctAnswer: 1,
      },
    ],
  },

  // QUEUE - HARD
  {
    concept: 'queue',
    difficulty: 'hard',
    questions: [
      {
        id: 'queue_hard_1',
        text: 'What is the time complexity of implementing a queue using a single stack?',
        options: ['O(1) for both operations', 'O(n) for enqueue, O(1) for dequeue', 'O(1) for enqueue, O(n) for dequeue', 'O(n) for both'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_2',
        text: 'How do you implement a LRU (Least Recently Used) cache efficiently?',
        options: ['Using queue only', 'Using hash map and doubly linked list', 'Using stack', 'Using array'],
        correctAnswer: 1,
      },
      {
        id: 'queue_hard_3',
        text: 'What is the optimal data structure for implementing a priority queue?',
        options: ['Array', 'Linked List', 'Heap', 'Stack'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_4',
        text: 'In sliding window maximum problem, what is the optimal approach?',
        options: ['Brute force', 'Using deque', 'Using priority queue', 'Using stack'],
        correctAnswer: 1,
      },
      {
        id: 'queue_hard_5',
        text: 'What is the time complexity of finding kth smallest element using priority queue?',
        options: ['O(n)', 'O(k)', 'O(n log k)', 'O(k log n)'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_6',
        text: 'Can you design a queue with O(1) enqueue, dequeue, and getMax operations?',
        options: ['Yes, using deque', 'No, impossible', 'Yes, using auxiliary structures', 'Only with sorting'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_7',
        text: 'In multi-level feedback queue scheduling, how many queues are typically used?',
        options: ['1', '2', 'Multiple with different priorities', '10'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_8',
        text: 'What is the space complexity of BFS on a graph with V vertices and E edges?',
        options: ['O(V)', 'O(E)', 'O(V+E)', 'O(VE)'],
        correctAnswer: 0,
      },
      {
        id: 'queue_hard_9',
        text: 'How do you generate binary numbers from 1 to n using a queue?',
        options: ['Not possible', 'Enqueue "1", then generate by appending 0 and 1', 'Use conversion', 'Use recursion'],
        correctAnswer: 1,
      },
      {
        id: 'queue_hard_10',
        text: 'What is the time complexity of reversing a queue using recursion?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_11',
        text: 'In interleaving two halves of a queue, what auxiliary structure is needed?',
        options: ['Another queue', 'Stack', 'Both queue and stack', 'Array'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_12',
        text: 'What is the Peterson\'s algorithm using queues for?',
        options: ['Sorting', 'Searching', 'Mutual exclusion', 'Graph traversal'],
        correctAnswer: 2,
      },
      {
        id: 'queue_hard_13',
        text: 'How many queues are needed to implement a stack with O(1) amortized push?',
        options: ['1', '2', '3', 'Not possible'],
        correctAnswer: 1,
      },
      {
        id: 'queue_hard_14',
        text: 'In finding first non-repeating character in a stream, what is used?',
        options: ['Array', 'Queue and hash map', 'Stack', 'Tree'],
        correctAnswer: 1,
      },
      {
        id: 'queue_hard_15',
        text: 'What is the time complexity of k-way merge using priority queue?',
        options: ['O(n)', 'O(n log k)', 'O(k log n)', 'O(nk)'],
        correctAnswer: 1,
      },
    ],
  },

  // TREE - EASY
  {
    concept: 'tree',
    difficulty: 'easy',
    questions: [
      {
        id: 'tree_easy_1',
        text: 'What is a binary tree?',
        options: ['Tree with two nodes', 'Tree where each node has at most two children', 'Tree with two levels', 'Tree with binary values'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_2',
        text: 'What is the root node in a tree?',
        options: ['Last node', 'Middle node', 'Topmost node', 'Largest node'],
        correctAnswer: 2,
      },
      {
        id: 'tree_easy_3',
        text: 'What are leaf nodes in a tree?',
        options: ['Nodes with children', 'Nodes without children', 'Root nodes', 'Parent nodes'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_4',
        text: 'What is the height of a tree with only one node?',
        options: ['0', '1', '2', 'Undefined'],
        correctAnswer: 0,
      },
      {
        id: 'tree_easy_5',
        text: 'In a binary search tree, where is the smallest element located?',
        options: ['Root', 'Leftmost node', 'Rightmost node', 'Any leaf'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_6',
        text: 'In a binary search tree, where is the largest element located?',
        options: ['Root', 'Leftmost node', 'Rightmost node', 'Any leaf'],
        correctAnswer: 2,
      },
      {
        id: 'tree_easy_7',
        text: 'What is the maximum number of nodes in a binary tree of height h?',
        options: ['h', '2h', '2^h', '2^(h+1) - 1'],
        correctAnswer: 3,
      },
      {
        id: 'tree_easy_8',
        text: 'What is the property of a binary search tree?',
        options: ['Left < Root < Right', 'Left > Root > Right', 'No specific order', 'All equal values'],
        correctAnswer: 0,
      },
      {
        id: 'tree_easy_9',
        text: 'Which traversal visits the root first?',
        options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_10',
        text: 'Which traversal visits the root last?',
        options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'],
        correctAnswer: 2,
      },
      {
        id: 'tree_easy_11',
        text: 'What is the minimum number of nodes in a binary tree of height h?',
        options: ['h', 'h+1', '2h', '2^h'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_12',
        text: 'Is tree a linear or non-linear data structure?',
        options: ['Linear', 'Non-linear', 'Both', 'Neither'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_13',
        text: 'What is the parent-child relationship in trees?',
        options: ['Many-to-many', 'One-to-many', 'One-to-one', 'Many-to-one'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_14',
        text: 'How many children can a node have in a binary tree?',
        options: ['Exactly 2', 'At most 2', 'At least 2', 'Any number'],
        correctAnswer: 1,
      },
      {
        id: 'tree_easy_15',
        text: 'What is the degree of a leaf node?',
        options: ['0', '1', '2', 'Undefined'],
        correctAnswer: 0,
      },
    ],
  },

  // TREE - MEDIUM
  {
    concept: 'tree',
    difficulty: 'medium',
    questions: [
      {
        id: 'tree_medium_1',
        text: 'What is the time complexity of searching in a balanced BST?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 1,
      },
      {
        id: 'tree_medium_2',
        text: 'What is the worst-case time complexity of searching in a BST?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 'tree_medium_3',
        text: 'What is inorder traversal of a BST?',
        options: ['Random order', 'Descending order', 'Ascending order', 'Level order'],
        correctAnswer: 2,
      },
      {
        id: 'tree_medium_4',
        text: 'What is a complete binary tree?',
        options: ['All levels filled', 'All levels filled except possibly last', 'All leaves at same level', 'Perfect binary tree'],
        correctAnswer: 1,
      },
      {
        id: 'tree_medium_5',
        text: 'What is a full binary tree?',
        options: ['All nodes have 0 or 2 children', 'All levels filled', 'All leaves at bottom', 'Height balanced'],
        correctAnswer: 0,
      },
      {
        id: 'tree_medium_6',
        text: 'What is the space complexity of inorder traversal using recursion?',
        options: ['O(1)', 'O(log n)', 'O(h) where h is height', 'O(n)'],
        correctAnswer: 2,
      },
      {
        id: 'tree_medium_7',
        text: 'How do you find the diameter of a binary tree?',
        options: ['Just find height', 'Find longest path between any two nodes', 'Count all nodes', 'Find width'],
        correctAnswer: 1,
      },
      {
        id: 'tree_medium_8',
        text: 'What is the successor of a node in BST?',
        options: ['Parent node', 'Left child', 'Next larger element', 'Right child'],
        correctAnswer: 2,
      },
      {
        id: 'tree_medium_9',
        text: 'Can we construct a unique binary tree from preorder and inorder traversal?',
        options: ['Yes', 'No', 'Only for BST', 'Only if tree is complete'],
        correctAnswer: 0,
      },
      {
        id: 'tree_medium_10',
        text: 'What is the time complexity of level order traversal?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 'tree_medium_11',
        text: 'Which tree ensures O(log n) operations in worst case?',
        options: ['Binary Tree', 'BST', 'AVL Tree', 'Complete Binary Tree'],
        correctAnswer: 2,
      },
      {
        id: 'tree_medium_12',
        text: 'What is a mirror image of a binary tree?',
        options: ['Same tree', 'Left and right subtrees swapped', 'Inverted tree', 'Reverse tree'],
        correctAnswer: 1,
      },
      {
        id: 'tree_medium_13',
        text: 'How do you check if a binary tree is a BST?',
        options: ['Check root only', 'Check all nodes with range', 'Count nodes', 'Find height'],
        correctAnswer: 1,
      },
      {
        id: 'tree_medium_14',
        text: 'What is the lowest common ancestor (LCA) in a tree?',
        options: ['Root node', 'Deepest common parent', 'Any parent', 'Leaf node'],
        correctAnswer: 1,
      },
      {
        id: 'tree_medium_15',
        text: 'Can preorder traversal be done without recursion?',
        options: ['Yes, using stack', 'No, recursion required', 'Yes, using queue', 'Yes, using array'],
        correctAnswer: 0,
      },
    ],
  },

  // TREE - HARD
  {
    concept: 'tree',
    difficulty: 'hard',
    questions: [
      {
        id: 'tree_hard_1',
        text: 'What is the time complexity of Morris traversal?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 'tree_hard_2',
        text: 'What is the space complexity of Morris traversal?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(h)'],
        correctAnswer: 0,
      },
      {
        id: 'tree_hard_3',
        text: 'How do you serialize and deserialize a binary tree?',
        options: ['Not possible', 'Using preorder traversal', 'Using level order with null markers', 'Using inorder only'],
        correctAnswer: 2,
      },
      {
        id: 'tree_hard_4',
        text: 'What is the maximum width of a binary tree?',
        options: ['Number of nodes', 'Maximum nodes at any level', 'Height', 'Leaf nodes'],
        correctAnswer: 1,
      },
      {
        id: 'tree_hard_5',
        text: 'Can you construct BST from postorder traversal alone?',
        options: ['Yes', 'No', 'Only with inorder', 'Only if tree is complete'],
        correctAnswer: 0,
      },
      {
        id: 'tree_hard_6',
        text: 'What is a threaded binary tree?',
        options: ['Multi-threaded tree', 'Tree with null pointers replaced by threads', 'Parallel tree', 'Distributed tree'],
        correctAnswer: 1,
      },
      {
        id: 'tree_hard_7',
        text: 'What is the optimal approach for vertical order traversal?',
        options: ['Recursion only', 'Using hash map and level order', 'Inorder traversal', 'Postorder traversal'],
        correctAnswer: 1,
      },
      {
        id: 'tree_hard_8',
        text: 'How do you find kth smallest element in BST in O(h) space?',
        options: ['Inorder traversal', 'Using Morris traversal', 'Level order', 'Preorder'],
        correctAnswer: 1,
      },
      {
        id: 'tree_hard_9',
        text: 'What is the time complexity of converting a sorted array to BST?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
        correctAnswer: 2,
      },
      {
        id: 'tree_hard_10',
        text: 'Can you recover a BST if two nodes are swapped?',
        options: ['Yes, using inorder traversal', 'No, impossible', 'Yes, using preorder', 'Only if nodes are adjacent'],
        correctAnswer: 0,
      },
      {
        id: 'tree_hard_11',
        text: 'What is the space complexity of iterative postorder using one stack?',
        options: ['O(1)', 'O(log n)', 'O(h)', 'O(n)'],
        correctAnswer: 2,
      },
      {
        id: 'tree_hard_12',
        text: 'How do you find the maximum path sum in a binary tree?',
        options: ['Simple DFS', 'Using recursion with global maximum', 'Level order', 'Not possible'],
        correctAnswer: 1,
      },
      {
        id: 'tree_hard_13',
        text: 'What is a segment tree used for?',
        options: ['Sorting', 'Range queries and updates', 'Searching', 'Traversal'],
        correctAnswer: 1,
      },
      {
        id: 'tree_hard_14',
        text: 'What is the time complexity of building a segment tree?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'],
        correctAnswer: 0,
      },
      {
        id: 'tree_hard_15',
        text: 'Can you find the distance between two nodes in O(1) after preprocessing?',
        options: ['Yes, using LCA and preprocessing', 'No, always O(n)', 'Yes, using hash map', 'Not possible'],
        correctAnswer: 0,
      },
    ],
  },

  // SORTING - EASY
  {
    concept: 'sorting',
    difficulty: 'easy',
    questions: [
      {
        id: 'sorting_easy_1',
        text: 'Which sorting algorithm is based on comparing adjacent elements?',
        options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Heap Sort'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_easy_2',
        text: 'What is the best-case time complexity of Bubble Sort?',
        options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_easy_3',
        text: 'What is the worst-case time complexity of Bubble Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_easy_4',
        text: 'Which sorting algorithm builds a sorted array one element at a time?',
        options: ['Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Heap Sort'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_easy_5',
        text: 'What is a stable sorting algorithm?',
        options: ['Fast algorithm', 'Algorithm that maintains relative order of equal elements', 'Algorithm that never fails', 'In-place algorithm'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_easy_6',
        text: 'Is Bubble Sort a stable sorting algorithm?',
        options: ['Yes', 'No', 'Sometimes', 'Depends on implementation'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_easy_7',
        text: 'What is the space complexity of Bubble Sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_easy_8',
        text: 'Which sorting algorithm repeatedly selects the minimum element?',
        options: ['Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_easy_9',
        text: 'What is the time complexity of Selection Sort in all cases?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'Varies'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_easy_10',
        text: 'Is Selection Sort a stable algorithm?',
        options: ['Yes', 'No', 'Sometimes', 'Depends on data'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_easy_11',
        text: 'Which algorithm is best for small datasets?',
        options: ['Quick Sort', 'Merge Sort', 'Insertion Sort', 'Heap Sort'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_easy_12',
        text: 'What does "in-place" sorting mean?',
        options: ['Sorts in place', 'Uses O(1) or O(log n) extra space', 'Very fast', 'Stable'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_easy_13',
        text: 'Is Insertion Sort in-place?',
        options: ['Yes', 'No', 'Sometimes', 'Depends on input'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_easy_14',
        text: 'Which sorting algorithm is best for nearly sorted data?',
        options: ['Quick Sort', 'Bubble Sort', 'Insertion Sort', 'Selection Sort'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_easy_15',
        text: 'Can Bubble Sort be optimized?',
        options: ['Yes, with a flag for swaps', 'No, cannot be improved', 'Only for special cases', 'Not worth optimizing'],
        correctAnswer: 0,
      },
    ],
  },

  // SORTING - MEDIUM
  {
    concept: 'sorting',
    difficulty: 'medium',
    questions: [
      {
        id: 'sorting_medium_1',
        text: 'What is the average time complexity of Quick Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_2',
        text: 'What is the worst-case time complexity of Quick Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_medium_3',
        text: 'Which technique does Quick Sort use?',
        options: ['Greedy', 'Dynamic Programming', 'Divide and Conquer', 'Backtracking'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_medium_4',
        text: 'Is Quick Sort stable?',
        options: ['Yes', 'No', 'Can be made stable', 'Depends on pivot'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_5',
        text: 'What is the time complexity of Merge Sort in all cases?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_6',
        text: 'What is the space complexity of Merge Sort?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_medium_7',
        text: 'Is Merge Sort stable?',
        options: ['Yes', 'No', 'Sometimes', 'Depends on implementation'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_medium_8',
        text: 'What is the best way to choose a pivot in Quick Sort?',
        options: ['Always first element', 'Always last element', 'Random or median-of-three', 'Always middle element'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_medium_9',
        text: 'Which sorting algorithm uses a heap data structure?',
        options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Bubble Sort'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_medium_10',
        text: 'What is the time complexity of Heap Sort?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_11',
        text: 'Is Heap Sort stable?',
        options: ['Yes', 'No', 'Can be made stable', 'Usually stable'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_12',
        text: 'What is Counting Sort\'s time complexity?',
        options: ['O(n)', 'O(n+k) where k is range', 'O(n log n)', 'O(n²)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_13',
        text: 'When is Counting Sort preferred?',
        options: ['Always', 'When range is small', 'For large datasets', 'Never'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_14',
        text: 'What is Radix Sort based on?',
        options: ['Comparisons', 'Digit by digit sorting', 'Random selection', 'Binary search'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_medium_15',
        text: 'Can you sort in O(n) time using comparison-based sorting?',
        options: ['Yes', 'No, lower bound is O(n log n)', 'Only for special cases', 'Yes, with Quick Sort'],
        correctAnswer: 1,
      },
    ],
  },

  // SORTING - HARD
  {
    concept: 'sorting',
    difficulty: 'hard',
    questions: [
      {
        id: 'sorting_hard_1',
        text: 'What is the theoretical lower bound for comparison-based sorting?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_2',
        text: 'Which algorithm is used in JavaScript\'s Array.sort()?',
        options: ['Quick Sort', 'Merge Sort', 'Tim Sort', 'Heap Sort'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_hard_3',
        text: 'What is Tim Sort?',
        options: ['Quick Sort variant', 'Hybrid of Merge and Insertion Sort', 'New algorithm', 'Heap Sort variant'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_4',
        text: 'What is the space complexity of Quick Sort in worst case?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_hard_5',
        text: 'Can you implement Quick Sort with O(log n) space?',
        options: ['Yes, with tail recursion optimization', 'No, impossible', 'Yes, always', 'Only for sorted data'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_hard_6',
        text: 'What is the best algorithm for sorting linked lists?',
        options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Bubble Sort'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_7',
        text: 'What is external sorting used for?',
        options: ['Small data', 'Data that doesn\'t fit in memory', 'Already sorted data', 'Parallel sorting'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_8',
        text: 'What is the k-way merge algorithm complexity?',
        options: ['O(n)', 'O(n log k)', 'O(nk)', 'O(n log n)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_9',
        text: 'Can you find median of two sorted arrays in O(log n)?',
        options: ['Yes, using binary search', 'No, need O(n)', 'Yes, using merge', 'Not possible'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_hard_10',
        text: 'What is the Dutch National Flag problem?',
        options: ['Sorting problem', 'Partitioning into 3 sections', 'Graph problem', 'Tree problem'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_11',
        text: 'What is the optimal solution for sorting an array of 0s, 1s, and 2s?',
        options: ['Quick Sort', 'Merge Sort', 'Dutch National Flag algorithm O(n)', 'Counting Sort'],
        correctAnswer: 2,
      },
      {
        id: 'sorting_hard_12',
        text: 'Can you sort n numbers in range 1 to n² in O(n) time?',
        options: ['Yes, using Radix Sort', 'No, impossible', 'Yes, using Quick Sort', 'Yes, using Heap Sort'],
        correctAnswer: 0,
      },
      {
        id: 'sorting_hard_13',
        text: 'What is Intro Sort?',
        options: ['Introduction algorithm', 'Hybrid of Quick, Heap, and Insertion Sort', 'New sorting method', 'Parallel sort'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_14',
        text: 'What is the time complexity of sorting using a balanced BST?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correctAnswer: 1,
      },
      {
        id: 'sorting_hard_15',
        text: 'Can you implement stable Quick Sort?',
        options: ['Yes, with extra space', 'No, impossible', 'Yes, always stable', 'Only for small arrays'],
        correctAnswer: 0,
      },
    ],
  },
];

export function getQuestions(concept: string, difficulty: string): Question[] {
  const questionSet = questionBank.find(
    (qs) => qs.concept === concept && qs.difficulty === difficulty
  );
  
  // Add difficulty and topic metadata to each question
  const questions = questionSet?.questions || [];
  return questions.map(q => ({
    ...q,
    difficulty: difficulty as 'easy' | 'medium' | 'hard',
    topic: concept.charAt(0).toUpperCase() + concept.slice(1),
  }));
}
