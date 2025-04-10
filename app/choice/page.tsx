"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { products } from "@/lib/data";
import { Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Product } from "@/lib/types";

export default function YourChoicePage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "suggestion", // "suggestion" or "modification"
    product: "",
    details: "",
  });

  useEffect(() => {
      const fetchProducts = async () => {
        try {
          
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
            withCredentials: true
          });
    
          setProducts(response.data.products); 
        } catch (error) {
          console.log("Error fetching cart:", error);
        }
      }
      fetchProducts();
    }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.name || !formData.email || !formData.details) {
      toast({
        title: "Error",
        description: "All fields are required!",
        variant: "destructive",
      });
      return;
    }
  
    try {
      await fetch("https://script.google.com/macros/s/AKfycbxjBo8JtEH2wRLAJ8cbPfKqqNo-nykyUbuXipEtmHbziNvyDLAweKtE8pXpJqeIEXVM/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      toast({
        title: "Suggestion Sent",
        description: "Thank you! We value your input.",
      });
  
      setFormData({ name: "", email: "", type: "suggestion", product: "", details: "" });
    } catch (error) {
      console.error("Submission failed:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="mt-20 relative flex flex-col items-center w-full text-center pt-12 px-6">
        <h1 className="text-2xl md:text-3xl font-medium mb-4 text-black">
          Your Choice Matters!
        </h1>
        <p className="text-md text-muted-foreground max-w-xl">
          Suggest a new product or request modifications to existing ones. <br></br>Your feedback helps us grow!
        </p>
      </section>

      {/* Form Section */}
      <div className="container mx-auto py-12 px-6">
        <div className="bg-card border p-8 rounded-lg shadow-md max-w-lg mx-auto">

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <Input
              type="email"
              placeholder="Your Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Suggestion Type */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-primary text-sm">
                <input
                  type="radio"
                  name="type"
                  value="suggestion"
                  checked={formData.type === "suggestion"}
                  onChange={handleChange}
                  className="accent-green-600"
                />
                <span>New Product Suggestion</span>
              </label>
              <label className="flex items-center gap-2 text-primary text-sm">
                <input
                  type="radio"
                  name="type"
                  value="modification"
                  checked={formData.type === "modification"}
                  onChange={handleChange}
                  className="accent-green-600"
                />
                <span>Modify Existing Product</span>
              </label>
            </div>

            {/* Select Product if modifying */}
            {formData.type === "modification" && (
              <Select
                onValueChange={(value) => setFormData({ ...formData, product: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product._id} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Textarea
              placeholder="Describe your suggestion or modification..."
              name="details"
              rows={4}
              value={formData.details}
              onChange={handleChange}
            />

            <Button type="submit" className="w-full flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Suggestion
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
