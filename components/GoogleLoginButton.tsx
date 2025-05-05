import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast"; // Adjust this to your actual toast import
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";

export default function GoogleLoginButton() {
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    // Load the Google Identity API script if not already loaded
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        setGoogleScriptLoaded(true);
      };
      document.body.appendChild(script);
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      setGoogleScriptLoaded(true);
    }
  }, []);

  useEffect(()=>{
    const handleGoogleSignIn = () => {
      if (window.google && window.google.accounts) {
        // Initialize the Google accounts API
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: any) => {
            try {
              const decoded = JSON.parse(atob(response.credential.split(".")[1]));
              const { name, email } = decoded;
  
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/oauth-login`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ name, email }),
                  credentials: "include",
                }
              );
  
              const data = await res.json();
  
              const userData = {
                _id: data.user._id,
                name: data.user.name,
                email: data.user.email,
                phone: data.user.phone,
                address: data.user.address,
                token: data.token,
                isLoggedIn: true,
                createdAt: data.user.createdAt,
                updatedAt: data.user.updatedAt,
              };
  
              setUser({ ...userData, primaryAddress: 0 });
              localStorage.setItem("user", JSON.stringify(userData));
              localStorage.setItem("token", data.token);
  
              toast({
                title: "Success",
                description: "Logged in with Google!",
              });
  
              if (!res.ok || data.error) {
                throw new Error(data.message || "Google login failed");
              }
  
            } catch (err) {
              toast({
                title: "Google Sign In Failed",
                description: "Please try again",
                variant: "destructive",
              });
            }
          },
        });
  
        // Render the button
        window.google.accounts.id.renderButton(
          document.getElementById("google-button-container"),
          {
            theme: "outline",
            size: "large",
            shape: "pill",
            logo_alignment: "left",
          }
        );
  
        // Trigger the One Tap prompt
        window.google.accounts.id.prompt();
      } else {
        toast({
          title: "Google Sign-In Not Ready",
          description: "Please try again in a few seconds.",
          variant: "destructive",
        });
      }
    };

    handleGoogleSignIn()
  }, [googleScriptLoaded, setUser, toast])

  useEffect(() => {
    if (user?.isLoggedIn && (!user.phone || user.address?.length === 0)) {
      router.replace("/complete-profile");
    } else if (user?.isLoggedIn) {
      router.replace("/products");
    }
  }, [user, router]);

  return (
    <div
      id="google-button-container"
    >
      
    </div>
  );
}
