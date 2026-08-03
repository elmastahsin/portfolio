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
  focus?: string;
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

export const translations = {
  en: {
    nav: {
      about: "About",
      skills: "Skills",
      projects: "Projects",
      experience: "Experience",
      education: "Education",
      certifications: "Awards",
      blog: "Blog",
      contact: "Contact",
    },
    sections: {
      aboutTitle: "About Me",
      aboutSubtitle: "Passionate about software architecture, clean code, and continuous learning.",
      skillsTitle: "Technical Skills",
      skillsSubtitle: "Core technologies and tools I leverage to build scalable enterprise solutions.",
      projectsTitle: "Featured Projects",
      projectsSubtitle: "Selected projects demonstrating backend microservices, mobile, and machine learning capabilities.",
      experienceTitle: "Work Experience",
      experienceSubtitle: "My professional career trajectory in backend software development and technical training delivery.",
      educationTitle: "Education",
      educationSubtitle: "Academic engineering foundation and computer science degree.",
      certificationsTitle: "Certifications & Awards",
      certificationsSubtitle: "Recognitions and specialized engineering credentials.",
      contactTitle: "Get In Touch",
      contactSubtitle: "Feel free to reach out for collaborations, inquiries, or technical discussion.",
      blogTitle: "Latest Articles",
      blogSubtitle: "Insights on software engineering, backend architecture, and training delivery.",
    },
    buttons: {
      getInTouch: "Get In Touch",
      downloadCv: "Download CV",
      viewProject: "View Project",
      viewCode: "View Code",
      sendMessage: "Send Message",
      sending: "Sending...",
      success: "Message Sent!",
    },
    labels: {
      currentRole: "Current Role",
      educationSummary: "Education",
      careerFocus: "Career Focus",
      interests: "Interests & Focus Areas",
      keyAchievements: "Key Achievements",
    }
  },
  tr: {
    nav: {
      about: "Hakkımda",
      skills: "Yetenekler",
      projects: "Projeler",
      experience: "Deneyim",
      education: "Eğitim",
      certifications: "Ödüller",
      blog: "Blog",
      contact: "İletişim",
    },
    sections: {
      aboutTitle: "Hakkımda",
      aboutSubtitle: "Yazılım mimarisi, temiz kod ve sürekli öğrenme tutkusu.",
      skillsTitle: "Teknik Yetkinlikler",
      skillsSubtitle: "Ölçeklenebilir kurumsal çözümler geliştirmek için kullandığım teknolojiler ve araçlar.",
      projectsTitle: "Öne Çıkan Projeler",
      projectsSubtitle: "Backend mikroservisler, mobil ve makine öğrenmesi yetkinliklerimi yansıtan projeler.",
      experienceTitle: "İş Deneyimi",
      experienceSubtitle: "Yazılım geliştirme ve teknik eğitim delivery süreçlerindeki profesyonel kariyer yolculuğum.",
      educationTitle: "Eğitim",
      educationSubtitle: "Akademik bilgisayar mühendisliği altyapım ve lisans derecem.",
      certificationsTitle: "Sertifikalar ve Ödüller",
      certificationsSubtitle: "Kazandığım ödüller ve uzmanlık sertifikalarım.",
      contactTitle: "İletişime Geçin",
      contactSubtitle: "İş birliği, projeler veya teknik konular için benimle iletişime geçebilirsiniz.",
      blogTitle: "Son Yazılar",
      blogSubtitle: "Yazılım mühendisliği, backend mimarileri ve eğitim delivery üzerine düşünceler.",
    },
    buttons: {
      getInTouch: "İletişime Geç",
      downloadCv: "CV İndir",
      viewProject: "Projeyi İncele",
      viewCode: "Kodu İncele",
      sendMessage: "Mesaj Gönder",
      sending: "Gönderiliyor...",
      success: "Mesaj Gönderildi!",
    },
    labels: {
      currentRole: "Mevcut Pozisyon",
      educationSummary: "Eğitim Geçmişi",
      careerFocus: "Kariyer Odak Alanı",
      interests: "İlgi ve Odak Alanları",
      keyAchievements: "Öne Çıkan Başarılar",
    }
  }
};

