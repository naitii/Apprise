import { Avatar, AvatarGroup, Box, Divider, Flex, Image, Input, Text } from "@chakra-ui/react"
// import UserPost from "../components/UserPost";
import { Link } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import Actions from "../components/Actions";
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {
  let postId=4
  let postImg="/po-post-3.png"
  let postTitle="Balancing out my workout with dumpling deliciousness!"
  let postTime="2 hours ago"
  let likes=5
  const [liked, setLiked] = useState(false);
  return (
    <>
      <Link to={`/pingpo/post/${postId}`}>
        <Box mt={3} mb={10} p={4} w={"auto"}>
          <Flex justifyContent={"space-between"}>
            <Flex alignItems={"center"}>
              <Avatar
                name="Ping Xiao Po"
                src="/po-profile-pic.jpg"
                size={"md"}
              />
              <Box>
                <Text ml={3} fontWeight={"bold"}>
                  pingpo
                </Text>
                <Text ml={3} fontSize={"sm"} color={"gray.light"}>
                  {postTime}
                </Text>
              </Box>
            </Flex>
            <Ellipsis size={28} cursor={"pointer"} />
          </Flex>
          <Flex>
            <Text mt={3} ml={3} fontSize={"xl"}>
              {postTitle}
            </Text>
          </Flex>
          {postImg && (
            <Image
              mt={3}
              borderRadius={8}
              src={postImg}
              alt="post"
              width={"100%"}
              minHeight={"380px"}
            />
          )}
          <Actions liked={liked} setLiked={setLiked} />
          <Flex>
            <AvatarGroup
              size="xs"
              max={2}
              ml={3}
              mt={3}
              onClick={(e) => e.preventDefault()}
            >
              <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
              <Avatar name="Segun Adebayo" src="https://bit.ly/sage-adebayo" />
              <Avatar name="Kent Dodds" src="https://bit.ly/kent-c-dodds" />
              <Avatar
                name="Prosper Otemuyiwa"
                src="https://bit.ly/prosper-baba"
              />
              <Avatar name="Christian Nwamba" src="https://bit.ly/code-beast" />
            </AvatarGroup>
            <Text ml={3} mt={3} fontSize={"sm"}>
              Liked by{" "}
              <Text fontWeight={"bold"} display={"inline"}>
                ryan.florence.83
              </Text>{" "}
              and {likes - 1} others
            </Text>
          </Flex>

          <Input
            mt={8}
            ml={3}
            mr={5}
            placeholder="Add a comment.."
            p={2}
            onClick={(e) => e.preventDefault()}
          />
          <Divider my={5} />
          <Comment
            comName={"ryan.florence.83"}
            comImg="https://bit.ly/ryan-florence"
            comment="I love dumplings! I'll have to try this out!"
            likes={2}
          />
          <Comment
            comName={"kent_dodds"}
            comImg="https://bit.ly/kent-c-doddse"
            comment="Damn fat panda! You're making me hungry!"
            likes={2}
          />
          <Comment
            comName={"code_beast"}
            comImg="https://bit.ly/code-beast"
            comment="You know why Fat people are so strong? Because they are weightlifting 24/7"
            likes={20}
          />
        </Box>
      </Link>
    </>
  );
}

export default PostPage
