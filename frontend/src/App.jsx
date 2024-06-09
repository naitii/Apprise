import { Container } from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SignUp from "./components/SignUp";
import { useRecoilState } from "recoil";
import userAtom from "./atoms/user.atom";
import LogoutBtn from "./components/LogoutBtn";

function App() {

  const user = useRecoilState(userAtom);
  return (
    <>
    <Header />
      <Container maxW="700px">
        <Routes>
          <Route path="/" element={user ? <HomePage /> : <Navigate to='/auth'/>}></Route>
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to='/'/>}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/:username" element={<UserPage />}></Route>
          <Route path="/:username/post/:pid" element={<PostPage />}></Route>
        </Routes>
        {user && <LogoutBtn/>}
      </Container>
    </> 
  );
}

export default App
