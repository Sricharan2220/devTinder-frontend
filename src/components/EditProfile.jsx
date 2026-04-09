import { use, useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(Array.isArray(user.skills) ? user.skills : []);
  const [skillInput, setSkillInput] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const _id = user._id;


  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill){ 
      setError("Skill cannot be empty");
      setSkillInput("")
      return;
    }
    if (skills.map(s => s.toLowerCase()).includes(trimmedSkill.toLowerCase())) {
      setError("Skill already added");
      return;
    }
    setSkills([...skills, trimmedSkill]);
    setSkillInput("");
    setError("");
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, idx) => idx !== index));
  };

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (!Array.isArray(a) || !Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    return a.every((value, index) => value === b[index]);
  };

  const saveProfile = async () => {
    //Clear Errors
    setError("");

    // Only send fields that have been changed
    const updatedFields = {};
    const normalizedAge = age === "" ? null : parseInt(age);
    if (firstName !== user.firstName) updatedFields.firstName = firstName;
    if (lastName !== user.lastName) updatedFields.lastName = lastName;
    if (photoUrl !== user.photoUrl) updatedFields.photoUrl = photoUrl;
    if (normalizedAge !== user.age) {updatedFields.age = normalizedAge;}
    if (gender !== user.gender) updatedFields.gender = gender;
    if (about !== user.about) updatedFields.about = about;
    if (!arraysEqual(skills, user.skills || [])) updatedFields.skills = skills;
    
    // If no fields changed, don't make the request
    if (Object.keys(updatedFields).length === 0) {
      setError("No changes to save");
      return;
    }

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        updatedFields,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <>
      <div className="flex justify-center my-10">
        <div className="flex justify-center mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div className="flex flex-col">
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">First Name:</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                    <div className="label">
                      <span className="label-text">Last Name:</span>
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      className="input input-bordered w-full max-w-xs"
                      onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <label className="form-control w-full max-w-xs my-2">  
                  <div className="label">
                    <span className="label-text">Photo URL :</span>
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Age:</span>
                  </div>
                  <input
                    type="number"
                    value={age}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Gender:</span>
                  </div>
                  <select
                    value={gender}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Skills:</span>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      className="input input-bordered w-full max-w-xs"
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Add a skill and press Enter"
                    />
                    <button type="button" className="btn btn-success" onClick={addSkill}>
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <span key={index} className="badge badge-Neutral badge-lg">
                        <span className="pl-2 font-medium">{skill}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-circle btn-ghost text-lg"
                          onClick={() => removeSkill(index)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </label>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">About:</span>
                  </div>
                  <textarea
                    value={about}
                    className="textarea textarea-bordered w-full max-w-xs h-24"
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                </label>
              </div>
              <p className="text-red-500">{error}</p>
              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{ _id,firstName, lastName, photoUrl, age, gender, about, skills }}
          showButtons={false}
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;