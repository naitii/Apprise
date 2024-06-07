import { Button, Container } from "@chakra-ui/react"
import { Route } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage";

function App() {

  return (
    <>
      <Container maxW="700px">
        <Route path="/:username" element={<UserPage />}></Route>
        <Route path="/:username/post/:pid" element={<PostPage />}></Route>
      </Container>
    </>
  );
}

export default App
