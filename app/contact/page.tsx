"use client";

import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      toast({ title: "Error", description: "All fields are required!", variant: "destructive" });
      return;
    }
    toast({ title: "Message Sent", description: "We will get back to you soon!" });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Navbar />

      {/* Contact Section */}
      <div className="mt-20 container mx-auto py-12 px-6 text-center">
        {/* Company Logo */}
        <div className="mb-8">
          <Image src="/logo.jpeg" alt="Company Logo" width={50} height={50} className="mx-auto" />
        </div>

        <h2 className="text-3xl font-medium mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
          Have any questions? We&apos;d love to hear from you! Reach out via the form below or contact us directly.
        </p>

        {/* Contact Form */}
        <div className="bg-card p-8 rounded-lg shadow-lg max-w-2xl mx-auto mb-8">
          <h3 className="text-lg font-semibold mb-4 text-left">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-1"
            />
            <Input
              type="email"
              placeholder="Your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="col-span-1"
            />
            <Input
              type="tel"
              placeholder="Your Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="col-span-1"
            />
            <Input
              type="text"
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="col-span-1"
            />
            <Textarea
              placeholder="Your Message"
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="col-span-2"
            />
            <Button type="submit" className="w-full flex items-center gap-2 col-span-2">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </div>
        <p className="mb-4 font-medium text-xl">OR</p>
        {/* Contact Details - Stacked */}
        <h3 className="text-3xl font-medium mb-4">Reach out here</h3>
        <div className="flex flex-col items-center gap-6 max-w-xl mx-auto">
          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border w-full">
            <MapPin className="text-[var(--primary)] h-6 w-6" />
            <div className="flex flex-col items-start">
              <h4 className="font-semibold">Our Office</h4>
              <p className="text-sm text-left text-muted-foreground">Grab Gardenn Healthy Foods
Khasra No. – 96, Salempur Rajputana Industrial Area,
Roorkee, Uttarakhand -247667</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border w-full">
            <Phone className="text-[var(--primary)] h-6 w-6" />
            <div className="flex flex-col items-start">
              <h4 className="font-semibold">Phone</h4>
              <p className="text-sm text-muted-foreground">+91 9286686912</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-card rounded-lg border w-full">
            <Mail className="text-[var(--primary)] h-6 w-6" />
            <div className="flex flex-col items-start">
              <h4 className="font-semibold">Email</h4>
              <p className="text-sm text-muted-foreground">grabgardenn@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
