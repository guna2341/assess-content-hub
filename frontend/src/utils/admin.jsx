
export const contentUnits = [
    {
        id: '1',
        code: 'MATH-101',
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts and operations',
        content: `<h2>Chapter 1: Basic Concepts</h2>
      <p>Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols.</p>
      <h3>1.1 Variables and Constants</h3>
      <ul>
        <li><strong>Variable:</strong> A symbol (usually a letter) that represents a number that may change.</li>
        <li><strong>Constant:</strong> A fixed value that does not change.</li>
      </ul>
      <h3>1.2 Expressions and Equations</h3>
      <ul>
        <li><strong>Expression:</strong> A combination of variables, numbers and operations.</li>
        <li><strong>Equation:</strong> A statement that two expressions are equal.</li>
      </ul>`,
        questionType: "content",
        language: 'en',
        explanation: 'This unit introduces algebraic concepts like variables, constants, expressions, and equations.',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        totalReviews: 3,
        minimumReviews: 3,
        questions:
        [
        {
            id: 'q1',
            question: 'What is a variable in algebra?',
            type: 'Short Answer',
                topic: 'variables',
                status: 'published',
            difficulty: 'Easy',
            correctAnswer: 'A symbol that represents a number that can change.',
                explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
                createdBy: 'Dr. Smith',
                },
                {
                    id: 'q1',
                    question: 'What is a variable in algebra?',
                    type: 'Short Answer',
                    topic: 'variables',
                    status: 'published',
                    difficulty: 'Easy',
                    correctAnswer: 'A symbol that represents a number that can change.',
                    explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
                    createdBy: 'Dr. Smith',
                }
        ]
    },
    {
        id: '2',
        code: 'MATH-201',
        title: 'அலகு: சமமான கோணங்கள்',
        description: 'இந்த அலகில் கோணங்களின் அடிப்படைப் புரிதலைக் கற்றுக்கொள்கிறோம்.',
        content: `
      <h2>அத்தியாயம் 1: கோணங்கள்</h2>
      <p>கோணம் என்பது இரண்டு ரேகைகள் சந்திக்கும் இடத்தில் உருவாகும்.</p>
      <h3>1.1 கோண வகைகள்</h3>
      <ul>
        <li>குறுகிய கோணம்</li>
        <li>நீளமான கோணம்</li>
      </ul>
    `,
        language: 'ta',
        explanation: 'This unit teaches the basics of angles and their types in Tamil.',
        questionsCount: 8,
        studentsEnrolled: 38,
        createdAt: '2024-02-01',
        updatedAt: '2024-02-04',
        createdBy: 'Dr. Kumar',
        questionType: "content",
        totalRevies: 3,
        minimumReviews: 3,
        questions:[
        {
            id: 'q3',
            question: 'கோணம் என்றால் என்ன?',
            type: 'Long Answer',
                topic: 'angles',
                status: 'published',
            difficulty: 'Easy',
            correctAnswer: 'இரண்டு ரேகைகள் சந்திக்கும் இடத்தில் உருவாகும் வடிவம்.',
            explanation: 'An angle is formed at the intersection of two lines.',
            createdBy: 'Dr. Kumar',
            createdAt: '2024-02-01'
            }
        ]
    },
    {
        id: '3',
        code: 'MATH-301',
        title: 'त्रिकोणमिति का परिचय',
        description: 'त्रिकोणों और उनके अनुपातों की मूल बातें।',
        content: `
      <h2>अध्याय 1: त्रिकोणमिति</h2>
      <p>त्रिकोणमिति गणित की वह शाखा है जिसमें कोणों और त्रिकोणों का अध्ययन किया जाता है।</p>
      <h3>1.1 प्रमुख अनुपात</h3>
      <ul>
        <li>साइन (sin)</li>
        <li>कोसाइन (cos)</li>
        <li>टैन्जेंट (tan)</li>
      </ul>
    `,
        language: 'hi',
        explanation: 'This unit introduces trigonometry and its basic ratios in Hindi.',
        questionsCount: 10,
        studentsEnrolled: 41,
        createdAt: '2024-03-01',
        updatedAt: '2024-03-04',
        createdBy: 'Dr. Mehta',
        questionType: "content",
        totalRevies: 2,
        minimumReviews: 3,
        questions:[
        {
            id: 'q4',
            question: 'त्रिकोणमिति में साइन क्या दर्शाता है?',
            type: 'Short Answer',
                topic: 'trigonometry',
                status: 'published',
            difficulty: 'Medium',
            correctAnswer: 'विपरीत भुजा और कर्ण का अनुपात',
            explanation: 'In trigonometry, sine is the ratio of the opposite side to the hypotenuse.',
            createdBy: 'Dr. Mehta',
            createdAt: '2024-03-01'
            }
        ]
    },
    {
        id: '4',
        code: 'MATH-101',
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts and operations',
        content: "<p>Demo Image</p>",
        imageLink: "https://tse2.mm.bing.net/th/id/OIP.7cRYFyLoDEDh4sRtM73vvwHaDg?pid=Api&P=0&h=180",
        language: 'en',
        explanation: 'This unit introduces algebraic concepts like variables, constants, expressions, and equations.',
        questionsCount: 12,
        studentsEnrolled: 45,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        createdBy: 'Dr. Smith',
        questionType: "content",
        totalReviews: 3,
        minimumReviews: 3,
        questions:[
        {
            id: 'q1',
            question: 'What is a variable in algebra?',
            type: 'Multiple Choice',
            options: [
              "2","3","4","5"

            ],
            topic: 'variables',
            difficulty: 'Easy',
            correctAnswer: 'a',
            explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
            createdBy: 'Dr. Smith',
                createdAt: '2024-01-15'
            
            },
        ]
    },
    {
        id: '5',
        code: 'MATH-401',
        title: 'Introduction to Algebra',
        description: 'Basic algebraic concepts and operations',
        content: "<p>Demo Image</p>",
        imageLink: "https://tse2.mm.bing.net/th/id/OIP.7cRYFyLoDEDh4sRtM73vvwHaDg?pid=Api&P=0&h=180",
        language: 'en',
        explanation: 'This unit introduces algebraic concepts like variables, constants, expressions, and equations.',
        status: 'needs edit',
        questionsCount: 12,
        studentsEnrolled: 45,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20',
        createdBy: 'Dr. Smith',
        questionType: "content",
        totalReviews: 3,
        minimumReviews: 3,
        questions:[
        {
            id: 'q1',
            question: 'What is a variable in algebra?',

                status: 'published',
                type: 'Multiple Choice',
            options: [
                {
                    id: "a0018813-3476-4440-a27c-a4d5ed8b2933",
                    isCorrect: true,
                    text: "option a"
                },
                {
                    id: "a0018813-3476-4440-a27c-a4d5ed8b2934",
                    isCorrect: false,
                    text: "option b"
                },
                {
                    id: "a0018813-3476-4440-a27c-a4d5ed8b2935",
                    isCorrect: false,
                    text: "option c"
                },
                {
                    id: "a0018813-3476-4440-a27c-a4d5ed8b2936",
                    isCorrect: false,
                    text: "option d"
                },

            ],
            topic: 'variables',
            difficulty: 'Easy',
            correctAnswer: 'a',
            explanation: 'A variable is a placeholder for a value that can change, commonly represented by letters.',
            createdBy: 'Dr. Smith',
            createdAt: '2024-01-15'
            },
        ]
    }
];

    export const questionBank = [
        {
            id: 'math',
            name: 'Mathematics',
            children: [
                {
                    id: 'algebra',
                    name: 'Algebra',
                    questions: [
                        {
                            id:'1',
                            question: 'algebra',
                            difficulty: 'Easy',
                            options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
                            correctAnswer: 'A',
                            explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
                            status: 'approved',
                            createdBy: 'Dr. Smith',
                            createdAt: '2024-01-15',
                            comments: [
                                {
                                    id: '1',
                                    user: 'Reviewer A',
                                    text: 'Clear and well-structured question.',
                                    type: 'approved',
                                    createdAt: '2024-01-16',
                                },
                            ],
                        }
                    ],
                    children: [
                        {
                            id: 'basic-algebra',
                            name: 'Basic Operations',
                            questionCount: 25,
                            questions: [
                                {
                                    id: '2',
                                    question: 'Solve for x: 2x + 5 = 13',
                                    difficulty: 'Easy',
                                    options: ['x = 4', 'x = 6', 'x = 8', 'x = 9'],
                                    correctAnswer: 'A',
                                    explanation: 'Subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
                                    status: 'approved',
                                    createdBy: 'Dr. Smith',
                                    createdAt: '2024-01-15',
                                    comments: [
                                        {
                                            id: '1',
                                            user: 'Reviewer A',
                                            text: 'Clear and well-structured question.',
                                            type: 'approved',
                                            createdAt: '2024-01-16',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            id: 'equations',
                            name: 'Linear Equations',
                            questionCount: 18,
                            questions: [
                                {
                                    id: '4',
                                    question: 'Find the value of x: 3x - 7 = 11',
                                    difficulty: 'Easy',
                                    options: ['x = 4', 'x = 6', 'x = 5', 'x = 7'],
                                    correctAnswer: 'B',
                                    explanation: 'Add 7 to both sides: 3x = 18, then divide by 3: x = 6',
                                    status: 'approved',
                                    createdBy: 'Dr. Lin',
                                    createdAt: '2024-01-12',
                                    comments: [],
                                },
                            ],
                        },
                        {
                            id: 'quadratic',
                            name: 'Quadratic Equations',
                            questionCount: 12,
                            questions: [
                                {
                                    id: '5',
                                    question: 'Solve: x² - 5x + 6 = 0',
                                    difficulty: 'Medium',
                                    options: ['x = 1 or x = 6', 'x = 2 or x = 3', 'x = -2 or x = -3', 'x = 0'],
                                    correctAnswer: 'B',
                                    explanation: 'Factor the equation: (x - 2)(x - 3) = 0, so x = 2 or x = 3',
                                    status: 'approved',
                                    createdBy: 'Dr. Patel',
                                    createdAt: '2024-01-10',
                                    comments: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    id: 'geometry',
                    name: 'Geometry',
                    children: [
                        {
                            id: 'basic-shapes',
                            name: 'Basic Shapes',
                            questionCount: 15,
                            questions: [
                                {
                                    id: '6',
                                    question: 'How many sides does a hexagon have?',
                                    type: 'Multiple Choice',
                                    difficulty: 'Easy',
                                    options: ['5', '6', '7', '8'],
                                    correctAnswer: 'B',
                                    explanation: 'A hexagon has 6 sides.',
                                    status: 'approved',
                                    createdBy: 'Prof. Alice',
                                    createdAt: '2024-01-17',
                                    comments: [],
                                },
                            ],
                        },
                        {
                            id: 'triangles',
                            name: 'Triangles',
                            questionCount: 22,
                            questions: [
                                {
                                    id: '8',
                                    question: 'What is the area of a triangle with base 10 cm and height 8 cm?',
                                    type: 'Short Answer',
                                    topic: 'triangles',
                                    difficulty: 'Medium',
                                    correctAnswer: '40 square cm',
                                    explanation: 'Area of triangle = (1/2) × base × height = (1/2) × 10 × 8 = 40 sq cm',
                                    status: 'pending',
                                    createdBy: 'Prof. Johnson',
                                    createdAt: '2024-01-18',
                                    comments: [
                                        {
                                            id: '2',
                                            user: 'Reviewer B',
                                            text: 'Consider adding a diagram for better understanding.',
                                            type: 'suggestion',
                                            createdAt: '2024-01-19',
                                        },
                                    ],
                                },
                                {
                                    id: '7',
                                    question: 'What is the sum of interior angles in any triangle?',
                                    type: 'Multiple Choice',
                                    difficulty: 'Easy',
                                    options: ['180°', '360°', '90°', '270°'],
                                    correctAnswer: 'A',
                                    explanation: 'The sum of the interior angles in a triangle is always 180°.',
                                    status: 'approved',
                                    createdBy: 'Dr. Green',
                                    createdAt: '2024-01-19',
                                    comments: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'science',
            name: 'Science',
            children: [
                {
                    id: 'physics',
                    name: 'Physics',
                    children: [
                        {
                            id: 'mechanics',
                            name: 'Mechanics',
                            questionCount: 30,
                            questions: [
                                {
                                    id: '3',
                                    question: 'Explain Newton first law of motion with an example.',
                                    type: 'Long Answer',
                                    topic: 'mechanics',
                                    difficulty: 'Hard',
                                    correctAnswer:
                                        'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.',
                                    explanation:
                                        'This law describes inertia - the tendency of objects to resist changes in their state of motion.',
                                    status: 'needs_review',
                                    createdBy: 'Dr. Williams',
                                    createdAt: '2024-01-20',
                                    comments: [
                                        {
                                            id: '3',
                                            user: 'Reviewer C',
                                            text: 'The question is good but needs more specific criteria for evaluation.',
                                            type: 'needs_edit',
                                            createdAt: '2024-01-21',
                                        },
                                    ],
                                },
                                {
                                    id: '8',
                                    question: 'What is the SI unit of force?',
                                    type: 'Multiple Choice',
                                    difficulty: 'Easy',
                                    options: ['Newton', 'Joule', 'Watt', 'Pascal'],
                                    correctAnswer: 'A',
                                    explanation: 'The SI unit of force is the Newton (N).',
                                    status: 'approved',
                                    createdBy: 'Dr. Evans',
                                    createdAt: '2024-01-22',
                                    comments: [],
                                },
                            ],
                        },
                        {
                            id: 'electricity',
                            name: 'Electricity',
                            questionCount: 20,
                            questions: [
                                {
                                    id: '9',
                                    question: 'Define electric current.',
                                    type: 'Short Answer',
                                    topic: 'electricity',
                                    difficulty: 'Medium',
                                    correctAnswer: 'The flow of electric charge through a conductor.',
                                    explanation:
                                        'Electric current is defined as the rate at which charge flows through a surface.',
                                    status: 'approved',
                                    createdBy: 'Prof. Lee',
                                    createdAt: '2024-01-23',
                                    comments: [],
                                },
                                {
                                    id: '10',
                                    question: 'Which device is used to measure electric current?',
                                    type: 'Multiple Choice',
                                    difficulty: 'Easy',
                                    options: ['Voltmeter', 'Ammeter', 'Galvanometer', 'Ohmmeter'],
                                    correctAnswer: 'B',
                                    explanation: 'Electric current is measured using an ammeter.',
                                    status: 'approved',
                                    createdBy: 'Prof. Lee',
                                    createdAt: '2024-01-23',
                                    comments: [],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ];
export const learningUnits = [
    {
        id: "1",
        title: "Introduction to React",
        type: "lecture",
        course: "Web Development",
        uploadDate: "2023-10-15",
        downloadUrl: "#",
        fileSize: "2.5 MB",
        status: "published"
    },
    {
        id: "2",
        title: "Assignment 1: Components",
        type: "assignment",
        course: "Web Development",
        uploadDate: "2023-10-18",
        downloadUrl: "#",
        fileSize: "1.2 MB",
        status: "published"
    },
    {
        id: "3",
        title: "Advanced State Management",
        type: "lecture",
        course: "Advanced React",
        uploadDate: "2023-10-20",
        downloadUrl: "#",
        fileSize: "3.8 MB",
        status: "draft"
    },
];

export const reviews = [
    {
        id: '1',
        question: 'What is the chemical formula for water?',
        type: 'MCQ',
        kind: 'passage',
        unit: 'Chemistry Basics',
        topic: 'Molecular Formulas',
        options: ['H2O', 'CO2', 'NaCl', 'CH4'],
        correctAnswer: 'A',
        explanation: 'Water consists of two hydrogen atoms and one oxygen atom.',
        submittedBy: 'Content Creator A',
        submittedAt: '2024-01-20',
        priority: 'medium',
        reviewsCompleted: 1,
        reviewsNeeded: 3,
        existingReviews: [
            {
                reviewer: 'Reviewer B',
                status: 'approved',
                comment: 'Clear and accurate question.',
                timestamp: '2024-01-21',
            },
        ],
        reviewStatus: 'pending',
    },
    {
        id: '2',
        question: 'Explain the process of photosynthesis in detail.',
        type: 'Long Answer',
        kind: 'question bank',
        unit: 'Biology Fundamentals',
        topic: 'Plant Biology',
        correctAnswer:
            'Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen...',
        explanation:
            'This process occurs in chloroplasts and involves light-dependent and light-independent reactions.',
        submittedBy: 'Dr. Smith',
        submittedAt: '2024-01-19',
        priority: 'high',
        reviewsCompleted: 0,
        reviewsNeeded: 3,
        existingReviews: [],
        reviewStatus: 'pending',
    },
    {
        id: '3',
        question: 'Solve: ∫(2x + 3)dx',
        type: 'Short Answer',
        kind: 'question bank',
        unit: 'Advanced Mathematics',
        topic: 'Calculus',
        correctAnswer: 'x² + 3x + C',
        explanation: 'Using the power rule of integration: ∫2x dx = x² and ∫3 dx = 3x',
        submittedBy: 'Prof. Johnson',
        submittedAt: '2024-01-18',
        priority: 'low',
        reviewsCompleted: 2,
        reviewsNeeded: 3,
        existingReviews: [
            {
                reviewer: 'Reviewer A',
                status: 'approved',
                comment: 'Mathematical notation is correct.',
                timestamp: '2024-01-19',
            },
            {
                reviewer: 'Reviewer C',
                status: 'needs_edit',
                comment: 'Consider adding step-by-step solution.',
                timestamp: '2024-01-20',
            },
        ],
        reviewStatus: 'pending',
    },
    {
        id: '4',
        question: 'What is the capital of France?',
        type: 'MCQ',
        kind: 'passage',
        unit: 'World Geography',
        reviewedAt: '2024-01-15',
        finalStatus: 'approved',
        myReview: 'approved',
        myComment: 'Straightforward geography question.',
        reviewStatus: 'completed',
        existingReviews: [
            {
                reviewer: 'Reviewer B',
                status: 'approved',
                comment: 'Clear and accurate question.',
                timestamp: '2024-01-21',
            },
        ],
    },
    {
        id: '5',
        question: 'Describe the causes of World War I.',
        type: 'Long Answer',
        kind: 'question bank',
        unit: 'Modern History',
        reviewedAt: '2024-01-12',
        finalStatus: 'needs_revision',
        myReview: 'needs_edit',
        myComment: 'Question needs more specific focus. Too broad as written.',
        reviewStatus: 'completed',
    },
];

export const learningUnitsLength = learningUnits.length;
export const totalQuestions = questionBank.length + contentUnits.length;
export const activeStudents = 89;
export const pendingReviews = reviews.filter(data => data.reviewStatus == "pending").length;

export const dashboardStats = [
    {
        title: 'Learning Units',
        value: learningUnitsLength,
        change: '+3 this week',
    },
    {
        title: 'Total Questions',
        value: totalQuestions,
        change: '+12 this week',
    },
    {
        title: 'Pending Reviews',
        value: pendingReviews,
        change: '2 urgent',
    },
];

export const recentActivies = [
    {
        id: 1,
        type: 'unit_created',
        message: 'New learning unit "Advanced Mathematics" created',
        time: '2 hours ago',
        user: 'Admin User',
    },
    {
        id: 2,
        type: 'question_submitted',
        message: '5 new questions submitted for review',
        time: '4 hours ago',
        user: 'Content Creator',
    },
    {
        id: 3,
        type: 'review_completed',
        message: 'Question review completed by 3 reviewers',
        time: '6 hours ago',
        user: 'Review Team',
    }
];