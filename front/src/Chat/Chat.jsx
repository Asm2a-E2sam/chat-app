import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LuSendHorizonal } from "react-icons/lu";
import axiosInstance from "../axiosConfig/TalkWaveDB";
import Avatar from "./Avatar";
import Message from "./Message";
export default function Chat() {
  const { isLogged, setIsLogged } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ws, setWS] = useState(null);
  const [users, setUsers] = useState([]);
  const logout = () => {
    setIsLogged(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/");
  };
  const fetchUsers = async () => {
    const res = await axiosInstance.get("/users");
    console.log(res.data.data.users);
    setUsers(res.data.data.users);
  };
  useEffect(() => {
    fetchUsers();
    const ws = new WebSocket("ws://localhost:3030");
    setWS(ws);
    ws.addEventListener("message", (e) => {
      console.log("new message ", e);
    });
  }, []);
  return (
    <>
      <div class="grid grid-cols-4 h-screen">
        <div class="btn-chat">
          <h1 className="flex items-center p-2 my-bg shadow">
            <img src="./vite.png" alt="logo" width={50} className="pr-2" />{" "}
            <span className="chatting font-bold text-3xl">TalkWave</span>
          </h1>
          <input
            type="text"
            className="m-3 px-3 py-1 rounded-full w-80 border shadow-lg"
            style={{ fontFamily: "Arial, FontAwesome" }}
            placeholder="&#xF002; Search Here ..."
          />
          {users.map((user) => (
            <div className="w-full px-3 flex items-center gap-2 user-info mb-4">
              <Avatar
                userId={user._id}
                username={user.username}
                online={true}
              />
              <div className="flex flex-col">
                <span className="text-slate-100 font-bold">
                  {user.username}
                </span>
                <span className="text-slate-100 flex-grow">
                  Hello, Who are you asmaaaaaaaaaa{" "}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div class="my-bg flex flex-col col-span-3 shadow">
          <div className="flex-grow">
            <h1 className="flex items-center pt-3 pb-2 shadow-lg pl-4">
              <Avatar
                userId="65550450a0b24d8158abba11"
                username="asmaa"
                online={true}
              />
              <span className="ml-3 text-slate-400 text-3xl">Asmaa</span>
            </h1>
            {/* sender */}
            <div className="text-right mr-4 mt-2">
              <div className="text-left inline-block py-2 px-3 my-2 rounded-md text-sm bg-sender text-white">
                Hello
              </div>
            </div>
            {/* receiver */}
            <div className="text-left ml-4 mt-2">
              <div className="text-left inline-block py-2 px-3 my-2 rounded-md text-sm bg-receiver text-white">
                Hello
              </div>
            </div>
            {/* sender */}
            <div className="text-right mr-4 mt-2">
              <div className="text-left inline-block py-2 px-3 my-2 rounded-md text-sm bg-sender text-white">
                How are you?
              </div>
            </div>
            {/* receiver */}
            <div className="text-left ml-4 mt-2">
              <div className="text-left inline-block py-2 px-3 my-2 rounded-md text-sm bg-receiver text-white">
                fine
              </div>
            </div>
          </div>
          <div className="flex mx-3 my-2">
            <input
              type="text"
              placeholder="Type your massage here ..."
              className="bg-white flex-grow border py-2 ps-4 rounded-s-full shadow-lg"
            />
            <button className="btn-chat rounded-r-full">
              <LuSendHorizonal className="text-2xl mx-3 text-white" />
            </button>
          </div>
        </div>
      </div>
      {/* <button onClick={logout}>Log out</button> */}
    </>
  );
}
