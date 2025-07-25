import React, { useState } from "react";

function Hero() {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
  }; 
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold">Welcome to Bitly</h1>
      <p className="mt-4 text-lg">Your one-stop solution for URL shortening</p>

      <form onSubmit={handleSubmit} className="flex justify-center items-center mt-8 relative">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          type="text"
          placeholder="Enter your URL here"
          required
          className="border border-gray-300 p-2 w-100  rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <button className="absolute right-0 bg-blue-500 text-white p-2 rounded-r-2xl cursor-pointer">
          Shorten
        </button>
      </form> 

      <table className="mt-8 w-full max-w-4xl mx-auto bg-white shadow-md rounded-lg">
        <thead className="bg-gray-200">
          <tr className="text-left">
            <th className="px-4 py-2">Shortened URL</th>
            <th className="px-4 py-2">Original URL</th>
            <th className="px-4 py-2">Clicks</th>
          </tr>
        </thead> 

        <tbody className="divide-y divide-gray-300">
          <tr >
            <td><a href="#">short.url/abc123</a></td>
            <td>https://www.original-url.com/very/long/path/to/resource</td>
            <td>10</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Hero;
