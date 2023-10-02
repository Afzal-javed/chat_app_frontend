import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import FriendList from '../FriendList/FriendList';
import AllUsers from '../AllUsers/AllUsers';
import ChatPage from '../ChatPage/ChatPage';
import "./Dashboard.css";
const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [socket, setSocket] = useState(null);
  const imageInputRef = useRef(null);
  useEffect(() => {
    const socket = io('http://localhost:8002');
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, [])
  useEffect(() => {
    socket?.emit('addUser', user?.id)
    socket?.on('getUsers', users => {
      console.log(users)
    })
    socket?.on('getMessage', (data) => {
      setMessages((prev) => {
        const newMessage = {
          user: data.user,
          message: data.message,
          time: data.time,
        };

        return {
          ...prev,
          messages: [...prev.messages, newMessage],
        };
      });
    });
    // socket?.on('getMessage', data => {
    //   setMessages(prev => ({
    //     ...prev,
    //     messages: [...prev.messages, { user: data.user, message: data.message }]
    //   }))

    // })
  }, [socket])
  const styles = {
    profileImage: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    profileImages: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
  };

  const handleAttachPhotoClick = () => {
    imageInputRef.current.click();
  };
  return (
    <div className={`bg-[#bbe6f5] w-screen h-screen flex`}>
      <FriendList conversations={conversations} setConversations={setConversations} setMessages={setMessages} styles={styles} user={user} />
      <ChatPage messages={messages} user={user} styles={styles} socket={socket} imageInputRef={imageInputRef} setConversations={setConversations} />
      <AllUsers setMessages={setMessages} users={users} setUsers={setUsers} user={user} styles={styles} />
    </div>
  )
}
export default Dashboard