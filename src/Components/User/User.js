import React, { useState } from 'react'
import Avatar from "../../assets/Avatar.png";
import { useNavigate } from 'react-router-dom';
const User = (isMobile) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const navigate = useNavigate();
    const handleEdit = () => {
        const userConfirmed = window.confirm('Do you want to Edit your Profile ?');
        if (userConfirmed) {
            navigate('/users/update')
        }
    }
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
    return (
        <div className={`flex items-center  mx-10 my-4 `}>
            <div className='border cursor-pointer border-black p-[1px] rounded-full'>
                <img src={user?.profilePicture || Avatar} onClick={() => handleEdit()} alt='avatar' style={styles.profileImage} />
            </div>
            <div className='ml-5'>
                <h3 className='text-2xl cursor-pointer'>{user.fullName}</h3>
                <p className='text-1rem font-light cursor-pointer'>{user.email}</p>
            </div>

        </div>

    )
}

export default User