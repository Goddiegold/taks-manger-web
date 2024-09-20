"use client";
import { userToken } from "@/app/utils/helper";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode | React.ReactNode[];
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const router = useRouter()
  const token = userToken();

  useEffect(() => {
    if (!token) {
      router.push("/pages/login");
    }
  }, [token]);

  if (token) {
    return <>{children}</>;
  }

  return null;
};

export default AuthWrapper;
