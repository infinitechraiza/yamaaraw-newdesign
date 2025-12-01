"use client";

export const dynamic = "force-dynamic";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Zap,
  CheckCircle,
  AlertCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { register } from "@/lib/auth";
import Logo from "@/public/icon512_rounded.png";
import { useETrikeToast } from "@/components/ui/toast-container";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const slides = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
  "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200",
  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  const toast = useETrikeToast();

  const pathname = usePathname();
  const [current, setCurrent] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.warning(
        "Terms Required",
        "Please agree to the Terms of Service and Privacy Policy"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(
        "Password Mismatch",
        "Passwords do not match. Please try again."
      );
      return;
    }

    if (formData.password.length < 6) {
      toast.error(
        "Weak Password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    setIsLoading(true);
    try {
      const user = await register(
        formData.email,
        formData.password,
        formData.name
      );
      if (user) {
        toast.success(
          "Account Created!",
          `Welcome to YAMAARAW, ${user.name}! Please sign in to continue.`
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(
        "Registration Failed",
        error.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0)
      return { strength: 0, label: "", color: "", bgColor: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[^A-Za-z0-9]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score < 2)
      return {
        strength: 1,
        label: "Weak",
        color: "text-red-400",
        bgColor: "bg-red-500",
      };
    if (score < 4)
      return {
        strength: 2,
        label: "Medium",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500",
      };
    if (score < 5)
      return {
        strength: 3,
        label: "Good",
        color: "text-blue-400",
        bgColor: "bg-blue-500",
      };
    return {
      strength: 4,
      label: "Strong",
      color: "text-green-400",
      bgColor: "bg-green-500",
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.confirmPassword && formData.password === formData.confirmPassword;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen grid grid-cols-1 sm:grid-cols-2">
      {/* Image and Typhography Section */}
      <div className="hidden lg:flex relative h-[100vh] w-full items-end overflow-hidden">
        <Image
          key={slides[current]}
          src={slides[current]}
          alt="Hero Slide"
          fill
          className="object-cover transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 w-full text-white p-10 bg-gray-400/75 backdrop-blur-md">
          <h1 className="text-4xl font-bold my-5 blur-[0.5px]">
            Power Your Future
          </h1>
          <p className="text-md tracking-wide font-semibold blur-[0.5px]">
            Visit our YAMAARAW store today.
            <br />
            <span className="font-normal">
              Discover our latest products, accessories, and innovations in our
              retail locations.
            </span>
          </p>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-s50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
        <div className="space-y-2">
          <div className="flex flex-col items-center justify-center my-3">
            <Image src={Logo} alt="Logo" className="w-24 h-24 mb-2" />
            <Badge className="h-8 w-auto bg-clip-text text-transparent bg-violet-50 bg-gradient-to-r from-blue-600 to-violet-600 text-violet-600 border-blue-200 hover:text-blue-500 hover:from-blue-700 hover:to-red-700 transition-all">
              Electric Vehicle Store
            </Badge>
          </div>
          <div
            className="bg-white flex w-[450px] h-auto px-12 py-10 border shadow-xl rounded-xl opacity-100"
            style={{ opacity: 0.9 }}
          >
            <div className="flex w-full">
              <Tabs value={pathname} className="w-full">
                <TabsList className="grid w-auto h-auto grid-cols-2 mb-6 gap-1">
                  <TabsTrigger
                    value="/login"
                    asChild
                    className="h-10 
            hover:bg-gradient-to-l hover:from-blue-600 hover:to-violet-600 hover:text-gray-100
            data-[state=active]:bg-gradient-to-l data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-gray-100"
                  >
                    <Link href="/login">Log In</Link>
                  </TabsTrigger>

                  <TabsTrigger
                    value="/register"
                    asChild
                    className="h-10 
            hover:bg-gradient-to-l hover:from-blue-600 hover:to-violet-600 hover:text-gray-100
            data-[state=active]:bg-gradient-to-l data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-gray-100"
                  >
                    <Link href="/register">Register</Link>
                  </TabsTrigger>
                </TabsList>

                {/* Form */}
                <div className="flex">
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                    Join YAMAARAW
                  </h1>
                </div>
                <p className="text-xs fore-ground text-gray-600">
                  Create your account to start shopping
                </p>
                <div className="mt-5">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative group">
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                          placeholder="Enter your full name"
                        />
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email Address
                      </label>
                      <div className="relative group">
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                          placeholder="Enter your email"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative group">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                          placeholder="Create a strong password"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Compact Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              Strength:
                            </span>
                            <span
                              className={`text-xs font-medium ${passwordStrength.color}`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4].map((level) => (
                              <div
                                key={level}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  level <= passwordStrength.strength
                                    ? passwordStrength.bgColor
                                    : "bg-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                          placeholder="Confirm your password"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      {/* Compact Password Match Indicator */}
                      {formData.confirmPassword && (
                        <div className="mt-1 flex items-center space-x-2">
                          {passwordsMatch ? (
                            <>
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-xs text-green-400 font-medium">
                                Passwords match
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3 h-3 text-red-400" />
                              <span className="text-xs text-red-400">
                                Passwords do not match
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Compact Terms Agreement */}
                    <div className="flex items-start space-x-3 p-3 bg-blue-500/20 rounded-xl border border-blue-700/30">
                      <input
                        id="agree-terms"
                        name="agree-terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="h-4 w-4 text-blue-400 focus:ring-blue-200 border-gray-300 rounded mt-0.5"
                      />
                      <div className="text-xs">
                        <label
                          htmlFor="agree-terms"
                          className="text-gray-400 fore-ground font-medium"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className=" bg-clip-text text-transparent bg-blue-50 bg-gradient-to-r from-blue-800 to-blue-800 text-blue-800  hover:text-blue-400 font-medium"
                          >
                            Terms
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/privacy"
                            className=" bg-clip-text text-transparent bg-blue-50 bg-gradient-to-r from-blue-800 to-blue-800 text-blue-800  hover:text-blue-400 font-medium"
                          >
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>

                    {/* Compact Submit Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || !passwordsMatch || !agreedToTerms}
                      className="w-full bg-gradient-to-l from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 hover:from-blue-700 hover:to-violet-700 h-14 rounded-xl shadow-lg text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:opacity-70"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="font-medium bg-clip-text text-transparent bg-violet-50 bg-gradient-to-r from-blue-800 to-violet-800 text-violet-800"
                      >
                        Sign in
                      </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                      Back to{" "}
                      <Link
                        href="/"
                        className="font-medium bg-clip-text text-transparent bg-violet-50 bg-gradient-to-r from-blue-800 to-violet-800 text-violet-800"
                      >
                        Home
                      </Link>
                    </p>
                  </div>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
