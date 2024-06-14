import { Flex } from '@chakra-ui/react'
import Conversation from '../components/Conversation'
import Chats from '../components/Chats'
import userAtom from '../atoms/user.atom'
import { useRecoilValue } from 'recoil'

const ChatPage = () => {
  const user = useRecoilValue(userAtom);
  
  return (
    <Flex flexDirection={["column", "row"]} gap={10}>
      <Flex w={["100%", "35%"]} justify={"center"}>
        <Conversation user ={user}/>
      </Flex>

      <Flex w={["100%", "65%"]} justify={"center"}>
        <Chats />
      </Flex>
    </Flex>
  );
}

export default ChatPage
