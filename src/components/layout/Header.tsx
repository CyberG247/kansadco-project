import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import DigitalClock from "@/components/ui/DigitalClock";
import { useTheme } from "@/components/ThemeProvider";
import logoTransparent from "@/assets/logo-transparent.png";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navLinks = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.about'), href: "/about" },
    { name: t('nav.services'), href: "/services" },
    { name: t('nav.projects'), href: "/projects" },
    { name: t('nav.team'), href: "/team" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 hidden md:block">
        <div className="container-custom flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+2348037380434" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" />
              +234 (0) 803 738 0434
            </a>
            <a href="mailto:kansadco@gmail.com" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" />
              kansadco@gmail.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <DigitalClock />
            
            {/* Language Selector */}
            <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors">
               <Globe className="h-4 w-4" />
               <select 
                 className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer outline-none"
                 value={i18n.language}
                 onChange={changeLanguage}
               >
                 <option value="en" className="text-foreground bg-background">English</option>
                 <option value="ha" className="text-foreground bg-background">Hausa</option>
                 <option value="ar" className="text-foreground bg-background">العربية</option>
                 <option value="zh" className="text-foreground bg-background">中文</option>
                 <option value="yo" className="text-foreground bg-background">Yoruba</option>
                 <option value="ig" className="text-foreground bg-background">Igbo</option>
                 <option value="tr" className="text-foreground bg-background">Türkçe</option>
                 <option value="es" className="text-foreground bg-background">Español</option>
               </select>
            </div>

            {/* Dark Mode Toggle - Top Bar */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-primary-foreground/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg"
            : "bg-background/80 backdrop-blur-sm"
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logoTransparent}
                alt="KANSADCO Logo"
                className="h-14 w-auto object-contain"
              />
              <span className="text-2xl font-bold font-display text-primary tracking-tight">KANSADCO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`font-medium transition-colors link-underline py-1 ${
                    location.pathname === link.href
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA Button & Mobile Dark Mode */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <Button asChild className="btn-gold">
                  <Link to="/book-tour">{t('nav.quote')}</Link>
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-background border-t animate-fade-in">
            <div className="container-custom py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`block py-2 font-medium transition-colors ${
                    location.pathname === link.href
                      ? "text-accent"
                      : "text-foreground hover:text-accent"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="border-t border-border pt-4 mt-4 space-y-4">
                <div className="flex items-center justify-between">
                   <DigitalClock />
                   {/* Mobile Dark Mode Toggle */}
                   <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground/80">
                   <Globe className="h-4 w-4" />
                   <select 
                     className="bg-transparent border border-input rounded p-1 text-sm w-full"
                     value={i18n.language}
                     onChange={changeLanguage}
                   >
                     <option value="en">English</option>
                     <option value="ha">Hausa</option>
                     <option value="ar">العربية</option>
                     <option value="zh">中文</option>
                     <option value="yo">Yoruba</option>
                     <option value="ig">Igbo</option>
                     <option value="tr">Türkçe</option>
                     <option value="es">Español</option>
                   </select>
                </div>
              </div>

              <Button asChild className="w-full btn-gold mt-4">
                <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                  {t('nav.quote')}
                </Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
