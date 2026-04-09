import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";


const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginForm,setIsLoginForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");


  
  const handleLogin = async () => {
    try{
      const res = await axios.post(BASE_URL + "/login", {
        emailId, 
        password 
      }
      ,
      {withCredentials: true}
    );
    dispatch(addUser(res.data));
    return navigate("/");
    }catch(err){
      //console.error("Error occurred while logging in:", error);
      setError(err?.response?.data || "Something went wrong");
    }
  }

   const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-[calc(100vh-84px)] bg-gradient-to-br from-base-100">
      
      <div className="mb-12 bg-base-300 shadow-2xl rounded-2xl p-8 w-80 transition-all duration-300 hover:scale-[1.01]">
        
        <h2 className="text-center text-2xl font-bold mb-6">
          {isLoginForm ? "Welcome Back 👋" : "Create Account 🎉"}
        </h2>
        <div>
        {!isLoginForm && (
              <>
                <div className="mb-2">
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                </div>

                <div className="mb-2">
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Last Name</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                </div>
              </>
        )}
        </div>
        {/* Email */}
        <div className="mb-2">
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          <input
            type="email"
            value={emailId}
            onChange={(e)=>setEmailId(e.target.value)}
            placeholder="Enter your email"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="label">
            <span className="label-text font-medium">Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            placeholder="Enter your password"
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Forgot password */}
        {/* <div className="text-right text-sm mb-4">
          <a href="#" className="text-primary hover:underline">
            Forgot password?
          </a>
        </div> */}

        <p className="text-red-500 mb-2 text-center">{error}</p>

        {/* Button */}
        <button className="btn btn-neutral w-full rounded-xl text-base font-semibold hover:scale-[1.02] transition-all duration-200"
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {isLoginForm ? "Login" : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="divider my-4">OR</div>

        {/* Signup */}
        <p className="text-center text-sm">
          {isLoginForm ? "Don’t have an account? " : "Already have an account? "}
          <span 
          className="text-primary font-medium cursor-pointer hover:underline"
          onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>

    </div>
  );
};

export default Login;