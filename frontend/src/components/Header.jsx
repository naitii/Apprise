import { Flex, Image, useColorMode } from "@chakra-ui/react"

const Header = () => {
    const {colorMode, toggleColorMode } = useColorMode();
  return (
    <Flex
      justifyContent={"space-between"}
      mt={"6"}
      mb="12"
      pl={"5"}
      pr={"5"}
      pb={"5"}
      borderBottom={
        colorMode === "light" ? "1px ridge #1e1e1e" : "1px ridge white"
      }
      h={"70px"}
      // w={"100vw"}
      position={"sticky"}
      top={0}
      right={0}
      backgroundColor={colorMode === "light" ? "gray.100" : "#1e1e1e"}
      zIndex={10}
    >
      <Image
        placeSelf={"flex-start"}
        width={"150px"}
        alt="logo"
        cursor={"pointer"}
        src={
          colorMode === "light"
            ? "/LightLogo/logo-no-background.svg"
            : "/DarkLogo/logo-no-background.svg"
        }
      />
      <Image
        filter={"brightness(0.6)"}
        cursor={"pointer"}
        onClick={toggleColorMode}
        width={"40px"}
        src={colorMode === "light" ? "/btns/moon.png" : "/btns/sun.png"}
      />
    </Flex>
  );
}

export default Header
