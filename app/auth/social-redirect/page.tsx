// pages/auth/social-redirect.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { userState } from "@/store/atoms/user";

export default function SocialRedirect() {
  const { data: session, status } = useSession();
  const setUser = useSetRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    const handleSocialLogin = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/oauth-login`,
            { email: session.user.email, name: session.user.name },
            { withCredentials: true }
          );

          const data = res.data;

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
            primaryAddress: data.user.primaryAddress || 0,
          });

          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.token);

          // Check if profile is incomplete
          if (!data.user.phone || !data.user.address) {
            router.replace("/complete-profile");
          } else {
            router.replace("/products");
          }
        } catch (err) {
          console.error("OAuth login failed", err);
          router.replace("/login");
        }
      }
    };

    handleSocialLogin();
  }, [session, status, setUser, router]);

  return <div className="text-center mt-20 text-xl">Redirecting...</div>;
}
