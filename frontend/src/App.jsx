// import { Container } from "@chakra-ui/react"
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
import UpdateProfile from "./pages/UpdateProfile";
import CreatePost from "./components/CreatePost";
import SidebarWithHeader from "./components/SideBarWithHeader";

function App() {

  const user = useRecoilState(userAtom);
  return (
    <>
      {/* <Container maxW="700px"> */}
      <Routes>
        <Route
          path="/"
          element={
            user[0] ? (
              <SidebarWithHeader children={<HomePage />} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        ></Route>
        <Route
          path="/update"
          element={
            user[0] ? (
              <SidebarWithHeader children={<UpdateProfile />} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        ></Route>
        <Route
          path="/auth"
          element={
            !user[0] ? (
              <>
                <Header />
                 <AuthPage />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        ></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route
          path="/profile/:username"
          element={<SidebarWithHeader children={<UserPage />} />}
        ></Route>
        <Route
          path="/:username/post/:pid"
          element={<SidebarWithHeader children={<PostPage />} />}
        ></Route>
      </Routes>
      {/* </Container> */}
    </>
  );
}

export default App
