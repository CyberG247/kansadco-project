import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroEstate from "@/assets/hero-estate.jpg";
import heroConstruction from "@/assets/hero-construction.jpg";

const slides = [
  {
    image: heroEstate,
    title: "Building Tomorrow's Legacy Today",
    subtitle: "Premier Real Estate & Property Development",
    description:
      "Creating world-class residential estates and commercial properties across Nigeria. Excellence in every foundation we lay.",
  },
  {
    image: heroConstruction,
    title: "Engineering Excellence",
    subtitle: "Construction & Infrastructure",
    description:
      "From roads to bridges, high-rises to industrial facilities – we deliver projects that stand the test of time.",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-dark/90 via-slate-dark/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full container-custom flex items-center">
            <div className="max-w-2xl text-primary-foreground">
              <span
                className={`inline-block text-accent font-medium mb-4 ${
                  index === currentSlide ? "animate-fade-up" : ""
                }`}
              >
                {slide.subtitle}
              </span>
              <h1
                className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                  index === currentSlide ? "animate-fade-up animation-delay-200" : ""
                }`}
              >
                {slide.title}
              </h1>
              <p
                className={`text-lg text-primary-foreground/90 mb-8 max-w-xl ${
                  index === currentSlide ? "animate-fade-up animation-delay-400" : ""
                }`}
              >
                {slide.description}
              </p>
              <div
                className={`flex flex-wrap gap-4 ${
                  index === currentSlide ? "animate-fade-up animation-delay-600" : ""
                }`}
              >
                <Button asChild size="lg" className="btn-gold">
                  <Link to="/projects">View Projects</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-primary-foreground text-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-background/20 backdrop-blur-sm rounded-full text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-background/20 backdrop-blur-sm rounded-full text-primary-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-accent"
                : "w-3 bg-primary-foreground/50 hover:bg-primary-foreground"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
