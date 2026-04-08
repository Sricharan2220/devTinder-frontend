import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { use } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchUser = async () =>{
    try{
      console.log("fetching user data...");
      const res = await axios.get(BASE_URL + "/profile/view",
        {withCredentials: true}
      );
      dispatch(addUser(res.data));
    }catch(err){
      if(err.status == 401){
        navigate("/login");
      }
      else{console.error(err);}
    }
  };
  
  useEffect(() => {
    fetchUser();
  },[]);

  return (
    <div>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Body
