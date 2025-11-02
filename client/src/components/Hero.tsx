import HeroIntro from './HeroIntro'
import HeroImage from './HeroImage'
import HeroButton from './HeroButton'
import grid from '../assets/grid.png'
import grid2 from '../assets/grid2.png'


const Hero = () => {
  return (
    <>
      <section className="relative flex flex-col justify-center items-center text-center py-20 overflow-hidden mt-[6rem] lg:mt-[4rem] min-h-full">

      <div
  style={{
    background: `
      radial-gradient(circle at 10% 100%, rgba(162, 55, 255, 0.25), transparent 90%),


    `,
    height: '100%',
    width: '100%',
    position: 'fixed',
    inset: 0,
    zIndex: -1, // notice -2 here
  }}
/>

        <div >
        <img
        src={grid2}
        alt="decorative background"
        className="absolute inset-0  w-[100%] min-h-full object-contain opacity-80 -z-10"
        style={{
          top: "10%",
          left: "10%",
          transform: "translate(-10%, -10%)",
   
          opacity: 0.8
        }}
      />
          <HeroIntro />
          <HeroButton />
          {/* <HeroImage /> */}
        </div>
      </section>
    </>
  )
}

export default Hero