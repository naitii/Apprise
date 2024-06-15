import { useEffect, useState } from "react";
import useShowToast from "../hooks/showToast"
import { Flex, Spinner, Text } from "@chakra-ui/react";
import Post from "../components/Post";

const HomePage = () => {
  const showToasts = useShowToast();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  useEffect(()=>{
    setLoading(true);
    const getFeedPosts = async ()=>{
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if(data.error){
          showToasts("Error", data.error, "error");
          return;
        }
        setPosts(data);

      } catch (err) {
        showToasts("Error", err.message, "error");
      }
      finally{
        setLoading(false);
      }
    }
    getFeedPosts();
  },[showToasts])

  return (
  <>
    {loading && (
      <Flex justify="center" align="center" h={"100vh"}>
        <Spinner size={"xl"}/>
      </Flex>
    )}
    {!loading && !posts.length && (
      <>
        <Text fontSize={"xl"}textAlign={"center"}>Get friends who post</Text>
      </>
    )}
    {!loading && posts.map((post)=>{return (
      <>
        <Post key={post._id} post={post} />
      </>
    )})}
  </>
  )
}
export default HomePage
