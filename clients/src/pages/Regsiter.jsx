import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';
import { googleAuth, registerUser } from '../apis/auth.js';
import { useState } from 'react';
import { BsEmojiLaughing, BsEmojiExpressionless } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { validUser } from '../apis/auth.js';
import logog from '../assets/Group.png';
const defaultData = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};
function Regsiter() {
  const [formData, setFormData] = useState(defaultData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const pageRoute = useNavigate();
  const handleOnChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (formData.email.includes('@') && formData.password.length > 6) {
      const { data } = await registerUser(formData);
      if (data?.token) {
        localStorage.setItem('userToken', data.token);
        toast.success('Succesfully Registered😍');
        setIsLoading(false);
        pageRoute('/chats');
      } else {
        setIsLoading(false);
        toast.error('Invalid Credentials!');
      }
    } else {
      setIsLoading(false);
      toast.warning('Provide valid Credentials!');
      setFormData({ ...formData, password: '' });
    }
  };

  const googleSuccess = async (res) => {
    if (res?.profileObj) {
      setIsLoading(true);
      const response = await googleAuth({ tokenId: res.tokenId });
      setIsLoading(false);
      if (response.data.token) {
        localStorage.setItem('userToken', response.data.token);
        pageRoute('/chats');
      }
    }
  };
  const googleFailure = (error) => {
    toast.error('Something Went Wrong.Try Agian!');
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_CLIENT_ID,
        scope: '',
      });
    };
    gapi.load('client:auth2', initClient);
    const isValid = async () => {
      const data = await validUser();
      if (data?.user) {
        window.location.href = '/chats';
      }
    };
    isValid();
  }, []);
  return (

    <div className="bg-hero-pattern bg-no-repeat bg-cover overflow-x-hidden">
        <div className="flex">
          <div className="h-screen flex flex-col items-start w-[50%] text-white pl-20 pt-32">
            <img src={logog} alt="goodspace" />
            <h1 className="text-3xl pt-6 font-semibold">Welcome to</h1>
            <h1 className="text-3xl font-semibold">Goodspace Communications</h1>
          </div>
          <div className="h-screen w-[50%]">
            <div className=" flex justify-center items-center backdrop-blur-xl rounded-[1.5rem] border-white w-[80%] text-white">
              <div className="w-[90%] sm:w-[400px] pl-0 ml-0 h-[600px] sm:pl-0 sm:ml-9 mt-20 relative"> <div className="absolute -top-5 left-0">
                  <h3 className=" text-[25px] font-bold tracking-wider">
                    Signup 
                  </h3>
                  <p className=" text-[12px] tracking-wider font-medium">
                    No Account ?{' '}
                    <Link className="underline" to="/login">
                      Sign in
                    </Link>
                  </p>
                </div>
                <form
                  className="flex flex-col gap-y-3 mt-[20%]"
                  onSubmit={handleOnSubmit}
                >
                  <label htmlFor="">Your First Name</label>
                  <div>
                    <input
                      className="w-[100%] sm:w-[80%] bg-white h-[40px] pl-3 text-black rounded-md"
                      onChange={handleOnChange}
                      name="firstname"
                      type="text"
                      placeholder="firstname"
                      value={formData.firstname}
                      required
                    />
                  </div>
                  <label htmlFor="">Your Last Name</label>
                  <div>
                    <input
                      className="w-[100%] sm:w-[80%] bg-white h-[40px] pl-3 text-black rounded-md"
                      onChange={handleOnChange}
                      name="lastname"
                      type="text"
                      placeholder="lastname"
                      value={formData.lastname}
                      required
                    />
                  </div>
                  <label htmlFor="">Your Email</label>
                  <div>
                    <input
                      className="w-[100%] sm:w-[80%] bg-white h-[40px] pl-3 text-black rounded-md"
                      onChange={handleOnChange}
                      name="email"
                      type="text"
                      placeholder="Email"
                      value={formData.email}
                      required
                    />
                  </div>
                  <label htmlFor="">Password</label>
                  <div className="relative">
                    <input
                      className="w-[100%] sm:w-[80%] bg-white h-[40px] pl-3 text-black rounded-md"
                      onChange={handleOnChange}
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      required
                    />
                    {!showPass ? (
                      <button type="button">
                        <BsEmojiLaughing
                          onClick={() => setShowPass(!showPass)}
                          className="text-[#fff] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]"
                        />
                      </button>
                    ) : (
                      <button type="button">
                        {' '}
                        <BsEmojiExpressionless
                          onClick={() => setShowPass(!showPass)}
                          className="text-[#fff] absolute top-3 right-5 sm:right-24 w-[30px] h-[25px]"
                        />
                      </button>
                    )}
                  </div>

                  <button
                    className="  bg-blue-500 w-[100%]  sm:w-[80%] h-[50px] font-bold text-white tracking-wide text-[17px] relative mt-8 backdrop-blur-lg"
                    type="submit"
                  >
                    <div
                      style={{ display: isLoading ? '' : 'none' }}
                      className="absolute -top-[53px] left-[27%] sm:-top-[53px] sm:left-[56px]"
                    >
                      <lottie-player
                        src="https://assets2.lottiefiles.com/packages/lf20_h9kds1my.json"
                        background="transparent"
                        speed="1"
                        style={{ width: '200px', height: '160px' }}
                        loop
                        autoplay
                      ></lottie-player>
                    </div>
                    <p
                      style={{ display: isLoading ? 'none' : 'block' }}
                      className="test-[#fff]"
                    >
                      Register
                    </p>
                  </button>
                  {/* <div className='border-t-[1px] w-[100%] sm:w-[80%] my-3' ></div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default Regsiter;
