import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/user.atom";
import useShowToast from "../hooks/showToast";

const Actions = ({ post }) => {
  // const { likes, comments } = post;
  const user = useRecoilValue(userAtom);
  const showToasts = useShowToast();
  const [post_, setPost] = useState(post);
  const [liked, setLiked] = useState(post?.likes.includes(user._id));
  const [comLoading, setComLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [postedBy, setPostedBy] = useState(null);
  const [liking, setLiking] = useState(false);

  useEffect(() => {

    const getPoster = async () => {
      try {
        const res = await fetch(`/api/users/profile/${post.postedBy}`);
      const data = await res.json();
          if (data.error) {
            showToasts("Error 5", data.error, "error");
          return;
          }
    setPostedBy(data);
    } catch (err) {
      showToasts("Error 6", err.message, "error");
    }
    }
  getPoster();
}, [post, user, showToasts]);

  const copyurl = async () => {
    const url = `${window.location.origin}/${postedBy?.username}/post/${post?._id}`;
    navigator.clipboard.writeText(url).then(() => {
      showToasts("Link Copied", "Post link copied to clipboard", "success");
    });
  };
  const handleLikeUnlike = async () => {
    setLiking(true);
    if(!user)return showToasts("Error", "You need to be logged in to like a post", "error");
    try {
      const res = await fetch(`/api/posts/like/${post?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToasts("Error", data.error, "error");
        return;
      }
      if (!liked) {
        // eslint-disable-next-line no-unsafe-optional-chaining
        setPost({ ...post, likes: [...post?.likes, user._id] });
      } else {
        setPost({
          ...post,
          likes: post?.likes.filter((like) => like !== user._id),
        });
      }

      setLiked(!liked);
    } catch (err) {
      showToasts("Error", err.message, "error");
    } finally {
      setLiking(false);
    }
  }
  const handleComment = async (e) => {
    e.preventDefault();
    setComLoading(true);
    try {
      const res = await fetch(`/api/posts/comment/${post?._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({text: comment}),
      });
      const data = await res.json();
      if(data.error){
        showToasts("Error", data.error, "error");
        return;
      }
      // console.log(data);
      setPost({...post, comments: [...post.comments, data]});
    } catch (err) {
      showToasts("Error", err.message, "error");
    }finally{
      setComLoading(false);
      onClose();
      setComment("");
    }
  }
  const [comment, setComment] = useState("");
  return (
    <>
      <Flex
        gap={4}
        onClick={(e) => e.preventDefault()}
        ml={3}
        mr={4}
        mt={3}
        justifyContent={"space-between"}
      >
        <Flex gap={4} maxH={"fit-content"}>
          {/* like */}
          {liking ? (
            <Flex>
              <Spinner size={"sm"} color={"red.300"} />
            </Flex>
          ) : (
            <svg
              aria-label="Like"
              color={liked ? "rgb(237, 73, 86)" : ""}
              fill={liked ? "rgb(237, 73, 86)" : "transparent"}
              height="19"
              role="img"
              viewBox="0 0 24 22"
              width="20"
              onClick={handleLikeUnlike}
            >
              <path
                d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                stroke="currentColor"
                strokeWidth="2"
              ></path>
            </svg>
          )}

          {/* comment */}
          <svg
            onClick={onOpen}
            aria-label="Comment"
            color=""
            fill=""
            height="20"
            role="img"
            viewBox="0 0 24 24"
            width="20"
          >
            <title>Comment</title>
            <path
              d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
              fill="none"
              stroke="currentColor"
              strokeLinejoin="round"
              strokeWidth="2"
            ></path>
          </svg>
        </Flex>

        {/* share */}
        <svg
          onClick={copyurl}
          aria-label="Share"
          color=""
          fill="rgb(243, 245, 247)"
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
        >
          <title>Share</title>
          <line
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
            x1="22"
            x2="9.218"
            y1="3"
            y2="10.083"
          ></line>
          <polygon
            fill="none"
            points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></polygon>
        </svg>
      </Flex>
      <Flex justifyContent={"space-between"}>
        <Text ml={3} mt={3} fontSize={"sm"}>
          {post_?.likes.length || post?.likes.length} likes
        </Text>
        <Text mt={3} ml={5} color={"gray.light"} fontSize={"sm"}>
          {post_?.comments.length || post?.comments.length} comments
        </Text>
      </Flex>
      <Flex mt={3} gap={0}>
        <Input
          value={comment}
          onClick={(e) => {
            e.preventDefault();
          }}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          ml={3}
          mr={5}
          placeholder="Add a comment.."
          p={2}
        />
        <Button
          onClick={(e) => {
            handleComment(e);
          }}
        >
          Comment
        </Button>
      </Flex>

      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg={useColorModeValue("gray.200", "gray.800")}>
            <ModalHeader>Add Comment</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Add a comment.."
                p={2}
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={(e) => {
                  handleComment(e);
                }}
                isLoading={comLoading}
              >
                Comment
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  );
};

export default Actions;
