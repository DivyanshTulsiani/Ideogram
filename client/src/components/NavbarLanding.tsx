import RightArrow from '../assets/right-arrow.png'
import {Link} from 'react-router-dom'

type MyRefDivProps = React.RefObject<HTMLDivElement | null>

interface NavbarLandingProps{
  TargetFeatures: MyRefDivProps
  LandingFeatures: MyRefDivProps
}


const NavbarLanding = (props: NavbarLandingProps) => {
  return (
    <>
      <div className="flex items-center justify-center mt-[0.8rem] fixed left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl">
        <div className="flex justify-between items-center px-5 bg-[#fefeff] shadow-[inset_0_4px_12px_rgba(0,0,0,0.08),0_4px_20px_rgba(0,0,0,0.05)] h-[2.8rem] lg:h-[3.2rem] w-[23rem] sm:w-[40rem] md:w-[45rem] lg:w-[60rem] xl:[80rem] rounded-lg shadow-[0_2px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-2 w-[33%]">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 font-inter flex items-center justify-center w-6 lg:w-7 h-6 lg:h-7 text-[#f1f6ff] text-[0.8rem] lg:text-sm rounded-md">
              Id
            </div>
            <div className="font-inter  text-[1rem] lg:text-[1rem]  text-slate-800">
              Ideogram
            </div>
          </div>

          <div className="hidden sm:flex justify-center items-center gap-12 w-[33%] font-inter text-sm ">
            <div>
              Home
            </div>
            <div onClick={()=>props.TargetFeatures.current?.scrollIntoView({behavior: "smooth"})}>
              Feature
            </div>
            <div onClick={()=>props.LandingFeatures.current?.scrollIntoView({behavior: "smooth"})}>
              Contact
            </div>
          </div>

          <div className="w-[33%] flex justify-end items-center font-inter text-sm gap-1">
          <Link to="/auth">
            <button className='flex items-center justify-between px-2.5 gap-2 bg-[#0f1628] rounded-lg p-1 w-[6rem] lg:w-[6.5rem] h-[1.8rem] lg:h-[2rem] '>

              <div className='text-white text-[0.8rem]'>
                Sign up
              </div>

              <div className='flex items-center bg-blue-400 rounded-sm p-1 '>
                <img className='h-2 lg:h-2.5 w-auto' src={RightArrow} />
              </div>
            </button>
            </Link>

          </div>
        </div>
      </div>
    </>
  )
}

export default NavbarLanding