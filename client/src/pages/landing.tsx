import NavbarLanding from "../components/NavbarLanding"
import DecorativeSquares from "../components/DecorativeSquares"
import Hero from "../components/Hero"

const Landing = () => {
  return (
    <>
      <div className="" style={{
        background: `
   radial-gradient(circle at 15% 15%, rgba(224, 242, 254, 0.8) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(245, 224, 255, 0.6) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgb(226 226 255 / 50%) 0%, transparent 50%), radial-gradient(circle at 85% 85%, rgba(245, 224, 255, 0.4) 0%, transparent 50%), linear-gradient(135deg, rgb(240, 249, 255) 0%, rgb(250, 245, 255) 100%)`, height: '100dvh', width: '100%', position: "fixed", zIndex: -1, top: 0, left: 0
      }}>
        <NavbarLanding />

        <div className="flex">
          <DecorativeSquares />
        </div>

        <div>
          <Hero/>
        </div>

        <div className="flex">
          jndjkv
        </div>
      </div>

    </>
  )
}

export default Landing