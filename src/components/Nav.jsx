import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Nav() {
    const navigate = useNavigate();
    const { user, signOut, loading } = useAuth();
  return (
    <div className="flex justify-between items-center p-4  text-white bg-blue-100/90 shadow-md">
      <div>
        <h1 onClick={() => navigate('/')} className="text-3xl font-bold text-black cursor-pointer">Bitly</h1>
      </div>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-black">Welcome, {user.user_metadata?.name || user.email}</span>
            <button
              onClick={() => navigate('/admin')}
              className="rounded-2xl bg-green-600 text-white p-2 cursor-pointer hover:bg-green-700"
            >
              Dashboard
            </button>
            <button
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
              className="rounded-2xl bg-red-600 text-white p-2 cursor-pointer hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "..." : "Logout"}
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="rounded-2xl bg-blue-700 text-white p-2 cursor-pointer hover:bg-blue-800"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
}

export default Nav;
