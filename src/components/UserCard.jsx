const UserCard = ({ user }) => {
  const { firstName, lastName, about, photoUrl, gender, skills, age } = user;
  
  return (
   <div className="card bg-base-300 w-80 h-fit shadow-sm">
  <figure className="w-full h-100">
    <img
      src={photoUrl}
      alt="user photo"
      className="w-full h-full object-cover" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{firstName} {lastName}</h2>
    <h2 className="break-words whitespace-normal">{about}</h2>
    {age && <h2>{age} years</h2>}
    {gender && <h2>Gender: {gender}</h2>}
    {skills.length > 0 && (
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="badge badge-accent badge-md">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    <div className="card-actions justify-center my-4">
      <button className="btn btn-primary">Ignore</button>
      <button className="btn btn-secondary">Interested</button>
    </div>
  </div>
</div>
  );
};

export default UserCard;
