import {  Text } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons";

const CreatePost = () => {
  return (
    <>
      <AddIcon m={2} boxSize={4}/>  
      <Text fontSize={"md"} fontWeight={"bold"} letterSpacing={1}>
        Create Post  
      </Text>
    </>
  )
}

export default CreatePost
