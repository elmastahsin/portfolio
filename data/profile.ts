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
      aboutTitle: "About",
      aboutSubtitle: "How I work and what I care about.",
      skillsTitle: "Tech specs",
      skillsSubtitle: "The tools I reach for every day.",
      projectsTitle: "Projects",
      projectsSubtitle: "Things I've designed, built and shipped.",
      experienceTitle: "Experience",
      experienceSubtitle: "Where I've worked.",
      educationTitle: "Education",
      educationSubtitle: "Where I studied.",
      certificationsTitle: "Awards",
      certificationsSubtitle: "Recognition along the way.",
      contactTitle: "Contact",
      contactSubtitle: "Tell me about your project or role.",
      blogTitle: "Writing",
      blogSubtitle: "Notes on backend engineering.",
    },
    buttons: {
      getInTouch: "Get In Touch",
      downloadCv: "Download CV",
      viewProject: "View Project",
      viewCode: "View Code",
      sendMessage: "Send message",
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
      aboutSubtitle: "Nasıl çalıştığım ve neyi önemsediğim.",
      skillsTitle: "Teknik özellikler",
      skillsSubtitle: "Her gün kullandığım araçlar.",
      projectsTitle: "Projeler",
      projectsSubtitle: "Tasarlayıp geliştirdiğim ve yayına aldığım işler.",
      experienceTitle: "Deneyim",
      experienceSubtitle: "Çalıştığım yerler.",
      educationTitle: "Eğitim",
      educationSubtitle: "Okuduğum yer.",
      certificationsTitle: "Ödüller",
      certificationsSubtitle: "Yol boyunca gelen takdirler.",
      contactTitle: "İletişim",
      contactSubtitle: "Projenizden veya pozisyondan bahsedin.",
      blogTitle: "Yazılar",
      blogSubtitle: "Backend mühendisliği üzerine notlar.",
    },
    buttons: {
      getInTouch: "İletişime Geç",
      downloadCv: "CV İndir",
      viewProject: "Projeyi İncele",
      viewCode: "Kodu İncele",
      sendMessage: "Mesajı gönder",
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
  title: "Computer Engineer & Backend Developer",
  tagline: "Computer Engineer & Backend Developer with 3+ years experience in Spring, Microservices, Docker, AWS, and ML Pipelines.",
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
    bio: "Computer Engineer with 3+ years of experience specializing in Java Backend Development and Software Architecture. Proficient in SDLC and Agile methodologies, with strong expertise in Core Java, Spring Framework, Microservices, Kafka, Docker, and AWS. Proven success in developing scalable backend applications and high-performance enterprise systems.",
    currentRole: "Computer Engineer & Backend Developer at IT KRAFT",
    educationSummary: "B.Sc. in Computer Engineering from Middle East Technical University (METU / ODTÜ)",
    careerFocus: "Architecting scalable enterprise backend applications, microservices, and high-performance software systems.",
    interests: ["Java Backend Architecture", "Spring Framework & Microservices", "Machine Learning & LLM Pipelines", "Cloud & DevOps (Docker, AWS, Kafka)", "Software Engineering & Clean Code"]
  },
  skills: [
    { title: "Programming Languages", items: ["Java", "Python", "Swift", "C", "C++", "SQL", "TypeScript"] },
    { title: "Backend & Tech", items: ["Spring Framework", "FastAPI", "Hibernate", "Microservices", "Kafka", "Docker", "AWS"] },
    { title: "Databases & Tools", items: ["PostgreSQL", "MySQL", "Elasticsearch", "Postman", "Swagger", "Git"] },
    { title: "Mobile & Desktop", items: ["SwiftUI", "macOS Menu Bar Apps", "React Native"] }
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
      title: "Spine – AirPods Posture Coach for macOS",
      description: "An open-source macOS menu bar app that tracks head tilt through the motion sensors in AirPods against a calibrated baseline and gives a short spoken nudge after sustained slouching. Fully on-device: no camera, no network calls, no third-party dependencies.",
      techStack: ["Swift", "SwiftUI", "CoreMotion", "XCTest", "Homebrew"],
      keyImpact: "Shipped as an MIT-licensed app installable via a personal Homebrew tap, with unit-tested posture-evaluation and calibration logic.",
      githubLink: "https://github.com/elmastahsin/spine"
    },
    {
      title: "FocusBlocker – macOS Website & App Blocker",
      description: "A macOS menu bar app that blocks distracting websites and apps for a set time. A SwiftUI front end talks to a privileged daemon that enforces blocks via the hosts file, DNS cache flushes and app termination, with shared logic in a separate Swift package.",
      techStack: ["Swift", "SwiftUI", "Swift Package Manager", "launchd Daemon", "Homebrew"],
      keyImpact: "Designed a split app/daemon architecture with code-signing checks so blocks can't be bypassed by simply quitting the app.",
      githubLink: "https://github.com/elmastahsin/focusblocker"
    },
    {
      title: "UNO-like Multiplayer Game Engine",
      description: "A real-time multiplayer card game system implementing core game logic, leaderboards, and JWT-based authentication to manage session integrity and multiplayer state flow.",
      techStack: ["Java", "Spring Boot", "JavaFX", "JWT", "REST APIs"],
      keyImpact: "Engineered real-time multiplayer state orchestration and secure JWT authentication.",
      githubLink: "https://github.com/elmastahsin/CENG453_20242_Group3_frontend"
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
      githubLink: "https://github.com/elmastahsin"
    }
  ],
  experience: [
    {
      company: "IT KRAFT",
      role: "Software Developer & Backend Engineer",
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
  title: "Computer Engineer & Backend Developer",
  tagline: "Spring, Mikroservisler, Docker, AWS ve ML Pipeline'larında 3+ yıl deneyimli Bilgisayar Mühendisi & Backend Geliştirici.",
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
    bio: "Java Backend Geliştirme ve Yazılım Mimarisi süreçlerinde 3 yılı aşkın deneyime sahip Bilgisayar Mühendisi. SDLC ve Çevik (Agile) metodolojilerde uzman; Core Java, Spring Framework, Mikroservisler, Kafka, Docker ve AWS konularında güçlü teknik yetkinliğe sahip. Ölçeklenebilir backend uygulamaları ve yüksek performanslı kurumsal sistemler geliştirmede kanıtlanmış başarı.",
    currentRole: "IT KRAFT şirketinde Bilgisayar Mühendisi & Backend Geliştirici",
    educationSummary: "Orta Doğu Teknik Üniversitesi (METU / ODTÜ) — Bilgisayar Mühendisliği (Lisans)",
    careerFocus: "Ölçeklenebilir kurumsal backend uygulamaları, mikroservis mimarileri ve yüksek performanslı yazılım sistemleri geliştirmek.",
    interests: ["Java Backend Mimarisi", "Spring Framework & Mikroservisler", "Makine Öğrenmesi & LLM Hatları", "Bulut & DevOps (Docker, AWS, Kafka)", "Yazılım Mühendisliği & Temiz Kod"]
  },
  skills: [
    { title: "Programlama Dilleri", items: ["Java", "Python", "Swift", "C", "C++", "SQL", "TypeScript"] },
    { title: "Backend & Teknolojiler", items: ["Spring Framework", "FastAPI", "Hibernate", "Mikroservisler", "Kafka", "Docker", "AWS"] },
    { title: "Veritabanları & Araçlar", items: ["PostgreSQL", "MySQL", "Elasticsearch", "Postman", "Swagger", "Git"] },
    { title: "Mobil & Masaüstü", items: ["SwiftUI", "macOS Menu Bar Apps", "React Native"] }
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
      title: "Spine – macOS için AirPods Duruş Koçu",
      description: "AirPods'taki hareket sensörleriyle baş eğimini kalibre edilmiş referansa göre takip eden ve uzun süre kambur durulduğunda kısa bir sesli uyarı veren açık kaynak macOS menü çubuğu uygulaması. Tamamen cihaz üzerinde çalışır: kamera, ağ çağrısı veya üçüncü parti bağımlılık yok.",
      techStack: ["Swift", "SwiftUI", "CoreMotion", "XCTest", "Homebrew"],
      keyImpact: "MIT lisansıyla, kişisel Homebrew tap üzerinden kurulabilir şekilde yayınlandı; duruş değerlendirme ve kalibrasyon mantığı birim testleriyle kapsandı.",
      githubLink: "https://github.com/elmastahsin/spine"
    },
    {
      title: "FocusBlocker – macOS Site ve Uygulama Engelleyici",
      description: "Dikkat dağıtan web sitelerini ve uygulamaları belirli bir süre engelleyen macOS menü çubuğu uygulaması. SwiftUI arayüzü; hosts dosyası, DNS önbellek temizliği ve uygulama sonlandırma ile engeli uygulayan ayrıcalıklı bir daemon ile haberleşir, ortak mantık ayrı bir Swift paketinde tutulur.",
      techStack: ["Swift", "SwiftUI", "Swift Package Manager", "launchd Daemon", "Homebrew"],
      keyImpact: "Engellerin uygulamayı kapatarak aşılamaması için kod imzası doğrulamalı uygulama/daemon mimarisi tasarlandı.",
      githubLink: "https://github.com/elmastahsin/focusblocker"
    },
    {
      title: "UNO Benzeri Çok Oyunculu Oyun Motoru",
      description: "Çekirdek oyun mantığını, liderlik tablosunu ve oturum güvenliğini sağlayan JWT tabanlı kimlik doğrulama mimarisini içeren gerçek zamanlı çok oyunculu kart oyunu sistemi.",
      techStack: ["Java", "Spring Boot", "JavaFX", "JWT", "REST APIs"],
      keyImpact: "Gerçek zamanlı çok oyunculu durum yönetimi ve güvenli JWT doğrulama altyapısı kuruldu.",
      githubLink: "https://github.com/elmastahsin/CENG453_20242_Group3_frontend"
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
      githubLink: "https://github.com/elmastahsin"
    }
  ],
  experience: [
    {
      company: "IT KRAFT",
      role: "Yazılım Geliştirici & Backend Mühendisi",
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
