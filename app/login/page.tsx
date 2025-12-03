"use client";
export const dynamic = "force-dynamic";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Zap, CircleArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { login } from "@/lib/auth";
import { useClientToast } from "@/hooks/use-client-toast";
import Logo from "@/public/icon512_rounded.png";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const slides = [
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
  "https://images.unsplash.com/photo-1555421689-d68471e189f2?w=1200",
  "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200",
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useClientToast();
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result) {
        const welcomeMessage =
          result.user.role === "admin"
            ? `Welcome back, Admin ${result.user.name}!`
            : `Welcome back, ${result.user.name}!`;

        toast.authSuccess(welcomeMessage);

        setTimeout(() => {
          router.push(result.redirectTo);
        }, 1000);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        "Login Failed",
        error.message || "Invalid email or password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [current, setCurrent] = useState(0);

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
            Visit our INFINITRADE store today.
            <br />
            <span className="font-normal">
              Discover our latest products, accessories, and innovations in our
              retail locations.
            </span>
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-s50 via-orange-50 to-slate-50 flex items-center justify-center p-4">
        <div className="space-y-2">
          <div className="flex flex-col items-center justify-center my-3">
            <Image src={Logo} alt="Logo" className="w-24 h-24 mb-2" />
            <Badge className="h-8 w-auto bg-clip-text text-transparent bg-violet-50 bg-gradient-to-r from-blue-600 to-violet-600 text-violet-600 border-blue-200 hover:text-blue-500 hover:from-blue-700 hover:to-red-700 transition-all">
              Electric Vehicle Store
            </Badge>
          </div>
          <div
            className="bg-white flex w-[460px] h-auto px-12 py-10 border shadow-xl rounded-xl opacity-100"
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
                    Welcome Back!
                  </h1>
                </div>
                <p className="text-xs fore-ground text-gray-600">
                  Log In to your YAMAARAW account
                </p>
                <div className="mt-5">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative group">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                          placeholder="Enter your email"
                        />
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Password
                      </label>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="pl-12 pr-12 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-white/70 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 focus:bg-white"
                          placeholder="Enter your password"
                        />
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded transition-colors"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-l from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 hover:from-blue-700 hover:to-violet-700 h-14 rounded-xl shadow-lg text-white font-semibold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:opacity-70"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span>Sign In</span>
                          <Zap className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </form>

                  <div className="mt-3 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Don't have an account?{" "}
                      <Link
                        href="/register"
                        className="font-medium bg-clip-text text-transparent bg-violet-50 bg-gradient-to-r from-blue-800 to-violet-800 text-violet-800"
                      >
                        Sign up for free
                      </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                      or Back to{" "}
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
