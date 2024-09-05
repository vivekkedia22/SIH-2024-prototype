import { useState } from 'react'

import Routers from './utils/Routers.jsx'
// import Home from './Pages/Home.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <div className='max-w-[100vw] bg-[url("../images/bg_img.jpg")] bg-cover'>
     <Routers/>
     {/* <Home/> */}
     </div>
    </>
  )
}

export default App
