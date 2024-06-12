import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react"
import {   MessageSquareMore } from "lucide-react";
import {CgMoreO} from "react-icons/cg";
import {  useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import { Link } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../hooks/showToast";

const UserHeader = ({ user, postCount }) => {
  const currentUser = useRecoilValue(userAtom);
  const [friend, setFriend] = useState(
    user.friends.includes(currentUser._id) ? true : false
  );
  // console.log(friend);
  const showToast = useShowToast();
  const [totalFriends, setTotalFriends] = useState(user.friends.length);

  const handleFriendship = async () => {
    try {
      const res = await fetch(`/api/users/addfriend/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      setFriend(!friend);
      setTotalFriends(totalFriends + (friend ? -1 : 1));
    } catch (err) {
      console.error("error in adding/removing friend: ", err);
      showToast("Error", err.message, "error");
    }
  };

  // const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const copyurl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied",
        description: "Profile link copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
        colorScheme: "green",
      });
    });
  };
  return (
    // <Container>
    <VStack gap={4} alignItems={"center"} mt={8}>
      <Flex justifyContent={"space-around"} w={["100%", "70%"]} gap={2}>
        <Box>
          <Avatar
            border={"1px solid black"}
            name={user.name}
            src={user.profilePic || "/default-profile-pic.jpg"}
            size={"2xl"}
          />
        </Box>
        <Box gap={"4"}>
          <Text fontSize={["2xl", "5xl"]} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex
            gap={2}
            alignItems={"center"}
            justifyContent={"space-around"}
            wrap={"wrap"}
          >
            {/* add username */}
            <Text
              fontSize={["sm", "md"]}
              textAlign={"center"}
              fontStyle={"italic"}
              fontWeight={"500"}
            >
              @{user.username}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <Text fontSize={["md", "xl"]} textAlign={"center"}>
        {/* 🌟 Dragon Warrior | Kung Fu Master | Noodle Enthusiast 🍜 */}
        {user.bio}
      </Text>

      <Flex gap={4} w={"full"} justifyContent={"center"} mt={6} mb={3}>
        {currentUser._id.toString() === user._id.toString() ? (
          <Link to="/update">
            <Button colorScheme={"blue"} w={"100%"}>
              Update Profile
            </Button>
          </Link>
        ) : friend ? (
          <>
            <Button colorScheme={"red"} w={"80%"} onClick={handleFriendship}>
              Remove Friend
            </Button>
          </>
        ) : (
          <>
            <Button colorScheme={"blue"} w={"80%"} onClick={handleFriendship}>
              Add Friend
            </Button>
          </>
        )}

        <Menu>
          <MenuButton>
            <CgMoreO size={28} cursor={"pointer"} />
          </MenuButton>
          <Portal>
            <MenuList bg={"gray.dark"}>
              <MenuItem bg={"gray.dark"} color={"white"} onClick={copyurl}>
                Copy Link
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
      {/* 4th row */}
      <Flex justifyContent={"center"} w={"full"} gap={20}>
        <Text fontSize={["md", "xl"]} textAlign={"center"}>
          Posts: {postCount}
        </Text>
        <Text fontSize={["md", "xl"]} textAlign={"center"}>
          Friends: {totalFriends}
        </Text>
        <MessageSquareMore
          // color={colorMode === "light" ? "#0cbf06" : "#9c7945"}
          size={28}
          cursor={"pointer"}
        />
      </Flex>

      <Flex w={"full"} justifyContent={"center"} mt={6} mb={3}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={"3"}
          cursor={"pointer"}
        >
          Posts
        </Flex>
      </Flex>
    </VStack>
    // </Container>
  );
};

export default UserHeader
