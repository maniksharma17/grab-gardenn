"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Mail, Phone, User, Eye, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";
import { useRouter } from "next/navigation";


interface RegisterDataTypes {
  name: string,
  email: string,
  password: string,
  phone: string,
  address: Address[]
}

type Address = {
  street: string;
  streetOptional: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string,
  name: string,
};

export default function AuthPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<RegisterDataTypes>({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: []
  });
  const [address, setAddress] = useState<Address>({
    street: "",
    streetOptional: "",
    city: "",
    state: "",
    country: "India",
    zipCode: "",
    name: "",
    phone: ""
  })
  const setUser = useSetRecoilState(userState);
  const user = useRecoilValue(userState)
  const router = useRouter();

  useEffect(() => {
    if (user?.isLoggedIn) {
      router.replace("/products");
    } 
  }, [user, router]);
  
  const handleSubmit = async (
    e: React.FormEvent,
    type: "login" | "register"
  ) => {
    e.preventDefault();
    setIsLoading(true);

    const endpoint = type === "login" ? "/api/users/login" : "/api/users/register";
    
    const body = type === "login" ? loginData : registerData;
    

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: 'include'
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if(data.error){
        toast({
          title: "Error",
          description: data.message
      });
      return;
      }

      setUser({
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        token: data.token,
        isLoggedIn: true,
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
        primaryAddress: 0,
      });

      localStorage.setItem("user", JSON.stringify({
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        token: data.token,
        isLoggedIn: true,
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
      }));
      localStorage.setItem("token", data.token);

      toast({
        title: "Success",
        description:
          type === "login"
            ? "You have been logged in successfully"
            : "Account created successfully",
      });

      router.replace('/products');
      
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mb-4"
                  onClick={() => console.log("Handle Google Auth here")}
                >
                  <Image
                    src="/google-icon.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                  Continue with Google
                </Button>

                <div className="flex flex-row items-center justify-center gap-2 px-8">
                  <div className="border-t w-full"></div>
                  <p className="text-gray-400 text-sm">OR</p>
                  <div className="w-full border-t"></div>
                </div>

                <form
                  onSubmit={(e) => handleSubmit(e, "login")}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          placeholder="Enter your password"
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground text-sm hover:underline"
                        >
                          {showPassword ? (
                            <Eye strokeWidth={1.2} className="h-5 w-5" />
                          ) : (
                            <EyeOffIcon strokeWidth={1.2} className="h-5 w-5" />
                          )}
                        </button>
                      </div>{" "}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2"></label>
                    <a
                      href="#"
                      className="text-sm text-primary hover:underline"
                    >
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

                <form
                  onSubmit={(e) => handleSubmit(e, "register")}
                  className="space-y-4"
                >
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2 mb-4"
                    onClick={() => console.log("Handle Google Auth here")}
                  >
                    <Image
                      src="/google-icon.svg"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    Continue with Google
                  </Button>

                  <div className="flex flex-row items-center justify-center gap-2 px-8">
                    <div className="border-t w-full"></div>
                    <p className="text-gray-400 text-sm">OR</p>
                    <div className="w-full border-t"></div>
                  </div>

                  <h4 className="border-t pt-4 mt-8 text-gray-600 text-sm font-medium">PERSONAL INFORMATION</h4>

                  <div className="">
                    <label className="text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={registerData.name}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter your name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="">
                    <label className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={registerData.email}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="">
                    <label className="text-sm font-medium">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="Enter your phone number"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="">
                    <label className="text-sm font-medium">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        placeholder="Create a password"
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground text-sm hover:underline"
                      >
                        {showPassword ? (
                          <Eye strokeWidth={1.2} className="h-5 w-5" />
                        ) : (
                          <EyeOffIcon strokeWidth={1.2} className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                    <h4 className="border-t pt-4 mt-8 text-gray-600 text-sm font-medium">SHIPPING INFO</h4>
                    <div className="space-y-2">
                    <div className="">
                      <label className="text-xs font-medium ml-1">Delivery Name</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={address.name}
                          onChange={(e) => {
                            setAddress({...address, name: e.target.value})
                            setRegisterData({
                              ...registerData,
                              address: [address]
                          });
                        }}
                          placeholder=""
                          className=""
                          required
                        />
                      </div>
                    </div>

                    <div className="">
                      <label className="text-xs font-medium ml-1">Delivery Phone</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={address.phone}
                          onChange={(e) => {
                            setAddress({...address, phone: e.target.value})
                            setRegisterData({
                              ...registerData,
                              address: [address]
                          });
                        }}
                          placeholder=""
                          className=""
                          required
                        />
                      </div>
                    </div>

                    <div className="">
                      <label className="text-xs font-medium ml-1">Street 1</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={address.street}
                          onChange={(e) => {
                            setAddress({...address, street: e.target.value})
                            setRegisterData({
                              ...registerData,
                              address: [address]
                          });
                        }}
                          placeholder=""
                          className=""
                          required
                        />
                      </div>
                    </div>

                    <div className="">
                      <label className="text-xs font-medium ml-1">Street 2 <span className="text-xs">(Optional)</span></label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={address.streetOptional}
                          onChange={(e) => {
                            setAddress({...address, streetOptional: e.target.value})
                            setRegisterData({
                              ...registerData,
                              address: [address]
                          });
                          }}
                          placeholder=""
                          className=""
                        />
                    </div>
                  </div>

                  <div className="flex flex-row gap-2">
                    <div className="">
                      <label className="text-xs font-medium ml-1">City</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={address.city}
                          onChange={(e) => {
                            setAddress({...address, city: e.target.value})
                            setRegisterData({
                              ...registerData,
                              address: [address]
                          });
                          }}
                          placeholder=""
                          className=""
                        />
                    </div>
                  </div>
                    <div className="">
                      <label className="text-xs font-medium ml-1">State</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={address.state}
                          onChange={(e) => {
                            setAddress({...address, state: e.target.value})
                            setRegisterData({
                              ...registerData,
                              address: [address]
                          });
                          }}
                          placeholder=""
                          className=""
                        />
                    </div>

                  
                  </div>
                  </div>
                  <div className="">
                      <label className="text-xs font-medium ml-1">Pin Code</label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={address.zipCode}
                          onChange={(e) => {
                            setAddress({...address, zipCode: e.target.value})
                            setRegisterData({
                              ...registerData,
                              address: [address]
                          });
                          }}
                          placeholder=""
                          className=""
                        />
                    </div>
                    </div>
                    
                  </div>
                  <p className="text-sm text-muted-foreground">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
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
