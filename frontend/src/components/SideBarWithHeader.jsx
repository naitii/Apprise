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

} from "@chakra-ui/react";
import {
  FiStar,
  FiSettings,
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


const LinkItems = [
  { name: "Home", icon: IoHomeOutline },
  { name: "Chat", icon: IoChatbubbleEllipsesOutline },
  { name: "Notification", icon: IoIosNotificationsOutline },
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
            onClick={onClose}
          />
        </Flex>
      </Link>
      <NavItem bg={useColorModeValue("gray.100", "gray.700")}>
        <CreatePost />
      </NavItem>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon}>
          {link.name}
        </NavItem>
      ))}
      <NavItem
        icon={colorMode === "light" ? FaRegMoon : FaRegSun}
        onClick={toggleColorMode}
      >
        Toggle Theme
      </NavItem>
      <NavItem position={"fixed"} bottom={"5"}>
        <LogoutBtn />
      </NavItem>
    </Box>
  );
};

const NavItem = ({ icon, children, ...rest }) => {
  return (
    <Link
      to="#"
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


  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
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

      <HStack spacing={{ base: "0", md: "6" }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
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
