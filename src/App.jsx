import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

let socket;

function App() {
  const [tempUsername, setTempUsername] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (username) {
      socket = io("https://group-chat-backend-production.up.railway.app/");

      socket.on(
        "chat message",
        ({ username: senderName, message: chatMessage }) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            { senderName, message: chatMessage },
          ]);
        }
      );

      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [username]);

  const joinChat = () => {
    if (tempUsername) {
      setUsername(tempUsername);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("chat message", { username, message });
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        {!username ? (
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-700 mb-4">
              Enter Your Username
            </h1>
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Your username"
              value={tempUsername}
              onChange={(e) => setTempUsername(e.target.value)}
            />
            <button
              onClick={joinChat}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <>
            <div className="h-96 overflow-y-scroll border p-4 rounded-md mb-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderName === username
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`p-3 rounded-md ${
                      msg.senderName === username
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.senderName === username ? (
                      ""
                    ) : (
                      <p className="text-sm font-semibold">{msg.senderName}</p>
                    )}
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
