import GithubLogo from "../assets/icons8-github-64.png"
import XLogo from "../assets/icons8-x-50.png"
import imch2 from "../assets/imch2.png"



const Footer = () => {
  return (
    <>
      <div className="bg-[#0f1628] text-white font-inter h-[4rem] flex px-10 shadow-lg border-t border-[#E6E6F0]">
        <div className="flex justify-start items-center gap-2 w-[33%] font-light">
          <img src={imch2} className="h-7 w-auto"/>
          <div className="font-inter  text-[1rem] lg:text-[1.4rem]">
            Ideogram
          </div>
        </div>
        <div className="flex justify-center items-center w-[33%] font-light">
          Built by Divyansh Tulsiani
        </div>
        {/* Socials */}
        <div className="flex justify-end gap-4 items-center w-[33%]">
            <div>
              <img src={GithubLogo} className="w-[1.3rem] h-auto"/>
            </div>
            <div>
              <img src={XLogo} className="w-[1.2rem] h-auto"/>
            </div>
        </div>
      </div >
    </>
  )
}


export default Footer