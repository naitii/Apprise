import { Avatar, Box, Container, Divider, Flex, Text } from "@chakra-ui/react"
// import Actions from "./Actions";
import { useState } from "react";
import useShowToast from "../hooks/showToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import moment from "moment";
import { Link } from "react-router-dom";

const Comment = ({main, comName ,comImg, comment, comTime}) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(main?.likes.includes(user._id));
  const showToasts = useShowToast();
  const [main_, setMain] = useState(main);
  const handleLikeUnlikeComment = async () => {
    if(!user)return showToasts("Error", "You need to be logged in to like a post", "error");
    try {
      const res = await fetch(`/api/posts/comment/like/${main?._id}`, {
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
        // eslint-disable-next-line no-unsafe-optional-chaining
        setMain({...main_, likes: [...main_?.likes, user._id]});
        // setPost
      }
      else{
        setMain({...main_, likes: main_?.likes.filter((like)=>like !== user._id)});
      }
      setLiked(!liked);
    } catch (err) {
      showToasts("Error", err.message, "error");
    }
  }

  return (
    <Container>
      <Flex justifyContent={"space-between"}>
        <Link to={'/profile/'+comName}>
        <Flex justifyContent={"center"}>
          <Avatar src={comImg} size={"sm"} />
          <Box>
            <Text ml={3} fontWeight={"bold"} fontSize={"md"}>
              {comName}
            </Text>
            <Text ml={3} fontSize={"sm"} color={"gray.light"}>
              {comTime}
            </Text>
          </Box>
        </Flex>
        </Link>
        <Text fontSize={"sm"} color={"gray.light"} mr={3}>{moment(main?.createdAt).fromNow()}</Text>
      </Flex>
      <Flex justifyContent={"space-between"} gap={4}>
        <Text mt={3} ml={6} fontSize={"md"}>
          {comment}
        </Text>
      </Flex>

      <Flex>
        <Box w={"fit-content"} textAlign={"center"} alignItems={"center"} ml={6} mt={2}>
          <svg
            onClick={handleLikeUnlikeComment}
            aria-label="Like"
            color={liked ? "rgb(237, 73, 86)" : ""}
            fill={liked ? "rgb(237, 73, 86)" : "transparent"}
            height="19"
            role="img"
            viewBox="0 0 24 22"
            width="20"
            // onClick={() => setLiked(!liked)}
          >
            <path
              d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
              stroke="currentColor"
              strokeWidth="2"
              ></path>
          </svg>
        </Box>
        <Text ml={3} mt={2} fontSize={"sm"} color={"gray.light"}>
            {main?.likes.length} likes
        </Text>
        </Flex>
      {/* <Actions liked={liked} setLiked={setLiked} /> */}
      <Divider my={4} />
    </Container>
  );
}

export default Comment
