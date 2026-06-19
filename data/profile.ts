export interface Socials {
  github?: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  medium?: string;
  scholar?: string;
}

export interface Project {
  title: string;
  description: string;
  techStack: string[];
  keyImpact: string;
  githubLink?: string;
  liveLink?: string;
  caseStudyLink?: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  dateRange: string;
  responsibilities: string[];
  keyAchievements: string[];
}

export interface EducationItem {
  university: string;
  degree: string;
  department: string;
  dateRange: string;
  location: string;
  coursework?: string[];
  focus?: string; // e.g. Thesis topic or specialized focus
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  url?: string;
  description?: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  cvUrl?: string;
  profileImage?: string;
  socials: Socials;
  about: {
    bio: string;
    currentRole: string;
    educationSummary: string;
    careerFocus: string;
    interests: string[];
  };
  skills: { title: string; items: string[] }[];
  projects: Project[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  languages: string[];
  themeColor?: "emerald" | "cyan" | "amber" | "fuchsia" | "red";
}

export const profileData: ProfileData = {
  name: "Alex Rivera",
  title: "AI Engineer & Distributed Systems Specialist",
  tagline: "Bridging the gap between scalable high-performance backend systems and state-of-the-art machine learning models.",
  location: "San Francisco, CA",
  email: "alex.rivera@example.com",
  cvUrl: "#", // Placeholder
  profileImage: "/images/profile.jpg", // Placeholder - we will handle empty states gracefully
  themeColor: "emerald",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    email: "mailto:alex.rivera@example.com",
    twitter: "https://twitter.com",
    medium: "https://medium.com",
    scholar: "https://scholar.google.com"
  },
  about: {
    bio: "I am a software engineer and AI researcher focused on designing and implementing distributed systems that train and serve large-scale machine learning models. I enjoy solving complex performance bottlenecks across the stack—from database query optimization to GPU kernel efficiency. With experience in both rapid-growth startups and university research labs, I bring a rigorous engineering mindset to AI development.",
    currentRole: "Lead AI Systems Engineer at SynthAI Labs",
    educationSummary: "M.S. in Computer Science from Stanford University",
    careerFocus: "Building next-generation infrastructure for collaborative and decentralized machine learning, ensuring safety, efficiency, and high scalability.",
    interests: ["Large Language Models", "Distributed GPU Orchestration", "Vector Databases", "Edge Computing", "Privacy-Preserving AI"]
  },
  skills: [
    { title: "Backend Development", items: ["Go", "Python", "Rust", "TypeScript", "Node.js", "gRPC", "FastAPI"] },
    { title: "Frontend & Mobile", items: ["React", "Next.js", "Tailwind CSS", "React Native", "SwiftUI"] },
    { title: "AI / Machine Learning", items: ["PyTorch", "Hugging Face", "Transformers", "Scikit-Learn", "LangChain", "TensorFlow"] },
    { title: "Databases & Cache", items: ["PostgreSQL", "Redis", "Pinecone", "MongoDB", "ClickHouse", "SQLite"] },
    { title: "DevOps & Tools", items: ["Docker", "Kubernetes", "AWS", "GitHub Actions", "Terraform", "Prometheus"] },
    { title: "Architecture & Standards", items: ["Microservices", "Event-Driven Systems", "System Design", "AWS Solutions Architect"] }
  ],
  projects: [
    {
      title: "NeuroFlow Orchestrator",
      description: "An open-source distributed training orchestrator that dynamically allocates spot instances on public clouds to train model checkpoints, cutting compute expenses by 45%.",
      techStack: ["Go", "Kubernetes", "PyTorch", "AWS", "gRPC"],
      keyImpact: "Reduced distributed training orchestration costs by 45% for a model with 13B parameters, managing failovers seamlessly.",
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      caseStudyLink: "#"
    },
    {
      title: "InsightEdge DB",
      description: "A lightweight, zero-dependency local vector database written in Rust, optimized for real-time semantic search and recommendation systems on embedded devices and web browsers via WebAssembly.",
      techStack: ["Rust", "WebAssembly", "TypeScript", "SIMD"],
      keyImpact: "Achieved sub-10ms search query response times for datasets containing up to 100,000 high-dimensional vectors on mobile platforms.",
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      caseStudyLink: "#"
    },
    {
      title: "AuraDoc Care",
      description: "A HIPAA-compliant mobile application that integrates privacy-preserving federated learning to assist clinicians in predicting patient readmission rates without uploading patient health records.",
      techStack: ["React Native", "FastAPI", "PostgreSQL", "PyTorch", "Docker"],
      keyImpact: "Successfully deployed as a pilot project across three regional clinics, maintaining 94% prediction accuracy while ensuring zero data leakage.",
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      caseStudyLink: "#"
    },
    {
      title: "SynthQuery LLM",
      description: "A fine-tuned Llama-3 adapter that converts conversational natural language into highly optimized PostgreSQL queries, handling nested joins, aggregations, and window functions with ease.",
      techStack: ["Python", "Hugging Face", "Transformers", "PostgreSQL", "LangChain"],
      keyImpact: "Improved SQL generation accuracy on complex schemas by 28% compared to base model prompting, decreasing average query response time by 15%.",
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      caseStudyLink: "#"
    }
  ],
  experience: [
    {
      company: "SynthAI Labs",
      role: "Lead AI Systems Engineer",
      location: "San Francisco, CA",
      dateRange: "2024 - Present",
      responsibilities: [
        "Architected the next-generation distributed inference engine serving fine-tuned LLMs to 200,000+ daily active users.",
        "Designed and implemented GPU-sharing protocols using Kubernetes, maximizing compute cluster utilization and lowering monthly API latency by 30%.",
        "Collaborated with research scientists to integrate custom attention kernels (FlashAttention) into production pipelines."
      ],
      keyAchievements: [
        "Reduced cluster operating costs by $180,000/year through advanced resource allocation algorithms.",
        "Scaled backend infrastructure throughput by 4x while maintaining sub-150ms time-to-first-token latency."
      ]
    },
    {
      company: "TechCorp Systems",
      role: "Senior Software Engineer (Backend)",
      location: "Seattle, WA",
      dateRange: "2022 - 2024",
      responsibilities: [
        "Led a team of 4 engineers in migrating a legacy monolithic billing system into high-throughput Go-based microservices.",
        "Designed a reliable asynchronous transaction ledger utilizing Apache Kafka, processing $12M+ in monthly transaction volume.",
        "Built automated load testing rigs that identified and eliminated memory leaks in core database connection pools."
      ],
      keyAchievements: [
        "Achieved 99.999% uptime for core financial services over a 12-month period.",
        "Reduced average database query response latency by 60% through aggressive caching layers and indexing strategies."
      ]
    },
    {
      company: "Stanford AI Lab",
      role: "Graduate Research Assistant",
      location: "Stanford, CA",
      dateRange: "2020 - 2022",
      responsibilities: [
        "Researched multi-modal learning techniques under the supervision of Dr. Sarah Jenkins.",
        "Maintained and optimized the lab's GPU cluster (Slurm), supporting 30+ researchers with training schedules.",
        "Co-authored two papers on federated learning models published in major machine learning conferences."
      ],
      keyAchievements: [
        "Published a paper at NeurIPS 2021 on decentralized training architectures.",
        "Created an open-source benchmarking suite for model compression techniques that received 1,200+ stars on GitHub."
      ]
    }
  ],
  education: [
    {
      university: "Stanford University",
      degree: "Master of Science",
      department: "Computer Science (AI Track)",
      dateRange: "2020 - 2022",
      location: "Stanford, CA",
      coursework: ["Distributed Systems", "Deep Learning", "Natural Language Processing", "Advanced Operating Systems"],
      focus: "Research focused on high-performance training systems and edge neural network compression."
    },
    {
      university: "University of California, Berkeley",
      degree: "Bachelor of Science",
      department: "Electrical Engineering & Computer Sciences (EECS)",
      dateRange: "2016 - 2020",
      location: "Berkeley, CA",
      coursework: ["Data Structures & Algorithms", "Database Systems", "Machine Learning", "Computer Architecture"],
      focus: "Graduated with Honors. Undergrad Thesis: Decentralized Consensus protocols for Peer-to-Peer Networks."
    }
  ],
  certifications: [
    {
      title: "AWS Certified Solutions Architect – Professional",
      issuer: "Amazon Web Services (AWS)",
      date: "2023",
      description: "Advanced validation of design, deployment, and management skills for enterprise AWS environments."
    },
    {
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI / Coursera",
      date: "2022",
      description: "Comprehensive 5-course series covering foundational neural network design, CNNs, RNNs, and hyperparameter tuning."
    },
    {
      title: "NeurIPS Outstanding Reviewer Award",
      issuer: "Neural Information Processing Systems Foundation",
      date: "2021",
      description: "Recognized for high-quality, constructive feedback on peer-reviewed submissions."
    }
  ],
  languages: ["English (Native)", "Spanish (Conversational)"]
};
