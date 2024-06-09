import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/user.atom";
import usePreviewImg from "../hooks/usePreviewIng";
import useShowToast from "../hooks/showToast";

const UpdateProfile = () =>{
    const toast = useToast();
    const showToast = useShowToast();
    const [user, setUser] = useRecoilState(userAtom);
    const [inputs, setInputs] = useState({
        name: user.name,
        username: user.username,
        email: user.email,
        password: "",
        profilePic: user.profilePic,
        bio: user.bio,
    })
    const fileRef = useRef(null);
    
    const {handleImg, imgUrl} = usePreviewImg();

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const userID = await user._id;
            const res = await fetch(`/api/users/updateprofile/${userID}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({...inputs, profilePic: imgUrl}),
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
            showToast("Profile Updated", "Your profile has been updated", "success");
                                    
        } catch (err) {
            console.error("error in updating profile: ", err);
        }
    }

  return (
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        //   bg={useColorModeValue("gray.50", "gr   ay.800")}
      >
        <Stack
          boxShadow={"xl"}
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "")}
          rounded={"xl"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} textAlign={"center"} fontSize={{ base: "2xl", sm: "3xl" }}>
            Update your Profile
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="2xl" src={imgUrl || inputs.profilePic}>
                  
                </Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Profile Photo
                </Button>
                <Input type="file" hidden ref={fileRef} onChange={handleImg} />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="name" isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="Full Name"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="UserName"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              type="email"
            />
          </FormControl>
          <FormControl id="bio">
            <FormLabel>Bio</FormLabel>
            <Textarea
              placeholder="Bio"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              placeholder="New password (if you want to update)"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              onClick={handleUpdate}
              _hover={{
                bg: "blue.500",
              }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
  );
}

export default UpdateProfile;