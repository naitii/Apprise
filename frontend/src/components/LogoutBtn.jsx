import { Box, Text, useToast } from "@chakra-ui/react"
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/user.atom";
import { TbLogout2 } from "react-icons/tb";


const LogoutBtn = () => {
    const setUser = useSetRecoilState(userAtom);
    const toast = useToast();
    const handleLogout = async () => {
        try {
            localStorage.removeItem("user-apprise");
            
            const res = await fetch("/api/users/logout",{
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
                setUser(null);
            } catch (err) {
            console.error("error in logging out: ", err)
        }
    }
  return (
    <>
      <Box as={TbLogout2} w={6} h={6} />
      <Text ml={5} mr={5} fontSize={"l"} onClick={handleLogout}>
        Log Out
      </Text>
    </>
  );
}

export default LogoutBtn
