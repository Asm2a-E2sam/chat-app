import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../user/Login";

export default function Home() {
    
  return (
    <div className="my-bg h-screen columns-2">
        <div className="mx-auto w-full h-screen border-r-2 flex items-center justify-center">
            {/* <div className="w-96 flex flex-col items-center justify-center">
                <img src="./chatting.png" alt="logo" width={100} className="pr-3"/>
                <h1 className="chatting mb-5">TalkWave</h1>
            </div> */}
            <img src="./chat-2.png" alt="chat-image" className="w-full"/>
        </div> 
      <div className="w-full flex items-center justify-center">
        <Login/>
        </div>   
      
    </div>
  );
}
