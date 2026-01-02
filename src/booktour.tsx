import Layout from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, CheckCircle } from "lucide-react";
import logoTransparent from "@/assets/logo-transparent.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BookTour = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    interest: "residential",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(true);
    // In a real app, you would send the data to a backend here
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-24 bg-primary">
        <div className="container-custom">
          <div className="max-w-3xl">
            <span className="inline-block text-accent font-medium mb-4">Book a Tour</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
              Experience Our Properties Firsthand
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Schedule a personalized tour of our ongoing projects and completed developments.
              Our team will guide you through the details and answer all your questions.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Form */}
            <div className="bg-card rounded-xl p-8 shadow-lg border border-border">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Schedule Your Visit
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Area of Interest
                    </label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="residential">Residential Properties</option>
                      <option value="commercial">Commercial Properties</option>
                      <option value="investment">Investment Opportunities</option>
                      <option value="land">Land Acquisition</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Date *
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preferred Time *
                    </label>
                    <div className="relative">
                      <Input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Message (Optional)
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about what you're looking for..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button type="submit" className="w-full btn-gold text-lg py-6">
                  Confirm Booking
                </Button>
              </form>
            </div>

            {/* Info Box */}
            <div className="space-y-8">
              <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
                <h3 className="font-display text-xl font-bold text-primary mb-4">
                  Why Tour With Us?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                    <p className="text-foreground/80">
                      <span className="font-semibold text-foreground">Expert Guidance:</span> Our
                      agents are knowledgeable about every detail of construction and design.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                    <p className="text-foreground/80">
                      <span className="font-semibold text-foreground">See Quality Firsthand:</span>{" "}
                      Inspect the premium materials and finishings we use in all our projects.
                    </p>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                    <p className="text-foreground/80">
                      <span className="font-semibold text-foreground">Personalized Experience:</span>{" "}
                      We tailor the tour to focus on properties that match your specific needs and budget.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">
                  Contact Info
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                    <p className="text-muted-foreground">
                      Rahmaniyya Estate 1, Ajose Adeogun Street, Utako 900108, Abuja
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Clock className="w-5 h-5 text-accent shrink-0" />
                    <p className="text-muted-foreground">Mon - Sat: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Success Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md bg-background border-accent/20">
          <DialogHeader className="flex flex-col items-center text-center space-y-4 pt-4">
            <div className="w-24 h-24 mb-2">
               <img 
                 src={logoTransparent} 
                 alt="KANSADCO" 
                 className="w-full h-full object-contain"
               />
            </div>
            <DialogTitle className="text-2xl font-display font-bold text-primary">
              Congratulations!
            </DialogTitle>
            <div className="text-accent text-lg font-medium">
              Request Received
            </div>
          </DialogHeader>
          
          <div className="text-center py-4 px-2 space-y-4">
            <p className="text-foreground/80 leading-relaxed">
              Your Book a Tour Request has been received and it is being reviewed by our Team.
            </p>
            <p className="text-muted-foreground text-sm italic">
              Kindly exercise patience while we process your request. We will contact you shortly to confirm your appointment.
            </p>
          </div>

          <div className="flex justify-center pb-4">
            <Button 
              onClick={() => setShowModal(false)}
              className="btn-gold min-w-[150px]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BookTour;
