import { Box, Flex, Image, Text, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import moment from "moment";


const Notification = ({ noti }) => {
    const bg = useColorModeValue("gray.300", "gray.700");
  return (
    <div>
      {noti.map((n) => (
        <Box
          key={n._id}
          p={2}
          m={2}
          bg={bg}
          borderRadius={"md"}
          mt={4}
          w={"100%"}
        >
          <Link to={n.link}>
            <Flex
              alignItems={"center"}
              gap={4}
              w={"100%"}
              justifyContent={"space-between"}
            >
              <Flex alignItems={"center"} gap={4}>
                <Image
                  src={n.image || "/default-profile-pic.jpg"}
                  alt="image"
                  boxSize="50px"
                  borderRadius="full"
                />
                <Text>{n.message}</Text>
              </Flex>
              <Text fontSize={"sm"} color={"gray"} textAlign={"right"}>
                {moment(n.createdAt).fromNow()}
              </Text>
            </Flex>
          </Link>
        </Box>
      ))}
    </div>
  );
};

export default Notification;
