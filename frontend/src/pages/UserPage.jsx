import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

const UserPage = () => {
  return (
    <div>
      <UserHeader />
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
