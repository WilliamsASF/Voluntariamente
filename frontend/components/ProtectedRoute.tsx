"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  // 🔓 No desenvolvimento, não bloqueia nada
  if (process.env.NODE_ENV === "development") {
    return <>{children}</>;
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("token"); // exemplo de auth
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
}
