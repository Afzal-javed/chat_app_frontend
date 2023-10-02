import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from "../../assets/Avatar.png"
import call from "../../assets/call.png"
import video from "../../assets/video.png";
import Input from "../../Components/Input/Input"
import send from "../../assets/send.png";
import add from "../../assets/add.png";
import addFriend from "../../assets/addFriend.png";
import "../Dashboard/Dashboard.css";

const ChatPage = ({ isMobile, onAddFriendClick, setMessages, isTab, messages, user, imageInputRef, socket, styles, setConversations }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSendingImage, setIsSendingImage] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const messageRef = useRef();
    useEffect(() => {
        messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages?.messages])
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user:detail'))
        const fetchConversations = async () => {
            const res = await fetch(`http://localhost:8000/api/conversations/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json();
            setConversations(resData)
        }
        fetchConversations();
    }, [])
    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() || isSendingImage) {
            const formData = new FormData();
            formData.append('conversationId', messages?.conversationId)
            formData.append('senderId', user?.id);
            formData.append('receiverId', messages?.receiver?.receiverId);
            formData.append('messageType', isSendingImage ? 'image' : 'text');
            formData.append('message', message);
            formData.append('photo', selectedImage);
            const newMessage = {
                user: { id: user.id, fullName: user.fullName, email: user.email },
                message: isSendingImage ? 'Image' : message,
                time: new Date().toLocaleTimeString()
            };
            // setMessages((prevMessages) => ({
            //   ...prevMessages,
            //   messages: [...prevMessages.messages, newMessage],
            // }));
            socket?.emit('sendMessage', {
                senderId: user?.id,
                receiverId: messages?.receiver?.receiverId,
                message,
                conversationId: messages?.conversationId,
                time: newMessage.time
            });
            const res = await fetch('http://localhost:8000/api/message', {
                method: 'POST',
                headers: {},
                body: formData,
            });
            setMessage('');
            setSelectedImage(null);
            setIsSendingImage(false);
        };
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setIsSendingImage(true);
        }
    };
    const fontStyles = {
        FontSize: {
            fontSize: '0.75rem',
            lineHeight: '0.5rem',
            // marginTop: '2px',
        }
    }

    return (
        <div className={`bg-[white] h-screen flex flex-col items-center ${isMobile ? '' : isTab ? 'row-start-1 col-span-2 h-[100vh]' : 'w-[50%]'}`}>
            {
                messages?.receiver?.fullName &&
                <div className={`w-[80%] bg-[#bbe6f5] h-[75px] my-7 rounded-full flex items-center px-10`}>
                    <div className='cursor-pointer'><img src={messages?.receiver?.profilePicture || Avatar} style={styles.profileImages} alt='Avatar' /></div>
                    <div className='ml-3 mr-auto'>
                        <h3 className='text-lg cursor-pointer'>{messages?.receiver?.fullName}</h3>
                        <p className='text-sm font-light text-gray-800 cursor-pointer'>{messages?.receiver?.userStatus === 'online' ? messages?.receiver?.userStatus : `last seen ${messages?.receiver?.userStatus}`}</p>
                    </div>
                    <div className=' cursor-pointer mr-4'><img src={video} width={30} height={30} alt='video' /></div>
                    <div className=' cursor-pointer'><img src={call} alt='call' /></div>
                    {
                        isTab && (
                            <div className='cursor-pointer ml-2 ' onClick={onAddFriendClick}>
                                <img src={addFriend} alt='addFriend' width={30} height={30} />
                            </div>
                        )
                    }
                </div>
            }
            <div className='h-[85%] w-[103%] overflow-scroll overflow-x-hidden border-b '>
                <div className=' px-7 py-10'>
                    {
                        messages?.messages?.length > 0 ?
                            messages.messages.map(({ message, image, time, user: { id } = {} }, index) => {
                                return (
                                    <div key={index}>{
                                        image ?
                                            (
                                                <div className='relative'>
                                                    <img src={image} alt='images' className={`max-w-[50%] rounded-b-xl  p-1 mb-6 ${id === user?.id ?
                                                        'bg-[#2c84a4] text-white rounded-tl-xl ml-auto' : 'bg-[#c3c1c1] rounded-tr-xl'}`}>
                                                    </img>
                                                    <span className={`absolute text-white ${id === user?.id ? 'bottom-4 right-3' : 'bottom-4 left-3'}`} style={fontStyles.FontSize}>{time}</span>
                                                    <div ref={messageRef}></div>
                                                </div>
                                            ) : (
                                                <div>
                                                    <div className={`relative max-w-[45%] rounded-b-xl  p-4 mb-6 ${id === user?.id ?
                                                        'bg-[#2c84a4] text-white rounded-tl-xl ml-auto' : 'bg-[#c3c1c1] rounded-tr-xl'}`}>
                                                        {message}
                                                        <p className='absolute bottom-3 right-3' style={fontStyles.FontSize}>{time}</p>
                                                    </div>
                                                    <div ref={messageRef}></div>
                                                </div>
                                            )
                                    }
                                    </div>
                                )
                            }) : <div className='text-center text-lg font-semibold mt-20'> No message</div>
                    }
                </div>
            </div>
            {
                messages?.receiver?.fullName &&
                <div className='p-4 w-full bg-white flex items-center shadow-md'>
                    <Input placeholder={`Type a ${isSendingImage ? 'message...' : 'message or select an image...'}`}
                        value={isSendingImage ? selectedImage?.name : message}
                        onChange={(e) => isSendingImage ? setSelectedImage(null) : setMessage(e.target.value)}
                        className='w-[75%]' inputClassName='p-4 shadow-lg rounded-full bg-[#bbe6f5]'
                        readOnly={isSendingImage} />
                    <div className=' flex items-center'>
                        <input type='file' name='photo' accept='image/*' onChange={handleImageChange} style={{ display: 'none' }}
                            ref={imageInputRef} id='imageInput' />
                        <label htmlFor='imageInput'>
                            <img src={add} width={48} height={48} alt='add' className={`ml-6 cursor-pointer`} />
                        </label>
                        <img src={send} width={48} height={48} onClick={(e) => sendMessage(e)} alt='send' className={`ml-6 cursor-pointer ${!(message.trim() || isSendingImage) && 'pointer-events-none'}`} />
                    </div>
                </div>
            }
        </div>
    )
}

export default ChatPage