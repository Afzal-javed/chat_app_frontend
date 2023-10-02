import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import logout from "../../assets/logout1.png";
import deleteIcon from "../../assets/delete.png";

const UserAccount = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const userId = user.id;
            const response = await fetch(`/api/logout/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.ok) {
                localStorage.removeItem('user:token');
                navigate('/users/sign_in')
                console.log('User logged out successfully');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };
    const handleDelete = async () => {
        try {
            const userConfirmed = window.confirm('Are you sure to delete account ?');
            if (userConfirmed) {
                const userId = user.id;
                const response = await fetch(`/api/delete/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    localStorage.removeItem('user:token');
                    localStorage.removeItem('user:detail');
                    navigate('/users/sign_up')
                } else {
                    alert('Deletion Failed')
                }
            }
        } catch (error) {
            alert('Internal server error');
        }
    }
    return (
        <div className='text-[blue] flex justify-between mb-4'>
            <p className='text-[blue] text-lg'>People</p>
            <div className='flex flex-col items-center'>
                <img src={logout} alt='logout' className='cursor-pointer' onClick={() => handleLogout()} width={30} height={30} />
                <p className='text-[black] cursor-pointer' onClick={() => handleLogout()}>Logout</p>
            </div>
            <div className='flex flex-col items-center'>
                <img src={deleteIcon} alt='delete' className='cursor-pointer' onClick={() => handleDelete()} width={30} height={30} />
                <p className='text-[black] cursor-pointer' onClick={() => handleDelete()}>Account</p>
            </div>
        </div>
    )
}

export default UserAccount