import { GoogleLogin } from "@react-oauth/google";
import { useState, type ChangeEvent } from "react";

export default function AuthPage() {

  const [Show, SetShow] = useState<boolean | null>(false)
  const [Email,SetEmail] = useState<string | undefined>(undefined)
  const [Password,SetPassword] = useState<string | undefined>(undefined)
  const [Name,SetName] = useState<string | undefined>(undefined)

  const OnEmailChange = (e: ChangeEvent<HTMLInputElement>) =>{
    SetEmail(e.target.value)
  }

  const OnPasswordChange = (e: ChangeEvent<HTMLInputElement>) =>{
    SetPassword(e.target.value)
  }
  const OnNameChange = (e: ChangeEvent<HTMLInputElement>) =>{
    SetName(e.target.value)
  }
 
  const handleSignin = async () => {
    try{
      const response = await fetch("https://ideogram-3.onrender.com/api/v1/users/signup",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          email: Email,
          password: Password,
          name: Name
        })

      })
      if(response.ok){
        const data = await response.json()
        if(data.message === "User created"){
          try{
            const resp = await fetch("https://ideogram-3.onrender.com/api/v1/users/signin",{
              method: "POST",
              headers: {
                "Content-Type": "application/json",
      
              },
              body: JSON.stringify({
                email: Email,
                password: Password
              })
      
            })
            
            if(resp.ok){
              const dataresp = await resp.json()
              localStorage.removeItem("token")
              localStorage.setItem("token",dataresp.token)
              window.location.href = "/flow"
            }
          }
          catch(e){

          }
        }
      }


    }
    catch(e){

    }
  }


  const handlegooglogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const res = await fetch("https://ideogram-3.onrender.com/api/v1/users/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: credentialResponse.credential
          })
        })
        const data = await res.json();
        console.log("JWT ", data.token)
        localStorage.setItem("token", data.token)

        window.location.href = "/flow";
      }
      catch (e) {
        console.log("Error during login")
      }


    }
  }



  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col w-[20rem]">
        {/* Header */}
        <div className="font-playfairvar flex justify-center items-center text-4xl">
          Sign Up
        </div>
        {/* Email */}
        <div className="flex flex-col gap-1 mt-[3rem]">
          <div className="font-inter text-gray-800 font-light">
            Email
          </div>
          <div className="font-inter font-light ">
            <input onChange={OnEmailChange} className="bg-[#f6f7fb] rounded-lg h-[3rem] w-[20rem] px-3 outline-none" placeholder="Enter your email" value={Email}/>
          </div>
        </div>
        {/* Password */}
        <div className="flex flex-col gap-1 mt-[1rem]">
          <div className="font-inter text-gray-800 font-light">
            Password
          </div>
          <div className="flex font-inter font-light bg-[#f6f7fb] rounded-lg px-3">
            <input type={Show ? 'text' : 'password'} className=" rounded-lg h-[3rem] w-[20rem] outline-none" placeholder="Enter your password" value={Password} onChange={OnPasswordChange}/>
            <button onClick={() => SetShow(!Show)}>
              {Show ?<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#7b7c7e" className="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>  : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#7b7c7e" className="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              }

            </button>
          </div>
        </div>
        {/* Name */}
        <div className="flex flex-col gap-1 mt-[1rem]">
          <div className="font-inter text-gray-800 font-light">
            Name
          </div>
          <div className="font-inter font-light ">
            <input className="bg-[#f6f7fb] rounded-lg h-[3rem] w-[20rem] px-3 outline-none" placeholder="Enter your name" value={Name} onChange={OnNameChange}/>
          </div>
        </div>
        {/* Signinlogin */}
        <div className="mt-[2rem] rounded-sm h-[2.5rem] text-white flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-600 hover:bg-blue-800 cursor-pointer font-inter font-light text-md">
          <button onClick={handleSignin} className="flex justify-center items-center ">
          Signin
          </button>
          
        </div>
        {/* Google */}

        <div className="rounded-lg mt-[1rem]"> 
        <GoogleLogin shape="rectangular" width={320} onSuccess={handlegooglogin} onError={() => console.log("Login Failed")}></GoogleLogin>
        </div>

        
      </div>
    </div>
  )
}