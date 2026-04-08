import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connection);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return <div className="text-center mt-20"><span className="loading loading-spinner loading-lg"></span></div>;

  if (connections.length === 0) return <h1 className="text-center mt-20 text-xl text-gray-500">No Connections Found</h1>;

  return (
    <div className="flex flex-col items-center py-10 px-4 min-h-screen">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Connections</h1>
          <span className="badge badge-primary badge-outline">{connections.length} total</span>
        </div>

        <div className="space-y-3">
          {connections.map((connection) => {
            const { _id, firstName, lastName, photoUrl, age, about, skills,gender } = connection;

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
                <div className="ml-4">
                  <Link to={"/chat/" + _id}>
                    <button className="btn btn-ghost btn-circle text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Connections;