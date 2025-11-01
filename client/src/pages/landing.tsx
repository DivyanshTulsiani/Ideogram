import NavbarLanding from "../components/NavbarLanding"
import DecorativeSquares from "../components/DecorativeSquares"
import Hero from "../components/Hero"

// background: `
//    radial-gradient(circle at 15% 15%, rgba(224, 242, 254, 0.8) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(245, 224, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgb(226 226 255 / 50%) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(245, 224, 255, 0.4) 0%, transparent 50%), linear-gradient(135deg, rgb(240, 249, 255) 0%, rgb(250, 245, 255) 100%)`, height: '100dvh', width: '100%', position: "fixed", zIndex: -1, top: 0, left: 0


//style={{ background: radial-gradient(circle at top center, rgba(173, 216, 255, 0.6), transparent 60%), radial-gradient(circle at bottom center, rgba(173, 216, 255, 0.6), transparent 60%), linear-gradient(to bottom, #ffffff, #ffffff) , height: '100dvh', width: '100%', position: 'fixed', zIndex: -1, top: 0, left: 0 }}

const Landing = () => {
  return (
    <>
      <div className=""   style={{
  background: `
    radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.35), transparent 70%),  /* violet glow behind hero */
    radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.25), transparent 80%),  /* blue glow near bottom */
    linear-gradient(to bottom, #f9fbff 0%, #ffffff 100%)  /* smooth white fade */
  `,
  height: '100dvh',
  width: '100%',
  position: 'fixed',
  inset: 0,
  zIndex: -1,
}}>
        <NavbarLanding />

        <div className="flex">
          <DecorativeSquares />
        </div>

        <div>
          <Hero/>
        </div>


      </div>

    </>
  )
}

export default Landing