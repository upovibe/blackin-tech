// Function to fetch diverse tech, design, and emerging tech skills
export const fetchSkills = async () => {
    const skills = [
      // Developer Skills
      "JavaScript", "React", "Node.js", "TypeScript", "Python", "Java", 
      "C++", "C#", "Swift", "Kotlin", "Go", "Rust", "PHP", "Ruby", 
      "HTML", "CSS", "SASS", "Next.js", "Vue.js", "Angular", "Svelte", 
      "SQL", "NoSQL", "MongoDB", "PostgreSQL", "MySQL", "SQLite", 
      "GraphQL", "REST APIs", "gRPC", "WebAssembly", "Docker", "Kubernetes", 
      "Terraform", "Ansible", "Jenkins", "Git", "GitHub", "GitLab", 
      "CI/CD Pipelines", "Agile", "Scrum", "TDD (Test-Driven Development)", 
      "DevOps", "Serverless", "Microservices", "WebSockets",
  
      // Cloud & Infrastructure
      "AWS", "Azure", "Google Cloud Platform (GCP)", "IBM Cloud", 
      "Oracle Cloud", "Cloudflare", "Heroku", "DigitalOcean", 
      "Infrastructure as Code (IaC)", "Kubernetes", "Docker Swarm", 
      "Istio", "Helm", "Vagrant", "Apache Kafka", "RabbitMQ", 
      "Nginx", "Apache HTTP Server", "Firebase", "Azure DevOps", 
      "ElasticSearch", "Redis", "Load Balancing", "Serverless Framework",
  
      // Blockchain & Web3
      "Solidity", "Web3.js", "Ethereum", "Hyperledger", "Truffle", 
      "Ganache", "Smart Contracts", "DApps (Decentralized Apps)", 
      "DeFi (Decentralized Finance)", "NFT Development", "Polygon", 
      "Binance Smart Chain", "Chainlink", "IPFS", "Tokenomics", 
      "Cryptography", "Consensus Algorithms", "Staking", 
      "Blockchain Security", "Metamask", "Wallet Integration", 
      "dApp Security", "Smart Contract Auditing", "Zero Knowledge Proofs (ZKPs)",
  
      // Artificial Intelligence & Data Science
      "Machine Learning", "Deep Learning", "Natural Language Processing (NLP)", 
      "Computer Vision", "Reinforcement Learning", "TensorFlow", 
      "PyTorch", "Scikit-learn", "Keras", "OpenCV", "Pandas", 
      "NumPy", "Matplotlib", "Data Analysis", "Data Visualization", 
      "Big Data", "Hadoop", "Spark", "Apache Flink", "Data Lakes", 
      "ETL Pipelines", "Data Warehousing", "Jupyter Notebooks", 
      "AI Ethics", "Generative AI", "GPT Models", "LangChain", "Hugging Face", 
      "AI Prompt Engineering", "AutoML", "MLOps", "AI Explainability",
  
      // Cybersecurity
      "Penetration Testing", "Ethical Hacking", "OWASP", "Burp Suite", 
      "Nmap", "Metasploit", "Kali Linux", "Wireshark", "Identity & Access Management (IAM)", 
      "Zero Trust Architecture", "Encryption", "SSL/TLS", "SOC (Security Operations Center)", 
      "SIEM", "Incident Response", "Threat Modeling", "Vulnerability Assessment", 
      "Network Security", "Endpoint Security", "Firewall Management", 
      "Intrusion Detection Systems (IDS)", "DevSecOps", "Cloud Security", 
      "Blockchain Security", "Multi-Factor Authentication (MFA)", "Security Audits",
  
      // Design & User Experience
      "Figma", "Sketch", "Adobe XD", "Adobe Photoshop", "Adobe Illustrator", 
      "Adobe After Effects", "Blender", "Cinema 4D", "3D Rendering", 
      "Motion Design", "Graphic Design", "Visual Design", "UI/UX Design", 
      "User Research", "Wireframing", "Prototyping", "Usability Testing", 
      "Design Systems", "Information Architecture", "Interaction Design", 
      "Mobile-First Design", "Responsive Design", "Accessibility (WCAG)", 
      "Animation", "Typography", "Color Theory", "Branding", 
      "User-Centered Design", "Storyboarding", "Augmented Reality (AR) Design", 
      "Virtual Reality (VR) Design", "Generative Art", "Data-Driven Design",
  
      // Emerging Tech & Miscellaneous
      "Quantum Computing", "Edge Computing", "IoT (Internet of Things)", 
      "Robotics", "AR/VR Development", "Unity", "Unreal Engine", 
      "Game Development", "3D Printing", "Wearable Tech", "5G Networking", 
      "Bioinformatics", "Digital Twins", "Metaverse Development", 
      "Generative Design", "Voice Interface Design", "Chatbot Development", 
      "RPA (Robotic Process Automation)", "Low-Code/No-Code Platforms", 
      "Graph Databases", "Neural Networks", "Digital Marketing Tech", 
      "SEO (Search Engine Optimization)", "Content Management Systems (CMS)"
    ];
    return skills;
  };

  

  // Function to fetch professional and soft skills
