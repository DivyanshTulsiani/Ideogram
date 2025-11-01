import HeroIntro from './HeroIntro'
import HeroImage from './HeroImage'
import HeroButton from './HeroButton'


const Hero = () => {
  return(
    <>
      <div className="flex flex-col justify-center mt-[4rem] ">
        <HeroIntro/>
        <HeroButton/>
        <HeroImage/>
      </div>
    </>
  )
}

export default Hero