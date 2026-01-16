// src/components/Login.tsx
import React, { useState, useEffect } from "react";
import { getMe, googleAuth, login, register } from "../services/authService";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowRight,
  Shield,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Building,
  Globe,
  Zap,
  Award,
  Star,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { RootState } from "../store/store";

function GoogleIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.73 1.23 9.24 3.25l6.9-6.9C35.93 2.34 30.33 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.02 6.22C12.5 13.3 17.77 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.64-.15-3.21-.43-4.73H24v9.01h12.67c-.55 2.95-2.2 5.45-4.67 7.14l7.57 5.86c4.43-4.09 6.93-10.11 6.93-17.28z"
      />
      <path
        fill="#FBBC05"
        d="M10.58 28.44a14.5 14.5 0 0 1 0-8.88l-8.02-6.22A23.99 23.99 0 0 0 0 24c0 3.88.93 7.56 2.56 10.66l8.02-6.22z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.33 0 11.93-2.09 15.91-5.68l-7.57-5.86c-2.1 1.41-4.79 2.24-8.34 2.24-6.23 0-11.5-3.8-13.42-9.22l-8.02 6.22C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

const Login: React.FC<any> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);
  // const sessionToken = localStorage.getItem("sessionToken");

  useEffect(() => {
    if (auth.userInfo) {
      navigate("/dashboard", { replace: true });
    }
  }, [auth.userInfo, navigate]);

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    department: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.jobTitle.trim()) {
        newErrors.jobTitle = "Job title is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe,
        });

        // After login, ask backend who we are
        const me = await getMe();

        dispatch(setAuth({ userInfo: me.user }));

        // Optional legacy global reference (only after backend verification)
        try {
          (window as any).currentUserId = me.user.id;
        } catch {}

        navigate("/dashboard");
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          jobTitle: formData.jobTitle,
          department: formData.department,
        });

        setErrors({
          general:
            "Account created successfully! Please sign in with your new credentials.",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      let errorMsg = isLogin
        ? "Login failed. Please try again."
        : "Registration failed. Please try again.";
      if (error.response) {
        if (isLogin && error.response.status === 401) {
          errorMsg = "Invalid email or password.";
        } else if (error.response.status === 500) {
          errorMsg = "Internal server error. Please try again later.";
        } else if (error.response.data?.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      setErrors({ general: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Users,
      title: "Investor Database",
      description:
        "Comprehensive investor profiles and relationship management",
    },
    {
      icon: Target,
      title: "Smart Targeting",
      description: "AI-powered investor matching and portfolio fit scoring",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into campaign performance and ROI",
    },
    {
      icon: Zap,
      title: "Automation",
      description: "Automated outreach sequences and follow-up campaigns",
    },
  ];

  const testimonials = [
    {
      quote:
        "InvestorCRM helped us raise our Series B 40% faster with better investor targeting.",
      author: "Sarah Johnson",
      role: "CEO, TechFlow Solutions",
      avatar:
        "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
    },
    {
      quote:
        "The analytics and ROI tracking features are game-changing for our IR strategy.",
      author: "Michael Chen",
      role: "VP Finance, HealthTech Inc",
      avatar:
        "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Investors Tracked" },
    { value: "500+", label: "Successful Raises" },
    { value: "$2.5B+", label: "Capital Raised" },
    { value: "98%", label: "User Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Left Side - Branding and Features */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Header */}
          <div>
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="ml-4 text-2xl font-bold">InvestorCRM</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Supercharge Your
              <span className="block text-blue-200">Investor Relations</span>
            </h1>

            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              The most advanced platform for managing investor relationships,
              tracking campaigns, and optimizing fundraising performance.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-blue-100 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Stats */}
          <div>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl xl:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-blue-100 mb-4 italic">
                "{testimonials[0].quote}"
              </p>
              <div className="flex items-center">
                <img
                  src={testimonials[0].avatar}
                  alt={testimonials[0].author}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <div className="font-medium text-white">
                    {testimonials[0].author}
                  </div>
                  <div className="text-sm text-blue-200">
                    {testimonials[0].role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold text-gray-900">
                InvestorCRM
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to your investor relations dashboard
            </p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block text-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? "Sign in to your investor relations dashboard"
                : "Join thousands of companies using InvestorCRM"}
            </p>
          </div>

          <div className="mb-5">
            <button
              onClick={googleAuth}
              type="button"
              className="flex items-center justify-center gap-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 active:scale-[0.98]"
            >
              <GoogleIcon className="h-5 w-5" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Registration Fields */}
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.firstName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.lastName
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.jobTitle}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          jobTitle: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.jobTitle
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., VP of Finance"
                    />
                    {errors.jobTitle && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.jobTitle}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select department</option>
                      <option value="Finance">Finance</option>
                      <option value="Strategy">Strategy</option>
                      <option value="Business Development">
                        Business Development
                      </option>
                      <option value="Executive">Executive</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                  />
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
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: e.target.checked,
                        }))
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </span>
                  </>
                ) : (
                  <>
                    {isLogin ? (
                      <LogIn className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    <span>{isLogin ? "Sign In" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Toggle Login/Register */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setFormData((prev) => ({
                        ...prev,
                        firstName: "",
                        lastName: "",
                        jobTitle: "",
                        department: "",
                      }));
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    {isLogin ? "Create account" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <div className="flex items-center mb-2">
                <Shield className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-900">
                  Enterprise Security
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Your data is protected with enterprise-grade security, including
                SSL encryption, two-factor authentication, and SOC 2 compliance.
              </p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Trusted by leading companies
            </p>
            <div className="flex items-center justify-center space-x-6 opacity-60">
              <Building className="w-6 h-6 text-gray-400" />
              <Globe className="w-6 h-6 text-gray-400" />
              <Briefcase className="w-6 h-6 text-gray-400" />
              <Award className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
