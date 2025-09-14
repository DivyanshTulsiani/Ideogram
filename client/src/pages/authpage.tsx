import { GoogleLogin } from "@react-oauth/google";

export default function AuthPage(){
  const handlegooglogin = async (credentialResponse: any) =>{
    if(credentialResponse.credential){
      const res = await fetch("http://localhost:3000/api/v1/users/auth/google",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token: credentialResponse.credential
        })
      })

      const data = await res.json();
      console.log("JWT ",data.token)
      localStorage.setItem("token",data.token)
    }
  }

  const id = import.meta.env.GOOGLE_CLIENT_ID;


  return(
    <div>
      <h1>Login or Register</h1>
      <h1>{id}</h1>
      <GoogleLogin onSuccess={handlegooglogin} onError={()=>console.log("Login Failed")}></GoogleLogin>
    </div>
  )
}