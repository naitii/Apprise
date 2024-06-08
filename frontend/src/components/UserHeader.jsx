import { Avatar, Box, Button, Container, Flex, Menu, MenuButton, MenuItem, MenuList, Portal, Text, VStack, useToast } from "@chakra-ui/react"
import { MessageSquareMore } from "lucide-react";
import {CgMoreO} from "react-icons/cg";

const UserHeader = () => {
  // const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const copyurl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(()=>{
      toast({
        title: "Link Copied",
        description: "Profile link copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
        colorScheme: "green",
      });
    })
  }
  return (
    <Container maxW="700px">
      <VStack gap={4} alignItems={"center"}>
        <Flex justifyContent={"space-around"} w={"full"} gap={4}>
          <Box>
            <Avatar
              border={"1px solid black"}
              name="Ping Xiao Po"
              src="/po-profile-pic.jpg"
              size={"2xl"}
            />
          </Box>
          <Box gap={"4"}>
            <Text fontSize={["2xl", "5xl"]} fontWeight={"bold"}>
              Ping Xiao Po
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
                @pingpo
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Text fontSize={["md", "xl"]} textAlign={"center"}>
          🌟 Dragon Warrior | Kung Fu Master | Noodle Enthusiast 🍜
        </Text>


        <Flex gap={4} w={"full"} justifyContent={"center"} mt={6} mb={3}>
          <Button colorScheme={"blue"} w={"80%"}>
            Add Friend
          </Button>
          <Menu>
            <MenuButton>
              <CgMoreO size={28} cursor={"pointer"} />
            </MenuButton>
            <Portal>
              <MenuList bg={"gray.dark"}>
                <MenuItem bg={"gray.dark"} color={"white"} onClick={copyurl}>Copy Link</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
        {/* 4th row */}
        <Flex justifyContent={"center"} w={"full"} gap={20}>
          <Text fontSize={["md", "xl"]} textAlign={"center"}>
            Posts: 4
          </Text>
          <Text fontSize={["md", "xl"]} textAlign={"center"}>
            Friends: 0
          </Text>
          <MessageSquareMore
            // color={colorMode === "light" ? "#0cbf06" : "#9c7945"}
            size={28}
            cursor={"pointer"}
          />
        </Flex>

        <Flex w={"full"} justifyContent={"center"} mt={6} mb={3}>
          <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={"3"} cursor={"pointer"}>Posts</Flex>
          <Flex flex={1} borderBottom={"1.5px solid gray"} color={"gray"} justifyContent={"center"} pb={"3"} cursor={"pointer"}>Comments</Flex>
        </Flex>
      </VStack>
    </Container>
  );
}

export default UserHeader
