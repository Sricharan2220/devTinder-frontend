import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { use, useEffect } from "react"
import { useDispatch,useSelector } from "react-redux"
import { addRequests, removeRequests } from "../utils/requestSlice" 
import { Link } from "react-router-dom"

const Requests = () => {
    const requests = useSelector((store) => store.request);
    const dispatch = useDispatch();

    const reviewRequest = async (status, _id) => {
        try {
        const res = axios.post(
            BASE_URL + "/request/review/" + status + "/" + _id,
            {},
            { withCredentials: true }
        );
        dispatch(removeRequests(_id));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRequests = async () => {
        try{
            const res = await axios.get(BASE_URL + "/user/requests/received",{
                withCredentials: true,
            });
            dispatch(addRequests(res.data.data));
        }
        catch(err){
            console.error(err);
        }
    }    

    useEffect(() => {
        fetchRequests();
    },[]);

  if (!requests) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  if (requests.length === 0) return <h1 className="text-center mt-20 text-xl text-gray-500">No Requests Found</h1>;

  return (
    <div className="flex flex-col items-center py-10 px-4 min-h-screen">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Connection Requests</h1>
          <span className="badge badge-primary badge-outline">{requests.length} total</span>
        </div>

        <div className="space-y-3">
          {requests.map((request) => {
            const { _id, firstName, lastName, photoUrl, age, about, skills,gender } = request.fromUserId;

            return (
              <div
                key={_id}
                className="flex items-center p-3 bg-base-200 hover:bg-base-300 rounded-2xl transition-all duration-200 border border-base-300 group"
              >
                {/* Compact Avatar */}
                <div className="avatar">
                  <div className="w-20 h-20 rounded-xl">
                    <img src={photoUrl} alt="profile" className="object-cover" />
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 ml-4 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-lg truncate text-white">
                      {firstName} {lastName}
                    </h2>
                    {age && <span className="text-xs opacity-50">• {age} yrs</span>}
                    {gender && <span className="text-xs opacity-50">• {gender}</span>}
                  </div>
                  
                  <p className="text-sm opacity-70 truncate max-w-xs">
                    {about || "No bio description available."}
                  </p>

                  {/* Minimal Skills Display */}
                  <div className="flex gap-2 mt-1">
                    {skills?.slice(0, 2).map((skill, i) => (
                      <span key={i} className="text-[12px] uppercase font-bold tracking-tighter opacity-40">
                        #{skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Area */}
                <div>
                    <button
                        className="btn btn-primary mx-2"
                        onClick={() => reviewRequest("rejected", request._id)}
                    >
                        Reject
                    </button>
                    <button
                        className="btn btn-secondary mx-2"
                        onClick={() => reviewRequest("accepted", request._id)}
                    >
                        Accept
                    </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Requests
