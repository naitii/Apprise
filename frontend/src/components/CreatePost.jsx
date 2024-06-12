import { Button, CloseButton, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Textarea, VStack, useColorMode, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons";
import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import usePreviewImage from "../hooks/usePreviewIng";
import { useRecoilValue } from "recoil";
import useShowToast from "../hooks/showToast";
import userAtom from "../atoms/user.atom";
const CreatePost = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postText, setPostText] = useState("");
  const { colorMode } = useColorMode();
  const [charactersCount, setCharactersCount] = useState(250);
  const imgRef = useRef(null)
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { handleImg, imgUrl, setImgUrl } = usePreviewImage();
  const [loading, setLoading] = useState(false);
  const handleTextChange = (e) => {
    setCharactersCount(250 - e.target.value.length);
    if(250 - e.target.value.length <= 0){
      const text = e.target.value.slice(0, 250);
      setPostText(text);
      setCharactersCount(0);
     return;
    }
      
    setPostText(e.target.value);
  }

  const handleCreatePost = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({postedBy:user._id, caption: postText, img: imgUrl }),
      });
      const data = await res.json();
      if(data.error){
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created", "success");
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (err) {
      showToast("Error", "Something went wrong", "error");
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        bg={useColorModeValue("gray.100", "gray.700")}
        p={4}
        _hover={{ bg: useColorModeValue("blue.100", "gray.600") }}
        onClick={onOpen}
      >
        <AddIcon m={2} boxSize={4} />
        <Text fontSize={"md"} fontWeight={"bold"} letterSpacing={1} m={4}>
          Create Post
        </Text>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} position={"fixed"}>
        <ModalOverlay />
        <ModalContent
          position={"fixed"}
          bottom={-16}
          h={"fit-content"}
          bg={useColorModeValue("gray.200", "gray.800")}
        >
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Textarea
                placeholder="Title"
                value={postText}
                onChange={handleTextChange}
                borderColor={colorMode === "light" ? "gray.700" : ""}
              ></Textarea>
              <Text fontSize={"sm"} placeSelf={"flex-end"} color={"gray"}>
                {charactersCount}/250
              </Text>

              <Input type="file" hidden ref={imgRef} onChange={handleImg} />
              {!imgUrl && (
                <CiImageOn
                  style={{
                    cursor: "pointer",
                    height: "50%",
                    width: "50%",
                    margin: "0",
                  }}
                  size={16}
                  onClick={() => imgRef.current.click()}
                />
              )}
              {imgUrl && (
                <Flex mt={2} position={"relative"} justifyContent={"center"}>
                  <Image
                    src={imgUrl}
                    alt="post image"
                    border={"1px solid #1e1e1e"}
                    boxSize={60}
                  />
                  <CloseButton
                  color={"#1e1e1e"}
                    bg={"gray.100"}
                    position={"absolute"}
                    top={2}
                    right={3}
                    onClick={() => setImgUrl("")}
                  />
                </Flex>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter >
            <Flex justifyContent={"center"} w={"100%"}>
            <Button colorScheme="blue" variant="ghost" w={"50%"} onClick={handleCreatePost} isLoading={loading}>
              Post
            </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreatePost
