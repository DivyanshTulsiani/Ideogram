import HeroImg from '../assets/CB5F2BEA-AAF8-4D3A-804F-2CCD97C6F3F3_1_201_a.jpeg'

const HeroImage = () => {
  return (
    <>
      <div className="flex justify-center items-center mt-[4rem] lg:mt-[2rem]">
        <div className="relative z-10 w-[90%] max-w-6xl
      p-1 lg:p-2 md:p-3
      rounded-xl
      bg-white/30
      backdrop-blur-xl
      border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] top-[-6rem]">
        <div >
        <img className='rounded-lg' src={HeroImg}/>

        </div>

        </div>
      </div>
    </>
  )
}

export default HeroImage