import { useEffect } from "react";
import { useNavigate } from "react-router-dom"


const Dashboard = () =>{
  const navigate = useNavigate();

  //we had used this earlier aswell the to have a async req in useEffect we define it within
  //that and then call it bydefault we dont make the useEffect fn async
  //yet again we can see ts ensures that headers auth takes a string or undefined so we define it that way

  useEffect(() => {
    const token = localStorage.getItem("token")
    const VerifyToken = async () => {
      try{
        const response = await fetch(`http://localhost:3000/api/v1/users/me`,{
          method: "POST",
          headers: token? {"authorization": token} : undefined
        })

        if(response.ok){

        }
        else{
          alert("Login failed")
          navigate("/")
        }
      }
      catch(e){
        localStorage.removeItem("token");
        alert("Invalid token. Redirecting to login...");
        navigate("/")
      }
    }
    VerifyToken()
  },[navigate])

  return(
    <>
    </>
  )
}

export default Dashboard