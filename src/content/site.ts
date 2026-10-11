export interface LocalizedString {
  en: string;
  ar: string;
}

export interface LocalizedList {
  en: string[];
  ar: string[];
}

export interface ProfileConfig {
  name: LocalizedString;
  role: LocalizedString;
  photoUrl: string;
  photoAlt: LocalizedString;
  links: {
    mostaql: string;
    khamsat: string;
    upwork: string;
  };
}

export interface NavConfig {
  skipToContent: LocalizedString;
  home: LocalizedString;
  about: LocalizedString;
  services: LocalizedString;
  projects: LocalizedString;
  langToggle: LocalizedString;
  signIn: LocalizedString;
  dashboard: LocalizedString;
}

export interface HeroConfig {
  badge: LocalizedString;
  headline: LocalizedString;
  text: LocalizedString;
  button: LocalizedString;
  photoPlaceholder: LocalizedString;
}

export interface AboutConfig {
  eyebrow: LocalizedString;
  title: LocalizedString;
  text: LocalizedString;
}

export interface ServiceItem {
  id: string;
  order: string;
  title: LocalizedString;
  description: LocalizedString;
  iconType: 'corporate' | 'landing' | 'ecommerce' | 'responsive' | 'dashboard' | 'auth' | 'refinement';
}

export interface ServicesConfig {
  eyebrow: LocalizedString;
  title: LocalizedString;
  items: ServiceItem[];
}

export interface ProjectItem {
  id: string;
  order: number;
  category: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  features: LocalizedList;
  tools: string[];
  imageUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
}

export interface ProjectsConfig {
  eyebrow: LocalizedString;
  title: LocalizedString;
  placeholderLabel: LocalizedString;
  viewProjectBtn: LocalizedString;
  linkComingSoonBtn: LocalizedString;
  readCaseStudyBtn: LocalizedString;
  featuresLabel: LocalizedString;
  technologiesLabel: LocalizedString;
  items: ProjectItem[];
}

export interface SkillCategory {
  id: string;
  title: LocalizedString;
  skills: string[];
}

export interface SkillsConfig {
  eyebrow: LocalizedString;
  title: LocalizedString;
  categories: SkillCategory[];
}

