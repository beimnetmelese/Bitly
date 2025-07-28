import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailConfirmationMessage, setEmailConfirmationMessage] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we were redirected here after registration with email confirmation message
  useEffect(() => {
    if (location.state?.emailConfirmation) {
      setEmailConfirmationMessage("Please check your email and click the confirmation link to activate your account.");
      setState("login"); // Ensure we're on login form
    }
  }, [location.state]);

  // Clear email confirmation message when switching between forms
  const handleStateChange = (newState) => {
    setState(newState);
    if (newState === "register") {
      setEmailConfirmationMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (state === "register") {
        if (!name.trim()) {
          setError("Name is required");
          return;
        }
        const { data, error } = await signUp(email, password, name);
        if (error) {
          setError(error.message);
        } else {
          // Check if email confirmation is required
          if (data.user && !data.session) {
            // Redirect to login page with email confirmation message
            navigate("/login", {
              state: { emailConfirmation: true },
              replace: true
            });
          } else {
            navigate("/");
          }
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 mt-10 mb-16 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="text-2xl font-medium m-auto">
          <span className="text-blue-600">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {error && (
          <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {emailConfirmationMessage && (
          <div className="w-full p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
            {emailConfirmationMessage}
          </div>
        )}
        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500"
              type="text"
              required
            />
          </div>
        )}
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500"
            type="email"
            required
          />
        </div>
        <div className="w-full ">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-blue-500"
            type="password"
            required
          />
        </div>
        {state === "register" ? (
          <p>
            Already have account?{" "}
            <span
              onClick={() => handleStateChange("login")}
              className="text-blue-400 cursor-pointer"
            >
              click here
            </span>
          </p>
        ) : (
          <p>
            Create an account?{" "}
            <span
              onClick={() => handleStateChange("register")}
              className="text-blue-400 cursor-pointer"
            >
              click here
            </span>
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all text-white border-2 rounded-md w-full py-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : (state === "register" ? "Create Account" : "Login")}
        </button>
      </form>
  );
}

export default Login;
