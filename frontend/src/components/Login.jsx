import { useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import axios from "axios"
const SignUp = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show,setShow]=useState(false);
  const navigate=useNavigate();
  const toast=useToast();

    const togglePasswordVisibility=()=>{
        setShow(!show)
    }

    const submitHandler=async (e)=>{
      e.preventDefault();
      if( !email || !password){
        toast({
          title: 'Please fill all the fields',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom'
        });
        return
      }

      const formData=new FormData();
          formData.append('email',email);
          formData.append('password',password);
          console.log("yohooo",email,password);
    try{
          const {data}=await axios.post('/api/user/login',formData,{
            headers:{
              'Content-Type':'application/json'
            }
          });
          toast({
            title: 'Registration successful',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
        });
        console.log("hello succesfull");
        console.log("user from local storage",data);  
        localStorage.setItem("userInfo",JSON.stringify(data));
        navigate('/game');
        }
    catch(error){
      toast({
        title: error.message || 'Something went wrong',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom'
    });
    }
    }

  return (
    <div className="flex h-full w-full flex-col justify-center items-center px-6 py-2 lg:px-8">
      <form className="w-[75%] space-y-5" onSubmit={submitHandler}>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
            onChange={(e)=>setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div >
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2 flex relative">
            <input
            onChange={(e)=>setPassword(e.target.value)}
              id="password"
              name="password"
              type={show?"text":"password"}
              autoComplete="current-password"
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <button type='button' onClick={togglePasswordVisibility} className="text-xs absolute right-[2px] top-1/2 -translate-y-[50%]">{show ? "Hide" :"Show"}</button>

          </div>
        </div>


        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Log In
          </button>
        
        </div>
        <div>
        <button
          onClick={()=>{
                setEmail("guest@example.com"),
                setPassword("123456")
          }}
            type="submit"
            className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get Guest User Credential
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
