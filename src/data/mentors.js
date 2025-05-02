// All mentors data in one place
export const mentors = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Software Engineer",
    rating: 4.9,
    reviews: 128,
    responseTime: "Usually responds in a few hours",
    lastActive: "Active recently",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    calendlyUrl: "https://calendly.com/jainsanskruti123",
    expertise: ["JavaScript", "React", "Node.js", "System Design"],
    about: "Hi! I'm Sarah, a Senior Software Engineer with 8 years of experience. I specialize in full-stack JavaScript development and have mentored over 100 developers. I'm passionate about helping others grow in their careers and sharing my knowledge.",
    plans: [
      {
        name: "Lite Plan",
        price: 240,
        description: "For mentees who just started their career or experienced ones looking to get to the next level.",
        features: [
          "2 calls per month (60min/call)",
          "Unlimited Q&A via chat",
          "Expect responses in 24 hours or less",
          "Hands-on support"
        ],
        calendlyEventType: "new-meeting-1"
      },
      {
        name: "Standard Plan",
        price: 300,
        description: "For mentees who want more personalized guidance and support.",
        features: [
          "4 calls per month (60min/call)",
          "Unlimited Q&A via chat",
          "Expect responses in 12 hours or less",
          "Hands-on support",
          "Code review"
        ],
        calendlyEventType: "new-meeting-1"
      },
      {
        name: "Pro Plan",
        price: 500,
        description: "For mentees who want to build an application under my guidance from inception till the deployment.",
        features: [
          "6 calls per month (60min/call)",
          "Unlimited Q&A via chat",
          "Expect responses in 6 hours or less",
          "Hands-on support",
          "Code review",
          "Project architecture guidance"
        ],
        calendlyEventType: "new-meeting-1"
      }
    ],
    sessions: [
      {
        name: "Introductory Call",
        duration: "15 minutes",
        price: 39,
        description: "If you're looking for a mentor, and you're just not sure about how this all works – this one is for you.",
        calendlyEventType: "15-min-call"
      },
      {
        name: "Ask me Anything",
        duration: "45 minutes",
        price: 120,
        description: "This session is very open-ended and provides an excellent opportunity to ask any questions to an expert.",
        calendlyEventType: "45-min-call"
      },
      {
        name: "Mock Interview",
        duration: "60 minutes",
        price: 150,
        description: "This session is for those aspiring professionals who want to get a taste of how the interview looks like at big companies.",
        calendlyEventType: "new-meeting-1"
      }
    ],
    testimonials: [
      {
        name: "John Doe",
        rating: 5,
        date: "October 4, 2024",
        content: "Sarah is an excellent mentor! She helped me improve my skills and provided valuable guidance throughout my journey."
      },
      {
        name: "Jane Smith",
        rating: 5,
        date: "August 23, 2024",
        content: "Really enjoyed my sessions with Sarah! She explained complex concepts in a simple way and provided great learning resources."
      }
    ],
    articles: [
      {
        title: "Getting Started in Your Career",
        type: "Article",
        description: "Learn the essential steps to kickstart your career in the tech industry."
      },
      {
        title: "Interview Preparation Guide",
        type: "Link",
        description: "A comprehensive guide to help you prepare for technical interviews."
      }
    ]
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Engineering Lead at Microsoft",
    rating: 4.8,
    reviews: 94,
    expertise: ["System Design", "Leadership", "Cloud Architecture"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "UX Design Director at Apple",
    rating: 5.0,
    reviews: 156,
    expertise: ["UI/UX", "Design Systems", "User Testing"],
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Data Science Manager at Amazon",
    rating: 4.7,
    reviews: 83,
    expertise: ["Machine Learning", "Analytics", "Python"],
    image: "https://images.unsplash.com/photo-1463453091185-61582044d556"
  },
  {
    id: 5,
    name: "Alex Thompson",
    role: "Career Coach & HR Consultant",
    rating: 4.9,
    reviews: 112,
    expertise: ["Career Development", "Resume Writing", "Interview Preparation"],
    image: "https://images.unsplash.com/photo-1450297350677-623de575f31c"
  },
  {
    id: 6,
    name: "Lisa Wang",
    role: "Leadership Development Coach",
    rating: 4.8,
    reviews: 98,
    expertise: ["Executive Coaching", "Team Leadership", "Strategic Planning"],
    image: "https://images.unsplash.com/photo-1509783236416-c9ad59bae472"
  },
  {
    id: 7,
    name: "Raj Patel",
    role: "Startup Founder & Advisor",
    rating: 4.9,
    reviews: 143,
    expertise: ["Business Strategy", "Fundraising", "Growth Hacking"],
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef"
  },
  {
    id: 8,
    name: "Maria Garcia",
    role: "Marketing Director at Meta",
    rating: 4.7,
    reviews: 89,
    expertise: ["Digital Marketing", "Brand Strategy", "Social Media"],
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0"
  },
  {
    id: 9,
    name: "James Wilson",
    role: "Senior Software Engineer at Netflix",
    rating: 4.8,
    reviews: 115,
    expertise: ["Java", "Microservices", "Cloud Computing"],
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79"
  },
  {
    id: 10,
    name: "Sophie Chen",
    role: "UX Designer at Spotify",
    rating: 4.9,
    reviews: 92,
    expertise: ["User Experience", "Interaction Design", "Prototyping"],
    image: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56"
  },
  {
    id: 11,
    name: "Carlos Rodriguez",
    role: "Data Scientist at Tesla",
    rating: 4.8,
    reviews: 76,
    expertise: ["Machine Learning", "Big Data", "AI"],
    image: "https://images.unsplash.com/photo-1542178243-bc20204b769f"
  },
  {
    id: 12,
    name: "John Doe",
    role: "Senior Software Engineer",
    rating: 4.7,
    reviews: 88,
    expertise: ["JavaScript", "React", "Node.js"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: 13,
    name: "Jane Smith",
    role: "UX/UI Designer",
    rating: 4.9,
    reviews: 134,
    expertise: ["Figma", "UI Design", "User Research"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  },
  // Additional mentors for better coverage
  {
    id: 14,
    name: "Emma Davis",
    role: "Product Manager at Airbnb",
    rating: 4.8,
    reviews: 95,
    expertise: ["Product Management", "User Research", "Data Analytics"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2"
  },
  {
    id: 15,
    name: "Robert Taylor",
    role: "Senior Software Engineer at Uber",
    rating: 4.9,
    reviews: 102,
    expertise: ["Python", "Django", "AWS"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  },
  {
    id: 16,
    name: "Priya Sharma",
    role: "UX Researcher at Microsoft",
    rating: 4.7,
    reviews: 87,
    expertise: ["User Research", "UX Design", "Usability Testing"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
  },
  {
    id: 17,
    name: "Daniel Lee",
    role: "Data Science Lead at LinkedIn",
    rating: 4.8,
    reviews: 91,
    expertise: ["Data Science", "Python", "Machine Learning"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: 18,
    name: "Aisha Khan",
    role: "Career Development Coach",
    rating: 4.9,
    reviews: 108,
    expertise: ["Career Coaching", "Interview Skills", "Professional Development"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
  },
  {
    id: 19,
    name: "Thomas Anderson",
    role: "Leadership Coach at McKinsey",
    rating: 4.8,
    reviews: 97,
    expertise: ["Leadership Development", "Executive Coaching", "Change Management"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  },
  {
    id: 20,
    name: "Lena Schmidt",
    role: "Startup Advisor & Investor",
    rating: 4.9,
    reviews: 124,
    expertise: ["Startup Strategy", "Venture Capital", "Business Development"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
  },
  {
    id: 21,
    name: "Marcus Brown",
    role: "Marketing Strategist at HubSpot",
    rating: 4.7,
    reviews: 85,
    expertise: ["Digital Marketing", "Content Strategy", "SEO"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  },
  {
    id: 22,
    name: "Yuki Tanaka",
    role: "Frontend Developer at Shopify",
    rating: 4.8,
    reviews: 94,
    expertise: ["JavaScript", "React", "TypeScript"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
  },
  {
    id: 23,
    name: "Olivia Martinez",
    role: "UI Designer at Adobe",
    rating: 4.9,
    reviews: 116,
    expertise: ["UI Design", "Figma", "Design Systems"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
  },
  {
    id: 24,
    name: "Ahmed Hassan",
    role: "Data Engineer at Twitter",
    rating: 4.7,
    reviews: 82,
    expertise: ["Big Data", "Python", "Data Engineering"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  }
]; 