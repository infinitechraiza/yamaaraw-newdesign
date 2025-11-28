"use client";
export const dynamic = "force-dynamic";
import type React from "react";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import ETrikeLoader from "@/components/ui/etrike-loader";
import Footer from "@/components/layout/footer";
import { useETrikeToast } from "@/components/ui/toast-container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ContactPage() {
  const toast = useETrikeToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          "Message Sent Successfully! 📧",
          "Thank you for your message! We'll get back to you within 24 hours.",
          {
            label: "View FAQ",
            onClick: () => {
              document
                .getElementById("faq-section")
                ?.scrollIntoView({ behavior: "smooth" });
            },
          }
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(
          "Failed to Send Message",
          data.message || "Please check your information and try again.",
          {
            label: "Try Again",
            onClick: () => {
              document.getElementById("name")?.focus();
            },
          }
        );
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error(
        "Connection Error",
        "Unable to send your message. Please check your internet connection and try again.",
        {
          label: "Retry",
          onClick: () => handleSubmit(e),
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <ETrikeLoader />
        </div>
      ) : (
        <>
          <Header />
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-blue-600 to-blue-200 text-black py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4 bg-white/30 text-white border-white/30 hover:bg-white/40 backdrop-blur-sm px-2 py-1.5">
                Get In Touch
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Contact
                <span className="block bg-gradient-to-l from-blue-700 to-violet-700 bg-clip-text text-transparent">
                  Us
                </span>
              </h1>
              <p className="text-xl text-blue-900/90 leading-relaxed mb-8 max-w-3xl mx-auto leading-relaxed">
                Ready to go electric? We're here to help you find the perfect
                electric vehicle for your needs.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Contact Information */}
              <div className="bg-card pt-12 text-left">
                {/* Header */}
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Get in Touch
                </h2>

                <div className="w-full grid md:grid-cols-4 gap-8 mb-12">
                  {/* Address */}
                  <div className="bg-card border border-border border-blue-200 rounded-xl p-8 text-xs text-center shadow-sm hover:shadow-lg transition-shadow transition-shadowbg-gradient-to-br from-blue-50 to-violet-50 border-blue-200 hover:shadow-lg hover:scale-105 transition-all ">
                    <div className="flex items-start justify-center mx-auto space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <MapPin className="w-8 h-8 text-white dark:text-blue-400 " />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Our Office
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      123 Electric Avenue
                      <br />
                      Makati City, Metro Manila
                      <br />
                      Philippines 1200
                    </p>
                  </div>

                  {/* Contact */}
                  <div className="bg-card border border-border rounded-xl p-8 text-xs text-center shadow-sm hover:shadow-lg transition-shadow transition-shadowbg-gradient-to-br from-blue-50 to-violet-50 border-blue-200 hover:shadow-lg hover:scale-105 transition-all ">
                    <div className="flex items-start justify-center mx-auto space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Phone className="w-8 h-8 text-white dark:text-blue-400 " />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Phone Numbers
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Sales: +63 (02) 123-4567
                      <br />
                      Support: +63 (02) 765-4321
                      <br />
                      Mobile: +63 917 123 4567
                    </p>
                  </div>

                  {/* Email */}
                  <div className="bg-card border border-border rounded-xl p-8 text-xs text-center shadow-sm hover:shadow-lg transition-shadow transition-shadowbg-gradient-to-br from-blue-50 to-violet-50 border-blue-200 hover:shadow-lg hover:scale-105 transition-all ">
                    <div className="flex items-start justify-center mx-auto space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Mail className="w-8 h-8 text-white dark:text-blue-400 " />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Email Addresses
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      General: info@yamaaraw.com
                      <br />
                      Sales: sales@yamaaraw.com
                      <br />
                      Support: support@yamaaraw.com
                    </p>
                  </div>

                  {/* Business Hours */}
                  <div className="bg-card border border-border rounded-xl p-8 text-xs text-center shadow-sm hover:shadow-lg transition-shadow transition-shadowbg-gradient-to-br from-blue-50 to-violet-50 border-blue-200 hover:shadow-lg hover:scale-105 transition-all ">
                    <div className="flex items-start justify-center mx-auto space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Clock className="w-8 h-8 text-white dark:text-blue-400 " />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Business Hours
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Form */}
                <div className="w-full h-full bg-card text-left hover:shadow-lg border border-border p-8 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="h-12 py-2 border border-border text-foreground paceholdermuted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-blue-500 rounded-xl"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="h-12 py-2 border border-border text-foreground paceholdermuted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-blue-500 rounded-xl"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          className="h-12 py-2 border border-border text-foreground paceholdermuted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-blue-500 rounded-xl"
                          placeholder="+63 XXX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full h-12 py-2 border border-border text-foreground paceholdermuted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-blue-500 rounded-xl"
                        >
                          <option value="">Select a subject</option>
                          <option value="product-inquiry">
                            Product Inquiry
                          </option>
                          <option value="sales">Sales</option>
                          <option value="support">Technical Support</option>
                          <option value="partnership">Partnership</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="h-full w-full px-4 py-3 border border-border text-foreground paceholdermuted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-blue-500 rounded-xl resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r rounded-full from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 hover:from-blue-700 hover:to-red-700 h-12 rounded-xl font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Map */}
                <div className="h-full min-h-82 g-card border border-border rounded-xl overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30894.245537999635!2d121.00381891225065!3d14.55453013786624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90264a0ed01%3A0x2b066ed57830cace!2sMakati%20City%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1763621492606!5m2!1sen!2sph"
                    width="600"
                    height="600"
                    style={{ border: 0, minHeight: "450px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section id="faq-section" className="py-20 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <Badge className="mb-4 px-2 py-1.5 bg-blue-100 text-blue-600 border-blue-200">
                  FAQ
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-lg text-muted-foreground">
                  Find answers to common questions about our products and
                  services.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question:
                      "What is the warranty period for your electric vehicles?",
                    answer:
                      "All our electric vehicles come with a comprehensive 2-year warranty covering battery, motor, and electrical components.",
                  },
                  {
                    question: "Do you offer financing options?",
                    answer:
                      "Yes, we partner with leading financial institutions to offer flexible financing options with competitive interest rates.",
                  },
                  {
                    question: "How long does it take to charge the battery?",
                    answer:
                      "Charging time varies by model, but typically ranges from 4-8 hours for a full charge using standard household outlets.",
                  },
                  {
                    question: "Do you provide after-sales service?",
                    answer:
                      "We have over 100 service centers nationwide and provide comprehensive after-sales support.",
                  },
                ].map((faq, index) => (
                  <div key={index}>
                    <Accordion type="single" collapsible>
                      <AccordionItem
                        value={`faq-${index}`}
                        className="bg-card h-50% border border-border rounded-xl overflow-hidden transition-all hover:shadow-lg p-6"
                      >
                        {/* Question */}
                        <AccordionTrigger>
                          <h3 className="text-lg font-medium text-foreground flex items-center">
                            <MessageSquare className="w-5 h-5 text-blue-500 mr-3 pointer-events-none no-underline" />
                            {faq.question}
                          </h3>
                        </AccordionTrigger>
                        {/* Answer */}
                        <AccordionContent value={`faq-${index}`}>
                          <p className="text-gray-600 leading-relaxed ml-8">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </>
      )}
    </div>
  );
}
