import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/showToast";
import { Flex, Spinner } from "@chakra-ui/react";


const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const {username} = useParams();
  const showToast = useShowToast();

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
        console.log(user);
      } catch (err) {
        showToast("Error",err.message,"error");
      }finally{
        setLoading(false);
      }
    }
    fetchUser();
  }, [username, showToast])
  if(!user&&loading){
    return (
      <Flex justify="center" align="center" h={"100vh"}>
        <Spinner size={"xl"}/>
      </Flex>
    )
  }
  if(!user&&!loading) return null;

  return (
    <div>
      <UserHeader user={user}/>
      <UserPost
        postId={4}
        postImg="/po-post-3.png"
        postTitle="Balancing out my workout with dumpling deliciousness!"
        postTime="2 hours ago"
        likes={5}
        comments={3}
      />
      <UserPost
        postId={3}
        postImg="/po-post-2.png"
        postTitle="Together, we're unstoppable! 🐼🐯🐒🦁🦗 #FuriousFive #Teamwork #KungFuFam"
        postTime="2 months ago"
        likes={5}
        comments={3}
      />
      <UserPost
        postId={2}
        postImg="/po-post-1.png"
        postTitle="Master your mind, and you'll master anything. 🐼🔥"
        postTime="3 months ago"
        likes={5}
        comments={3}
      />
      <UserPost
        postId={1}
        postTitle="🍜🍜 Just had the most epic dumpling feast! 🥟 Remember, it's not about how many dumplings you can eat (though my record is pretty impressive 😏), it's about savoring each one with gratitude and joy. Stay awesome, my friends! 🐼✨"
        postTime="5 months ago"
        likes={5}
        comments={3}
      />
    </div>
  );
}

export default UserPage
