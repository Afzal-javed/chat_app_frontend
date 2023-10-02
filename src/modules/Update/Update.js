import React, { useEffect, useState } from 'react'
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import Avatar from "../../assets/Avatar.png"
import { useNavigate } from 'react-router-dom';
import "../Form/Form.css";
const Update = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const [selectedImage, setSelectedImage] = useState(null);
    const [data, setData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        password: ""
    })
    const styles = {
        profileImage: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
        }
    }
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user:detail'));
        if (userData) {
            setUser(userData);
            setData({
                fullName: userData?.fullName,
                email: userData?.email,
                password: "",
            });
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (selectedImage) {
            formData.append('profilePicture', selectedImage);
        }
        formData.append('fullName', data.fullName);
        formData.append('email', data.email);
        formData.append('password', data.password);
        try {
            const userId = user.id
            const res = await fetch(`http://localhost:8000/api/update/${userId}`, {
                method: 'PATCH',
                body: formData
            });
            if (res.status === 500) {
                alert('Interal server error');
            } else if (res.status === 400) {
                alert('This email is already used by another');
            }
            else {
                const resData = await res.json();
                if (resData.token) {
                    localStorage.setItem('user:detail', JSON.stringify(resData));
                    localStorage.removeItem('user:token');
                    navigate('/users/sign_in')
                }
            }
        } catch (error) {
            console.log("Error occured while updating profile", error);
        }
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    }
    return (
        <div className='w-full h-screen flex justify-center items-center bg-[lightblue]'>
            <div className='content'>
                <h2 className='text-3xl font-bold mb-[1rem]'>Profile</h2>
                <div className='profile-section'>
                    {
                        selectedImage ? (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                className='profile-image rounded-full'
                                alt="Profile"
                                style={styles.profileImage}
                            />
                        ) : (
                            <img src={user?.profilePicture || Avatar} className='profile-image rounded-full' alt="Profile" style={styles.profileImage} />
                        )
                    }
                    <div className='flex items-center mt-4 mb-[0.5rem]' id='file'>
                        <input type="file" name='profilePicture' accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>
                <form className='form' onSubmit={(e) => handleSubmit(e)}>
                    <Input type='text' label='Full Name' placeholder='Enter Your Name' name='name' value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} className='mb-[1rem]' />
                    <Input type='text' label='Email' placeholder='Enter Your Email' name='email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className='mb-[1rem]' />
                    <Input type='password' label='Password' placeholder='Enter Your Password' name='password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} className='mb-[1rem]' />
                    <Button label='Update' type='submit' className='w-[50%] mb-2' />
                </form>

            </div>
        </div>
    )
}

export default Update