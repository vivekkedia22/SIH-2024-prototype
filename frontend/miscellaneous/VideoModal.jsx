// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   useDisclosure,
//   IconButton,
// } from '@chakra-ui/react';
// import { FaVideo } from 'react-icons/fa';
// import io from 'socket.io-client';
// // import Peer from 'simple-peer'; // Add simple-peer for WebRTC
// const VideoModal = ({ selectedChat,socket }) => {
//     const { isOpen, onOpen, onClose } = useDisclosure();
//     const [socket, setSocket] = useState(null);
//     // const [myStream, setMyStream] = useState(null);
//     // const [otherStream, setOtherStream] = useState(null);
//     // const [peer, setPeer] = useState(null);
//     // const myVideoRef = useRef();
//     // const otherVideoRef = useRef();

    
//     // Other state variables as needed
//     // e.g., const [isCalling, setIsCalling] = useState(false);
//     // useEffect(() => {
      
//     //   }, []);
//     //   const startCall = () => {
     
//     //   };
      
//     //   const endCall = () => {
//     //    onClose()
//     //   };

//       return (
//         <>
         
      
//           <Modal isOpen={isOpen} onClose={endCall}>
//             <ModalOverlay />
//             <ModalContent>
//               <ModalHeader>Video Call</ModalHeader>
//               <ModalCloseButton />
//               <ModalBody>
//                 <video ref={myVideoRef} autoPlay style={{ width: '100%' }} muted />
//                 <video ref={otherVideoRef} autoPlay style={{ width: '100%' }} />
//               </ModalBody>
//               <ModalFooter>
//                 <Button colorScheme="red" onClick={endCall}>
//                   End Call
//                 </Button>
//               </ModalFooter>
//             </ModalContent>
//           </Modal>
//         </>
//       );
      
      
      
//   };
  
//   export default VideoModal