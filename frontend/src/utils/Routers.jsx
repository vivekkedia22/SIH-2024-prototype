import React from 'react'
import {Route,Routes} from "react-router-dom"
import Home from '../Pages/Home.jsx'
import Chats from '../Pages/Chats.jsx'
import Login from '../components/Login.jsx'
import SignUp from '../components/SignUp.jsx'
import Rough from '../Pages/rough.jsx'
const Routers = () => {
  return (
    <div>
    <Routes>
      <Route path="/" element={<Home/>}>
      </Route>
      <Route path='/game' element={<Rough/>}></Route>
      <Route path="/chats" element={<Chats/>}></Route>
     </Routes>      
    </div>
  )
}

export default Routers
