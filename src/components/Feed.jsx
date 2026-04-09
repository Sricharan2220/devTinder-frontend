import axios from "axios"
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {useEffect} from "react";
import { addFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((state) => state.feed);
  const dispatch = useDispatch();

  const getFeed = async ()=>{
    if(feed && feed.length > 0) return;
    try{
      const res = await axios.get(BASE_URL + "/user/feed",{withCredentials: true}); 
      dispatch(addFeed(res.data));
    }
    catch(error){
      console.error("Error fetching feed:", error);
      //TODO: Handle error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    getFeed();
  },[]);

  if(!feed) return;

  if(feed.length === 0){
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-67px)]">
        <h2 className="text-2xl font-semibold mb-4">No more users to show</h2>
        <p className="text-gray-600">Please check back later for new users.</p>
      </div>
    );
  }
  return (
    <div className="flex justify-center my-10">
      {feed && <UserCard user={feed[0]} showButtons={true} key={feed[0]._id} />}
    </div>
  )
}

export default Feed
