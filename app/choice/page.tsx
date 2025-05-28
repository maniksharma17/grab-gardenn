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
    type: "suggestion",
    product: "",
    details: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
          {
            withCredentials: true,
          }
        );

        setProducts(response.data.products);
      } catch (error) {
        console.log("Error fetching cart:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      const url =
        "https://script.google.com/macros/s/AKfycbzNQXQN6UlZwVo_BYTBGgDcoXLFC_0jJnCX-qQUPa-wi_I6bXJrRCSylBOM9J_c77RU/exec";
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `Name=${formData.name}&Email=${formData.email}&Type=${formData.type}&Product=${formData.product}&Details=${formData.details}`,
      });

      toast({
        title: "Suggestion Sent",
        description: "Thank you! We value your input.",
      });

      setFormData({
        name: "",
        email: "",
        type: "suggestion",
        product: "",
        details: "",
      });
    } catch (error) {
      console.log("Submission failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex items-center justify-center relative bg-primary mt-20 h-[200px]">
        <div>
          <h1 className="text-4xl font-semibold text-white text-center">
            Your Choice Matters!
          </h1>
          <p className="text-center text-sm text-gray-100 mt-2">
            Suggest a new product or request modifications to existing ones.
            Your feedback helps us grow!
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-6">
        <div className="p-8 rounded-lg max-w-5xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-8"
          >
            {/* Left Column */}
            <div className="flex-1 space-y-4">
              <Input
                type="text"
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white h-12 text-lg text-primary placeholder:text-gray-500 focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
              <Input
                type="email"
                placeholder="Your Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white h-12 text-lg text-primary placeholder:text-gray-500 focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />

              {/* Suggestion Type */}
              <div className="flex gap-4">
                <div
                  onClick={() =>
                    setFormData({ ...formData, type: "suggestion" })
                  }
                  className={`cursor-pointer px-4 py-2 rounded-md border transition-colors duration-200 text-sm font-medium ${
                    formData.type === "suggestion"
                      ? "bg-green-100 border-green-600 text-green-800"
                      : "bg-muted border-muted-foreground text-muted-foreground"
                  }`}
                >
                  New Product Suggestion
                </div>

                <div
                  onClick={() =>
                    setFormData({ ...formData, type: "modification" })
                  }
                  className={`cursor-pointer px-4 py-2 rounded-md border transition-colors duration-200 text-sm font-medium ${
                    formData.type === "modification"
                      ? "bg-green-100 border-green-600 text-green-800"
                      : "bg-muted border-muted-foreground text-muted-foreground"
                  }`}
                >
                  Modify Existing Product
                </div>
              </div>

              {formData.type === "modification" && (
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, product: value })
                  }
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
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col space-y-4">
              <Textarea
                placeholder="Describe your suggestion or modification..."
                name="details"
                rows={6}
                value={formData.details}
                onChange={handleChange}
                className="bg-white text-lg text-primary placeholder:text-gray-500 focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />

              <Button type="submit" className="w-full flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Suggestion
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
