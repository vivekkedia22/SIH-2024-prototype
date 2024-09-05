import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider.jsx";
import { Box, Text } from "@chakra-ui/layout";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatsLogic.js";
import ProfileModal from "../../miscellaneous/ProfileModal.jsx";
import UpdateGroupChatModal from "../../miscellaneous/UpdateGroupChatModal.jsx";
import ScrollableChat from "../../miscellaneous/ScrollableChat.jsx";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "react-lottie"
import animationData from "../animation/typing.json"
// import VideoModal from "../../miscellaneous/VideoModal.jsx";



const ENDPOINT = "http://localhost:3000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notification,setNotification } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const defaultOptions={
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const toast = useToast();
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      console.log(messages);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit('stop typing',selectedChat._id)
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          { chatId: selectedChat._id, content: newMessage },
          config
        );
        // console.log("Speaking from singleChat to check if the message i sent is being sent properly",data);
        socket.emit('new message',data)
        setMessages([...messages, data]);

      } catch (error) {
        // console.log(error);
        toast({
          title: "Error Occured!",
          description: "Failed to send the Messagewa",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setNewMessage("");
      }
    }
  };
  const typingHandler = async (e) => {
    setNewMessage(e.target.value);

    //typing indicator logic
    if(!socketConnected) return
    if(!typing){
      setTyping(true)
      socket.emit('typing',selectedChat._id)
    }
    let lastTypingTime=new Date().getTime();
    var timerLength=3000;
    setTimeout(()=>{
      let timeNow=new Date().getTime();
      let timeDiff=timeNow-lastTypingTime;

      if(timeDiff>=timerLength && typing){
        socket.emit("stop typing",selectedChat._id);
        setTyping(false)
      }

    },timerLength)
  };
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing",()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false))
  }, []);
  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);
console.log("notification==================",notification);
  useEffect(() => {
    socket.on("message received socket", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if(!notification.includes(newMessageReceived)){
          setNotification([newMessageReceived,...notification]);
          setFetchAgain(!fetchAgain)
        }

      }
      else{
        setMessages([...messages,newMessageReceived])
      }
    });
  });



  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  {/* <VideoModal socket={socket}/> */}
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="flex flex-col overflow-y-scroll">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              idisplay="first-name"
              isRequired
              mt={3}
            >
              {istyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
