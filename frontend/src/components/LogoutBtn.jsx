import { Button, useToast } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/user.atom";
import { set } from "mongoose";


const LogoutBtn = () => {
    const setUser = useSetRecoilState(userAtom);
    const toast = useToast();
    const handleLogout = async () => {
        try {
            localStorage.removeItem("user-apprise");
            setUser(null);

            const res = fetch("/api/users/logout",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            console.log(data);
            if(data.error){
                toast({
                    title: "Error in logging out.",
                    description: data.error,
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }
        } catch (err) {
            console.error("error in logging out: ", err)
        }
    }
  return (
    <Button 
        // position={"fixed"}
        size={"sm"}
        onClick={handleLogout}
    >Log Out</Button>
  )
}

export default LogoutBtn
