import React, { useState } from 'react';
import Input from '../../Components/Input/Input';
import Button from '../../Components/Button/Button';
import { useNavigate } from 'react-router-dom';
import Avatar from "../../assets/Avatar.png";
import "./Form.css";
const Form = ({ isSignInPage = true }) => {
    const [data, setData] = useState({
        ...(!isSignInPage && {
            fullName: ""
        }),
        email: "",
        password: ""
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
    const navigate = useNavigate();

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
            const res = await fetch(`http://localhost:8000/api/${isSignInPage ? 'login' : 'register'}`, {
                method: 'POST',
                body: formData,
            });
            if (res.status === 400) {
                alert("Invalid credentials");
            } else if (res.status === 200 && isSignInPage) {
                const resData = await res.json();
                if (resData.token) {
                    localStorage.setItem('user:token', resData.token);
                    localStorage.setItem('user:detail', JSON.stringify(resData.user));
                    navigate('/');
                }
            } else {
                const resData = await res.json();
                navigate('/users/sign_in');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);

        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };
    const styles = {
        profileImage: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            objectFit: 'cover',
        },
    };
    return (
        <div className='w-full h-screen flex items-center justify-center bg-[lightblue]'>
            <div className='content'>
                <div className='text-3xl font-bold'>Welcome {isSignInPage && "Back"}</div>
                <div className='mb-[0.5rem]'>{isSignInPage ? 'Sign In now' : 'Sign up now'}</div>
                <div className='profile-section'>
                    {selectedImage ? (
                        <img
                            src={URL.createObjectURL(selectedImage)}
                            className='profile-image rounded-full'
                            alt="Profile"
                        />
                    ) : (<div>
                        {isSignInPage ?
                            <>
                                <img src={user?.profilePicture || Avatar} className='profile-image rounded-full' alt="Profile" />
                            </> : <>
                                <img src={Avatar} className='profile-image rounded-full' alt="Profile" />
                            </>
                        }
                    </div>
                    )}
                    <div className='flex items-center mt-4 mb-[0.5rem]' id='file'>
                        {!isSignInPage &&
                            <input type="file" name='profilePicture' accept="image/*" onChange={handleImageChange} />
                        }
                    </div>
                </div>

                <form className='form' onSubmit={(e) => handleSubmit(e)}>
                    {!isSignInPage && <Input label='Full Name' name='name' placeholder='Enter your name' value={data.fullName} onChange={(e) => setData({ ...data, fullName: e.target.value })} className='mb-[1rem]' />}
                    <Input label='Email' type='email' name='email' placeholder='Enter your email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className='mb-[1rem]' />
                    <Input label='Password' type='password' name='password' placeholder='Enter your password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} className='mb-[1rem]' />
                    <Button label={isSignInPage ? 'Sign In' : 'Sign Up'} type='submit' className='w-[50%] mb-2' />
                </form>
                <div>{isSignInPage ? "Don't have an account?" : 'Already have an account?'} <span onClick={() => navigate(`/users/${isSignInPage ? 'sign_up' : 'sign_in'}`)} className='text-[blue] cursor-pointer'>{isSignInPage ? 'Sign Up' : 'Sign In'}</span></div>
            </div>
        </div>
    );
}

export default Form;
