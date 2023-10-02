import React, { useState } from 'react'
import Avatar from "../../assets/Avatar.png"
import { useNavigate } from 'react-router-dom';
import "../Dashboard/Dashboard.css";
import User from '../../Components/User/User';
const FriendList = ({ conversations, setConversations, setMessages, styles, user }) => {
    const [currentChatUser, setCurrentChatUser] = useState(null);
    const [showFriendList, setShowFriendList] = useState(false);
    const [friendOrder, setFriendOrder] = useState([]);
    const navigate = useNavigate();
    const fetchMessages = async (conversationId, receiver) => {
        const res = await fetch(`http://localhost:8000/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const resData = await res.json();
        setMessages({ messages: resData, receiver, conversationId });
    };
    const startChatWithUser = (user) => {
        setCurrentChatUser(user);
        setConversations((prevConversations) => {
            const index = prevConversations.findIndex((conv) => conv.user.receiverId === user.receiverId);
            if (index !== -1) {
                prevConversations.splice(index, 1);
                return [{ user, conversationId: 'new' }, ...prevConversations];
            }
            return [{ user, conversationId: 'new' }, ...prevConversations];
        });
        setFriendOrder((prevOrder) => {
            const updatedOrder = prevOrder.filter((userId) => userId !== user.usersId);
            return [user.usersId, ...updatedOrder];
        });
    };
    const toggleFriendList = () => {
        setShowFriendList(!showFriendList);
    };
    const handleEdit = () => {
        const userConfirmed = window.confirm('Do you want to Edit your Profile ?');
        if (userConfirmed) {
            navigate('/users/update')
        }
    }
    return (
        <div
            className=' w-[25%] h-screen bg-[#bbe6f5]' >
            <User />
            <hr />
            <div className='mx-10 mt-5 h-[80%] overflow-scroll overflow-x-hidden border-b'>
                <div className='text-[blue] text-lg'>Message</div>
                <div>
                    {
                        conversations.length > 0 ?
                            conversations.map(({ conversationId, user }) => {
                                return (
                                    <div
                                        key={user.receiverId}
                                        className='flex items-center  py-4 border-[#555454] border-b-2'
                                        onClick={() => startChatWithUser(user)}
                                    >
                                        <div className='flex items-center' onClick={() => fetchMessages(conversationId, user)}>
                                            <div>
                                                <img src={user?.profilePicture || Avatar} className='cursor-pointer' alt='avatar' style={styles.profileImages} />
                                            </div>
                                            <div className='ml-5'>
                                                <h3 className='text-xl cursor-pointer'>{user?.fullName}</h3>
                                                <p className='text-1rem font-light cursor-pointer'>{user?.email}</p>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                )
                            }) : <div className='text-center text-lg font-semibold mt-20'>No Friends</div>
                    }
                </div>
            </div>
        </div>
    )
}

export default FriendList