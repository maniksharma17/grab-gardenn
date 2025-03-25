"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Mail, User } from "lucide-react";
import Image from "next/image";

export default function AuthPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">      
      <div className="flex-1 container mx-auto py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Image
              src="/logo.jpeg"
              alt="Grab Gardenn"
              width={40}
              height={40}
              className="mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">Welcome to Grab Gardenn</h2>
            <p className="text-muted-foreground">
              Join thousands of health-conscious customers
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="Enter your email" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="Enter your password" className="pl-10" required />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Remember me</span>
                    </label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <div className="bg-card p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="text" placeholder="Enter your name" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="Enter your email" className="pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="Create a password" className="pl-10" required />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Register"}
                  </Button>
                </form>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              By signing up, you&apos;ll receive:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>✨ Exclusive member discounts</li>
              <li>🎁 Special offers and promotions</li>
              <li>📦 Order tracking and history</li>
              <li>💚 Early access to new products</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}