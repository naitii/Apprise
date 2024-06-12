import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import useShowToast from "../hooks/showToast";

const Actions = ({ post }) => {
  // const { likes, comments } = post;
  const user = useRecoilValue(userAtom);
  const showToasts = useShowToast();
  const [post_, setPost] = useState(post);
  const [liked, setLiked] = useState(post.likes.includes(user._id));
  const [comLoading, setComLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLikeUnlike = async () => {
    if(!user)return showToasts("Error", "You need to be logged in to like a post", "error");
    try {
      const res = await fetch(`/api/posts/like/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })
      const data = await res.json();
      if(data.error){
        showToasts("Error", data.error, "error");
        return;
      }
      if(!liked){
        setPost({...post, likes: [...post.likes, user._id]});
      }
      else{
        setPost({...post, likes: post.likes.filter((like)=>like !== user._id)});
      }
      setLiked(!liked);
      
    } catch (err) {
      showToasts("Error", err.message, "error");
    }
  }
  const handleComment = async () => {
    setComLoading(true);
    try {
      const res = await fetch(`/api/posts/comment/${post._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({text: comment}),
      });
      const data = await res.json();
      if(data.error){
        showToasts("Error", data.error, "error");
        return;
      }
      // console.log(data);
      setPost({...post, comments: [...post.comments, data]});
    } catch (err) {
      showToasts("Error", err.message, "error");
    }finally{
      setComLoading(false);
      onClose();
      setComment("");
    }
  }
  const [comment, setComment] = useState("");
  return (
    <>
      <Flex
        gap={4}
        onClick={(e) => e.preventDefault()}
        ml={3}
        mr={4}
        mt={3}
        justifyContent={"space-between"}
      >
        <Flex gap={4} maxH={"fit-content"}>
          {/* like */}
          <svg
            aria-label="Like"
            color={liked ? "rgb(237, 73, 86)" : ""}
            fill={liked ? "rgb(237, 73, 86)" : "transparent"}
            height="19"
            role="img"
            viewBox="0 0 24 22"
            width="20"
            onClick={handleLikeUnlike}
          >
            <path
              d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
          </svg>

          {/* comment */}
          <svg
            onClick={onOpen}
            aria-label="Comment"
            color=""
            fill=""
            height="20"
            role="img"
            viewBox="0 0 24 24"
            width="20"
          >
            <title>Comment</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </Flex>

        {/* share */}
        <svg
          aria-label="Share"
          color=""
          fill="rgb(243, 245, 247)"
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
        >
          <title>Share</title>
          <line
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="22"
            x2="9.218"
            y1="3"
            y2="10.083"
          ></line>
          <polygon
            fill="none"
            points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></polygon>
        </svg>
      </Flex>
      <Flex justifyContent={"space-between"}>
        <Text ml={3} mt={3} fontSize={"sm"}>
          {post_?.likes.length} likes
        </Text>
        <Text mt={3} ml={5} color={"gray.light"} fontSize={"sm"}>
          {post_?.comments.length} comments
        </Text>
      </Flex>

      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg={useColorModeValue("gray.200", "gray.800")}>
            <ModalHeader>Add Comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Add a comment.."
                p={2}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleComment} isLoading={comLoading}>
                Comment
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default Actions;
