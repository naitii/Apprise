import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
//   chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/auth.atom";
import userAtom from "../atoms/user.atom";
// import { FaLock } from "react-icons/fa";

// const CFaUserAlt = chakra(FaUserAlt);
// const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const handleShowClick = () => setShowPassword(!showPassword);

  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const toast = useToast(); 
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const res = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        });
        const data = await res.json();
        if(data.error){
            toast({
                title: "An error occurred.",
                description: data.error,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        localStorage.setItem("user-apprise", JSON.stringify(data));
        setUser(data);
    } catch (err) {
        console.error("error in logging in: ", err);
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="80vh"
      //   backgroundColor="gray.200"
      //   justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading>Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }} boxShadow={"xl"}>
          <form>
            <Stack spacing={4} p="1rem" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    // children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Username"
                    value={input.username}
                    onChange={(e) =>
                      setInput({ ...input, username: e.target.value })
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup mb={5}>
                  <InputLeftElement
                    pointerEvents="none"
                    // color="gray.300"
                    // children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={input.password}
                    onChange={(e) =>
                      setInput({ ...input, password: e.target.value })
                    }
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                {/* <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText> */}
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                alignSelf={"center"}
                colorScheme="teal"
                width="80%"
                loadingText="Logging in..."
                onClick={handleLogin}
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link color="teal.500" onClick={() => setAuthScreen("signup")}>
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};

export default Login;
