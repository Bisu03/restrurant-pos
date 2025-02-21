import React from "react";
import { useState } from "react";
import { getSession, getCsrfToken, signIn } from "next-auth/react";
import Router from "next/router";
import { toast } from "react-toastify";

const Index = ({ session, csrfToken }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.warn("Please enter both email and password");
      return;
    }
    setLoading(true);
    signIn("credentials", { redirect: false, email, password }).then((data) => {
      if (data?.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        Router.push("/records");
        setLoading(false);
        toast.success("Welcome back! Kitchen access granted 🍴");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-red-600 p-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              🍽️ Chef's Corner
            </h1>
            <p className="text-white/90">Sign in to manage your recipes</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <input type="hidden" name="csrfToken" defaultValue={csrfToken} />

            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Chef's Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@kitchen.com"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    ✉️
                  </span>
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Secret Recipe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border focus:border-red-500 focus:outline-none"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    🔒
                  </span>
                </div>
              </div>

              {/* Show Password & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                    className="form-checkbox h-4 w-4 text-red-600"
                  />
                  <span className="text-sm text-gray-600">Show password</span>
                </label>
                <a href="#" className="text-sm text-red-600 hover:text-red-800">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all ${loading ? "opacity-75 cursor-not-allowed" : ""
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
                      {/* Spinner SVG */}
                    </svg>
                    Cooking...
                  </span>
                ) : (
                  "Open Kitchen"
                )}
              </button>

              {/* Social Login */}

            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const csrfToken = await getCsrfToken(context);
  console.log(session);

  if (session) {
    return {
      redirect: {
        destination: "/tablestatus",
        permanent: false,
      },
    };
  }

  return {
    props: { session, csrfToken },
  };
}

export default Index;