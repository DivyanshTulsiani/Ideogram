const FeaturesHeader = () =>{
  return(
    <>
      <div className="flex flex-col justify-center items-center font-inter">
        <div className="rounded-full px-3 py-0.5 text-[0.7rem] text-[#0e4eb6] bg-[#ffffff] shadow border-1 border-gray-200">
          <span className="bg-clip-text bg-[#658ccb] text-transparent mr-[0.2rem]">✨</span>Our Features
        </div>

        <div className="text-2xl lg:text-3xl font-inter font-[450] mt-[0.5rem] text-center">
        Powerful Features, Seamlessly Crafted
        </div>

        <div className="text-[0.6rem] px-5 lg:text-xs font-inter text-gray-500 mt-[0.5rem] lg:mt-[1rem] text-center ">
        Explore the tools that simplify your workflow, enhance creativity, and bring every idea to life with precision.
        </div>
      </div>
    </>
  )
}

export default FeaturesHeader