import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Avatar from "../../assets/Avatar.png";
import UserAccount from '../../Components/User/UserAccount';
const AllUsers = ({ setMessages, users, setUsers, user, styles }) => {
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
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`http://localhost:8000/api/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json();
            setUsers(resData);
        }
        fetchUsers()
    }, [])

    return (
        <div className={` w-[25%] px-8 py-10 h-screen bg-[#bbe6f5]`}>
            <UserAccount />
            <div className='h-[93%] overflow-scroll overflow-x-hidden border-b'>
                {
                    users?.length > 0 ?
                        users.map(({ usersId, user }) => {
                            return (
                                <div className='flex items-center  py-4 border-[#555454] border-b-2' key={usersId}>
                                    <div className='flex items-center'

                                        onClick={() => fetchMessages('new', user)}
                                    // onClick={() => handleUserClick({ usersId, user })}
                                    >
                                        <div><img src={user?.profilePicture || Avatar} className='cursor-pointer' alt='avatar' style={styles.profileImages} /></div>
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
    )
}

export default AllUsers