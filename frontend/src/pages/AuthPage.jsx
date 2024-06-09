import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/auth.atom"
import Login from "../components/Login"
import SignUp from "../components/SignUp";

const AuthPage = () => {
    const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <div>
      {authScreenState === 'login' ? <Login /> : <SignUp />}
    </div>
  )
}

export default AuthPage
