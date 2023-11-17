import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LuSendHorizonal } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { GrLogout } from "react-icons/gr";
import axiosInstance from "../axiosConfig/TalkWaveDB";
import Avatar from "./Avatar";
export default function Chat() {
  const { isLogged, setIsLogged } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ws, setWS] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [loginUser, setLoginUser] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchUsers = async () => {
    try{
        let currentUser = JSON.parse(localStorage.getItem("userInfo"))._id
        const res = await axiosInstance.get("/users");
        console.log(res.data.data.users);
        let _users = await res.data.data.users?.filter((user)=> user._id !== currentUser)
        setUsers(_users);
        setFilteredUsers(_users)
    }catch(err){
        console.log(err);
    }
  };
  useEffect(() => {
    setLoginUser(JSON.parse(localStorage.getItem("userInfo")))
    try {
      fetchUsers();
    } catch (err) {
      console.log(err); 
    }
    const ws = new WebSocket("ws://localhost:3030");
    setWS(ws);
    ws.addEventListener("message", (e) => {
      console.log("new message ", e);
    });
  }, []);

  const sendMessage=()=>{
    console.log(newMessage);
    setNewMessage("");
  }

  const filterUsers= (ev)=>{
    const e = ev.target.value;
    setSearchInput(e);
    if(e){
        console.log(e);
        const _filteredUsers = users.filter((user)=> user.username.startsWith(e));
        setFilteredUsers(_filteredUsers);
    }else{
        setFilteredUsers(users)
    }
  }

  const logout =()=>{
    try{
        axiosInstance.patch(`/users/${loginUser._id}`,{online:false})
    }catch(err){
        console.log(err);
    }
    setIsLogged(false);
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <>
      <div class="grid grid-cols-4 h-screen">
        <div class="btn-chat">
          <h1 className="flex items-center justify-between p-2 my-bg shadow">
            <div className="flex items-center">
            <img src="./vite.png" alt="logo" width={50} className="pr-2" />{" "}
            <span className="chatting font-bold text-3xl">TalkWave</span>
            </div>
            <GrLogout className="text-xl mr-2" role="button" onClick={logout}/>
          </h1>
          <input
            type="text" value={searchInput}
            className="m-3 px-3 py-1 rounded-full w-80 border shadow-lg"
            style={{ fontFamily: "Arial, FontAwesome" }}
            placeholder="&#xF002; Search Here ..."
            onChange={(ev)=>{filterUsers(ev)}}
          />
          {filteredUsers.map((user) => (
            <div className={`w-full px-3 flex items-center gap-2 user-info mb-4 ${(user._id === selectedUser?._id)?"my-bg ml-5 rounded-s-full p-1":""}`} onClick={() => {setSelectedUser(user)}} key={user._id} role="button">
              <Avatar
                userId={user._id}
                username={user.username}
                online={user.online}
                size={10}
              />
              <div className="flex flex-col">
                <span className={`font-bold ${(user._id === selectedUser?._id)?"text-slate-500":"text-slate-100"}`}>
                  {user.username}
                </span>
                <span className=
                {`flex-grow ${(user._id === selectedUser?._id)?"text-slate-500":"text-slate-100"}`}>
                  Hello, Who are you asmaaaaaaaaaa{" "}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div class="my-bg flex flex-col col-span-3 shadow">
        {selectedUser?._id ?
            <>
            <div className="flex-grow">
                <h1 className="flex justify-between pt-3 pb-2 shadow-lg pl-4">
                <div className="flex items-center">
                <Avatar
                    userId={selectedUser._id}
                    username={selectedUser.username}
                    online={selectedUser.online}
                    size={10}
                />
                <span className="ml-3 text-slate-400 text-3xl">{selectedUser.username}</span>
                </div>
                <span className="mr-3 text-slate-400 text-3xl">
                <IoMdClose onClick={() => {setSelectedUser(null)}} role="button"/>
                </span>
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
                value={newMessage}
                onChange={(ev)=>{setNewMessage(ev.target.value)}}
                placeholder="Type your massage here ..."
                className="bg-white flex-grow border py-2 ps-4 rounded-s-full shadow-lg"
                />
                <button className="btn-chat rounded-r-full" onClick={sendMessage}>
                <LuSendHorizonal className="text-2xl mx-3 text-white" />
                </button>
            </div>
            </>
            :
            <img src="./chat-3.png" alt="" className="h-screen mx-auto"/>
        }
        </div>
      </div>
      {/* <button onClick={logout}>Log out</button> */}
    </>
  );
}
