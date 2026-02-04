// Auth context for managing user sessions
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("cooper_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      // Get existing users
      const usersData = localStorage.getItem("cooper_users") || "[]";
      const users = JSON.parse(usersData);

      // Check if email exists
      if (users.find((u: any) => u.email === email)) {
        return false;
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        name,
        email,
        phone,
        password, // In production, this should be hashed
      };

      users.push(newUser);
      localStorage.setItem("cooper_users", JSON.stringify(users));

      // Auto login
      const userSession = { id: newUser.id, name, email, phone };
      setUser(userSession);
      localStorage.setItem("cooper_user", JSON.stringify(userSession));

      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const usersData = localStorage.getItem("cooper_users") || "[]";
      const users = JSON.parse(usersData);

      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userSession = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          phone: foundUser.phone,
        };
        setUser(userSession);
        localStorage.setItem("cooper_user", JSON.stringify(userSession));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cooper_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
