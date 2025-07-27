import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { linkAPI } from "../lib/linkUtils";

function Hero() {
  const [input, setInput] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userLinks, setUserLinks] = useState([]);
  const [showCustomCode, setShowCustomCode] = useState(false);

  const { user } = useAuth();

  // Fetch user's links when component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchUserLinks();
    } else {
      setUserLinks([]);
    }
  }, [user]);

  const fetchUserLinks = async () => {
    if (!user) return;

    const { data, error } = await linkAPI.getUserLinks(user.id);
    if (!error && data) {
      setUserLinks(data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to create short links");
      return;
    }

    if (!input.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await linkAPI.createLink(
        input.trim(),
        customCode.trim() || null,
        user.id
      );

      if (error) {
        setError(error.message || "Failed to create short link");
      } else {
        setSuccess(`Short link created: ${window.location.origin}/${data.short_code}`);
        setInput("");
        setCustomCode("");
        setShowCustomCode(false);
        // Refresh the links list
        fetchUserLinks();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteLink = async (linkId) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    const { error } = await linkAPI.deleteLink(linkId, user.id);
    if (!error) {
      fetchUserLinks();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8">
      <h1 className="text-5xl font-bold">Welcome to Bitly</h1>
      <p className="mt-4 text-lg">Your one-stop solution for URL shortening</p>

      {!user && (
        <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          Please login to create and manage your short links
        </div>
      )}

      {user && (
        <div className="mt-8 w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center items-center relative">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                type="text"
                placeholder="Enter your URL here"
                required
                disabled={loading}
                className="border border-gray-300 p-3 w-full rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-0 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-3 rounded-r-2xl cursor-pointer disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Shorten"}
              </button>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setShowCustomCode(!showCustomCode)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                {showCustomCode ? "Hide" : "Add"} custom short code
              </button>
            </div>

            {showCustomCode && (
              <div className="flex justify-center">
                <input
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  type="text"
                  placeholder="Enter custom short code (optional)"
                  disabled={loading}
                  className="border border-gray-300 p-2 w-64 rounded focus:ring-2 focus:ring-blue-400 outline-none disabled:bg-gray-100"
                />
              </div>
            )}
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
              <button
                onClick={() => navigator.clipboard.writeText(success.split(': ')[1])}
                className="ml-2 text-green-600 hover:text-green-800 underline"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      )}

      {user && userLinks.length > 0 && (
        <div className="mt-8 w-full max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Your Links</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr className="text-left">
                  <th className="px-4 py-3">Short Code</th>
                  <th className="px-4 py-3">Original URL</th>
                  <th className="px-4 py-3">Clicks</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {userLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <a
                        href={`/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-mono"
                      >
                        {link.short_code}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={link.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate block max-w-xs"
                        title={link.original_url}
                      >
                        {link.original_url}
                      </a>
                    </td>
                    <td className="px-4 py-3">{link.click_count || 0}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(link.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${link.short_code}`)}
                        className="text-green-600 hover:text-green-800 mr-2 text-sm"
                      >
                        Copy
                      </button>
                      <button
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero;
