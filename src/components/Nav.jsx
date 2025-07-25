import React from "react";
import { useNavigate } from "react-router-dom";

function Nav() {
    const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center p-4  text-white bg-blue-100/90 shadow-md">
      <div>
        <h1 onClick={() => navigate('/')} className="text-3xl font-bold text-black cursor-pointer">Bitly</h1>
      </div>

      <div className="flex gap-4">
        <h2 onClick={() => navigate('/login')} className=" rounded-2xl bg-blue-700 text-white p-2 cursor-pointer">Login </h2>
      </div>
    </div>
  );
}

export default Nav;
