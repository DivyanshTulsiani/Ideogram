import { motion } from "framer-motion";

const HeroButton = () => {
  const AnimatedText = "Generate flowchart of OSI model";
  const Words = AnimatedText.split(" ");

  return (
    <>
      <div className="flex justify-center items-center mt-[1.5rem] lg:mt-[0.2rem]">
        <div className="relative z-10 p-1 rounded-full backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
        <div className="flex bg-white gap-2 px-2 lg:px-3 py-1 lg:py-1 rounded-full text-[#848486] items-center">
          <div className="flex">
          {Words.map((word, index) =>
            <motion.p
              initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
              animate={{ filter: "blur(0)", opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              key={index}
              className="mr-0.5 lg:mr-0.75 text-[0.5rem] lg:text-[0.5rem] lg:text-[0.5rem]">
              {word}
            </motion.p>)}
            </div>
          <div className="flex bg-blue-400 text-[0.5rem] lg:text-[0.5rem] px-3 py-1 rounded-full text-white">
            <div>
              Generate
            </div>
            <div>

            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default HeroButton