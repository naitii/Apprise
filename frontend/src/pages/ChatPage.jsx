import { Flex } from '@chakra-ui/react'
import Conversation from '../components/Conversation'
import Chats from '../components/Chats'
import userAtom from '../atoms/user.atom'
import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'

const ChatPage = () => {
  const user = useRecoilValue(userAtom);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }},[]);
  return (
    <Flex flexDirection={isMobile ? "column" : "row"} gap={10}>
      <Flex w={isMobile ? "100%" : "35%"} justify={"center"}>
        <Conversation user ={user}/>
      </Flex>

      <Flex w={isMobile ? "0" : "65%"} justify={"center"}>
        <Chats />
      </Flex>
    </Flex>
  );
}

export default ChatPage
