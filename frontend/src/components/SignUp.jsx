import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react'
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
// import { useToast } from "@chakra-ui/toast";
const SignUp = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState();
    const [show,setShow]=useState(false);
    const [picLoading, setPicLoading] = useState(false);
    const toast = useToast()
    const navigate=useNavigate();
    const handleClick = () => setShow(!show);


    const submitHandler = async (e) => {
      e.preventDefault();
  
      if (!name || !email || !password || !confirmPassword) {
          toast({
              title: 'Please fill all the fields',
              status: 'warning',
              duration: 5000,
              isClosable: true,
              position: 'bottom'
          });
          return;
      }
      if (password !== confirmPassword) {
          toast({
              title: 'Passwords do not match',
              status: 'warning',
              duration: 5000,
              isClosable: true,
              position: 'bottom'
          });
          return;
      }
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('avatar', avatar);
  
      try {
          const { data } = await axios.post('/api/user/register', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          toast({
              title: 'Registration successful',
              status: 'success',
              duration: 5000,
              isClosable: true,
              position: 'bottom'
          });
          localStorage.setItem("userInfo",JSON.stringify(data))
          navigate('/game');
      } catch (error) {
          toast({
              title: error.response?.data?.message || 'Something went wrong',
              status: 'error',
              duration: 5000,
              isClosable: true,
              position: 'bottom'
          });
      }
  };
  

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
