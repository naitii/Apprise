/* eslint-disable react-hooks/rules-of-hooks */
import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  Image,
  useColorMode,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiBell,
} from "react-icons/fi";

import { IoChatbubbleEllipsesOutline, IoHomeOutline } from "react-icons/io5";
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import LogoutBtn from "./LogoutBtn";
import { IoIosNotificationsOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/showToast";


const LinkItems = [
  { name: "Home", icon: IoHomeOutline, href: "/"},
  { name: "Chat", icon: IoChatbubbleEllipsesOutline, href: "/chat" },
  { name: "Notification", icon: IoIosNotificationsOutline, href: "/notification"},
];

export default function SidebarWithHeader({ children }) {
    // const currentUser = useRecoilValue(userAtom);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "#262626")}>
      <SidebarContent
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

const SidebarContent = ({ onClose, ...rest }) => {
        const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue("white", "#1e1e1e")}
      // borderRight="1px"
      // borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Link to="/">
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Image
            placeSelf={"flex-start"}
            width={"150px"}
            alt="logo"
            cursor={"pointer"}
            mt={5}
            src={
              colorMode === "light"
                ? "/LightLogo/logo-no-background.svg"
                : "/DarkLogo/logo-no-background.svg"
            }
          />
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={(e)=>{e.preventDefault(); onClose()}}
          />
        </Flex>
      </Link>
      <NavItem _hover={"none"}>
        <CreatePost />
      </NavItem>
      {LinkItems.map((link) => (
        <Link to={link.href} key={link.name}>
          <NavItem as={Link} to={link.href} icon={link.icon}>{link.name}</NavItem>
        </Link>
      ))}
      <NavItem
        icon={colorMode === "light" ? FaRegMoon : FaRegSun}
        onClick={toggleColorMode}
      >
        Toggle Theme
      </NavItem>
      <NavItem position={"fixed"} bottom={"12"}>
        <LogoutBtn />
      </NavItem>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "gray.700",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
        
      </Flex>
    </Link>
  );
};

