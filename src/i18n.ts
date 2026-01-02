import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        about: "About",
        services: "Services",
        projects: "Projects",
        team: "Team",
        contact: "Contact",
        quote: "Book a Tour"
      },
      footer: {
        description: "Leading construction and real estate development company in Nigeria.",
        quickLinks: "Quick Links",
        contactInfo: "Contact Info",
        rights: "All rights reserved."
      },
      hero: {
        title: "Turning Land into Landmarks!",
        subtitle: "Excellence in Construction, Real Estate & Property Development.",
        explore: "Explore Projects",
        contact: "Contact Us"
      }
    }
  },
  ha: {
    translation: {
      nav: {
        home: "Gida",
        about: "Game da Mu",
        services: "Ayyuka",
        projects: "Ayyukan",
        team: "Tawaga",
        contact: "Tuntube Mu",
        quote: "Nemi Farashi"
      },
      footer: {
        description: "Babban kamfanin gine-gine da haɓaka gidaje a Najeriya.",
        quickLinks: "Hanyoyin Sauri",
        contactInfo: "Bayanin Tuntuɓa",
        rights: "An kiyaye duk haƙƙoƙi."
      },
      hero: {
        title: "Gina Mafarkai, Tabbatar da Gaskiya",
        subtitle: "Babban kamfanin gine-gine da haɓaka gidaje da ke isar da ƙwarewa a faɗin Najeriya.",
        explore: "Bincika Ayyuka",
        contact: "Tuntube Mu"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        about: "من نحن",
        services: "خدماتنا",
        projects: "مشاريعنا",
        team: "الفريق",
        contact: "اتصل بنا",
        quote: "احصل على عرض سعر"
      },
      footer: {
        description: "شركة رائدة في مجال البناء والتطوير العقاري في نيجيريا.",
        quickLinks: "روابط سريعة",
        contactInfo: "معلومات الاتصال",
        rights: "جميع الحقوق محفوظة."
      },
      hero: {
        title: "بناء الأحلام، تشييد الواقع",
        subtitle: "شركة رائدة في مجال البناء والتطوير العقاري تقدم التميز في جميع أنحاء نيجيريا.",
        explore: "استكشف المشاريع",
        contact: "اتصل بنا"
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: "首页",
        about: "关于我们",
        services: "服务",
        projects: "项目",
        team: "团队",
        contact: "联系我们",
        quote: "获取报价"
      },
      footer: {
        description: "尼日利亚领先的建筑和房地产开发公司。",
        quickLinks: "快速链接",
        contactInfo: "联系方式",
        rights: "版权所有。"
      },
      hero: {
        title: "构筑梦想，建设现实",
        subtitle: "在尼日利亚各地提供卓越服务的顶级建筑和房地产开发公司。",
        explore: "探索项目",
        contact: "联系我们"
      }
    }
  },
  yo: {
    translation: {
      nav: {
        home: "Ile",
        about: "Nipa Wa",
        services: "Awọn Iṣẹ",
        projects: "Awọn Ise agbese",
        team: "Ẹgbẹ",
        contact: "Kan si Wa",
        quote: "Gba Iye"
      },
      footer: {
        description: "Ile-iṣẹ ikole ati idagbasoke ohun-ini gidi ti o ga julọ ni Nigeria.",
        quickLinks: "Awọn Ọna asopọ Yara",
        contactInfo: "Alaye Olubasọrọ",
        rights: "Gbogbo awọn ẹtọ wa ni ipamọ."
      },
      hero: {
        title: "Kọ Awọn ala, Kọ Otitọ",
        subtitle: "Ile-iṣẹ ikole ati idagbasoke ohun-ini gidi ti n pese didara julọ kọja Nigeria.",
        explore: "Ṣawari Awọn Ise agbese",
        contact: "Kan si Wa"
      }
    }
  },
  ig: {
    translation: {
      nav: {
        home: "Ụlọ",
        about: "Banyere Anyị",
        services: "Ọrụ",
        projects: "Ọrụ Anyị",
        team: "Otu",
        contact: "Kpọtụrụ Anyị",
        quote: "Nweta Ọnụahịa"
      },
      footer: {
        description: "Ụlọ ọrụ na-ewu ụlọ na mmepe ụlọ na Naịjirịa.",
        quickLinks: "Njikọ Ngwa Ngwa",
        contactInfo: "Ozi Kpọtụrụ",
        rights: "Ikike niile echekwabara."
      },
      hero: {
        title: "Na-ewu Nrọ, Na-arụ Eziokwu",
        subtitle: "Ụlọ ọrụ na-ewu ụlọ na mmepe ụlọ na-ebute ọmarịcha na Naịjirịa niile.",
        explore: "Chọpụta Ọrụ",
        contact: "Kpọtụrụ Anyị"
      }
    }
  },
  tr: {
    translation: {
      nav: {
        home: "Ana Sayfa",
        about: "Hakkımızda",
        services: "Hizmetler",
        projects: "Projeler",
        team: "Takım",
        contact: "İletişim",
        quote: "Teklif Al"
      },
      footer: {
        description: "Nijerya'nın önde gelen inşaat ve gayrimenkul geliştirme şirketi.",
        quickLinks: "Hızlı Bağlantılar",
        contactInfo: "İletişim Bilgileri",
        rights: "Tüm hakları saklıdır."
      },
      hero: {
        title: "Hayalleri İnşa Ediyoruz, Gerçeği Kuruyoruz",
        subtitle: "Nijerya genelinde mükemmellik sunan birinci sınıf inşaat ve gayrimenkul geliştirme şirketi.",
        explore: "Projeleri Keşfet",
        contact: "Bize Ulaşın"
      }
    }
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        about: "Nosotros",
        services: "Servicios",
        projects: "Proyectos",
        team: "Equipo",
        contact: "Contacto",
        quote: "Obtener Cotización"
      },
      footer: {
        description: "Empresa líder en construcción y desarrollo inmobiliario en Nigeria.",
        quickLinks: "Enlaces Rápidos",
        contactInfo: "Información de Contacto",
        rights: "Todos los derechos reservados."
      },
      hero: {
        title: "Construyendo Sueños, Cimentando Realidades",
        subtitle: "Empresa de construcción y desarrollo inmobiliario de primer nivel que ofrece excelencia en toda Nigeria.",
        explore: "Explorar Proyectos",
        contact: "Contáctenos"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    }
  });

export default i18n;