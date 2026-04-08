import { use } from "react"
import EditProfile from "./EditProfile"
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user);
  return (
    <div>
      {user && <EditProfile user={user} />}
    </div>
  )
}

export default Profile;
