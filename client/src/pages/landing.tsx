import NavbarLanding from "../components/NavbarLanding"
import Hero from "../components/Hero"
import HeroImage from "../components/HeroImage"
import Features from "../components/Features"
import { useRef } from "react"
import Footer from "../components/Footer"
// background: `
//    radial-gradient(circle at 15% 15%, rgba(224, 242, 254, 0.8) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(245, 224, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgb(226 226 255 / 50%) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(245, 224, 255, 0.4) 0%, transparent 50%), linear-gradient(135deg, rgb(240, 249, 255) 0%, rgb(250, 245, 255) 100%)`, height: '100dvh', width: '100%', position: "fixed", zIndex: -1, top: 0, left: 0


// //background: `
// radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.25), transparent 70%),   /* soft violet glow near top */
// radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.20), transparent 80%),   /* bluish glow near bottom */
// linear-gradient(to bottom, #0f1117 0%, #151821 100%)                             /* dark gradient base */
// `,

//style={{ background: radial-gradient(circle at top center, rgba(173, 216, 255, 0.6), transparent 60%), radial-gradient(circle at bottom center, rgba(173, 216, 255, 0.6), transparent 60%), linear-gradient(to bottom, #ffffff, #ffffff) , height: '100dvh', width: '100%', position: 'fixed', zIndex: -1, top: 0, left: 0 }}

const Landing = () => {
  const TargetRefFeatures = useRef<HTMLDivElement>(null)
  const TargetRefContact = useRef<HTMLDivElement>(null)
   return (
    <>
    <div  style={{
  position: 'relative',
  minHeight: '100vh',
  overflowX: 'hidden',
}}>
<div
  className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_50%_1%,rgba(162,55,255,0.25)_0%,transparent_20%),radial-gradient(circle_at_10%_120%,rgba(76,85,255,0.25)_0%,transparent_40%),radial-gradient(circle_at_120%_120%,rgba(76,85,255,0.25)_0%,transparent_40%),linear-gradient(to_bottom,#f9fbff_0%,#ffffff_100%)] lg:bg-[radial-gradient(circle_at_50%_10%,rgba(162,55,255,0.25)_0%,transparent_30%),radial-gradient(circle_at_10%_90%,rgba(76,85,255,0.25)_0%,transparent_40%),radial-gradient(circle_at_100%_100%,rgba(76,85,255,0.25)_0%,transparent_40%),linear-gradient(to_bottom,#f9fbff_0%,#ffffff_100%)] "
/>
    <div>
        <NavbarLanding TargetFeatures={TargetRefFeatures} LandingFeatures={TargetRefContact}/>

        <div className="flex">
          {/* <DecorativeSquares /> */}
        </div>

        <div>
          <Hero/>
          <HeroImage />
        </div>

        <div className="mt-[1rem] relative top-[-4rem]" ref={TargetRefFeatures}>
          <Features/>

        </div>


      </div>
      <div ref={TargetRefContact}>
      <Footer />
      </div>
        


      </div>

    </>
  )
}

export default Landing