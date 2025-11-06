


const Footer = () => {
  return (
    <>
      <div className="bg-[#fefeff] font-inter h-[4rem] flex px-10 shadow-lg border-t border-[#E6E6F0]">
        <div className="flex justify-start items-center gap-2 w-[33%] font-light">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 font-inter flex items-center justify-center w-6 lg:w-9 h-6 lg:h-9 text-[#f1f6ff] text-[0.8rem] lg:text-lg rounded-md">
            Id
          </div>
          <div className="font-inter  text-[1rem] lg:text-[1.4rem]  text-slate-800">
            Ideogram
          </div>
        </div>
        <div className="flex justify-center items-center w-[33%] font-light">
          Built by Divyansh Tulsiani
        </div>
        {/* Socials */}
        <div className="flex justify-end items-center w-[33%]">
            <div>
              <image/>
            </div>
            <div>

            </div>
        </div>
      </div >
    </>
  )
}


export default Footer