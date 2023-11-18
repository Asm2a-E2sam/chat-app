import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LuSendHorizonal } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { GrLogout } from "react-icons/gr";
import axiosInstance from "../axiosConfig/TalkWaveDB";
import Avatar from "./Avatar";
import { UserContext } from "../context/LoginUser";
import { uniqBy } from "lodash";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, SetOnlinePeople] = useState({});
  const [offlinePeople, SetOfflinePeople] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const { name, id, setId, setName } = useContext(UserContext);
  const [newMassageText, setNewMassageText] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesBoxRef = useRef();

  // const { isLogged, setIsLogged } = useContext(UserContext);
  const navigate = useNavigate();
  const [filteredUsers, setFilteredUsers] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const fetchUsers = async () => {
    try {
      let currentUser = JSON.parse(localStorage.getItem("userInfo"))._id;
      const res = await axiosInstance.get("/users");
      console.log(res.data.data.users);
      let _users = await res.data.data.users?.filter(
        (user) => user._id !== currentUser
      );
      if (_users) {
        setFilteredUsers(_users);
      } else {
        setFilteredUsers(null);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    connectToWs();
  }, []);

  function connectToWs() {
    const ws = new WebSocket("ws://localhost:3030");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
    ws.addEventListener("close", () => {
      setTimeout(() => {
        console.log("Server is down .. Trying to reconnect");
        connectToWs();
      }, 5000);
    });
  }
  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    // console.log(people);
    SetOnlinePeople(people);
  }
  function handleMessage(ev) {
    // console.log('The new Message ' , ev);
    const messageData = JSON.parse(ev.data);
    // console.log(messageData);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("text" in messageData) {
      setMessages((prev) => [...prev, { ...messageData }]);
    }
  }
  const TheOnlinePeople = { ...onlinePeople };
  delete TheOnlinePeople[id];
  const realMessages = uniqBy(messages, "_id");

  function sendMessage(ev, file = null) {
    if (ev) ev.preventDefault();
    ws.send(
      JSON.stringify({
        receiver: selectedUser,
        text: newMassageText,
        file,
      })
    );
    if (file) {
      axiosInstance.get("/messages/" + selectedUser).then((res) => {
        setMessages(res.data);
      });
    } else {
      setNewMassageText("");
      setMessages((prev) => [
        ...prev,
        {
          text: newMassageText,
          sender: id,
          receiver: selectedUser,
          _id: Date.now(),
        },
      ]);
    }
  }
  useEffect(() => {
    const div = messagesBoxRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      axiosInstance.get("/messages/" + selectedUser).then((res) => {
        // console.log(res.data);
        setMessages(res.data);
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    axiosInstance.get("/people").then((res) => {
      const offlinePeopleArr = res.data
        .filter((p) => p._id !== id)
        .filter((p) => !Object.keys(onlinePeople).includes(p._id));
      const offlinePeople = {};
      offlinePeopleArr.forEach((p) => {
        offlinePeople[p._id] = p;
      });
      SetOfflinePeople(offlinePeople);
    });
  }, [onlinePeople]);

  function logout() {
    axiosInstance.post("/logout").then(() => {
      setWs(null);
      setId(null);
      setName(null);
      window.location.reload();
    });
    navigate("/");
  }

  function sendFile(ev) {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      sendMessage(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
  }

  // useEffect(() => {
  //   // setLoginUser(JSON.parse(localStorage.getItem("userInfo")))
  //   try {
  //     fetchUsers();
  //   } catch (err) {
  //     console.log(err);
  //   }

  // }, []);

  // const sendMessage=()=>{
  //   console.log(newMessage);
  //   setNewMessage("");
  // }

  // const filterUsers= (ev)=>{
  //   const e = ev.target.value;
  //   setSearchInput(e);
  //   if(e){
  //       console.log(e);
  //       const _filteredUsers = users.filter((user)=> user.username.startsWith(e));
  //       setFilteredUsers(_filteredUsers);
  //   }else{
  //       setFilteredUsers(users)
  //   }
  // }

  // const logout =()=>{
  //   try{
  //       axiosInstance.patch(`/users/${loginUser._id}`,{online:false})
  //   }catch(err){
  //       console.log(err);
  //   }
  //   setIsLogged(false);
  //   localStorage.removeItem("userInfo");
  //   localStorage.removeItem("token");
  //   navigate("/");
  // }

  return (
    <>
      <div className="grid grid-cols-4 h-screen">
        <div className="btn-chat h-screen flex flex-col">
          <h1 className="flex items-center justify-between p-2 my-bg shadow">
            <div className="flex items-center">
              <img src="./vite.png" alt="logo" width={50} className="pr-2" />{" "}
              <span className="chatting font-bold text-3xl">TalkWave</span>
            </div>
            <GrLogout className="text-xl mr-2" role="button" onClick={logout} />
          </h1>
          <input
            type="text"
            value={searchInput}
            className="m-3 px-3 py-1 rounded-full w-80 border shadow-lg"
            style={{ fontFamily: "Arial, FontAwesome" }}
            placeholder="&#xF002; Search Here ..."
            onChange={(ev) => {
              filterUsers(ev);
            }}
          />
          <div className="flex-grow overflow-x-hidden">
            {Object.keys(TheOnlinePeople).map((userId) => (
              // {filteredUsers.map((user) => (
              <div
                className={`w-full px-3 flex items-center gap-2 user-info mb-4 ${
                  userId === selectedUser ? "my-bg ml-5 rounded-s-full p-1" : ""
                }`}
                onClick={() => {
                  setSelectedUser(userId);
                }}
                key={userId}
                role="button"
              >
                <Avatar
                  userId={userId}
                  username={TheOnlinePeople[userId]}
                  online={true}
                />
                <div className="flex flex-col">
                  <span
                    className={`font-bold ${
                      userId === selectedUser
                        ? "text-slate-500"
                        : "text-slate-100"
                    }`}
                  >
                    {TheOnlinePeople[userId]}
                  </span>
                  {/* <span className=
                {`flex-grow ${(userId === selectedUser)?"text-slate-500":"text-slate-100"}`}>
                  Hello, Who are you asmaaaaaaaaaa{" "}
                </span> */}
                </div>
              </div>
            ))}
            {Object.keys(offlinePeople).map((userId) => (
              <div
                className={`w-full px-3 flex items-center gap-2 user-info mb-4 ${
                  userId === selectedUser ? "my-bg ml-5 rounded-s-full p-1" : ""
                }`}
                onClick={() => {
                  setSelectedUser(userId);
                }}
                key={userId}
                role="button"
              >
                <Avatar
                  userId={userId}
                  username={offlinePeople[userId].username}
                  online={false}
                />
                <div className="flex flex-col">
                  <span
                    className={`font-bold ${
                      userId === selectedUser
                        ? "text-slate-500"
                        : "text-slate-100"
                    }`}
                  >
                    {offlinePeople[userId].username}
                  </span>
                  {/* <span className=
                {`flex-grow ${(userId === selectedUser)?"text-slate-500":"text-slate-100"}`}>
                  Hello, Who are you asmaaaaaaaaaa{" "}
                </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="my-bg flex h-screen flex-col col-span-3 shadow">
          {selectedUser ? (
            <>
              <h1 className="flex justify-between pt-3 pb-2 shadow-lg pl-4">
                <div className="flex items-center">
                  {/* <Avatar
                    userId={selectedUser}
                    username={selectedUser.username}
                    online={selectedUser.online}
                    size={10}
                /> */}
                  {/* <span className="ml-3 text-slate-400 text-3xl">{selectedUser.username}</span> */}
                </div>
                <span className="mr-3 text-slate-400 text-3xl">
                  <IoMdClose
                    onClick={() => {
                      setSelectedUser(null);
                    }}
                    role="button"
                  />
                </span>
              </h1>
              <div className="flex-grow overflow-x-hidden">
                {realMessages.map((message) => (
                  <div
                    key={message._id}
                    className={
                      message.sender === id ? "text-right" : "text-left"
                    }
                  >
                    <div
                      className={
                        "text-left inline-block py-2 mx-3 px-3 my-2 rounded-md text-sm text-white " +
                        (message.sender === id ? "bg-sender" : "bg-receiver")
                      }
                    >
                      {message.text}
                      {message.file &&
                      message.file.match(/\.(jpeg|jpg|gif|png)$/) ? (
                        <div className="">
                          <img
                            src={
                              axiosInstance.defaults.baseURL +
                              "/uploads/" +
                              message.file
                            }
                            alt="Sent Image"
                            className="max-w-full max-h-40 mt-2"
                          />
                        </div>
                      ) : (
                        message.file && (
                          <div className="">
                            <a
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 border-b"
                              href={
                                axiosInstance.defaults.baseURL +
                                "/uploads/" +
                                message.file
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {message.file}
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesBoxRef}></div>
              </div>
              <form
                className="flex m-3 shadow-lg rounded-full"
                onSubmit={sendMessage}
              >
                <input
                  type="text"
                  placeholder="Type your Massage Here"
                  className="bg-white py-2 ps-4 rounded-s-full flex-grow border-y border-l rounded-sm p-2"
                  value={newMassageText}
                  onChange={(ev) => setNewMassageText(ev.target.value)}
                />
                <label
                  role="button"
                  className="text-gray-500 border-y p-2 bg-white"
                >
                  <input type="file" className="hidden" onChange={sendFile} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                      clipRule="evenodd"
                    />
                  </svg>
                </label>
                <button
                  type="submit"
                  className="btn-chat rounded-r-full text-white"
                >
                  <LuSendHorizonal className="text-2xl mx-3 text-white" />
                </button>
              </form>
            </>
          ) : (
            <img src="./chat-3.png" alt="" className="h-screen mx-auto" />
          )}
        </div>
      </div>
    </>
  );
}
