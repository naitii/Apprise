/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Avatar, Box, Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectedChatAtom } from "../atoms/chat.atom";
import React, { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/showToast";
import userAtom from "../atoms/user.atom";
import { CiImageOn } from "react-icons/ci";
import { BsSend } from "react-icons/bs";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import usePreviewImg from "../hooks/usePreviewIng"; 


const Chats = () => {
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [allChat, setAllChat] = useState([]);
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const socket = useSocket();
  const imgRef = useRef(null);
  const { onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const { handleImg, imgUrl, setImgUrl } = usePreviewImg();


  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }},[]);

   useEffect(() => {
       const element = document.getElementById("messageContainer");
       if(element)
          element.scrollTop = element.scrollHeight;
   });


   const handleKeyDown = (e) => {
     if (e.key === "Enter") {
       sendMessage();
     }
   };

  const sendMessage = async () => {
    if(message.trim() === "" && !imgUrl) return;
    if(loading) return;
    setLoading(true);
    try {
      if(imgUrl){
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverId: selectedChat.userId,
            message: "",
            img: imgUrl,
          }),
        });
        const data = await res.json();
        if (data.error) {
          showToast("error", "Error in sending message", data.error);
          return;
        }
        setAllChat([...allChat, data]);
        setMessage("");
        setImgUrl("");
      }
      else{
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receiverId: selectedChat.userId,
            message,
            img: "",
          }),
        });
        const data = await res.json();
        if (data.error) {
          showToast("error", "Error in sending message", data.error);
          return;
        }
        setAllChat([...allChat, data]);
        setMessage("");
        setImgUrl("");
      }
    } catch (err) {
      showToast("error", "Error in sending message", err.message);
    }finally{
      setLoading(false);

    }
  }
  useEffect(() => {
    // if(socket){
    socket?.on("newChat", (data) => {
      console.log("new chat data: ", selectedChat._id === data?.convoId);
      if(selectedChat._id.toString() === data?.convoId.toString()){
        setAllChat((prevChat) => [...prevChat, data]);
        const element = document.getElementById("messageContainer");
        if (element) element.scrollTop = element.scrollHeight;
      }
    });

    return () => {
      socket?.off("newChat");
    };
    // }
  }, [socket]);

  useEffect(() => {
    if(selectedChat.mock) return setAllChat([]);
    const fetchChat = async () => {
      if(selectedChat._id === "") return;
      try {
        const res = await fetch(`/api/chat/${selectedChat?.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("error", "Error in fetching chat", data.error);
          return;
        }
        setMessage("");
        setAllChat(data);
      } catch (err) {
        showToast("error", "Error in fetching chat", err.message);
      }
    }
    fetchChat();
  }, [selectedChat, showToast]);

  if (selectedChat._id === "") {
    return (
      <Flex alignItems={"center"} h={"70vh"} justifyContent={"center"}>
        <Text fontSize={20}>Select a chat to start messaging</Text>
      </Flex>
    );
  }
   
  return (
    <Box
      bg={useColorModeValue("gray.300", "#1e1e1e")}
      w={"100%"}
      rounded={5}
      overflowY={"auto"}
    >
      <Flex
        bg={useColorModeValue("gray.200", "gray.700")}
        w={"100%"}
        gap={3}
        p={3}
        pl={6}
      >
        {isMobile && (
          <Box
            as={IoIosArrowRoundBack}
            w={9}
            h={9}
            color={"blue.500"}
            onClick={(e) => {
              e.preventDefault;
              history.back();
              setSelectedChat({
                _id: "",
                userId: "",
                name: "",
                username: "",
                userProfilePic: "",
              });
            }}
          />
        )}
        <Link
          to={`/profile/${selectedChat.username}`}
          style={{ textDecoration: "none" }}
        >
          <Flex>
            <Avatar src={selectedChat.userProfilePic} />
            <Box>
              <Text ml={3} fontSize={20} fontWeight={"bold"}>
                {selectedChat.name}
              </Text>
              <Text ml={3} fontSize={15}>
                (@{selectedChat.username})
              </Text>
            </Box>
          </Flex>
        </Link>
      </Flex>
      {/* mapping */}
      <Box p={4} overflowY={"auto"} h={"400px"} id="messageContainer">
        <Flex flexDirection={"column"} alignItems={"center"} mt={4} mb={4}>
          <Avatar
            height={"100px"}
            w={"100px"}
            src={selectedChat.userProfilePic}
          />
          <Text ml={3} fontSize={20} fontWeight={"bold"}>
            {selectedChat.name}
          </Text>
        </Flex>
        {allChat.map((chat) => (
          <React.Fragment key={chat._id}>
            {chat.img ? (
              <Flex
                justifyContent={
                  chat.sender === user._id ? "flex-end" : "flex-start"
                }
                mb={4}
              >
                {chat.sender !== user._id && (
                  <Avatar w={10} h={10} src={selectedChat.userProfilePic} />
                )}
                <Box
                  p={1}
                  ml={3}
                  mr={3}
                  bg={chat.sender === user._id ? "blue.300" : "gray.500"}
                  color={"white"}
                  rounded={5}
                  maxW={"70%"}
                >
                  <Link to={chat.img} target="blank">
                    <Image src={chat.img} />
                  </Link>
                </Box>
                {chat.sender === user._id && (
                  <Avatar w={10} h={10} src={user.profilePic} />
                )}
              </Flex>
            ) : (
              <Flex
                justifyContent={
                  chat.sender === user._id ? "flex-end" : "flex-start"
                }
                mb={4}
              >
                {chat.sender !== user._id && (
                  <Avatar w={10} h={10} src={selectedChat.userProfilePic} />
                )}
                <Box
                  p={2}
                  ml={3}
                  mr={3}
                  bg={chat.sender === user._id ? "blue.300" : "gray.500"}
                  color={"white"}
                  rounded={5}
                  maxW={"70%"}
                >
                  {chat.text}
                </Box>
                {chat.sender === user._id && (
                  <Avatar w={10} h={10} src={user.profilePic} />
                )}
              </Flex>
            )}
          </React.Fragment>
        ))}
      </Box>

      <Flex alignItems={"center"}>
        <Box
          as={CiImageOn}
          w={9}
          h={9}
          color={"blue.500"}
          m={2}
          onClick={() => {
            imgRef.current.click();
          }}
        />
        <Input type="file" ref={imgRef} hidden onChange={handleImg} />
        <Input
          m={3}
          placeholder="Type a message"
          w={"75%"}
          rounded={20}
          borderColor={useColorModeValue("gray.500", "gray.700")}
          _hover={"none"}
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Box as={BsSend} w={9} h={8} color={"blue.400"} onClick={sendMessage} />
      </Flex>

      <Modal blockScrollOnMount={false} isOpen={imgUrl} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Your Selected Image</ModalHeader>
          <ModalCloseButton
            onClick={() => {
              setImgUrl("");
            }}
          />
          <ModalBody>
            <Image src={imgUrl} />
          </ModalBody>

          <ModalFooter>
            {loading ? (
              <Spinner size={"md"} />
            ) : (
              <Button colorScheme="blue" mr={3} onClick={sendMessage}>
                Send
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Chats
