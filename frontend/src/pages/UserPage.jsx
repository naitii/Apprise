import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/showToast";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";
import { useRecoilState  } from "recoil";
import postsAtom from "../atoms/post.atom";


const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const {username} = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [postCount, setPostCount] = useState(0);

  useEffect(()=>{
    const fetchUser =async ()=>{
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if(data.error){
          showToast("Error",data.error,"error");
          console.log(data.error);
          return;
        }
        setUser(data);
      } catch (err) {
        showToast("Error",err.message,"error");
      }finally{
        setLoading(false);
      }
    }
    fetchUser();

    const getPost = async () => {
    try {
      const res = await fetch(`/api/posts/user/${username}`);
      const data = await res.json();
      if(data.error){
        showToast("Error",data.error,"error");
      }
      setPosts(data);
      setPostCount(data.length);
      }
     catch (err) {
      showToast("Error",err.message,"error");
    }finally{
      setPostLoading(false);
    }
  }
  getPost();
  }, [username, showToast])


  if(!user&&loading){
    return (
      <Flex justify="center" align="center" h={"100vh"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }
  
  if(!user&&!loading) return null;
  if(!postLoading && !posts?.length){
    return (
      <>
        <UserHeader user={user} post={postCount}/>
        <Flex justify="center" align="center" h={"50vh"}>
          <Text fontSize={"xl"}>No posts yet</Text>
        </Flex>
      </>
    )
  }

  return (
    <div>
      <UserHeader user={user} post={postCount}/>
      {postLoading && (
        <Flex justify="center" align="center" h={"100vh"}>
          <Spinner size={"xl"}/>
        </Flex>
      )}
      {!postLoading && posts.map((post)=>{return (
        <>
          <Post key={post._id} post={post} />
        </>
      )})}
    </div>
  );
}

export default UserPage
