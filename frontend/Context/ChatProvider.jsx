import { createContext, useEffect,useState,useContext } from "react";
import {useNavigate} from "react-router-dom"
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat,setSelectedChat]=useState();
  const [chats,setChats]=useState([])
  const [notification,setNotification]=useState([]);
  const [callNotification,setCallNotification]=useState([]);
  const navigate=useNavigate();
  let socket;
  const ENDPOINT = "http://localhost:3000";

  useEffect(()=>{
    const userInfo=JSON.parse(localStorage.getItem("userInfo"))
    setUser(userInfo);
    console.log("hello all this is me vivek :",user);
    console.log("hello all this is me vivek 2:",chats);
    console.log("hello all this is me vivek 3:",selectedChat);
    if(!userInfo){
      navigate('/')
    }
  },[navigate])

  return <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification,socket }}>{children}</ChatContext.Provider>;
};

export const ChatState=()=>{
  return useContext(ChatContext);
}
export default ChatProvider;
