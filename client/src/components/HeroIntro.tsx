import RightArrow from '../../src/assets/right-arrow.png'


const HeroIntro = () => {
  return (
    <>
      <div className="flex flex-col items-center font-inter">
        {/* Transform banner */}
        <div className="flex items-center bg-[#fefefe] rounded-lg px-2 py-0.5 lg:py-1 lg:py-[1.5] text-[0.6rem] lg:text-sm gap-2 shadow-lg">
          <div className="bg-clip-text bg-gradient-to-r from-blue-600 to-red-300 text-transparent text-lg">
            ✨
          </div>
          <div>
            Ideogram for every idea your mind curates
          </div>
          <div>
            <div className='flex items-center bg-blue-400 rounded-sm p-0.75 '>
              <img className='h-2.5 w-auto' src={RightArrow} />
            </div>
          </div>
        </div>

        {/* Main Intro */}
        <div className='mt-[1rem] lg:mt-[1rem] flex flex-col px-10 md:px-50 lg:px-70 xl:px-100 lg:mt-[1.5rem]'>
          <div className='text-2xl font-[450] lg:text-4xl text-center leading-tight'>
            Generate <span className='font-playfair'>smart flowcharts</span> within seconds with power of AI
          </div>
          <div className='text-[#6B7280] flex justify-center px-5 items-center text-[0.6rem] mt-[0.5rem] lg:text-[0.9rem]  text-center'>
            Generate flowcharts effortlessly from simple prompts. Upload your own PDFs, customize every detail, and make it uniquely yours — flowcharts have never been this exciting!
          </div>
        </div>

        {/* Option access */}
        <div className='flex justify-center items-center'>
          <div>
            <input/>
            <button></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default HeroIntro