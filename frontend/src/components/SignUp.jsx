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
//   FormHelperText,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import authScreenAtom from "../atoms/auth.atom";
import { useSetRecoilState } from "recoil";
// import { FaLock } from "react-icons/fa";

// const CFaUserAlt = chakra(FaUserAlt);
// const CFaLock = chakra(FaLock);

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowClick = () => setShowPassword(!showPassword);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
    const toast = useToast();
  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })
  const handleSignUp = async (e) => {
    e.preventDefault();
    // console.log(typeof(input.password));
    try {
        const res = await fetch("/api/users/signup",{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
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
        

    } catch (err) {
        console.error("error in signing up: ", err)
    }
  }


  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="80vh"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading>Sign Up</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack spacing={4} p="1rem" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="text"
                    placeholder="Full name"
                    value={input.name}
                    mr={2}
                    onChange={(e) =>
                      setInput({ ...input, name: e.target.value })
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
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
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    type="text"
                    placeholder="Email"
                    value={input.email}
                    onChange={(e) =>
                      setInput({ ...input, email: e.target.value })
                    }
                  />
                </InputGroup>
              </FormControl>
              7
              <FormControl>
                <InputGroup mb={5}>
                  <InputLeftElement
                    pointerEvents="none"
                    // color="gray.300"
                    // children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Set Password"
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
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                loadingText="Submitting"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        Already a User?{" "}
        <Link color="teal.500" onClick={() => setAuthScreen("login")}>
          Log in
        </Link>
      </Box>
    </Flex>
  );
};

export default SignUp;
