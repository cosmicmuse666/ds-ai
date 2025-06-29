import { StudySchedule } from '../types';

export const subjectColors = {
  'Linear Algebra': 'bg-blue-500',
  'Calculus': 'bg-blue-600',
  'Probability': 'bg-green-500',
  'Statistics': 'bg-green-600',
  'Python': 'bg-green-400',
  'Data Structures': 'bg-orange-500',
  'Algorithms': 'bg-orange-600',
  'Machine Learning': 'bg-purple-500',
  'Deep Learning': 'bg-purple-600',
  'AI': 'bg-red-500',
  'DBMS': 'bg-red-600',
  'Review': 'bg-gray-500',
  'Mock Tests': 'bg-gray-600'
};

export const generateStudySchedule = (): StudySchedule => {
  const schedule: StudySchedule = {};
  
  // Month 1 (July): Mathematical Foundations
  const month1Plan = {
    // Week 1-2: Linear Algebra (Days 1-14)
    week1: [
      {
        subject: 'Linear Algebra',
        tasks: ['Vector spaces and subspaces basics', 'Linear dependence concepts', 'Watch MIT OCW Linear Algebra video 1-2'],
        resources: [
          'Coursera: Linear Algebra for Machine Learning and Data Science (DeepLearning.AI)',
          'Coursera: Linear Algebra: Matrix Algebra, Determinants, & Eigenvectors (Johns Hopkins University)',
          'Vector Spaces and Subspaces (with examples) - YouTube',
          'Understanding Vector Spaces - YouTube'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Vector spaces continued', 'Subspace verification practice', 'Complete 3Blue1Brown Chapter 1'],
        resources: [
          'Coursera: Linear Algebra for Machine Learning and Data Science (DeepLearning.AI)',
          'Vector Spaces and Subspaces (with examples) - YouTube',
          'Understanding Vector Spaces - YouTube',
          '3Blue1Brown Essence of Linear Algebra'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Matrix operations review', 'Inverse matrices', 'Special matrices (symmetric, orthogonal)'],
        resources: [
          'Khan Academy Linear Algebra',
          'Inverse Matrices and Their Properties - YouTube',
          "Lay's Linear Algebra textbook",
          'MIT OCW Linear Algebra'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Matrix operations practice', 'Determinants and properties', 'Rank and nullity introduction'],
        resources: [
          'Khan Academy Linear Algebra',
          'Inverse Matrices and Their Properties - YouTube',
          'MIT OCW Linear Algebra'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Quadratic forms', 'Rank and nullity deep dive', 'Matrix decomposition basics'],
        resources: [
          'MathInsight.org',
          'How to Find Rank and Nullity of a Matrix | Linear Algebra Exercises - YouTube',
          "Paul's Online Math Notes",
          'MIT OCW Linear Algebra'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Quadratic forms practice', 'Positive definite matrices', 'Applications in optimization'],
        resources: [
          'MathInsight.org',
          'How to Find Rank and Nullity of a Matrix | Linear Algebra Exercises - YouTube',
          "Paul's Notes",
          'MIT OCW Linear Algebra'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Week 1 practice set', 'GATE PYQs - Linear Algebra', 'Concept review and consolidation'],
        resources: [
          'GATE Overflow',
          'Linear Algebra GATE Questions - YouTube',
          'Linear Algebra NPTEL assignments',
          'Made Easy Workbooks'
        ]
      }
    ],
    week2: [
      {
        subject: 'Linear Algebra',
        tasks: ['LU decomposition theory', 'Eigenvalues introduction', 'Characteristic polynomials'],
        resources: [
          'Khan Academy',
          'Linear Algebra - LU-Decomposition of a Matrix Explained - YouTube',
          'MIT OCW',
          '3Blue1Brown'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Eigenvalues computation', 'Eigenvectors and eigenspaces', 'Diagonalization'],
        resources: [
          'Khan Academy',
          'Finding Eigenvalues and Eigenvectors - YouTube',
          'MIT OCW',
          '3Blue1Brown Eigenvalues and Eigenvectors'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['LU decomposition practice', 'Applications of eigenvalues', 'Matrix powers using diagonalization'],
        resources: [
          'Linear Algebra - LU-Decomposition of a Matrix Explained - YouTube',
          'Finding Eigenvalues and Eigenvectors - YouTube',
          'Khan Academy',
          'MIT OCW'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['SVD introduction', 'Singular values and vectors', 'Low-rank approximations'],
        resources: [
          'Singular Value Decomposition (SVD): Overview - YouTube',
          'Singular Value Decomposition in 3 minutes | SVD Part 01 - YouTube',
          'Essence of LA - YouTube',
          'DeepLearning.ai Math'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['SVD applications', 'Projections and least squares', 'Orthogonal projections'],
        resources: [
          'Linear Algebra: Projections - YouTube',
          'Singular Value Decomposition (SVD): Overview - YouTube',
          'Essence of LA - YouTube',
          'MIT OCW'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Projections practice', 'Gram-Schmidt process', 'QR decomposition'],
        resources: [
          'Linear Algebra: Projections - YouTube',
          'Essence of LA - YouTube',
          'DeepLearning.ai Math',
          'MIT OCW'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Linear Algebra recap', 'MCQ practice', 'Week 2 assessment'],
        resources: [
          '1300 Linear Algebra MCQs Solution - YouTube',
          'GateOverflow',
          'Made Easy Workbooks',
          'NPTEL assignments'
        ]
      }
    ],
    // Week 3: Calculus & Optimization (Days 15-21)
    week3: [
      {
        subject: 'Calculus',
        tasks: ['Limits and continuity review', 'Multivariable limits', 'Epsilon-delta definition'],
        resources: [
          "Paul's Online Notes",
          'Limits and Continuity - YouTube',
          'Khan Academy Calculus',
          'MIT OCW Calculus'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Partial derivatives', 'Chain rule multivariable', 'Implicit differentiation'],
        resources: [
          "Paul's Online Notes",
          'What Is Derivatives In Calculus In Layman Terms? - YouTube',
          'Khan Academy',
          'MIT OCW Calculus'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Taylor series multivariable', 'Error analysis', 'Approximation methods'],
        resources: [
          "Paul's Online Notes",
          'Taylor series | Chapter 11, Essence of calculus - YouTube',
          'Khan Academy',
          'MIT OCW Calculus'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Maxima and minima', 'Critical points', 'Second derivative test'],
        resources: [
          'Khan Academy',
          'Introduction to Maxima and Minima for Calculus - YouTube',
          "Prof. Gilbert's lectures",
          "Paul's Notes"
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Constrained optimization', 'Lagrange multipliers', 'Applications in ML'],
        resources: [
          'Khan Academy',
          'Introduction to Maxima and Minima for Calculus - YouTube',
          "Prof. Gilbert's lectures",
          "Paul's Notes"
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Gradient descent theory', 'Convexity concepts', 'Optimization algorithms'],
        resources: [
          'Gradient Descent - Machine Learning Crash Course - YouTube',
          'Convex Optimization - YouTube',
          "Andrew Ng's ML Math",
          'DeepL.ai Math series'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Calculus week review', 'Optimization practice problems', 'Integration to probability prep'],
        resources: [
          'All week resources',
          'Practice problems',
          'GATE PYQs',
          'Convex Optimization Boyd'
        ]
      }
    ],
    // Week 4: Probability Basics (Days 22-28)
    week4: [
      {
        subject: 'Probability',
        tasks: ['Counting principles', 'Permutations and combinations', 'Sample spaces'],
        resources: [
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
          'edX: Introduction to Probability (HarvardX)',
          "Blitzstein's Harvard Stats",
          '3Blue1Brown - Bayes'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Probability axioms', 'Conditional probability', 'Independence'],
        resources: [
          "Blitzstein's Harvard Stats",
          '3Blue1Brown - Bayes',
          'Khan Academy',
          'edX: Probability - The Science of Uncertainty and Data (MITx)'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Bayes theorem', 'Law of total probability', 'Applications and examples'],
        resources: [
          "Blitzstein's Harvard Stats",
          '3Blue1Brown - Bayes',
          'Khan Academy',
          'edX: Introduction to Probability (HarvardX)'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Random variables', 'Expectation and linearity', 'Variance properties'],
        resources: [
          'Khan Academy',
          'NPTEL - Prob & Stats',
          'Harvard Stat110',
          "Blitzstein's Harvard Stats"
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Mean, median, mode', 'Standard deviation', 'Moments of distributions'],
        resources: [
          'Khan Academy',
          'NPTEL - Prob & Stats',
          'Harvard Stat110',
          "Blitzstein's Harvard Stats"
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Covariance and correlation', 'Joint distributions', 'Independence of RVs'],
        resources: [
          'Khan Academy',
          'NPTEL - Prob & Stats',
          'Harvard Stat110',
          "Blitzstein's Harvard Stats"
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Probability quiz', 'GATE PYQs practice', 'Month 1 review preparation'],
        resources: [
          'PYQs',
          'GATEOverflow',
          'ISLR Exercises',
          'Harvard Stat110'
        ]
      }
    ]
  };

  // Month 2 (August): Stats + Python Foundations
  const month2Plan = {
    // Week 5: Distributions + Stats (Days 29-35)
    week5: [
      {
        subject: 'Statistics',
        tasks: ['Bernoulli distribution', 'Binomial distribution', 'Properties and applications'],
        resources: [
          'Coursera: Introduction to Statistics (Stanford University)',
          'Coursera: Basic Statistics (University of Amsterdam)',
          'Bernoulli Distribution Probability Modeling Explained - YouTube',
          'Binomial Distribution EXPLAINED in UNDER 15 MINUTES! - YouTube'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Normal distribution', 'Standard normal', 'Z-scores and applications'],
        resources: [
          'Coursera: The Power of Statistics (Google)',
          'Understanding the normal distribution - statistics help #Statistics #Probability - YouTube',
          'ISLR book',
          'Khan Academy'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Distribution relationships', 'Central Limit Theorem', 'Sampling distributions'],
        resources: [
          'The Central Limit Theorem, Clearly Explained!!! - YouTube',
          'ISLR book',
          'Khan Academy',
          'StatQuest'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Poisson distribution', 'Exponential distribution', 'Applications in real world'],
        resources: [
          'Introduction to Poisson Distribution - Probability & Statistics - YouTube',
          'The Exponential Distribution - YouTube',
          'Harvard Stat110',
          'StatQuest'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['t-distribution', 'Chi-square distribution', 'F-distribution'],
        resources: [
          "Student's T Distribution - YouTube",
          'The Square of the Normal Distribution - YouTube',
          'Harvard Stat110',
          'StatQuest'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Hypothesis testing', 'Type I and II errors', 'p-values and significance'],
        resources: [
          'Hypothesis Testing Explained in 60 Seconds - YouTube',
          'Harvard Stat110',
          'StatQuest',
          'Khan Academy'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Statistics GATE PYQs', 'Week 5 assessment', 'Prepare for Python'],
        resources: [
          'GATE DA 25: Practice and PYQs: Probability and Statistics Part 2 - YouTube',
          'GATE PYQs',
          'GATEOverflow',
          'ISLR Exercises'
        ]
      }
    ],
    // Week 6: Python Programming I (Days 36-42)
    week6: [
      {
        subject: 'Python',
        tasks: ['Python syntax basics', 'Variables and data types', 'Control structures'],
        resources: [
          'GeeksforGeeks: 10 Best Python Data Science Courses Online [2025]',
          'Python Tutorial: Learn Python For Data Science - YouTube',
          'Python.org Docs',
          'RealPython'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Functions and scope', 'Recursion basics', 'Lambda functions'],
        resources: [
          'Coursera: Applied Data Science with Python (University of Michigan)',
          'Recursion for Python Beginners with Recursive Function Examples - YouTube',
          '#40 Python Tutorial for Beginners | Recursion - YouTube',
          'Python.org Docs'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Recursion advanced', 'Dynamic programming intro', 'Memoization'],
        resources: [
          'DataCamp: Data Scientist with Python',
          'Recursion for Python Beginners with Recursive Function Examples - YouTube',
          '#40 Python Tutorial for Beginners | Recursion - YouTube',
          'GeeksforGeeks'
        ]
      },
      {
        subject: 'Python',
        tasks: ['NumPy basics', 'Arrays and operations', 'Broadcasting'],
        resources: [
          'Python NumPy Tutorial - YouTube',
          'Datacamp',
          'Jupyter Notebooks',
          'NumPy docs'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Pandas introduction', 'DataFrames and Series', 'Data manipulation'],
        resources: [
          'Pandas Tutorial (Data Analysis In Python) - YouTube',
          'Datacamp',
          'Kaggle Notebooks',
          'Pandas docs'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Object-oriented programming', 'Classes and objects', 'Inheritance'],
        resources: [
          'Python Object Oriented Programming (OOP) - For Beginners - YouTube',
          'Datacamp',
          'RealPython',
          'Python OOP tutorials'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Build CLI Calculator', 'CSV Data Cleaner project', 'Code review and optimization'],
        resources: [
          'Creating a Command Line Utility In Python | Python for AI #77 - YouTube',
          'Building a Basic Command Line Calculator in Python - YouTube',
          'Data Cleaning with Python Pandas: Hands-On Tutorial with Real World Data - YouTube',
          'Project-based learning'
        ]
      }
    ]
  };

  // Month 3 (September): DS & Algorithms Deep Dive
  const month3Plan = {
    // Week 7: Data Structures I (Days 43-49)
    week7: [
      {
        subject: 'Data Structures',
        tasks: ['Arrays and dynamic arrays', 'Time complexity analysis', 'Array operations'],
        resources: [
          'Deep Dive into the Array Data Structure - YouTube',
          'GFG',
          'Python Tutor Visualizer',
          'LeetCode'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Stacks implementation', 'Stack applications', 'Expression evaluation'],
        resources: [
          'GFG',
          'Python Tutor Visualizer',
          'HackerRank',
          'Stack data structure tutorials'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Queues and deques', 'Circular queues', 'Priority queues intro'],
        resources: [
          'Queue Data Structure Tutorial - What is a Queue? - YouTube',
          'GFG',
          'Python Tutor Visualizer',
          'HackerRank'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Linked lists basics', 'Singly and doubly linked', 'List operations'],
        resources: [
          'GFG',
          'Python Tutor Visualizer',
          'LeetCode',
          'Linked list tutorials'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Linked list problems', 'Cycle detection', 'Merging lists'],
        resources: [
          'GFG',
          'LeetCode',
          'HackerRank',
          'Linked list problem sets'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Trees introduction', 'Binary trees', 'Tree terminology'],
        resources: [
          'Binary Search Tree Explained | Data Structures for Beginners - YouTube',
          'GFG',
          'Visualgo',
          'MIT OCW Algorithms'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Tree traversals', 'Pre/In/Post order', 'BFS and DFS on trees'],
        resources: [
          'Binary tree traversal - breadth-first and depth-first strategies - YouTube',
          'Depth-First Search Algorithm: Graph or Tree traversal and search - YouTube',
          'GFG',
          'Tree practice problems'
        ]
      }
    ],
    // Week 8: Data Structures II (Days 50-56)
    week8: [
      {
        subject: 'Data Structures',
        tasks: ['Binary search trees', 'BST operations', 'AVL trees intro'],
        resources: [
          'Binary Search Trees | C++ | Java | Data Structures and Algorithms | Placements - YouTube',
          'GFG',
          'Visualgo',
          'MIT OCW'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Tree problems practice', 'Height and depth', 'Lowest common ancestor'],
        resources: [
          'LeetCode',
          'GFG',
          'Tree problem sets',
          'Binary tree practice'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Hash tables theory', 'Hash functions', 'Collision resolution'],
        resources: [
          'Data Structures: Hash Tables - YouTube',
          'GFG',
          'MIT OCW Algorithms',
          'Hash table visualizations'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Heaps and priority queues', 'Min/max heaps', 'Heap operations'],
        resources: [
          'The Heap Data Structure: A Comprehensive Tutorial - YouTube',
          'GFG',
          'Visualgo',
          'Heap implementations'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Hashing applications', 'Hash maps in practice', 'Performance analysis'],
        resources: [
          'Understanding and implementing a Hash Table (in C) - YouTube',
          'GFG',
          'LeetCode hashing',
          'Practice sets'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Hashing practice problems', 'Two sum variants', 'Frequency counting'],
        resources: [
          'LeetCode',
          'HackerRank',
          'Practice sets',
          'Hash table problems'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Data structures quiz', 'Week 8 revision', 'Algorithm prep'],
        resources: [
          'Top 20+ Data structure Questions & Answer | Tpoint Tech - YouTube',
          'All week resources',
          'Quiz platforms',
          'Revision notes'
        ]
      }
    ],
    // Week 9: Algorithms I (Days 57-63)
    week9: [
      {
        subject: 'Algorithms',
        tasks: ['Sorting algorithms intro', 'Bubble sort', 'Selection sort'],
        resources: [
          'Bubble Sort Algorithm Explained (Full Code Included) - Python Algorithms Series for Beginners - YouTube',
          'GFG',
          'Visualgo',
          'Sorting visualizations'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Insertion sort', 'Sorting analysis', 'Stability in sorting'],
        resources: [
          'Insertion sort in 2 minutes - YouTube',
          'GFG',
          'MIT OCW Algorithms',
          'Algorithm analysis'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Merge sort algorithm', 'Divide and conquer', 'Merge sort analysis'],
        resources: [
          'Understanding Mergesort: Sorting Made Simple | Recursion Series - YouTube',
          'GFG',
          'MIT OCW',
          'Merge sort implementations'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Quick sort algorithm', 'Partitioning', 'Quick sort analysis'],
        resources: [
          '2.8.1 QuickSort Algorithm - YouTube',
          'GFG',
          'MIT OCW',
          'Quick sort visualizations'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Sorting patterns practice', 'LeetCode sorting', 'Comparison of algorithms'],
        resources: [
          'LeetCode Patterns - YouTube',
          'LeetCode',
          'Sorting problem sets',
          'Performance comparisons'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Linear search', 'Binary search', 'Search variations'],
        resources: [
          'Learn Linear Search in 3 minutes ⬇️ - YouTube',
          'Binary Search Algorithm in 100 Seconds - YouTube',
          'GFG',
          'Search implementations'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Ternary search', 'Search problems', 'Advanced searching'],
        resources: [
          'GFG',
          'LeetCode binary search',
          'Search problem practice',
          'Advanced search algorithms'
        ]
      }
    ],
    // Week 10: Algorithms II + Graph Theory (Days 64-70)
    week10: [
      {
        subject: 'Algorithms',
        tasks: ['Recursion patterns', 'Recursive thinking', 'Base cases'],
        resources: [
          'Algorithms: Recursion - YouTube',
          'GFG',
          'Recursion visualizations',
          'Recursive problem solving'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Divide and conquer', 'Master theorem', 'D&C applications'],
        resources: [
          'Divide and Conquer: The Art of Breaking Down Problems | Recursion Series - YouTube',
          'MIT OCW Algorithms',
          'D&C examples',
          'Complexity analysis'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Advanced recursion', 'Backtracking intro', 'Recursive optimization'],
        resources: [
          'GFG',
          'Backtracking problems',
          'Advanced recursion',
          'Recursive algorithms'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Graph representation', 'Adjacency matrix/list', 'Graph basics'],
        resources: [
          'Graph in Data Structure | BFS & DFS Algorithms | Learn Coding - YouTube',
          'GFG',
          'Graph theory basics',
          'Graph implementations'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['BFS on graphs', 'DFS on graphs', 'Graph traversal applications'],
        resources: [
          'Binary tree traversal - breadth-first and depth-first strategies - YouTube',
          'Depth-First Search Algorithm: Graph or Tree traversal and search - YouTube',
          'GFG',
          'Visualgo graphs'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Shortest path algorithms', 'Dijkstra algorithm', 'Path finding'],
        resources: [
          "How Dijkstra's Algorithm Works - YouTube",
          'GFG',
          'Dijkstra implementations',
          'Shortest path problems'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Graph applications', 'Connected components', 'Graph problems practice'],
        resources: [
          'LeetCode graphs',
          'Graph problem sets',
          'Applications',
          'Graph algorithms practice'
        ]
      }
    ]
  };

  // Month 4 (October): Machine Learning
  const month4Plan = {
    // Week 11-12: Supervised ML (Days 71-84)
    week11: [
      {
        subject: 'Machine Learning',
        tasks: ['ML introduction', 'Supervised vs unsupervised', 'Types of learning'],
        resources: [
          'Andrew Ng Coursera ML Course',
          'Kaggle: https://www.kaggle.com/',
          'fast.ai: Offers free, practical deep learning courses',
          'ISLR Book'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Simple linear regression', 'Least squares', 'Cost functions'],
        resources: [
          'Linear Regression, Clearly Explained!!! - YouTube',
          'ISLR',
          'Coursera ML Week 1',
          'Linear regression theory'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Multiple linear regression', 'Feature scaling', 'Normal equation'],
        resources: [
          'Multiple Regression for beginners - YouTube',
          'ISLR',
          'Coursera ML Week 2',
          'MLR implementations'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Ridge regression', 'Regularization', 'Bias-variance tradeoff'],
        resources: [
          'Regularization Part 1: Ridge (L2) Regression - YouTube',
          'Bias-Variance Trade-off - Explained - YouTube',
          'ISLR',
          'Coursera ML Week 3'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Lasso regression', 'Elastic net', 'Feature selection'],
        resources: [
          'ISLR',
          'Scikit-learn docs',
          'Regularization comparison',
          'Feature selection techniques'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Logistic regression', 'Sigmoid function', 'Classification basics'],
        resources: [
          'StatQuest: Logistic Regression - YouTube',
          'StatQuest',
          'Sklearn',
          'Logistic regression theory'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['k-NN algorithm', 'Distance metrics', 'Curse of dimensionality'],
        resources: [
          'K Nearest Neighbors (KNN) in 10 Minutes (Beginner Friendly) - YouTube',
          'Simple Explanation of the K-Nearest Neighbors (KNN) Algorithm - YouTube',
          'ISLR',
          'Distance learning'
        ]
      }
    ],
    week12: [
      {
        subject: 'Machine Learning',
        tasks: ['Naive Bayes', 'Bayes classifier', 'Text classification'],
        resources: [
          'Naive Bayes, Clearly Explained!!! - YouTube',
          'StatQuest',
          'Sklearn',
          'NB applications'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Linear Discriminant Analysis', 'QDA', 'Dimensionality reduction'],
        resources: [
          'ISLR',
          'LDA theory',
          'Discriminant analysis',
          'Dimensionality reduction techniques'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Support Vector Machines', 'Kernel trick', 'SVM theory'],
        resources: [
          'Support Vector Machines Part 1 (of 3): Main Ideas!!! - YouTube',
          'Support Vector Machine (SVM) in 2 minutes - YouTube',
          'Hands-on ML',
          'Kernel methods'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Decision trees', 'Information gain', 'Tree pruning'],
        resources: [
          'Decision Trees in Machine Learning | Introduction - YouTube',
          'ISLR',
          'Decision tree algorithms',
          'Tree implementations'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Cross-validation', 'k-fold CV', 'Model selection'],
        resources: [
          'Machine Learning Fundamentals: Cross Validation - YouTube',
          'ISLR',
          'CV techniques',
          'Model evaluation'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Neural networks intro', 'Perceptron', 'Multi-layer perceptrons'],
        resources: [
          'What is Multilayer Perceptron (MLP) in Machine Learning? - YouTube',
          'DeepLearning.ai',
          "Karpathy's NN videos",
          'NN basics'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Feedforward networks', 'Backpropagation', 'NN training'],
        resources: [
          'Feedforward Neural Networks Explained | Learn FNNs in Simple Terms - YouTube',
          'DeepLearning.ai',
          "Karpathy's NN videos",
          'NN implementations'
        ]
      }
    ],
    // Week 13-14: Unsupervised + Project (Days 85-98)
    week13: [
      {
        subject: 'Machine Learning',
        tasks: ['Clustering introduction', 'k-means algorithm', 'Cluster evaluation'],
        resources: [
          'K-Means Algorithm Simple Explanation - YouTube',
          'Josh Starmer StatQuest',
          'Sklearn docs',
          'Clustering theory'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Hierarchical clustering', 'Dendrograms', 'Linkage methods'],
        resources: [
          'What is Hierarchical Clustering in Machine Learning? - YouTube',
          'StatQuest',
          'Sklearn clustering',
          'Hierarchical methods'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['DBSCAN clustering', 'Density-based clustering', 'Cluster comparison'],
        resources: [
          'Sklearn docs',
          'DBSCAN theory',
          'Clustering algorithms',
          'Density-based methods'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Principal Component Analysis', 'Dimensionality reduction', 'PCA theory'],
        resources: [
          'Principal Component Analysis (PCA) - YouTube',
          'StatQuest',
          'PCA implementations',
          'Dimensionality reduction'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['PCA applications', 'Feature extraction', 'Variance explained'],
        resources: [
          'Sklearn PCA',
          'PCA practice',
          'Feature engineering',
          'Variance analysis'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['t-SNE', 'Manifold learning', 'Visualization techniques'],
        resources: [
          't-SNE theory',
          'Manifold learning',
          'Data visualization',
          'Dimensionality reduction techniques'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['ML project planning', 'Dataset selection', 'Problem formulation'],
        resources: [
          'Machine Learning End to End Project | Full Course | iNeuron - YouTube',
          'End-to-End Machine Learning Project – AI, MLOps - YouTube',
          'Kaggle datasets',
          'ML workflow'
        ]
      }
    ],
    week14: [
      {
        subject: 'Machine Learning',
        tasks: ['Data preprocessing', 'Feature engineering', 'Data cleaning'],
        resources: [
          'Pandas',
          'Sklearn preprocessing',
          'Data preparation',
          'Feature engineering techniques'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model selection', 'Algorithm comparison', 'Baseline models'],
        resources: [
          'Sklearn',
          'Model comparison',
          'ML pipeline',
          'Algorithm selection'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model training', 'Hyperparameter tuning', 'Grid search'],
        resources: [
          'Sklearn',
          'Hyperparameter optimization',
          'Model tuning',
          'Grid search techniques'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model evaluation', 'Metrics selection', 'Performance analysis'],
        resources: [
          'Sklearn metrics',
          'Model evaluation',
          'Performance measures',
          'Evaluation techniques'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model interpretation', 'Feature importance', 'Results analysis'],
        resources: [
          'Model interpretation',
          'Feature analysis',
          'Results presentation',
          'Model explainability'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Project documentation', 'Code organization', 'Presentation prep'],
        resources: [
          'Documentation best practices',
          'Code structure',
          'Project presentation',
          'Technical writing'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Project completion', 'Final review', 'ML month assessment'],
        resources: [
          'Project finalization',
          'Code review',
          'Month 4 review',
          'ML assessment'
        ]
      }
    ]
  };

  // Month 5 (November): AI + DBMS
  const month5Plan = {
    // Week 15-16: AI + Reasoning (Days 99-112)
    week15: [
      {
        subject: 'AI',
        tasks: ['AI introduction', 'Intelligent agents', 'Problem-solving agents'],
        resources: [
          'AIMA Book',
          'Stanford CS221',
          'AI fundamentals',
          'Intelligent agents theory'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Search algorithms', 'Uninformed search', 'BFS and DFS'],
        resources: [
          'AI Search Algorithms - YouTube',
          'AIMA Book',
          'Search algorithms',
          'AI search theory'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Informed search', 'A* algorithm', 'Heuristic functions'],
        resources: [
          'AIMA Book',
          'A* implementations',
          'Heuristic search',
          'Informed search algorithms'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Local search', 'Hill climbing', 'Simulated annealing'],
        resources: [
          'AIMA Book',
          'Local search algorithms',
          'Optimization methods',
          'Metaheuristic algorithms'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Constraint satisfaction', 'CSP algorithms', 'Backtracking search'],
        resources: [
          'AIMA Book',
          'CSP theory',
          'Constraint programming',
          'Backtracking algorithms'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Logic and reasoning', 'Propositional logic', 'Logical inference'],
        resources: [
          'PROPOSITIONAL LOGIC | Artificial Intelligence | GATE | PL with example | Hindi tutorial - YouTube',
          'AIMA Book',
          'Logic in AI',
          'Reasoning systems'
        ]
      },
      {
        subject: 'AI',
        tasks: ['First-order logic', 'Predicate logic', 'Knowledge representation'],
        resources: [
          'Predicate logic in AI | First order logic in Artificial Intelligence | fol examples - YouTube',
          'AIMA Book',
          'FOL theory',
          'Knowledge systems'
        ]
      }
    ],
    week16: [
      {
        subject: 'AI',
        tasks: ['Adversarial search', 'Game theory', 'Minimax algorithm'],
        resources: [
          'Introduction to Adversarial Search || Artificial Intelligence - YouTube',
          'AIMA Book',
          'Game AI',
          'Adversarial algorithms'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Alpha-beta pruning', 'Game optimization', 'Evaluation functions'],
        resources: [
          'AIMA Book',
          'Game optimization',
          'Pruning techniques',
          'Game tree search'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Probabilistic reasoning', 'Bayesian networks', 'Uncertainty'],
        resources: [
          'Understanding AI: Probabilistic Models Explained Simply - YouTube',
          'CS221 Stanford',
          'Bayesian AI',
          'Probabilistic models'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Markov models', 'Hidden Markov Models', 'Sequential data'],
        resources: [
          'AIMA Book',
          'Markov models',
          'Sequential AI',
          'HMM theory'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Sampling methods', 'Monte Carlo', 'MCMC algorithms'],
        resources: [
          'Sampling Techniques Explained With Detailed Examples | Intellipaat - YouTube',
          'Sampling theory',
          'Monte Carlo methods',
          'MCMC'
        ]
      },
      {
        subject: 'AI',
        tasks: ['AI problem solving', 'Case studies', 'AI applications'],
        resources: [
          'COMP 3200 / 6980 - Intro to Artificial Intelligence - Lecture 03 - Problem Solving and Search',
          'AIMA problems',
          'AI case studies',
          'Real-world AI'
        ]
      },
      {
        subject: 'AI',
        tasks: ['AI week review', 'Reasoning practice', 'DBMS preparation'],
        resources: [
          'AI review materials',
          'Practice problems',
          'Week assessment',
          'AI fundamentals review'
        ]
      }
    ],
    // Week 17-18: DBMS + Warehousing (Days 113-126)
    week17: [
      {
        subject: 'DBMS',
        tasks: ['Database concepts', 'DBMS architecture', 'Data models'],
        resources: [
          'PlacementPreparation.io: 10 Best Websites to Learn DBMS in 2025 [Free + Paid]',
          'DBMS by Navathe',
          'Database fundamentals',
          'DBMS theory'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Entity-Relationship model', 'ER diagrams', 'Relationship types'],
        resources: [
          'Entity Relationship Diagram Tutorial - YouTube',
          'GFG DBMS',
          'ER modeling',
          'Database design'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['ER to relational mapping', 'Schema conversion', 'Table design'],
        resources: [
          'Database design',
          'Schema mapping',
          'Relational model',
          'Table normalization'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Relational algebra', 'Selection and projection', 'Join operations'],
        resources: [
          'Relational Algebra in DBMS with Examples-Relational Algebra in DBMS-Relational Algebra Operations - YouTube',
          'Relational algebra',
          'Database operations',
          'Query theory'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['SQL basics', 'DDL and DML', 'Basic queries'],
        resources: [
          'SQL Tutorial for Beginners | Future of Data & AI | Data Science Dojo - YouTube',
          'SQLZoo',
          'SQL tutorials',
          'Database queries'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Advanced SQL', 'Joins and subqueries', 'Aggregate functions'],
        resources: [
          'LeetCode SQL',
          'Advanced SQL',
          'Query optimization',
          'Complex queries'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['SQL practice', 'Complex queries', 'Database problems'],
        resources: [
          'LeetCode SQL',
          'SQL practice',
          'Query problems',
          'Database exercises'
        ]
      }
    ],
    week18: [
      {
        subject: 'DBMS',
        tasks: ['Normalization theory', 'Functional dependencies', '1NF, 2NF, 3NF'],
        resources: [
          'Normalization theory',
          'Database normalization',
          'FD theory',
          'Normal forms'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['BCNF and 4NF', 'Decomposition', 'Lossless joins'],
        resources: [
          'Advanced normalization',
          'Database decomposition',
          'Normal forms',
          'Lossless decomposition'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Transaction management', 'ACID properties', 'Concurrency control'],
        resources: [
          'Transaction theory',
          'DBMS transactions',
          'Concurrency',
          'ACID properties'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Indexing and hashing', 'B-trees', 'Database performance'],
        resources: [
          'Database indexing',
          'B-tree structures',
          'Performance tuning',
          'Index optimization'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Data warehousing', 'OLAP vs OLTP', 'Dimensional modeling'],
        resources: [
          'Data Warehouse - The Ultimate Guide [2025] | Master Data Modeling - YouTube',
          'IBM DW Tutorial',
          'Data warehousing',
          'OLAP concepts'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['ETL processes', 'Data integration', 'Warehouse design'],
        resources: [
          'What is Data Mapping and Transformation? (Data Transformation) - YouTube',
          'ETL theory',
          'Data integration',
          'Warehouse architecture'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['DBMS review', 'SQL practice', 'Month 5 assessment'],
        resources: [
          'What is a database schema? - YouTube',
          'DBMS review',
          'SQL problems',
          'Database assessment'
        ]
      }
    ]
  };

  // Month 6 (December): Advanced Topics
  const month6Plan = {
    // Week 19-22: Review + Advanced Topics
    week19: [
      {
        subject: 'Review',
        tasks: ['Linear Algebra review', 'Key concepts consolidation', 'Formula sheet creation'],
        resources: [
          'All Linear Algebra resources from Month 1',
          'Reinforcement Learning by David Silver (YouTube)',
          'CS 285: Deep Reinforcement Learning (UC Berkeley)',
          'Linear algebra formula compilation'
        ]
      },
      {
        subject: 'Review',
        tasks: ['Calculus review', 'Optimization techniques', 'Applications in ML'],
        resources: [
          'All Calculus resources from Month 1',
          'Reinforcement Learning: An Introduction by Sutton and Barto',
          'Time Series Analysis courses on Coursera/edX',
          'Optimization review'
        ]
      },
      {
        subject: 'Review',
        tasks: ['Probability and Statistics review', 'Distribution properties', 'Hypothesis testing'],
        resources: [
          'All Probability/Statistics resources from Months 1-2',
          'Forecasting: Principles and Practice by Hyndman and Athanasopoulos',
          'NoSQL databases explained for beginners - YouTube',
          'Statistics formula sheet'
        ]
      },
      {
        subject: 'Review',
        tasks: ['Python programming review', 'Data structures in Python', 'Libraries recap'],
        resources: [
          'All Python resources from Month 2',
          'MongoDB University courses',
          'Kaggle datasets for practice',
          'Python cheat sheets'
        ]
      },
      {
        subject: 'Review',
        tasks: ['Data Structures review', 'Algorithm complexity', 'Implementation practice'],
        resources: [
          'All DS resources from Month 3',
          'UCI Machine Learning Repository',
          'Advanced topic exploration',
          'DS complexity analysis'
        ]
      },
      {
        subject: 'Review',
        tasks: ['Algorithms review', 'Graph algorithms', 'Dynamic programming'],
        resources: [
          'All Algorithm resources from Month 3',
          'Advanced algorithms practice',
          'Competitive programming',
          'Algorithm complexity review'
        ]
      },
      {
        subject: 'Review',
        tasks: ['Machine Learning review', 'Model comparison', 'Feature engineering'],
        resources: [
          'All ML resources from Month 4',
          'Advanced ML topics',
          'Deep learning introduction',
          'ML algorithm comparison'
        ]
      }
    ]
  };

  // Generate the complete schedule
  let currentDate = new Date(2025, 6, 1); // July 1, 2025
  let weekCounter = 1;
  let dayCounter = 1;

  // Helper function to add days to schedule
  const addDaysToSchedule = (weekPlan: any[], weekNum: number, subject: string) => {
    weekPlan.forEach((dayPlan, dayIndex) => {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isWeekday = currentDate.getDay() >= 1 && currentDate.getDay() <= 5;
      
      schedule[dateStr] = {
        week: weekNum,
        month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
        subject: dayPlan.subject || subject,
        tasks: dayPlan.tasks || [],
        resources: dayPlan.resources || [],
        plannedHours: isWeekday ? 2.5 : 4.0,
        weekday: isWeekday,
        notes: {
          conceptsLearned: "",
          difficultiesFaced: "",
          practiceProblems: "",
          resourceFeedback: "",
          tomorrowFocus: "",
          quickNotes: "",
          voiceNotes: [],
          images: [],
          tags: []
        },
        progress: {
          tasksCompleted: 0,
          totalTasks: dayPlan.tasks?.length || 0,
          actualHours: 0,
          completionPercentage: 0
        }
      };
      
      currentDate.setDate(currentDate.getDate() + 1);
      dayCounter++;
    });
    weekCounter++;
  };

  // Month 1: Mathematical Foundations
  addDaysToSchedule(month1Plan.week1, 1, 'Linear Algebra');
  addDaysToSchedule(month1Plan.week2, 2, 'Linear Algebra');
  addDaysToSchedule(month1Plan.week3, 3, 'Calculus');
  addDaysToSchedule(month1Plan.week4, 4, 'Probability');

  // Month 2: Stats + Python
  addDaysToSchedule(month2Plan.week5, 5, 'Statistics');
  addDaysToSchedule(month2Plan.week6, 6, 'Python');

  // Month 3: DS & Algorithms
  addDaysToSchedule(month3Plan.week7, 7, 'Data Structures');
  addDaysToSchedule(month3Plan.week8, 8, 'Data Structures');
  addDaysToSchedule(month3Plan.week9, 9, 'Algorithms');
  addDaysToSchedule(month3Plan.week10, 10, 'Algorithms');

  // Month 4: Machine Learning
  addDaysToSchedule(month4Plan.week11, 11, 'Machine Learning');
  addDaysToSchedule(month4Plan.week12, 12, 'Machine Learning');
  addDaysToSchedule(month4Plan.week13, 13, 'Machine Learning');
  addDaysToSchedule(month4Plan.week14, 14, 'Machine Learning');

  // Month 5: AI + DBMS
  addDaysToSchedule(month5Plan.week15, 15, 'AI');
  addDaysToSchedule(month5Plan.week16, 16, 'AI');
  addDaysToSchedule(month5Plan.week17, 17, 'DBMS');
  addDaysToSchedule(month5Plan.week18, 18, 'DBMS');

  // Month 6: Advanced Topics and Review
  addDaysToSchedule(month6Plan.week19, 19, 'Review');

  // Continue with remaining months (December-January) - Review and Mock Tests
  // Month 6-8: Review, Advanced Topics, and Mock Tests
  for (let week = 20; week <= 30; week++) {
    for (let day = 0; day < 7; day++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const isWeekday = currentDate.getDay() >= 1 && currentDate.getDay() <= 5;
      
      let subject = 'Review';
      let tasks: string[] = [];
      let resources: string[] = [];
      
      if (week <= 22) {
        // December: Subject Review
        const subjects = ['Linear Algebra', 'Calculus', 'Probability', 'Statistics', 'Python', 'Data Structures', 'Algorithms'];
        subject = subjects[day % subjects.length];
        tasks = [
          `${subject} concept review`,
          `Practice problems and PYQs`,
          `Formula consolidation`,
          `Weak area identification`
        ];
        resources = [
          'All previous month resources',
          'GATE PYQs',
          'Reinforcement Learning resources',
          'Time Series Analysis materials',
          'NoSQL database tutorials'
        ];
      } else if (week <= 26) {
        // Late December: Advanced Topics
        subject = 'Review';
        tasks = [
          'Advanced topic exploration',
          'Interdisciplinary connections',
          'Formula notebook compilation',
          'Error log summary'
        ];
        resources = [
          'Reinforcement Learning by David Silver (YouTube)',
          'CS 285: Deep Reinforcement Learning (UC Berkeley)',
          'Reinforcement Learning: An Introduction by Sutton and Barto',
          'Time Series Analysis courses on Coursera/edX',
          'Forecasting: Principles and Practice by Hyndman and Athanasopoulos',
          'NoSQL databases explained for beginners - YouTube',
          'MongoDB University courses',
          'Kaggle competitions'
        ];
      } else {
        // January: Mock Tests and Final Prep
        subject = 'Mock Tests';
        tasks = [
          'Full-length mock test',
          'Error analysis and review',
          'Concept reinforcement',
          'Strategy refinement'
        ];
        resources = [
          'All previous resources',
          'GATE PYQs',
          'Mock test platforms',
          'Formula sheets',
          'GATEOverflow',
          'Made Easy test series'
        ];
      }
      
      schedule[dateStr] = {
        week: week,
        month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
        subject: subject,
        tasks: tasks,
        resources: resources,
        plannedHours: isWeekday ? 2.5 : 4.0,
        weekday: isWeekday,
        notes: {
          conceptsLearned: "",
          difficultiesFaced: "",
          practiceProblems: "",
          resourceFeedback: "",
          tomorrowFocus: "",
          quickNotes: "",
          voiceNotes: [],
          images: [],
          tags: []
        },
        progress: {
          tasksCompleted: 0,
          totalTasks: tasks.length,
          actualHours: 0,
          completionPercentage: 0
        }
      };
      
      currentDate.setDate(currentDate.getDate() + 1);
      dayCounter++;
    }
    weekCounter++;
  }

  return schedule;
};

export const studySchedule = generateStudySchedule();