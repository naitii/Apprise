import {
  Avatar,
  Box,
  Divider,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/showToast";
import { useRecoilState } from "recoil";
import { selectedChatAtom } from "../atoms/chat.atom";


const Conversation = ({ user }) => {
  const { colorMode } = useColorMode();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [otherOne, setOtherOne] = useState([]);
  const showToast = useShowToast();
  const [selectedChat, setSelectedChat] = useRecoilState(selectedChatAtom);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    }
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/chat/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("error", "Error in fetching conversations", data.error);
          return;
        }
        setConversations(data);

        const otherUsers = await Promise.all(
          data.map(async (item) => {
            const otherUserId =
              item.members[0] !== user._id ? item.members[0] : item.members[1];
            const res2 = await fetch(`/api/users/profile/${otherUserId}`);
            const data2 = await res2.json();
            const senderOfLastMessage =
              item.lastMessage.sender === user._id ? "You" : data2.username;
            return {
              user: data2,
              lastMessage: item.lastMessage,
              updatedAt: item.updatedAt,
              sender: senderOfLastMessage,
            };
          })
        );
        setOtherOne(otherUsers);
      } catch (err) {
        showToast("error", "Error in fetching conversations", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user._id, showToast]);

  return (
    <VStack
      bg={useColorModeValue("gray.300", "#1e1e1e")}
      w={"100%"}
      p={4}
      rounded={5}
      overflowY={"auto"}
    >
      <Flex alignItems={"center"} justifyContent={"space-between"} w={"100%"}>
        <Link to={`/profile/${user.username}`}>
          <Flex w="100%" alignItems={"center"} gap={4}>
            <Avatar size="lg" name={user.username} src={user.profilePic} />
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                {user.name}
              </Text>
              <Text fontSize="md" color="gray">
                @{user.username}
              </Text>
            </Box>
          </Flex>
        </Link>
        <Flex mr={4}>
          <Link to={`/update`}>
            <Box as={FiEdit2} />
          </Link>
        </Flex>
      </Flex>
      <Divider />
      <Flex w={"100%"} gap={2}>
        <Input
          mt={4}
          placeholder="Search"
          w={"100%"}
          bg={useColorModeValue("white", "gray.700")}
          border="none"
          p={2}
          rounded={5}
        />
        <Box
          as={IoIosSearch}
          pl={2}
          mt={2}
          w={["15%"]}
          h={["100%"]}
          justifySelf={"center"}
          bg={useColorModeValue("gray.300", "#1e1e1e")}
        />
      </Flex>
      <Divider my={4} />
      {loading &&
        [1, 2, 3, 4, 5].map((item) => (
          <Box key={item} w={"100%"}>
            <Flex w={"100%"} gap={4}>
              <SkeletonCircle size={10} />
              <Flex
                w={"70%"}
                flexDirection={"column"}
                justifyContent={"space-between"}
              >
                <Skeleton h={4} w={"60%"} />
                <Skeleton h={3} w={"100%"} />
              </Flex>
            </Flex>
            <Divider my={3} />
          </Box>
        ))}

      {!loading && !conversations.length && (
        <Text>No conversations to show</Text>
      )}

      {!loading &&
        otherOne.length &&
        otherOne.map((thatOne, index) => (
          <Box
            as={Link}
            to={isMobile ? `/chat/mob` : "#"}
            key={index}
            w={"100%"}
            h={20}
            onClick={() => {
              setSelectedChat({
                _id: conversations[index]._id,
                userId: thatOne.user._id,
                name: thatOne.user.name,
                username: thatOne.user.username,
                userProfilePic: thatOne.user.profilePic,
              });
            }}
            p={2}
            cursor={"pointer"}
            bg={
              selectedChat._id === conversations[index]._id
                ? colorMode === "light"
                  ? "gray.100"
                  : "gray.700"
                : "transparent"
            }
          >
            <Flex w={"100%"} gap={4} minH={"fit-content"}>
              <Avatar src={thatOne?.user?.profilePic} />
              <Flex
                w={"70%"}
                flexDirection={"column"}
                justifyContent={"space-between"}
              >
                <Text h={4} w={"60%"} fontWeight={"bold"}>
                  {thatOne?.user.username}
                </Text>
                <Text h={3} w={"100%"} minH={"fit-content"} color={"gray"}>
                  {thatOne?.sender}:{" "}
                  {thatOne?.lastMessage?.text.length > 15
                    ? thatOne?.lastMessage?.text.substring(0, 15) + "...."
                    : thatOne?.lastMessage?.text}
                </Text>
              </Flex>
              <Box>
                {/* <Text fontSize={"xs"} color={"gray"} >{moment(thatOne.updatedAt).fromNow()}</Text> */}
              </Box>
            </Flex>
            {/* <Divider my={3} /> */}
          </Box>
        ))}
    </VStack>
  );
};

export default Conversation;
