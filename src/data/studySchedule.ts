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
        tasks: ['Vector spaces and subspaces basics', 'Linear dependence concepts', 'MIT OCW Linear Algebra video 1-2'],
        resources: [
          'Coursera: Linear Algebra for Machine Learning and Data Science (DeepLearning.AI)',
          'Coursera: Linear Algebra: Matrix Algebra, Determinants, & Eigenvectors (Johns Hopkins University)',
          'https://www.youtube.com/watch?v=k7RM-ot2NWY - Vector Spaces and Subspaces (with examples)',
          'https://www.youtube.com/watch?v=uQhTuRlWMxw - Understanding Vector Spaces'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Vector spaces continued', 'Subspace verification practice', 'Complete 3Blue1Brown Chapter 1'],
        resources: [
          'MIT OCW Linear Algebra',
          '3Blue1Brown series',
          'Khan Academy',
          'https://www.youtube.com/watch?v=k7RM-ot2NWY - Vector Spaces and Subspaces (with examples)',
          'https://www.youtube.com/watch?v=uQhTuRlWMxw - Understanding Vector Spaces'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Matrix operations review', 'Inverse matrices', 'Special matrices (symmetric, orthogonal)'],
        resources: [
          'Khan Academy',
          "Lay's Linear Algebra",
          'MIT OCW',
          'https://www.youtube.com/watch?v=uQhTuRlWMxw - Inverse Matrices and Their Properties'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Matrix operations practice', 'Determinants and properties', 'Rank and nullity introduction'],
        resources: [
          'Khan Academy',
          "Lay's Linear Algebra",
          'MIT OCW',
          'https://www.youtube.com/watch?v=uQhTuRlWMxw - Inverse Matrices and Their Properties'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Quadratic forms', 'Rank and nullity deep dive', 'Matrix decomposition basics'],
        resources: [
          'MathInsight.org',
          "Paul's Notes",
          'MIT OCW',
          'https://www.youtube.com/watch?v=2IdtqGM6KWU - How to Find Rank and Nullity of a Matrix | Linear Algebra Exercises'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Quadratic forms practice', 'Positive definite matrices', 'Applications in optimization'],
        resources: [
          'MathInsight.org',
          "Paul's Notes",
          'MIT OCW',
          'https://www.youtube.com/watch?v=2IdtqGM6KWU - How to Find Rank and Nullity of a Matrix | Linear Algebra Exercises'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Week 1 practice set', 'GATE PYQs - Linear Algebra', 'Concept review and consolidation'],
        resources: [
          'GATE Overflow',
          'Linear Algebra NPTEL assignments',
          'Made Easy Workbooks',
          'https://www.youtube.com/watch?v=VqP2tREMvt0 - Linear Algebra GATE Questions'
        ]
      }
    ],
    week2: [
      {
        subject: 'Linear Algebra',
        tasks: ['LU decomposition theory', 'Eigenvalues introduction', 'Characteristic polynomials'],
        resources: [
          'Khan Academy',
          'MIT OCW',
          '3Blue1Brown',
          'https://www.youtube.com/watch?v=BFYSjHUyTEM - Linear Algebra - LU-Decomposition of a Matrix Explained'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Eigenvalues computation', 'Eigenvectors and eigenspaces', 'Diagonalization'],
        resources: [
          'Khan Academy',
          'MIT OCW',
          '3Blue1Brown',
          'https://www.youtube.com/watch?v=PFDu9oVAE-g - Finding Eigenvalues and Eigenvectors'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['LU decomposition practice', 'Applications of eigenvalues', 'Matrix powers using diagonalization'],
        resources: [
          'Khan Academy',
          'MIT OCW',
          '3Blue1Brown',
          'https://www.youtube.com/watch?v=BFYSjHUyTEM - Linear Algebra - LU-Decomposition of a Matrix Explained',
          'https://www.youtube.com/watch?v=PFDu9oVAE-g - Finding Eigenvalues and Eigenvectors'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['SVD introduction', 'Singular values and vectors', 'Low-rank approximations'],
        resources: [
          'Essence of LA - YouTube',
          'DeepLearning.ai Math',
          'MIT OCW',
          'https://www.youtube.com/watch?v=mBcLRGuAFUk - Singular Value Decomposition (SVD): Overview',
          'https://www.youtube.com/watch?v=P5mlg91as1c - Singular Value Decomposition in 3 minutes | SVD Part 01'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['SVD applications', 'Projections and least squares', 'Orthogonal projections'],
        resources: [
          'Essence of LA - YouTube',
          'DeepLearning.ai Math',
          'MIT OCW',
          'https://www.youtube.com/watch?v=mBcLRGuAFUk - Singular Value Decomposition (SVD): Overview',
          'https://www.youtube.com/watch?v=LyGKycYT2v0 - Linear Algebra: Projections'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Projections practice', 'Gram-Schmidt process', 'QR decomposition'],
        resources: [
          'Essence of LA - YouTube',
          'DeepLearning.ai Math',
          'MIT OCW',
          'https://www.youtube.com/watch?v=LyGKycYT2v0 - Linear Algebra: Projections'
        ]
      },
      {
        subject: 'Linear Algebra',
        tasks: ['Linear Algebra recap', 'MCQ practice', 'Week 2 assessment'],
        resources: [
          'GateOverflow',
          'Made Easy Workbooks',
          'NPTEL assignments',
          'https://www.youtube.com/watch?v=VqP2tREMvt0 - 1300 Linear Algebra MCQs Solution'
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
          'Khan Academy',
          'MIT OCW Calculus',
          'https://www.youtube.com/watch?v=riXcZT2ICjA - Limits and Continuity'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Partial derivatives', 'Chain rule multivariable', 'Implicit differentiation'],
        resources: [
          "Paul's Online Notes",
          'Khan Academy',
          'MIT OCW Calculus',
          'https://www.youtube.com/watch?v=riXcZT2ICjA - Limits and Continuity'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Taylor series multivariable', 'Error analysis', 'Approximation methods'],
        resources: [
          "Paul's Online Notes",
          'Khan Academy',
          'MIT OCW Calculus',
          'https://www.youtube.com/watch?v=3d6DsjIBzJ4 - Taylor series | Chapter 11, Essence of calculus'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Maxima and minima', 'Critical points', 'Second derivative test'],
        resources: [
          'Khan Academy',
          "Prof. Gilbert's lectures",
          "Paul's Notes",
          'https://www.youtube.com/watch?v=WUvTyaaNkzM - What Is Derivatives In Calculus In Layman Terms?',
          'https://www.youtube.com/watch?v=TkcVjuAKOyY - Introduction to Maxima and Minima for Calculus'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Constrained optimization', 'Lagrange multipliers', 'Applications in ML'],
        resources: [
          'Khan Academy',
          "Prof. Gilbert's lectures",
          "Paul's Notes",
          'https://www.youtube.com/watch?v=WUvTyaaNkzM - What Is Derivatives In Calculus In Layman Terms?',
          'https://www.youtube.com/watch?v=TkcVjuAKOyY - Introduction to Maxima and Minima for Calculus'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Gradient descent theory', 'Convexity concepts', 'Optimization algorithms'],
        resources: [
          "Andrew Ng's ML Math",
          'DeepL.ai Math series',
          'Convex Optimization Boyd',
          'https://www.youtube.com/watch?v=sDv4f4s2SB8 - Gradient Descent - Machine Learning Crash Course',
          'https://www.youtube.com/watch?v=AMsgGFiK_Do - Convex Optimization'
        ]
      },
      {
        subject: 'Calculus',
        tasks: ['Calculus week review', 'Optimization practice problems', 'Integration to probability prep'],
        resources: [
          'All week resources',
          'Practice problems',
          'GATE PYQs',
          'https://www.youtube.com/watch?v=sDv4f4s2SB8 - Gradient Descent - Machine Learning Crash Course',
          'https://www.youtube.com/watch?v=AMsgGFiK_Do - Convex Optimization'
        ]
      }
    ],
    // Week 4: Probability Basics (Days 22-28)
    week4: [
      {
        subject: 'Probability',
        tasks: ['Counting principles', 'Permutations and combinations', 'Sample spaces'],
        resources: [
          "Blitzstein's Harvard Stats",
          '3Blue1Brown - Bayes',
          'Khan Academy',
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
          'edX: Introduction to Probability (HarvardX)'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Probability axioms', 'Conditional probability', 'Independence'],
        resources: [
          "Blitzstein's Harvard Stats",
          '3Blue1Brown - Bayes',
          'Khan Academy',
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
          'edX: Introduction to Probability (HarvardX)'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Bayes theorem', 'Law of total probability', 'Applications and examples'],
        resources: [
          "Blitzstein's Harvard Stats",
          '3Blue1Brown - Bayes',
          'Khan Academy',
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
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
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
          'edX: Introduction to Probability (HarvardX)'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Mean, median, mode', 'Standard deviation', 'Moments of distributions'],
        resources: [
          'Khan Academy',
          'NPTEL - Prob & Stats',
          'Harvard Stat110',
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
          'edX: Introduction to Probability (HarvardX)'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Covariance and correlation', 'Joint distributions', 'Independence of RVs'],
        resources: [
          'Khan Academy',
          'NPTEL - Prob & Stats',
          'Harvard Stat110',
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
          'edX: Introduction to Probability (HarvardX)'
        ]
      },
      {
        subject: 'Probability',
        tasks: ['Probability quiz', 'GATE PYQs practice', 'Month 1 review preparation'],
        resources: [
          'PYQs',
          'GATEOverflow',
          'ISLR Exercises',
          'edX: Probability - The Science of Uncertainty and Data (MITx)',
          'edX: Introduction to Probability (HarvardX)'
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
          'ISLR book',
          'Khan Academy',
          'StatQuest',
          'Coursera: Introduction to Statistics (Stanford University)',
          'Coursera: Basic Statistics (University of Amsterdam)',
          'Coursera: The Power of Statistics (Google)',
          'https://www.youtube.com/watch?v=bT1p5tJwn_0 - Bernoulli Distribution Probability Modeling Explained',
          'https://www.youtube.com/watch?v=8idr1WZ1A7Q - Binomial Distribution EXPLAINED in UNDER 15 MINUTES!'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Normal distribution', 'Standard normal', 'Z-scores and applications'],
        resources: [
          'ISLR book',
          'Khan Academy',
          'StatQuest',
          'Coursera: Introduction to Statistics (Stanford University)',
          'https://www.youtube.com/watch?v=rzFX5NWojp0 - Understanding the normal distribution - statistics help'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Distribution relationships', 'Central Limit Theorem', 'Sampling distributions'],
        resources: [
          'ISLR book',
          'Khan Academy',
          'StatQuest',
          'https://www.youtube.com/watch?v=rzFX5NWojp0 - Understanding the normal distribution - statistics help'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Poisson distribution', 'Exponential distribution', 'Applications in real world'],
        resources: [
          'Harvard Stat110',
          'StatQuest',
          'Khan Academy',
          'https://www.youtube.com/watch?v=cxKdJT8fe0w - Introduction to Poisson Distribution - Probability & Statistics',
          'https://www.youtube.com/watch?v=y2QF_f-Ta58 - The Exponential Distribution'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['t-distribution', 'Chi-square distribution', 'F-distribution'],
        resources: [
          'Harvard Stat110',
          'StatQuest',
          'Khan Academy',
          'https://www.youtube.com/watch?v=Uv6BcZNFxQI - Student\'s T Distribution',
          'https://www.youtube.com/watch?v=hcDb12fsbBU - The Square of the Normal Distribution'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Hypothesis testing', 'Type I and II errors', 'p-values and significance'],
        resources: [
          'Harvard Stat110',
          'StatQuest',
          'Khan Academy',
          'https://www.youtube.com/watch?v=0oc49DyA3hU - The Central Limit Theorem, Clearly Explained!!!',
          'https://www.youtube.com/watch?v=0oc49DyA3hU - Hypothesis Testing Explained in 60 Seconds'
        ]
      },
      {
        subject: 'Statistics',
        tasks: ['Statistics GATE PYQs', 'Week 5 assessment', 'Prepare for Python'],
        resources: [
          'GATE PYQs',
          'GATEOverflow',
          'ISLR Exercises',
          'https://www.youtube.com/watch?v=VjLEoo3hIoM - GATE DA 25: Practice and PYQs: Probability and Statistics Part 2'
        ]
      }
    ],
    // Week 6: Python Programming I (Days 36-42)
    week6: [
      {
        subject: 'Python',
        tasks: ['Python syntax basics', 'Variables and data types', 'Control structures'],
        resources: [
          'Python.org Docs',
          'RealPython',
          'Python Tutor',
          'GeeksforGeeks: 10 Best Python Data Science Courses Online [2025]',
          'Coursera: Applied Data Science with Python (University of Michigan)',
          'DataCamp: Data Scientist with Python',
          'https://www.youtube.com/watch?v=LHBE6Q9XlzI - Python Tutorial: Learn Python For Data Science'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Functions and scope', 'Recursion basics', 'Lambda functions'],
        resources: [
          'Python.org Docs',
          'RealPython',
          'Python Tutor',
          'https://www.youtube.com/watch?v=LHBE6Q9XlzI - Python Tutorial: Learn Python For Data Science',
          'https://www.youtube.com/watch?v=Qk0zUZW-U_M - Recursion for Python Beginners with Recursive Function Examples'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Recursion advanced', 'Dynamic programming intro', 'Memoization'],
        resources: [
          'Python.org Docs',
          'RealPython',
          'GeeksforGeeks',
          'https://www.youtube.com/watch?v=Qk0zUZW-U_M - Recursion for Python Beginners with Recursive Function Examples',
          'https://www.youtube.com/watch?v=ngCos392W4w - #40 Python Tutorial for Beginners | Recursion'
        ]
      },
      {
        subject: 'Python',
        tasks: ['NumPy basics', 'Arrays and operations', 'Broadcasting'],
        resources: [
          'Datacamp',
          'Jupyter Notebooks',
          'NumPy docs',
          'https://www.youtube.com/watch?v=QUT1VHiLmmI - Python NumPy Tutorial'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Pandas introduction', 'DataFrames and Series', 'Data manipulation'],
        resources: [
          'Datacamp',
          'Kaggle Notebooks',
          'Pandas docs',
          'https://www.youtube.com/watch?v=vmEHCJofslg - Pandas Tutorial (Data Analysis In Python)'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Object-oriented programming', 'Classes and objects', 'Inheritance'],
        resources: [
          'Datacamp',
          'RealPython',
          'Python OOP tutorials',
          'https://www.youtube.com/watch?v=Ej_02ICOIgs - Python Object Oriented Programming (OOP) - For Beginners'
        ]
      },
      {
        subject: 'Python',
        tasks: ['Build CLI Calculator', 'CSV Data Cleaner project', 'Code review and optimization'],
        resources: [
          'Project-based learning',
          'GitHub',
          'Code review practices',
          'https://www.youtube.com/watch?v=u4X7ijqZKLA - Creating a Command Line Utility In Python | Python for AI #77',
          'https://www.youtube.com/watch?v=bDhvCp3_lYw - Building a Basic Command Line Calculator in Python',
          'https://www.youtube.com/watch?v=4UKsLeAI2gs - Data Cleaning with Python Pandas: Hands-On Tutorial with Real World Data'
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
          'GFG',
          'Python Tutor Visualizer',
          'LeetCode',
          'https://www.youtube.com/watch?v=QJNwK2uJyGs - Deep Dive into the Array Data Structure'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Stacks implementation', 'Stack applications', 'Expression evaluation'],
        resources: [
          'GFG',
          'Python Tutor Visualizer',
          'HackerRank'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Queues and deques', 'Circular queues', 'Priority queues intro'],
        resources: [
          'GFG',
          'Python Tutor Visualizer',
          'HackerRank',
          'https://www.youtube.com/watch?v=D6gu-_tmEpQ - Queue Data Structure Tutorial - What is a Queue?'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Linked lists basics', 'Singly and doubly linked', 'List operations'],
        resources: [
          'GFG',
          'Python Tutor Visualizer',
          'LeetCode'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Linked list problems', 'Cycle detection', 'Merging lists'],
        resources: [
          'GFG',
          'LeetCode',
          'HackerRank'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Trees introduction', 'Binary trees', 'Tree terminology'],
        resources: [
          'GFG',
          'Visualgo',
          'MIT OCW Algorithms',
          'https://www.youtube.com/watch?v=oSWTXtMglKE - Binary Search Tree Explained | Data Structures for Beginners'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Tree traversals', 'Pre/In/Post order', 'BFS and DFS on trees'],
        resources: [
          'GFG',
          'Visualgo',
          'Tree practice problems',
          'https://www.youtube.com/watch?v=9RHO6jU--GU - Binary tree traversal - breadth-first and depth-first strategies',
          'https://www.youtube.com/watch?v=7fujbpJ0LB4 - Depth-First Search Algorithm: Graph or Tree traversal and search'
        ]
      }
    ],
    // Week 8: Data Structures II (Days 50-56)
    week8: [
      {
        subject: 'Data Structures',
        tasks: ['Binary search trees', 'BST operations', 'AVL trees intro'],
        resources: [
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
          'https://www.youtube.com/watch?v=Aagf3RyK3Lw - Binary Search Trees | C++ | Java | Data Structures and Algorithms | Placements'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Hash tables theory', 'Hash functions', 'Collision resolution'],
        resources: [
          'GFG',
          'MIT OCW Algorithms',
          'Hash table visualizations',
          'https://www.youtube.com/watch?v=shs0KM3wKv8 - Data Structures: Hash Tables'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Heaps and priority queues', 'Min/max heaps', 'Heap operations'],
        resources: [
          'GFG',
          'Visualgo',
          'Heap implementations',
          'https://www.youtube.com/watch?v=t0Cq6tVNRBA - The Heap Data Structure: A Comprehensive Tutorial'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Hashing applications', 'Hash maps in practice', 'Performance analysis'],
        resources: [
          'GFG',
          'LeetCode hashing',
          'Practice sets',
          'https://www.youtube.com/watch?v=KyUTuwXAOxU - Understanding and implementing a Hash Table (in C)'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Hashing practice problems', 'Two sum variants', 'Frequency counting'],
        resources: [
          'LeetCode',
          'HackerRank',
          'Practice sets'
        ]
      },
      {
        subject: 'Data Structures',
        tasks: ['Data structures quiz', 'Week 8 revision', 'Algorithm prep'],
        resources: [
          'All week resources',
          'Quiz platforms',
          'Revision notes',
          'https://www.youtube.com/watch?v=RBSGKlAvoiM - Top 20+ Data structure Questions & Answer | Tpoint Tech'
        ]
      }
    ],
    // Week 9: Algorithms I (Days 57-63)
    week9: [
      {
        subject: 'Algorithms',
        tasks: ['Sorting algorithms intro', 'Bubble sort', 'Selection sort'],
        resources: [
          'GFG',
          'Visualgo',
          'Sorting visualizations',
          'https://www.youtube.com/watch?v=xli_FI7CuzA - Bubble Sort Algorithm Explained (Full Code Included) - Python Algorithms Series for Beginners'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Insertion sort', 'Sorting analysis', 'Stability in sorting'],
        resources: [
          'GFG',
          'MIT OCW Algorithms',
          'Algorithm analysis',
          'https://www.youtube.com/watch?v=JU767SDMDvA - Insertion sort in 2 minutes'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Merge sort algorithm', 'Divide and conquer', 'Merge sort analysis'],
        resources: [
          'GFG',
          'MIT OCW',
          'Merge sort implementations',
          'https://www.youtube.com/watch?v=4VqmGXwpLqc - Understanding Mergesort: Sorting Made Simple | Recursion Series'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Quick sort algorithm', 'Partitioning', 'Quick sort analysis'],
        resources: [
          'GFG',
          'MIT OCW',
          'Quick sort visualizations',
          'https://www.youtube.com/watch?v=7h1s2SojIRw - 2.8.1 QuickSort Algorithm'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Sorting patterns practice', 'LeetCode sorting', 'Comparison of algorithms'],
        resources: [
          'LeetCode',
          'Sorting problem sets',
          'Performance comparisons',
          'https://www.youtube.com/watch?v=xo7XrRVxH8Y - LeetCode Patterns'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Linear search', 'Binary search', 'Search variations'],
        resources: [
          'GFG',
          'Binary search patterns',
          'Search implementations',
          'https://www.youtube.com/watch?v=MFhxShGxHWc - Learn Linear Search in 3 minutes ⬇️',
          'https://www.youtube.com/watch?v=fDKIpRe8GW4 - Binary Search Algorithm in 100 Seconds'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Ternary search', 'Search problems', 'Advanced searching'],
        resources: [
          'GFG',
          'LeetCode binary search',
          'Search problem practice'
        ]
      }
    ],
    // Week 10: Algorithms II + Graph Theory (Days 64-70)
    week10: [
      {
        subject: 'Algorithms',
        tasks: ['Recursion patterns', 'Recursive thinking', 'Base cases'],
        resources: [
          'GFG',
          'Recursion visualizations',
          'Recursive problem solving',
          'https://www.youtube.com/watch?v=KEEKn7Me-ms - Algorithms: Recursion'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Divide and conquer', 'Master theorem', 'D&C applications'],
        resources: [
          'MIT OCW Algorithms',
          'D&C examples',
          'Complexity analysis',
          'https://www.youtube.com/watch?v=2YLsrmjwzqw - Divide and Conquer: The Art of Breaking Down Problems | Recursion Series'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Advanced recursion', 'Backtracking intro', 'Recursive optimization'],
        resources: [
          'GFG',
          'Backtracking problems',
          'Advanced recursion'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Graph representation', 'Adjacency matrix/list', 'Graph basics'],
        resources: [
          'GFG',
          'Graph theory basics',
          'Graph implementations',
          'https://www.youtube.com/watch?v=gXgEDyodOJU - Graph in Data Structure | BFS & DFS Algorithms | Learn Coding'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['BFS on graphs', 'DFS on graphs', 'Graph traversal applications'],
        resources: [
          'GFG',
          'Graph traversal',
          'Visualgo graphs',
          'https://www.youtube.com/watch?v=9RHO6jU--GU - Binary tree traversal - breadth-first and depth-first strategies',
          'https://www.youtube.com/watch?v=7fujbpJ0LB4 - Depth-First Search Algorithm: Graph or Tree traversal and search'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Shortest path algorithms', 'Dijkstra algorithm', 'Path finding'],
        resources: [
          'GFG',
          'Dijkstra implementations',
          'Shortest path problems',
          'https://www.youtube.com/watch?v=GazC3A4OQTE - How Dijkstra\'s Algorithm Works'
        ]
      },
      {
        subject: 'Algorithms',
        tasks: ['Graph applications', 'Connected components', 'Graph problems practice'],
        resources: [
          'LeetCode graphs',
          'Graph problem sets',
          'Applications'
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
          'Andrew Ng Coursera',
          'ISLR Book',
          'ML basics',
          'Kaggle: https://www.kaggle.com/',
          'Coursera: Machine Learning by Andrew Ng',
          'fast.ai: Free practical deep learning courses'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Simple linear regression', 'Least squares', 'Cost functions'],
        resources: [
          'ISLR',
          'Coursera ML Week 1',
          'Linear regression theory',
          'https://www.youtube.com/watch?v=nk2CQITm_eo - Linear Regression, Clearly Explained!!!'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Multiple linear regression', 'Feature scaling', 'Normal equation'],
        resources: [
          'ISLR',
          'Coursera ML Week 2',
          'MLR implementations',
          'https://www.youtube.com/watch?v=zITIFTsivN8 - Multiple Regression for beginners'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Ridge regression', 'Regularization', 'Bias-variance tradeoff'],
        resources: [
          'ISLR',
          'Coursera ML Week 3',
          'Regularization techniques',
          'https://www.youtube.com/watch?v=Q81RR3yKn30 - Regularization Part 1: Ridge (L2) Regression'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Lasso regression', 'Elastic net', 'Feature selection'],
        resources: [
          'ISLR',
          'Scikit-learn docs',
          'Regularization comparison'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Logistic regression', 'Sigmoid function', 'Classification basics'],
        resources: [
          'StatQuest',
          'Sklearn',
          'Logistic regression theory',
          'https://www.youtube.com/watch?v=yIYKR4sgzI8 - StatQuest: Logistic Regression'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['k-NN algorithm', 'Distance metrics', 'Curse of dimensionality'],
        resources: [
          'ISLR',
          'k-NN implementations',
          'Distance learning',
          'https://www.youtube.com/watch?v=HVXime0nQeI - K Nearest Neighbors (KNN) in 10 Minutes (Beginner Friendly)',
          'https://www.youtube.com/watch?v=4HKqjENq9OU - Simple Explanation of the K-Nearest Neighbors (KNN) Algorithm'
        ]
      }
    ],
    week12: [
      {
        subject: 'Machine Learning',
        tasks: ['Naive Bayes', 'Bayes classifier', 'Text classification'],
        resources: [
          'StatQuest',
          'Sklearn',
          'NB applications',
          'https://www.youtube.com/watch?v=O2L2Uv9pdDA - Naive Bayes, Clearly Explained!!!'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Linear Discriminant Analysis', 'QDA', 'Dimensionality reduction'],
        resources: [
          'ISLR',
          'LDA theory',
          'Discriminant analysis'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Support Vector Machines', 'Kernel trick', 'SVM theory'],
        resources: [
          'Hands-on ML',
          'SVM visualizations',
          'Kernel methods',
          'https://www.youtube.com/watch?v=efR1C6CvhmE - Support Vector Machines Part 1 (of 3): Main Ideas!!!',
          'https://www.youtube.com/watch?v=_PwhiWxHK8o - Support Vector Machine (SVM) in 2 minutes'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Decision trees', 'Information gain', 'Tree pruning'],
        resources: [
          'ISLR',
          'Decision tree algorithms',
          'Tree implementations',
          'https://www.youtube.com/watch?v=7VeUPuFGJHk - Decision Trees in Machine Learning | Introduction'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Cross-validation', 'k-fold CV', 'Model selection'],
        resources: [
          'ISLR',
          'CV techniques',
          'Model evaluation',
          'https://www.youtube.com/watch?v=fSytzGwwBVw - Machine Learning Fundamentals: Cross Validation'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Neural networks intro', 'Perceptron', 'Multi-layer perceptrons'],
        resources: [
          'DeepLearning.ai',
          "Karpathy's NN videos",
          'NN basics',
          'https://www.youtube.com/watch?v=aircAruvnKk - What is Multilayer Perceptron (MLP) in Machine Learning?'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Feedforward networks', 'Backpropagation', 'NN training'],
        resources: [
          'DeepLearning.ai',
          "Karpathy's NN videos",
          'NN implementations',
          'https://www.youtube.com/watch?v=CqOfi41LfDw - Feedforward Neural Networks Explained | Learn FNNs in Simple Terms',
          'https://www.youtube.com/watch?v=EuBBz3bI-aA - Bias-Variance Trade-off - Explained'
        ]
      }
    ],
    // Week 13-14: Unsupervised + Project (Days 85-98)
    week13: [
      {
        subject: 'Machine Learning',
        tasks: ['Clustering introduction', 'k-means algorithm', 'Cluster evaluation'],
        resources: [
          'Josh Starmer StatQuest',
          'Sklearn docs',
          'Clustering theory',
          'https://www.youtube.com/watch?v=4b5d3muPQmA - K-Means Algorithm Simple Explanation'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Hierarchical clustering', 'Dendrograms', 'Linkage methods'],
        resources: [
          'StatQuest',
          'Sklearn clustering',
          'Hierarchical methods',
          'https://www.youtube.com/watch?v=7xHsRkOdVwo - What is Hierarchical Clustering in Machine Learning?'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['DBSCAN clustering', 'Density-based clustering', 'Cluster comparison'],
        resources: [
          'Sklearn docs',
          'DBSCAN theory',
          'Clustering algorithms'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Principal Component Analysis', 'Dimensionality reduction', 'PCA theory'],
        resources: [
          'StatQuest',
          'PCA implementations',
          'Dimensionality reduction',
          'https://www.youtube.com/watch?v=FgakZw6K1QQ - Principal Component Analysis (PCA)'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['PCA applications', 'Feature extraction', 'Variance explained'],
        resources: [
          'Sklearn PCA',
          'PCA practice',
          'Feature engineering'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['t-SNE', 'Manifold learning', 'Visualization techniques'],
        resources: [
          't-SNE theory',
          'Manifold learning',
          'Data visualization'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['ML project planning', 'Dataset selection', 'Problem formulation'],
        resources: [
          'Kaggle datasets',
          'Project guidelines',
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
          'Data preparation'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model selection', 'Algorithm comparison', 'Baseline models'],
        resources: [
          'Sklearn',
          'Model comparison',
          'ML pipeline'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model training', 'Hyperparameter tuning', 'Grid search'],
        resources: [
          'Sklearn',
          'Hyperparameter optimization',
          'Model tuning'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model evaluation', 'Metrics selection', 'Performance analysis'],
        resources: [
          'Sklearn metrics',
          'Model evaluation',
          'Performance measures'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Model interpretation', 'Feature importance', 'Results analysis'],
        resources: [
          'Model interpretation',
          'Feature analysis',
          'Results presentation'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Project documentation', 'Code organization', 'Presentation prep'],
        resources: [
          'Documentation best practices',
          'Code structure',
          'Project presentation'
        ]
      },
      {
        subject: 'Machine Learning',
        tasks: ['Project completion', 'Final review', 'ML month assessment'],
        resources: [
          'Project finalization',
          'Code review',
          'Month 4 review',
          'https://www.youtube.com/watch?v=fiz1ORTBGpY - Machine Learning End to End Project | Full Course | iNeuron',
          'https://www.youtube.com/watch?v=MpF9HENQjDo - End-to-End Machine Learning Project – AI, MLOps'
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
          'https://www.youtube.com/watch?v=J1Ue31prBk8 - AI Search Algorithms'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Search algorithms', 'Uninformed search', 'BFS and DFS'],
        resources: [
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
          'Heuristic search'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Local search', 'Hill climbing', 'Simulated annealing'],
        resources: [
          'AIMA Book',
          'Local search algorithms',
          'Optimization methods'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Constraint satisfaction', 'CSP algorithms', 'Backtracking search'],
        resources: [
          'AIMA Book',
          'CSP theory',
          'Constraint programming'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Logic and reasoning', 'Propositional logic', 'Logical inference'],
        resources: [
          'AIMA Book',
          'Logic in AI',
          'Reasoning systems',
          'https://www.youtube.com/watch?v=E5FEqGYLL0o - PROPOSITIONAL LOGIC | Artificial Intelligence | GATE | PL with example | Hindi tutorial'
        ]
      },
      {
        subject: 'AI',
        tasks: ['First-order logic', 'Predicate logic', 'Knowledge representation'],
        resources: [
          'AIMA Book',
          'FOL theory',
          'Knowledge systems',
          'https://www.youtube.com/watch?v=gyoqX0W-NH4 - Predicate logic in AI | First order logic in Artificial Intelligence | fol examples'
        ]
      }
    ],
    week16: [
      {
        subject: 'AI',
        tasks: ['Adversarial search', 'Game theory', 'Minimax algorithm'],
        resources: [
          'AIMA Book',
          'Game AI',
          'Adversarial algorithms',
          'https://www.youtube.com/watch?v=l-hh51ncgDI - Introduction to Adversarial Search || Artificial Intelligence'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Alpha-beta pruning', 'Game optimization', 'Evaluation functions'],
        resources: [
          'AIMA Book',
          'Game optimization',
          'Pruning techniques'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Probabilistic reasoning', 'Bayesian networks', 'Uncertainty'],
        resources: [
          'CS221 Stanford',
          'Bayesian AI',
          'Probabilistic models',
          'https://www.youtube.com/watch?v=HZGCoVF3YvM - Understanding AI: Probabilistic Models Explained Simply'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Markov models', 'Hidden Markov Models', 'Sequential data'],
        resources: [
          'AIMA Book',
          'Markov models',
          'Sequential AI'
        ]
      },
      {
        subject: 'AI',
        tasks: ['Sampling methods', 'Monte Carlo', 'MCMC algorithms'],
        resources: [
          'Sampling theory',
          'Monte Carlo methods',
          'MCMC',
          'https://www.youtube.com/watch?v=qQFF4tPgeWI - Sampling Techniques Explained With Detailed Examples | Intellipaat'
        ]
      },
      {
        subject: 'AI',
        tasks: ['AI problem solving', 'Case studies', 'AI applications'],
        resources: [
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
          'Week assessment'
        ]
      }
    ],
    // Week 17-18: DBMS + Warehousing (Days 113-126)
    week17: [
      {
        subject: 'DBMS',
        tasks: ['Database concepts', 'DBMS architecture', 'Data models'],
        resources: [
          'DBMS by Navathe',
          'Database fundamentals',
          'DBMS theory',
          'PlacementPreparation.io: 10 Best Websites to Learn DBMS in 2025 [Free + Paid]'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Entity-Relationship model', 'ER diagrams', 'Relationship types'],
        resources: [
          'GFG DBMS',
          'ER modeling',
          'Database design',
          'https://www.youtube.com/watch?v=QpdhBUYk7Kk - Entity Relationship Diagram Tutorial'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['ER to relational mapping', 'Schema conversion', 'Table design'],
        resources: [
          'Database design',
          'Schema mapping',
          'Relational model'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Relational algebra', 'Selection and projection', 'Join operations'],
        resources: [
          'Relational algebra',
          'Database operations',
          'Query theory',
          'https://www.youtube.com/watch?v=2rrqLcrVIxE - Relational Algebra in DBMS with Examples-Relational Algebra in DBMS-Relational Algebra Operations'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['SQL basics', 'DDL and DML', 'Basic queries'],
        resources: [
          'SQLZoo',
          'SQL tutorials',
          'Database queries',
          'https://www.youtube.com/watch?v=HXV3zeQKqGY - SQL Tutorial for Beginners | Future of Data & AI | Data Science Dojo'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Advanced SQL', 'Joins and subqueries', 'Aggregate functions'],
        resources: [
          'LeetCode SQL',
          'Advanced SQL',
          'Query optimization'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['SQL practice', 'Complex queries', 'Database problems'],
        resources: [
          'LeetCode SQL',
          'SQL practice',
          'Query problems'
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
          'FD theory'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['BCNF and 4NF', 'Decomposition', 'Lossless joins'],
        resources: [
          'Advanced normalization',
          'Database decomposition',
          'Normal forms'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Transaction management', 'ACID properties', 'Concurrency control'],
        resources: [
          'Transaction theory',
          'DBMS transactions',
          'Concurrency'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Indexing and hashing', 'B-trees', 'Database performance'],
        resources: [
          'Database indexing',
          'B-tree structures',
          'Performance tuning'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['Data warehousing', 'OLAP vs OLTP', 'Dimensional modeling'],
        resources: [
          'IBM DW Tutorial',
          'Data warehousing',
          'OLAP concepts',
          'https://www.youtube.com/watch?v=HKcEyHF1U00 - Data Warehouse - The Ultimate Guide [2025] | Master Data Modeling'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['ETL processes', 'Data integration', 'Warehouse design'],
        resources: [
          'ETL theory',
          'Data integration',
          'Warehouse architecture',
          'https://www.youtube.com/watch?v=M_dhw4QQd94 - What is Data Mapping and Transformation? (Data Transformation)'
        ]
      },
      {
        subject: 'DBMS',
        tasks: ['DBMS review', 'SQL practice', 'Month 5 assessment'],
        resources: [
          'DBMS review',
          'SQL problems',
          'Database assessment',
          'https://www.youtube.com/watch?v=ztHopE5Wnpc - What is a database schema?'
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

  // Continue with remaining months (December-January) - Review and Mock Tests
  // Month 6-8: Review, Advanced Topics, and Mock Tests
  for (let week = 19; week <= 30; week++) {
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
          'GATEOverflow',
          'Formula sheets',
          'Revision notes'
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
          'Time Series Analysis courses (Coursera/edX)',
          'NoSQL databases (MongoDB University)',
          'Advanced ML topics',
          'Research papers'
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
          'GATE mock test platforms',
          'Previous year papers',
          'Time management strategies',
          'Final revision materials',
          'Stress management techniques'
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