import { Avatar, Box, Container, Flex, Image, Text } from "@chakra-ui/react";
import { Ellipsis } from "lucide-react";
import { Link } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/showToast";
import moment  from "moment";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import { DeleteIcon } from "@chakra-ui/icons";
import postsAtom from "../atoms/post.atom";


const Post = ({post}) => {
    const {postedBy, img, caption, createdAt} = post;
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const [postUser, setPostUser] =useState(null);
    const handleDeletePost = async (e) => {
      e.preventDefault();
        try {
          if(!window.confirm("Are you sure you want to delete this post?")) return;
          const res = await fetch(`/api/posts/${post._id}`, {
            method: "DELETE",
          })
          const data = await res.json();
          if(data.error){
            showToast("Error", data.error, "error");
            return;
          }
          showToast("Success", data.message, "success");  
          setPosts(posts.filter((p)=>p._id !== post._id));

        } catch (err) {
            showToast("Error", err.message, "error"); 
        }
    }
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
      <Flex justifyContent={"center"} mt={5}>
        <Container
          ml={0}
          mr={0}
          mt={3}
          mb={10}
          boxShadow={"2px 2px 7px #1e1e1e"}
          p={4}
        >
          <Flex justifyContent={"space-between"}>
            <Link to={`/profile/${postUser?.username}`}>
              <Flex alignItems={"center"}>
                <Avatar
                  name={postUser?.name}
                  src={postUser?.profilePic}
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
            {currentUser?._id === postUser?._id && (
              <DeleteIcon
                size={15}
                cursor={"pointer"}
                onClick={(e) => {
                  handleDeletePost(e);
                }}
              />
            )}
            {currentUser?._id !== postUser?._id && (
              <Ellipsis size={28} cursor={"pointer"} />
            )}
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
        </Container>
      </Flex>
    </Link>
  );
}

export default Post