export const fetchAbilities = async () => {
    const abilities = [
      // Project & Team Management
      "Project Management", "Agile Methodologies", "Scrum Master", 
      "Kanban", "Lean Development", "Waterfall", "Stakeholder Management", 
      "Risk Management", "Change Management", "Product Management", 
      "Resource Allocation", "Budgeting & Forecasting", "OKRs (Objectives and Key Results)", 
      "Team Leadership", "Cross-functional Collaboration", "Conflict Resolution", 
      "Time Management", "Delegation", "Team Building", "Task Prioritization", 
      "Sprint Planning", "Roadmapping", "Project Scheduling", "Issue Tracking", 
      "Trello", "JIRA", "Asana", "Monday.com", "Basecamp",
  
      // Communication & Collaboration
      "Verbal Communication", "Written Communication", "Active Listening", 
      "Negotiation", "Public Speaking", "Presentation Skills", 
      "Storytelling", "Client Management", "Interpersonal Skills", 
      "Empathy", "Cross-cultural Communication", "Remote Collaboration", 
      "Team Collaboration Tools (Slack, Microsoft Teams)", "Networking", 
      "Influence & Persuasion", "Meeting Facilitation", "Conflict Mediation", 
      "Business Communication", "Consensus Building", "Documentation Writing",
  
      // Leadership & Strategy
      "Leadership", "Strategic Planning", "Decision Making", 
      "Critical Thinking", "Problem Solving", "Visionary Thinking", 
      "Coaching & Mentorship", "Emotional Intelligence", "Change Leadership", 
      "Organizational Development", "Business Acumen", "Entrepreneurship", 
      "Innovation", "Creative Problem Solving", "Growth Hacking", 
      "Crisis Management", "Negotiation Strategies", "Performance Management", 
      "Inspiring Teams", "Motivational Leadership", "Vision Setting",
  
      // Analytical & Problem-Solving Skills
      "Data Analysis", "Data-Driven Decision Making", "Quantitative Analysis", 
      "Qualitative Analysis", "Root Cause Analysis", "Troubleshooting", 
      "Logical Thinking", "Analytical Thinking", "Systems Thinking", 
      "Risk Analysis", "SWOT Analysis", "A/B Testing", "Forecasting", 
      "Business Intelligence", "Pattern Recognition", "Process Optimization", 
      "KPI Measurement", "Competitive Analysis", "Gap Analysis", 
      "Complex Problem Solving",
  
      // Creativity & Innovation
      "Creative Thinking", "Design Thinking", "Innovation Management", 
      "Brainstorming", "Ideation", "Prototyping", "User-Centered Design", 
      "Out-of-the-Box Thinking", "User Research", "Market Research", 
      "Concept Development", "Service Design", "Storyboarding", 
      "Scenario Planning", "Wireframing", "Creative Problem Solving", 
      "Trend Analysis", "Future Forecasting", "Human-Centered Innovation", 
      "MVP (Minimum Viable Product) Development",
  
      // Organization & Planning
      "Organization", "Planning", "Time Management", "Goal Setting", 
      "Multitasking", "Attention to Detail", "Scheduling", 
      "Task Management", "Deadline Management", "Event Planning", 
      "Workflow Management", "Prioritization", "Personal Productivity", 
      "Self-Discipline", "Accountability", "Stress Management", 
      "Meeting Deadlines", "Gantt Charts", "Work-Life Balance", 
      "Calendar Management", "Document Management",
  
      // Customer-Focused Skills
      "Customer Relationship Management", "Customer Service", 
      "Customer Success", "Client Satisfaction", "User Experience (UX)", 
      "User-Centered Design", "Client Onboarding", "Client Communication", 
      "Client Retention", "Customer Feedback Analysis", "User Feedback Loops", 
      "Market Research", "Customer Journey Mapping", "Client Consultation", 
      "Client Presentations", "Account Management", "User Advocacy",
  
      // Sales & Marketing
      "Sales Strategy", "Digital Marketing", "SEO (Search Engine Optimization)", 
      "Content Marketing", "Social Media Marketing", "PPC (Pay Per Click)", 
      "Lead Generation", "Market Segmentation", "Brand Strategy", 
      "Copywriting", "Email Marketing", "Customer Acquisition", 
      "Customer Retention", "Marketing Analytics", "Conversion Rate Optimization", 
      "Salesforce", "HubSpot", "Marketing Automation", "Influencer Marketing", 
      "Affiliate Marketing", "Product Marketing", "Growth Hacking",
  
      // Learning & Adaptability
      "Adaptability", "Continuous Learning", "Self-Motivation", 
      "Resilience", "Agility", "Growth Mindset", "Open-mindedness", 
      "Curiosity", "Learning Agility", "Upskilling", "Lifelong Learning", 
      "Feedback Reception", "Mentoring", "Self-reflection", "Creativity in Learning", 
      "Iterative Learning", "Self-Improvement", "Peer Learning", "Flexibility",
  
      // Ethics & Integrity
      "Ethical Decision Making", "Professional Integrity", "Transparency", 
      "Confidentiality", "Accountability", "Trustworthiness", 
      "Compliance", "Social Responsibility", "Sustainability", 
      "Fairness", "Workplace Ethics", "Moral Judgment", "Corporate Governance", 
      "Anti-discrimination", "Diversity and Inclusion", "Data Privacy", 
      "Corporate Social Responsibility (CSR)", "Equality Advocacy",
  
      // Miscellaneous Professional Skills
      "Vendor Management", "Supply Chain Management", "Contract Negotiation", 
      "Business Analysis", "Process Improvement", "Financial Management", 
      "Budget Management", "Procurement", "Compliance Management", 
      "Risk Assessment", "Legal Compliance", "Business Strategy", 
      "Business Process Re-engineering (BPR)", "Lean Six Sigma", 
      "Sustainability Initiatives", "Crisis Management", "Global Mindset", 
      "Cultural Sensitivity", "Business Transformation"
    ];
    return abilities;
  };
  


  // Function to fetch availability statuses
