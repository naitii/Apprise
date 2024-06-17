import { Avatar, Box, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react"
// import UserPost from "../components/UserPost";
import {  Link, useParams } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useShowToast from "../hooks/showToast";
import moment from "moment";


const PostPage = () => {
  const [post, setPosts] = useState(null);
  const [user, setUser] = useState(null);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [sortedComments, setSortedComments] = useState([]);
  const showToast = useShowToast();
  const {username} = useParams();
  const {pid} = useParams();
  
  
  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error -1", data.error, "error");
          console.log(data.error);
          return;
        }
        setUser(data);
      } catch (err) {
        showToast("Error -2", err.message, "error");
      } finally {
        setLoading1(false);
      }
    };
    fetchUser();

    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setPosts(data);
        
        setSortedComments(data.comments.sort((a, b) => moment(b.createdAt).diff(moment(a.createdAt))));
      } catch (err) {
        showToast("Error", err.message, "error");
      }finally{
        setLoading2(false);
      
      }
    }
    getPost();
  },[])
  if(loading1 || loading2){
    return(
      <Flex justify="center" align="center" h={"60vh"}>
        <Spinner size={"xl"}/>
      </Flex>
    )

  }
  
  return (
    <Flex justifyContent={"center"}>
      <Box mt={3} mb={10} p={4} w={"80%"}>
        <Link to={`/profile/${user?.username}`}>
          <Flex justifyContent={"space-between"}>
            <Flex alignItems={"center"}>
              <Avatar
                name="Ping Xiao Po"
                src={user?.profilePic || "/default-profile-pc.jpg"}
                size={"md"}
              />
              <Box>
                <Text ml={3} fontWeight={"bold"}>
                  {user?.username}
                </Text>
                <Text ml={3} fontSize={"sm"} color={"gray.light"}>
                  {moment(post?.createdAt).fromNow()}
                </Text>
              </Box>
            </Flex>
            <Ellipsis size={28} cursor={"pointer"} />
          </Flex>
        </Link>
        <Flex>
          <Text mt={3} ml={3} fontSize={"xl"}>
            {post?.caption}
          </Text>
        </Flex>
        {post?.img && (
          <Image
            mt={3}
            borderRadius={8}
            src={post?.img}
            alt="post"
            width={"100%"}
            minHeight={"380px"}
          />
        )}
        {post && <Actions post={post} />}

        <Divider my={5} />
        {sortedComments?.map((comment, index) => {
          return (
            <>
              <Comment
                key={index}
                main={comment}
                comName={comment.username}
                comImg={comment.userProfilePic}
                comment={comment.text}
                likes={comment?.likes?.length}
                post={post}
              />
            </>
          );
        })}
        <Divider my={5} />
      </Box>
    </Flex>
  );
}

export default PostPage