export const profileDataEn: ProfileData = {
  name: "Tahsin Elmas",
  title: "Software Developer & Training Delivery Specialist",
  tagline: "Java Backend Developer & Training Delivery Specialist with 3+ years experience in Spring, Microservices, Docker, AWS, and ML Pipelines.",
  location: "Ankara, Turkey",
  email: "tahsinelmasdev@gmail.com",
  cvUrl: "/TahsinELMAS.pdf",
  profileImage: "/images/profile.jpg",
  themeColor: "emerald",
  socials: {
    github: "https://github.com/elmastahsin",
    linkedin: "https://linkedin.com/in/tahsinelmas",
    email: "mailto:tahsinelmasdev@gmail.com"
  },
  about: {
    bio: "IT Professional with 3+ years of experience specializing in Java Backend Development and Training Delivery. Proficient in SDLC and Agile methodologies, with strong expertise in Core Java, Spring Framework, Microservices, Kafka, Docker, and AWS. Proven success in developing scalable backend applications and delivering high-quality technical training programs.",
    currentRole: "Software Developer & Training Delivery Specialist at IT KRAFT",
    educationSummary: "B.Sc. in Computer Engineering from Middle East Technical University (METU / ODTÜ)",
    careerFocus: "Architecting scalable enterprise backend applications, microservices, and leading high-quality technical training delivery programs.",
    interests: ["Java Backend Architecture", "Spring Framework & Microservices", "Machine Learning & LLM Pipelines", "Cloud & DevOps (Docker, AWS, Kafka)", "Technical Content & Training Delivery"]
  },
  skills: [
    { title: "Programming Languages", items: ["Java", "Python", "C", "C++", "SQL", "TypeScript"] },
    { title: "Backend & Tech", items: ["Spring Framework", "FastAPI", "Hibernate", "Microservices", "Kafka", "Docker", "AWS"] },
    { title: "Databases & Tools", items: ["PostgreSQL", "MySQL", "Elasticsearch", "Postman", "Swagger", "Git"] }
  ],
  projects: [
    {
      title: "Gurme Restaurant Recommendation App",
      description: "A restaurant recommendation platform engineered with RESTful APIs, Spring Boot, and PostgreSQL in a containerized Docker environment.",
      techStack: ["Java", "Spring Boot", "PostgreSQL", "Docker", "REST APIs"],
      keyImpact: "Awarded 5th place out of 35 engineering projects at METU-CENG Demo Day 2025.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "https://senior.ceng.metu.edu.tr/2025/GURME/"
    },
    {
      title: "UNO-like Multiplayer Game Engine",
      description: "A real-time multiplayer card game system implementing core game logic, leaderboards, and JWT-based authentication to manage session integrity and multiplayer state flow.",
      techStack: ["Java", "Spring Boot", "JavaFX", "JWT", "REST APIs"],
      keyImpact: "Engineered real-time multiplayer state orchestration and secure JWT authentication.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "https://github.com/elmastahsin/CENG453_20242_Group3_frontend"
    },
    {
      title: "Varlık (Wealth & Asset Tracking Platform)",
      description: "A cross-platform financial wealth and asset tracking application designed for multi-category asset management and real-time financial tracking.",
      techStack: ["Java", "Spring Boot", "React Native", "PostgreSQL", "REST APIs"],
      keyImpact: "Delivered a cross-platform mobile and backend architecture for multi-currency financial tracking.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "https://varlik.tahsinelmas.com"
    },
    {
      title: "MTTR Prediction System (ML for Electrical Utilities)",
      description: "A machine learning pipeline developed for electrical utility infrastructure to predict Mean Time to Repair (MTTR), improving predictive maintenance and grid reliability.",
      techStack: ["Python", "Machine Learning", "Scikit-Learn", "SQL", "Pandas"],
      keyImpact: "Optimized maintenance scheduling and outage restoration analysis for electrical utilities.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "#"
    }
  ],
  experience: [
    {
      company: "IT KRAFT",
      role: "Software Developer & Training Delivery Specialist",
      location: "Ankara, Turkey",
      dateRange: "September 2024 - Present",
      responsibilities: [
        "Led training delivery and train-the-trainers programs for engineering teams, accelerating onboarding and technical proficiency.",
        "Contributed to LMS (Learning Management System) platform development, designing scalable backend components and RESTful APIs using Spring (MVC, Data, Security).",
        "Ensured clean architecture, high scalability, and robust code quality across enterprise software solutions."
      ],
      keyAchievements: [
        "Successfully spearheaded train-the-trainers programs while delivering core LMS backend features.",
        "Architected scalable Spring backend components focused on clean architecture and performance."
      ]
    },
    {
      company: "PTTeM",
      role: "Software Developer",
      location: "Ankara, Turkey",
      dateRange: "June 2023 - September 2024",
      responsibilities: [
        "Engineered backend architecture for a high-volume wallet-based gift card platform.",
        "Implemented robust authentication and authorization using Spring Security, Keycloak, and JWT tokens.",
        "Containerized and deployed microservices via Docker & AWS, integrating Elasticsearch for high-speed search operations."
      ],
      keyAchievements: [
        "Launched wallet-based gift card microservices on AWS with Keycloak OAuth2/JWT security.",
        "Integrated Elasticsearch to enable real-time transactional search across gift card services."
      ]
    }
  ],
  education: [
    {
      university: "Middle East Technical University (METU / ODTÜ)",
      degree: "Bachelor of Science (B.S.)",
      department: "Computer Engineering",
      dateRange: "2022 - 2026",
      location: "Ankara, Turkey",
      coursework: ["Data Structures & Algorithms", "Operating Systems", "Database Management Systems", "Software Engineering", "Machine Learning", "Computer Networks"],
      focus: "Comprehensive education in computer engineering, backend microservices, database systems, and artificial intelligence."
    }
  ],
  certifications: [
    {
      title: "METU-CENG Demo Day 2025 – 5th Place Award",
      issuer: "Middle East Technical University (METU / ODTÜ)",
      date: "2025",
      description: "Ranked 5th out of 35 engineering projects for the Gurme Restaurant Recommendation Platform."
    },
    {
      title: "Java Backend & Cloud Microservices Specialist",
      issuer: "Spring, AWS & Docker Technical Ecosystems",
      date: "2024",
      description: "Specialized experience in Spring Framework, Microservices, Kafka, Docker, Keycloak, and AWS deployments."
    }
  ],
  languages: ["Turkish (Native)", "English (Professional / Fluent)"]
};

