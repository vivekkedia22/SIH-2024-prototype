import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider.jsx";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../../miscellaneous/SideDrawer.jsx";
import MyChats from "../../miscellaneous/MyChats.jsx";
import ChatBox from "../../miscellaneous/ChatBox.jsx";
const Chats = () => {
  const { user, chats } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  // console.log("this is me speaking from chat page:",user,"also :",chats);

  return (
    <div style={{ width: "100%" }}>
      {user && (
        <SideDrawer/>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && (
          <MyChats fetchAgain={fetchAgain}/>
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chats;
