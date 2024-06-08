import { Avatar, AvatarGroup, Box, Container, Flex, Image, Input, Text } from '@chakra-ui/react'
import {Link} from 'react-router-dom'
import { Ellipsis } from "lucide-react";
import Actions from './Actions';
import { useState } from 'react';
// import {CgMoreO} from 'react-icons/cg'

const UserPost = ({postId, postImg, postTitle, postTime, likes, comments}) => {
    // const { colorMode, toggleColorMode } = useColorMode();
    const [liked, setLiked] = useState(false);
  return (
    <Link to={`/pingpo/post/${postId}`}>
      <Container mt={3} mb={10} border="1px solid #1e1e1e" p={4}>
        <Flex justifyContent={"space-between"}>
          <Flex alignItems={"center"}>
            <Avatar name="Ping Xiao Po" src="/po-profile-pic.jpg" size={"md"} />
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

        <Text mt={3} ml={5} color={"gray.light"} fontSize={"sm"}>
          View all {comments} Comments
        </Text>
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

export default UserPost