export const profileDataTr: ProfileData = {
  name: "Tahsin Elmas",
  title: "Yazılım Geliştirici & Eğitim Delivery Uzmanı",
  tagline: "Spring, Mikroservisler, Docker, AWS ve ML Pipeline'larında 3+ yıl deneyimli Java Backend Geliştirici & Eğitim Delivery Uzmanı.",
  location: "Ankara, Türkiye",
  email: "tahsinelmasdev@gmail.com",
  cvUrl: "/TahsinELMAS.pdf",
  profileImage: "/images/profile.jpg",
  themeColor: "emerald",
  socials: {
    github: "https://github.com/elmastahsin",
    linkedin: "https://linkedin.com/in/tahsinelmas",
    email: "mailto:tahsinelmasdev@gmail.com"
  },
  about: {
    bio: "Java Backend Geliştirme ve Teknik Eğitim Delivery süreçlerinde 3 yılı aşkın deneyime sahip IT profesyoneli. SDLC ve Çevik (Agile) metodolojilerde uzman; Core Java, Spring Framework, Mikroservisler, Kafka, Docker ve AWS konularında güçlü teknik yetkinliğe sahip. Ölçeklenebilir backend uygulamaları geliştirme ve yüksek kaliteli teknik eğitim programları sunmada kanıtlanmış başarı.",
    currentRole: "IT KRAFT şirketinde Yazılım Geliştirici & Eğitim Delivery Uzmanı",
    educationSummary: "Orta Doğu Teknik Üniversitesi (METU / ODTÜ) — Bilgisayar Mühendisliği (Lisans)",
    careerFocus: "Ölçeklenebilir kurumsal backend uygulamaları, mikroservis mimarileri geliştirmek ve yüksek kaliteli teknik eğitim delivery süreçlerine liderlik etmek.",
    interests: ["Java Backend Mimarisi", "Spring Framework & Mikroservisler", "Makine Öğrenmesi & LLM Hatları", "Bulut & DevOps (Docker, AWS, Kafka)", "Teknik İçerik & Eğitim Delivery"]
  },
  skills: [
    { title: "Programlama Dilleri", items: ["Java", "Python", "C", "C++", "SQL", "TypeScript"] },
    { title: "Backend & Teknolojiler", items: ["Spring Framework", "FastAPI", "Hibernate", "Mikroservisler", "Kafka", "Docker", "AWS"] },
    { title: "Veritabanları & Araçlar", items: ["PostgreSQL", "MySQL", "Elasticsearch", "Postman", "Swagger", "Git"] }
  ],
  projects: [
    {
      title: "Gurme Restoran Öneri Uygulaması",
      description: "Dockerize edilmiş ortamda RESTful API'ler, Spring Boot ve PostgreSQL kullanılarak geliştirilmiş restoran öneri platformu.",
      techStack: ["Java", "Spring Boot", "PostgreSQL", "Docker", "REST APIs"],
      keyImpact: "METU-CENG Demo Day 2025'te 35 mühendislik projesi arasında 5.lik ödülü kazandı.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "https://senior.ceng.metu.edu.tr/2025/GURME/"
    },
    {
      title: "UNO Benzeri Çok Oyunculu Oyun Motoru",
      description: "Çekirdek oyun mantığını, liderlik tablosunu ve oturum güvenliğini sağlayan JWT tabanlı kimlik doğrulama mimarisini içeren gerçek zamanlı çok oyunculu kart oyunu sistemi.",
      techStack: ["Java", "Spring Boot", "JavaFX", "JWT", "REST APIs"],
      keyImpact: "Gerçek zamanlı çok oyunculu durum yönetimi ve güvenli JWT doğrulama altyapısı kuruldu.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "https://github.com/elmastahsin/CENG453_20242_Group3_frontend"
    },
    {
      title: "Varlık (Finans ve Varlık Takip Platformu)",
      description: "Çok kategorili varlık yönetimi ve gerçek zamanlı finansal takip için tasarlanmış çapraz platform finans takip uygulaması.",
      techStack: ["Java", "Spring Boot", "React Native", "PostgreSQL", "REST APIs"],
      keyImpact: "Çoklu para birimi ve finans takibi sunan mobil ve backend mimarisi sağlandı.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "https://varlik.tahsinelmas.com"
    },
    {
      title: "MTTR Tahminleme Sistemi (ML for Electrical Utilities)",
      description: "Elektrik altyapı şebekelerinde Ortalama Onarım Süresini (MTTR) tahmin etmek için geliştirilmiş makine öğrenmesi hattı.",
      techStack: ["Python", "Machine Learning", "Scikit-Learn", "SQL", "Pandas"],
      keyImpact: "Elektrik şebekeleri için kestirimci bakım ve arıza giderme analizlerini optimize etti.",
      githubLink: "https://github.com/elmastahsin",
      liveLink: "varlik.tahsinelmas.com"
    }
  ],
  experience: [
    {
      company: "IT KRAFT",
      role: "Yazılım Geliştirici & Eğitim Delivery Uzmanı",
      location: "Ankara, Türkiye",
      dateRange: "Eylül 2024 - Günümüz",
      responsibilities: [
        "Mühendislik ekipleri için teknik eğitim ve eğitici eğitimi (train-the-trainers) programlarına liderlik etti, oryantasyon sürelerini hızlandırdı.",
        "LMS (Öğrenme Yönetim Sistemi) platformu backend geliştirmesine katkıda bulundu; Spring (MVC, Data, Security) kullanarak ölçeklenebilir RESTful API'ler tasarladı.",
        "Kurumsal yazılım çözümlerinde temiz mimari, yüksek ölçeklenebilirlik ve kod kalitesini sağladı."
      ],
      keyAchievements: [
        "LMS platformu temel backend özelliklerini geliştirirken eğitici eğitimi programlarına başarıyla liderlik etti.",
        "Performans ve temiz mimari odaklı ölçeklenebilir Spring backend bileşenleri inşa etti."
      ]
    },
    {
      company: "PTTeM",
      role: "Yazılım Geliştirici",
      location: "Ankara, Türkiye",
      dateRange: "Haziran 2023 - Eylül 2024",
      responsibilities: [
        "Yüksek hacimli cüzdan tabanlı hediye kartı platformu için backend mimarisi geliştirdi.",
        "Spring Security, Keycloak ve JWT token'ları ile güvenli kimlik doğrulama mimarisini kurdu.",
        "Docker ve AWS üzerinde mikroservis dağıtımları gerçekleştirdi ve Elasticsearch entegrasyonu sağladı."
      ],
      keyAchievements: [
        "Cüzdan tabanlı hediye kartı mikroservislerini AWS üzerinde Keycloak OAuth2/JWT güvenliği ile yayına aldı.",
        "Hediye kartı servislerinde gerçek zamanlı işlem aramalarını sağlamak için Elasticsearch entegre etti."
      ]
    }
  ],
  education: [
    {
      university: "Orta Doğu Teknik Üniversitesi (METU / ODTÜ)",
      degree: "Lisans (B.Sc.)",
      department: "Bilgisayar Mühendisliği",
      dateRange: "2022 - 2026",
      location: "Ankara, Türkiye",
      coursework: ["Veri Yapıları & Algoritmalar", "İşletim Sistemleri", "Veritabanı Yönetim Sistemleri", "Yazılım Mühendisliği", "Makine Öğrenmesi", "Bilgisayar Ağları"],
      focus: "Bilgisayar mühendisliği, backend mikroservisler, veritabanı sistemleri ve yapay zekâ konularında kapsamlı eğitim."
    }
  ],
  certifications: [
    {
      title: "METU-CENG Demo Day 2025 – 5.lik Ödülü",
      issuer: "Orta Doğu Teknik Üniversitesi (METU / ODTÜ)",
      date: "2025",
      description: "Gurme Restoran Öneri Platformu ile 35 mühendislik projesi arasında 5.lik derecesi elde edildi."
    },
    {
      title: "Java Backend & Bulut Mikroservisleri Uzmanlığı",
      issuer: "Spring, AWS & Docker Teknik Ekosistemleri",
      date: "2024",
      description: "Spring Framework, Mikroservisler, Kafka, Docker, Keycloak ve AWS dağıtımları üzerine uzmanlık."
    }
  ],
  languages: ["Türkçe (Ana Dil)", "İngilizce (Profesyonel / Akıcı)"]
};

// Fallback compatibility export
export const profileData: ProfileData = profileDataEn;
