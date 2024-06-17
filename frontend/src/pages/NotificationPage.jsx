import { useRecoilValue } from "recoil"
import Notification from "../components/Notification"
import userAtom from "../atoms/user.atom"
import { useEffect, useState } from "react";
import useShowToast from "../hooks/showToast";


const NotificationPage = () => {
    const user = useRecoilValue(userAtom);
    const [notifications, setNotifications] = useState([]);
    const showToast = useShowToast();

    useEffect(()=>{
        const getNotifications = async () => {
            try {
                const res = await fetch(`/api/notification/${user._id}`);
                const data = await res.json();
                if(data.error){
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data);
                setNotifications(data);
                
            } catch (err) {
                showToast("Error", err.message, "error");
            }
        }
        getNotifications();

        const markNotificationsAsRead = async () => {
            try {
                const res = await fetch(`/api/notification/markread/${user._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if(!res.ok){
                    showToast("Error", "Error in marking notifications as read", "error");
                    return;
                }
             
            } catch (err) {
                showToast("Error", err.message, "error");
            }
        }
        markNotificationsAsRead();

    },[user, showToast])

  return (
    <div>
        <Notification noti={notifications}/>
    </div>
  )
}

export default NotificationPage