const MobileNav = ({ onOpen, ...rest }) => {
    const currentUser = useRecoilValue(userAtom);
    const { colorMode } = useColorMode();
    const [searchedUser, setSearchedUser] = useState("");
    const [users, setUsers] = useState([]);
    const showToast = useShowToast();
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [isNotification, setIsNotification] = useState(false);

    useEffect(() => {
      const getNotifications = async () => {
        try {
          const res = await fetch(`/api/notification/${currentUser._id}`);
          const data = await res.json();
          if (data.error) {
            showToast("Error", data.error, "error");
            return;
          }
          console.log(data);
          if(data[0]?.read === false){
            setIsNotification(true);
          }
        } catch (err) {
          showToast("Error", err.message, "error");
        }
      };
      getNotifications();
    },[]);

    useEffect(() => {
      if(window.innerWidth<800){
        setIsMobile(true);
      }
    },[])
    const handleChange = async (e) => {
      setLoading(true);
      setSearchedUser(e.target.value);
      if(e.target.value === "") {
        setUsers([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/users/suggestedUsers/${e.target.value}`)
        const data = await res.json();
        if (data.error) {
          showToast("error", "Error in searching user", data.error);
          return;
        }
        if(data.length >=5) {
          const data2  = data.slice(0,5);
          setUsers(data2);
          setLoading(false);
          return
        }
        setUsers(data);        
      } catch (err) {
        showToast("error", "Error in searching user", err.message);
      }finally{
        setLoading(false);
      }
    }

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="120px"
      alignItems="center"
      bg={useColorModeValue("white", "#1e1e1e")}
      // borderBottomWidth="1px"
      // borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent={{ base: "space-between", md: "flex-end" }}
      {...rest}
    >
      <IconButton
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      {isMobile && (
        <Flex
          alignItems="center"
          width={"100%"}
          flexDirection={"column"}
          gap={5}
        >
          <Link to="/">
            <Image
              display={{ base: "flex", md: "none" }}
              placeSelf={"flex-start"}
              width={"150px"}
              alt="logo"
              cursor={"pointer"}
              mt={5}
              src={
                colorMode === "light"
                  ? "/LightLogo/logo-no-background.svg"
                  : "/DarkLogo/logo-no-background.svg"
              }
            />
          </Link>
          <HStack w={"75%"} position={"relative"} h={"100%"}>
            <Input
              placeholder="Search Users"
              display={"flex"}
              bg={useColorModeValue("gray.200", "#1e1e1e")}
              rounded={20}
              h={"100%"}
              w={["100%", "75%"]}
              onChange={handleChange}
              value={searchedUser}
            />
            {loading && (
              <VStack
                position={"absolute"}
                zIndex={10}
                top={10}
                bg={useColorModeValue("white", "#1e1e1e")}
                rounded={15}
                alignItems={"center"}
                w={["100%", "75%"]}
              >
                <Spinner height={10}  width={10}/>
              </VStack>
            )}
            <VStack
              position={"absolute"}
              zIndex={10}
              top={7}
              bg={useColorModeValue("white", "#1e1e1e")}
              rounded={15}
              alignItems={"flex-start"}
              w={["100%", "75%"]}
            >
              {users.map((user) => {
                return (
                  <Link
                    to={`/profile/${user.username}`}
                    key={user._id}
                    style={{ width: "100%" }}
                  >
                    <Flex
                      onClick={() => {
                        setUsers([]);
                      }}
                      p={2}
                      w={"100%"}
                      rounded={5}
                      alignItems={"center"}
                    >
                      <Avatar size={"lg"} src={user.profilePic} ml={2} mt={2} />
                      <Box>
                        <Text ml={2}>{user.name}</Text>
                        <Text ml={2} color="gray.600">
                          @{user.username}
                        </Text>
                      </Box>
                    </Flex>
                  </Link>
                );
              })}
            </VStack>
          </HStack>
        </Flex>
      )}
      {!isMobile && (
        <>
          <Link to="/">
            <Image
              display={{ base: "flex", md: "none" }}
              placeSelf={"flex-start"}
              width={"150px"}
              alt="logo"
              cursor={"pointer"}
              mt={5}
              src={
                colorMode === "light"
                  ? "/LightLogo/logo-no-background.svg"
                  : "/DarkLogo/logo-no-background.svg"
              }
            />
          </Link>
          <HStack w={"75%"} position={"relative"} h={"100%"}>
            <Input
              placeholder="Search Users"
              display={"flex"}
              bg={useColorModeValue("gray.200", "#1e1e1e")}
              rounded={20}
              h={["100%", "35%"]}
              w={["100%", "75%"]}
              onChange={handleChange}
              value={searchedUser}
            />
            {loading && (
              <VStack
                position={"absolute"}
                zIndex={10}
                top={24}
                bg={useColorModeValue("white", "#1e1e1e")}
                rounded={15}
                alignItems={"center"}
                w={["100%", "75%"]}
              >
                <Spinner size={20} />
              </VStack>
            )}
            <VStack
              position={"absolute"}
              zIndex={10}
              top={24}
              bg={useColorModeValue("white", "#1e1e1e")}
              rounded={15}
              alignItems={"flex-start"}
              w={["100%", "75%"]}
            >
              {users.map((user) => {
                return (
                  <Link
                    to={`/profile/${user.username}`}
                    key={user._id}
                    style={{ width: "100%" }}
                  >
                    <Flex
                      onClick={() => {
                        setUsers([]);
                      }}
                      p={2}
                      w={"100%"}
                      rounded={5}
                      alignItems={"center"}
                    >
                      <Avatar size={"lg"} src={user.profilePic} ml={2} mt={2} />
                      <Box>
                        <Text ml={2}>{user.name}</Text>
                        <Text ml={2} color="gray.600">
                          @{user.username}
                        </Text>
                      </Box>
                    </Flex>
                  </Link>
                );
              })}
            </VStack>
          </HStack>
        </>
      )}

      <HStack spacing={{ base: "0", md: "6" }}>
        <Link to="/notification">
        <Box position={"relative"}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          onClick={() => setIsNotification(false)}
          icon={<FiBell />}
          />
         {isNotification && <Box position={"absolute"} top={2} right={2} bg={"red.300"} h={"10px"} w={"10px"} rounded={100}/>}
        </Box>
        
        </Link>
        <Link to={`/profile/${currentUser.username}`}>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: "none" }}
              >
                <HStack>
                  <Avatar size={"sm"} src={currentUser.profilePic} />
                  <VStack
                    display={{ base: "none", md: "flex" }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">{currentUser.name}</Text>
                    <Text fontSize="xs" color="gray.600">
                      @{currentUser.username}
                    </Text>
                  </VStack>
                </HStack>
              </MenuButton>
            </Menu>
          </Flex>
        </Link>
      </HStack>
    </Flex>
  );
};
