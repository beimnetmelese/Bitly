// src/pages/Redirect.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

export default function Redirect() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Looking for your link...");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const logClickAndRedirect = async () => {
      try {
        setStatus("Looking for your link...");
        
        // Simulate progress for better UX
        const interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 90));
        }, 300);

        const { data: link, error } = await supabase
          .from("links")
          .select("*")
          .eq("short_code", shortCode)
          .single();

        clearInterval(interval);
        setProgress(100);

        if (error || !link) {
          console.error("Link not found");
          setStatus("Link not found. Redirecting to home page...");
          setTimeout(() => navigate("/404"), 2000);
          return;
        }

        setStatus("Preparing your destination...");
        
        // Log click
        await supabase.from("clicks").insert([
          {
            link_id: link.id,
            country: "Ethiopia", // You can use an IP lookup API for real location
            user_agent: navigator.userAgent,
          },
        ]);

        setStatus("Updating stats...");
        
        // Update click count
        await supabase
          .from("links")
          .update({ click_count: link.click_count + 1 })
          .eq("id", link.id);

        setStatus("Redirecting now...");
        
        // Small delay for user to see the final message
        setTimeout(() => {
          window.location.href = link.original_url;
        }, 500);
      } catch (err) {
        console.error("Error during redirect:", err);
        setStatus("Something went wrong. Redirecting to home page...");
        setTimeout(() => navigate("/"), 2000);
      }
    };

    logClickAndRedirect();
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity, repeatType: "reverse" },
            }}
          >
            <svg
              className="w-16 h-16 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Taking you there</h1>
        <p className="text-gray-600 mb-6">{status}</p>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <motion.div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-500"
        >
          <p>Hold tight while we redirect you</p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 text-center text-gray-500 text-sm"
      >
        <p>Powered by your awesome service</p>
      </motion.div>
    </div>
  );
}