import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { useNavigate } from "react-router-dom";
const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      // Only validate these fields for registration
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Always validate email and password
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        // Login logic here
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        console.log("User logged in successfully");
      } else {
        // Registration logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await updateProfile(userCredential.user, {
          displayName: `${formData.firstName} ${formData.lastName}`,
        });

        console.log("User registered successfully");
      }
      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: error.message });
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      console.log("Google sign in successful");
      navigate("/dashboard");
    } catch (error) {
      setErrors({ submit: error.message });
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/40 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 letter-spacing: -0.02em">
              Nest
            </h1>
            <p className="text-slate-600 font-medium">
              Manage your finances with ease
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex mb-6 bg-white/20 backdrop-blur-sm rounded-lg p-1 border border-white/30">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center rounded-md transition-all duration-200 font-medium text-sm ${
                isLogin
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-white/30"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center rounded-md transition-all duration-200 font-medium text-sm ${
                !isLogin
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-700 hover:bg-white/30"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Registration/Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              /* Name Fields for Registration */
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/60 transition-all"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-sm mt-1 font-medium">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/60 transition-all"
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm mt-1 font-medium">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/60 transition-all"
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
               className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/60 transition-all"
                placeholder="Enter your password"
                required
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 font-medium">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              /* Confirm Password Field - Only for Registration */
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                 className="w-full px-4 py-3 bg-white/40 backdrop-blur-sm border border-white/30 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/60 transition-all"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {isLogin && (
              /* Forgot Password Link - Only for Login */
              <div className="text-right">
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
>
              {loading
                ? isLogin
                  ? "Signing In..."
                  : "Creating Account..."
                : isLogin
                ? "Sign In to Nest"
                : "Sign Up to Nest"}
            </button>

            {/* Error Message */}
            {errors.submit && (
              <p className="text-red-600 text-sm mt-1 font-medium">
                {errors.submit}
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
  <div className="flex-1 border-t border-white/40"></div>
  <span className="px-3 text-slate-600 text-sm font-medium">
    or continue with
  </span>
  <div className="flex-1 border-t border-white/40"></div>
</div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
  onClick={handleGoogleSignUp}
  disabled={loading}
  className="flex items-center justify-center gap-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 disabled:bg-white/20 text-slate-700 py-3 px-4 rounded-lg border border-white/30 transition-all duration-200 disabled:cursor-not-allowed font-medium hover:shadow-md"
>
              <img src="/google.svg" alt="Google logo" className="w-5 h-5" />
              Google
            </button>
          </div>

          {/* Login/Register Toggle Link */}
          <div className="text-center mt-6">
  <p className="text-slate-600">
    {isLogin
      ? "Don't have an account? "
      : "Already have an account? "}
    <button
      onClick={() => setIsLogin(!isLogin)}
      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
    >
      {isLogin ? "Sign Up" : "Sign In"}
    </button>
  </p>
</div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
