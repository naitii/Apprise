import { Avatar, Box, Container, Flex, Image, Input, Text } from "@chakra-ui/react";
import { Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/showToast";
import moment  from "moment";


const Post = ({post}) => {
    const {postedBy, img, caption, createdAt} = post;
    const showToast = useShowToast();
    const [postUser, setPostUser] =useState(null);
    useEffect(()=>{
        const getUser = async ()=>{
            try {
                const res = await fetch("/api/users/profile/"+postedBy);
                const data = await res.json();
                if(data.error){
                    showToast("Error", data.error, "error");
                    return;
                }
                setPostUser(data);
            } catch (err) {
                showToast("Error", err.message, "error");
            }
        }
        getUser();
    },[postedBy, showToast])
  return (
    <Link to={`/${postUser?.username}/post/${post._id}`}>
      <Container mt={3} mb={10} boxShadow={"2px 2px 7px #1e1e1e"} p={4}>
        <Flex justifyContent={"space-between"}>
          <Link to={`/profile/${postUser?.username}`}>
            <Flex alignItems={"center"}>
              <Avatar
                name={postUser?.name}
                src={postUser?.profilePic || "/default-profile-pc.jpg"}
                size={"md"}
              />
              <Box>
                <Text ml={3} fontWeight={"bold"}>
                  {postUser?.username}
                </Text>
                <Text ml={3} fontSize={"sm"} color={"gray.light"}>
                  {moment(createdAt).fromNow()}
                </Text>
              </Box>
            </Flex>
          </Link>
          <Ellipsis size={28} cursor={"pointer"} />
        </Flex>
        <Flex>
          <Text mt={3} ml={3} fontSize={"xl"}>
            {caption}
          </Text>
        </Flex>
        {img && (
          <Image
            mt={3}
            borderRadius={8}
            src={img}
            alt="post"
            width={"100%"}
            minHeight={"380px"}
          />
        )}
        <Actions post={post} />

        <Input
          ml={3}
          mr={5}
          placeholder="Add a comment.."
          p={2}
          onClick={(e) => e.preventDefault()}
        />
      </Container>
    </Link>
  );
}

export default Post