export const fetchAvailabilityStatuses = async () => {
    const availabilityStatuses = [
      // General Availability
      "Available", 
      "Not Available", 
      "Available Soon",
      
      // Work Type Availability
      "Full-time", 
      "Part-time", 
      "Freelance/Contract", 
      "Temporary", 
      "Internship", 
      "Consultant",
      
      // Remote Work Availability
      "Remote Only", 
      "On-site Only", 
      "Hybrid", 
      "Willing to Relocate",
      
      // Shift & Time Preferences
      "Day Shift", 
      "Night Shift", 
      "Weekend Availability", 
      "Flexible Hours", 
      "On-call", 
      "Per Diem", // Paid on a daily basis for flexible jobs.
      
      // Immediate & Future Availability
      "Immediately Available", 
      "Available Within 2 Weeks", 
      "Available Within a Month", 
      "Currently Employed (Open to Offers)", 
      "Looking for Opportunities", 
      "Unavailable for the Next 3 Months"
    ];
    return availabilityStatuses;
  };
  

  // Function to fetch educational categories
export const fetchEducationalCategories = async () => {
  const educationalCategories = [
    // Primary & Secondary Education
    "Primary School", 
    "Secondary School", 
    "High School Diploma", 
    
    // Undergraduate Education
    "Associate's Degree", 
    "Bachelor's Degree", 
    "Undergraduate Certificate", 
    
    // Graduate Education
    "Master's Degree", 
    "Postgraduate Diploma/Certificate", 
    "Doctorate (Ph.D.)",
    
    // Professional Certifications
    "Professional Certification", 
    "Technical Certification", 
    "Vocational Training", 
    "Coding Bootcamp", 
    
    // Continuing Education & Online Courses
    "Online Courses", 
    "Workshops & Seminars", 
    "Continuing Education Units (CEUs)", 
    
    // Specialized Training
    "Apprenticeship", 
    "Internship Program", 
    "Fellowship", 
    "Military Training", 
    
    // Licenses & Special Qualifications
    "Professional License", 
    "Industry-Specific Qualification", 
    "Security Clearance", 
    "CPR/First Aid Certification"
  ];
  return educationalCategories;
};
