import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, User } from "lucide-react";

const testimonials = [
  {
    name: "Abdullahi Bala Musa",
    position: "Managing Director, InnovaTech Consultancy Ltd",
    content:
      "KANSADCO's attention to detail and commitment to quality is unmatched. They delivered our office complex ahead of schedule and within budget. Truly a world-class construction company.",
  },
  {
    name: "Alhaji Ibrahim Suleiman",
    position: "Property Investor, Kano",
    content:
      "I've worked with KANSADCO on multiple real estate projects. Their professionalism and integrity set them apart. My investments with them have exceeded all expectations.",
  },
  {
    name: "Dr. Amina Bello",
    position: "Homeowner, Rahmaniyya Estate",
    content:
      "Moving into our KANSADCO home was a dream come true. The quality of construction, the beautiful finishing, and the serene environment - everything exceeded our expectations.",
  },
  {
    name: "Engr. Chukwudi Okonkwo",
    position: "Director, Federal Ministry of Works",
    content:
      "KANSADCO has consistently demonstrated capability in executing major infrastructure projects. Their bridges and roads are built to last, meeting international standards.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-padding bg-cream">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-accent font-medium mb-4">Testimonials</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-card rounded-xl p-8 md:p-12 shadow-lg text-center">
                    <Quote className="h-12 w-12 text-accent/30 mx-auto mb-6" />
                    <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-muted flex items-center justify-center">
                      <User className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="font-display font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-muted-foreground text-sm">{testimonial.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={prev}
              className="p-3 bg-primary rounded-full text-primary-foreground hover:bg-accent transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-accent"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-3 bg-primary rounded-full text-primary-foreground hover:bg-accent transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
