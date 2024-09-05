import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider.jsx";
import { useToast } from "@chakra-ui/toast";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import { getSender } from "../src/config/ChatsLogic.js";
import GroupChatModal from "./GroupChatModal.jsx";
const MyChats = ({ fetchAgain }) => {
  const { user, chats, selectedChat, setChats, setSelectedChat } = ChatState();

  const [loggedUser, setLoggedUser] = useState(null); // Initialize with null
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat/", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(userInfo);
    fetchChats();
  }, [fetchAgain]); // Include dependencies to trigger fetch on user change

  return (
    <Box
      // className={`${selectedChat?"hidden":"flex "} md:flex`}
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        {/* {console.log("this is me speaking on behalf of the selected chat",selectedChat)} */}
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats && (
          <Stack overflowY="scroll">
            {/* {console.log("checking for error here why is the chats not working",chats)} */}
            {chats.map((chat) => {
              // console.log("hello i am speaking rom mychats.jsx from line 87 and the issue is i am printing chats and chat to chec whats happenig here",chats,"now this is chat",chat);
              // console.log(chat.chatName);
              // console.log(chat.isGroupChat);
              // console.log("also this is chat.users",chat.users);
              return (
                <Box
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {/* {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage?.sender.name} : </b>
                    {chat.latestMessage?.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )} */}
                </Box>
              );
            })}
          </Stack>
        )}
        {!chats && <ChatLoading />}{" "}
        {/* Display loading state when chats are not yet fetched */}
      </Box>
    </Box>
  );
};

export default MyChats;