export interface ProcessStep {
  id: string;
  order: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface ProcessConfig {
  eyebrow: LocalizedString;
  title: LocalizedString;
  steps: ProcessStep[];
}

export interface FooterConfig {
  copyright: LocalizedString;
  profileLabels: {
    mostaql: LocalizedString;
    khamsat: LocalizedString;
    upwork: LocalizedString;
  };
}

export interface SiteContent {
  profile: ProfileConfig;
  nav: NavConfig;
  hero: HeroConfig;
  about: AboutConfig;
  services: ServicesConfig;
  projects: ProjectsConfig;
  skills: SkillsConfig;
  process: ProcessConfig;
  footer: FooterConfig;
}

export const site: SiteContent = {
  profile: {
    name: {
      en: 'Akram Sherif',
      ar: 'أكرم شريف',
    },
    role: {
      en: 'Web Developer & Website Designer',
      ar: 'مطوّر ومصمم مواقع ويب',
    },
    photoUrl: '', // Config value: when empty shows placeholder; when set, shows photo
    photoAlt: {
      en: 'Akram Sherif — Web Developer & Website Designer',
      ar: 'أكرم شريف — مطوّر ومصمم مواقع ويب',
    },
    links: {
      mostaql: '',
      khamsat: '',
      upwork: '',
    },
  },

  nav: {
    skipToContent: {
      en: 'Skip to main content',
      ar: 'الانتقال إلى المحتوى الرئيسي',
    },
    home: {
      en: 'Home',
      ar: 'الرئيسية',
    },
    about: {
      en: 'About',
      ar: 'نبذة عني',
    },
    services: {
      en: 'Services',
      ar: 'الخدمات',
    },
    projects: {
      en: 'Projects',
      ar: 'الأعمال',
    },
    langToggle: {
      en: 'EN | عربي',
      ar: 'EN | عربي',
    },
    signIn: {
      en: 'Sign in',
      ar: 'تسجيل الدخول',
    },
    dashboard: {
      en: 'Dashboard',
      ar: 'لوحة التحكم',
    },
  },

  hero: {
    badge: {
      en: 'Web Developer & Website Designer',
      ar: 'مطوّر ومصمم مواقع ويب',
    },
    headline: {
      en: 'Building Modern Websites That Help Businesses Grow.',
      ar: 'أبني مواقع إلكترونية حديثة تساعد أعمالك على النمو.',
    },
    text: {
      en: "I'm a Web Developer and Website Designer focused on creating modern, responsive, user-friendly websites tailored to business needs.",
      ar: 'أنا مطوّر ومصمم مواقع ويب، أركّز على بناء مواقع حديثة ومتجاوبة وسهلة الاستخدام تناسب احتياجات عملك.',
    },
    button: {
      en: 'View My Work',
      ar: 'شاهد أعمالي',
    },
    photoPlaceholder: {
      en: 'Your photo',
      ar: 'صورتك',
    },
  },

  about: {
    eyebrow: {
      en: '01 // ABOUT',
      ar: '01 // نبذة عني',
    },
    title: {
      en: 'About Me',
      ar: 'نبذة عني',
    },
    text: {
      en: "I design and develop websites with a focus on usability, responsive layouts, clean interfaces, functionality and maintainability. I take the time to understand each client's requirements, so the final website fits their business goals.",
      ar: 'أصمّم وأطوّر مواقع الويب مع التركيز على سهولة الاستخدام، والتصميم المتجاوب، والواجهات النظيفة، والوظائف، وسهولة الصيانة. أحرص على فهم متطلبات كل عميل بدقة، ليأتي الموقع النهائي متوافقًا مع أهداف عمله.',
    },
  },

  services: {
    eyebrow: {
      en: '02 // SERVICES',
      ar: '02 // الخدمات',
    },
    title: {
      en: 'Services',
      ar: 'الخدمات',
    },
    items: [
      {
        id: 'business-corporate',
        order: '01',
        title: {
          en: 'Business and Corporate Websites',
          ar: 'مواقع الشركات والأعمال',
        },
        description: {
          en: 'Professional websites that present your business clearly and build trust with your customers.',
          ar: 'مواقع احترافية تعرض نشاطك بوضوح وتبني ثقة عملائك.',
        },
        iconType: 'corporate',
      },
      {
        id: 'landing-pages',
        order: '02',
        title: {
          en: 'Landing Page Design and Development',
          ar: 'تصميم وتطوير صفحات الهبوط',
        },
        description: {
          en: 'Focused single-page designs built to turn visitors into inquiries.',
          ar: 'صفحات واحدة مركّزة تحوّل الزوار إلى استفسارات.',
        },
        iconType: 'landing',
      },
      {
        id: 'ecommerce',
        order: '03',
        title: {
          en: 'E-commerce Website Development',
          ar: 'تطوير المتاجر الإلكترونية',
        },
        description: {
          en: 'Online stores with clear product pages, a cart and a smooth checkout flow.',
          ar: 'متاجر إلكترونية بصفحات منتجات واضحة وسلة مشتريات وتجربة شراء سلسة.',
        },
        iconType: 'ecommerce',
      },
      {
        id: 'responsive-design',
        order: '04',
        title: {
          en: 'Responsive Website Design',
          ar: 'تصميم مواقع متجاوبة',
        },
        description: {
          en: 'Layouts that look and work well on phones, tablets and desktops.',
          ar: 'تصاميم تظهر وتعمل بشكل ممتاز على الهاتف واللوحي والكمبيوتر.',
        },
        iconType: 'responsive',
      },
      {
        id: 'dashboards-accounts',
        order: '05',
        title: {
          en: 'Admin Dashboards and Customer Account Interfaces',
          ar: 'لوحات التحكم وحسابات العملاء',
        },
        description: {
          en: 'Dashboards to manage your content, plus account pages for your customers.',
          ar: 'لوحات تحكم لإدارة المحتوى، وصفحات حسابات لعملائك.',
        },
        iconType: 'dashboard',
      },
      {
        id: 'auth-database',
        order: '06',
        title: {
          en: 'Authentication and Database Integration',
          ar: 'تسجيل الدخول وربط قواعد البيانات',
        },
        description: {
          en: 'Secure sign-in and database connections for sites that need user accounts or stored data.',
          ar: 'تسجيل دخول آمن وربط بقواعد البيانات للمواقع التي تحتاج حسابات مستخدمين أو بيانات محفوظة.',
        },
        iconType: 'auth',
      },
      {
        id: 'ui-refinements',
        order: '07',
        title: {
          en: 'Website Improvements and UI Refinements',
          ar: 'تحسين المواقع وتطوير الواجهات',
        },
        description: {
          en: 'Improve the look and usability of an existing website.',
          ar: 'تحسين مظهر موقعك الحالي وسهولة استخدامه.',
        },
        iconType: 'refinement',
      },
    ],
  },

  projects: {
    eyebrow: {
      en: '03 // PROJECTS',
      ar: '03 // الأعمال',
    },
    title: {
      en: 'Featured Projects',
      ar: 'المشاريع المختارة',
    },
    placeholderLabel: {
      en: 'Project screenshot goes here',
      ar: 'مكان لقطة شاشة المشروع',
    },
    viewProjectBtn: {
      en: 'View Project',
      ar: 'عرض المشروع',
    },
    linkComingSoonBtn: {
      en: 'Link coming soon',
      ar: 'الرابط قريبًا',
    },
    readCaseStudyBtn: {
      en: 'Read case study',
      ar: 'قراءة دراسة الحالة',
    },
    featuresLabel: {
      en: 'Key Features',
      ar: 'المميزات الرئيسية',
    },
    technologiesLabel: {
      en: 'Technologies Used',
      ar: 'التقنيات المستخدمة',
    },
    items: [
      {
        id: 'dahr',
        order: 1,
        category: {
          en: 'E-commerce',
          ar: 'متجر إلكتروني',
        },
        title: {
          en: 'Dahr: Perfume E-commerce Website',
          ar: 'Dahr — متجر عطور إلكتروني',
        },
        description: {
          en: 'A modern e-commerce website concept for a fragrance brand, designed to showcase perfume products through an elegant interface and a smooth shopping experience.',
          ar: 'فكرة متجر إلكتروني حديث لعلامة عطور، مصمّم لعرض المنتجات بواجهة أنيقة وتجربة تسوّق سلسة.',
        },
        features: {
          en: [
            'Product listings and product detail pages',
            'Shopping cart and checkout interface',
            'Responsive layouts',
            'Customer accounts',
            'Admin dashboard and product management',
          ],
          ar: [
            'قوائم المنتجات وصفحات التفاصيل',
            'سلة المشتريات وواجهة الدفع',
            'تصميم متجاوب',
            'حسابات العملاء',
            'لوحة تحكم لإدارة المنتجات',
          ],
        },
        tools: ['HTML', 'CSS', 'JavaScript', 'React', 'Firebase'],
        imageUrl: '', // When empty: shows 'Project screenshot goes here' / 'مكان لقطة شاشة المشروع'
        liveUrl: '', // When empty: shows disabled button with 'Link coming soon' / 'الرابط قريبًا'
        caseStudyUrl: '', // When empty: 'Read case study' does not appear
      },
      {
        id: 'education',
        order: 2,
        category: {
          en: 'Education',
          ar: 'تعليم',
        },
        title: {
          en: 'Education and Study Abroad Website',
          ar: 'موقع تعليمي للدراسة بالخارج',
        },
        description: {
          en: 'A user-friendly educational website designed to present study opportunities, explain available services, and help prospective students navigate the information they need.',
          ar: 'موقع تعليمي سهل الاستخدام يعرض فرص الدراسة ويشرح الخدمات المتاحة ويساعد الطلاب المحتملين على الوصول إلى المعلومات التي يحتاجونها.',
        },
        features: {
          en: [
            'Course catalog with filters',
            'Student registration flow',
            'Lesson player interface',
            'Instructor profiles',
          ],
          ar: [
            'دليل الدورات مع التصفية',
            'مسار تسجيل الطلاب',
            'واجهة تشغيل الدروس',
            'ملفات تعريف المدربين',
          ],
        },
        tools: ['HTML', 'CSS', 'JavaScript', 'React'],
        imageUrl: '',
        liveUrl: '',
        caseStudyUrl: '',
      },
    ],
  },

  skills: {
    eyebrow: {
      en: '04 // SKILLS',
      ar: '04 // المهارات',
    },
    title: {
      en: 'Skills and Technologies',
      ar: 'المهارات والتقنيات',
    },
    categories: [
      {
        id: 'frontend',
        title: {
          en: 'Frontend Development',
          ar: 'تطوير الواجهات الأمامية',
        },
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      },
      {
        id: 'responsive-ui',
        title: {
          en: 'Responsive UI Design',
          ar: 'تصميم واجهات متجاوبة',
        },
        skills: ['Responsive layouts', 'Mobile-first design'],
      },
      {
        id: 'backend',
        title: {
          en: 'Backend and Database Integration',
          ar: 'الخلفية وقواعد البيانات',
        },
        skills: ['Firebase'],
      },
      {
        id: 'auth',
        title: {
          en: 'Authentication and User Management',
          ar: 'تسجيل الدخول وإدارة المستخدمين',
        },
        skills: ['Firebase Authentication'],
      },
      {
        id: 'deployment',
        title: {
          en: 'Website Deployment and Version Control',
          ar: 'النشر والتحكم في الإصدارات',
        },
        skills: ['Firebase Hosting', 'GitHub'],
      },
    ],
  },

  process: {
    eyebrow: {
      en: '05 // PROCESS',
      ar: '05 // طريقة العمل',
    },
    title: {
      en: 'Work Process',
      ar: 'طريقة العمل',
    },
    steps: [
      {
        id: 'discovery',
        order: '01',
        title: {
          en: 'Discovery',
          ar: 'الاكتشاف',
        },
        description: {
          en: "Understand the client's goals and requirements.",
          ar: 'فهم أهداف العميل ومتطلباته.',
        },
      },
      {
        id: 'planning-design',
        order: '02',
        title: {
          en: 'Planning and Design',
          ar: 'التخطيط والتصميم',
        },
        description: {
          en: 'Define the structure, layout and user experience.',
          ar: 'تحديد هيكل الموقع وتخطيط الصفحات وتجربة المستخدم.',
        },
      },
      {
        id: 'development',
        order: '03',
        title: {
          en: 'Development',
          ar: 'التطوير',
        },
        description: {
          en: 'Build and test the website.',
          ar: 'بناء الموقع واختباره.',
        },
      },
      {
        id: 'delivery',
        order: '04',
        title: {
          en: 'Delivery',
          ar: 'التسليم',
        },
        description: {
          en: 'Review, refine and prepare the website for deployment or handoff.',
          ar: 'المراجعة والتحسين وتجهيز الموقع للنشر أو التسليم.',
        },
      },
    ],
  },

  footer: {
    copyright: {
      en: '© 2026 Akram Sherif. All rights reserved.',
      ar: '© 2026 أكرم شريف. جميع الحقوق محفوظة.',
    },
    profileLabels: {
      mostaql: {
        en: 'Mostaql',
        ar: 'مستقل',
      },
      khamsat: {
        en: 'Khamsat',
        ar: 'خمسات',
      },
      upwork: {
        en: 'Upwork',
        ar: 'Upwork',
      },
    },
  },
};
