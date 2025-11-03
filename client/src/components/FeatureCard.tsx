interface FeatureCardProps {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  Content: string;
  Title: string;
  Stroke: string;
  Background: string
}

const FeatureCard = ({Icon,Content,Title,Background,Stroke} : FeatureCardProps) => {
  return (
    <>
      <div className="flex flex-col justify-center border border-gray-300 bg-[#ffffff] w-[9rem] lg:w-[12rem] p-3 rounded-md font-inter">
        <div style={{backgroundColor: `${Background}`}} className=" rounded-sm p-1 flex justify-items-start h-6 w-6 mt-[0.2rem]">
          <Icon style={{stroke: `${Stroke}`}} className=""/>
        </div>
        <div className="text-[0.7rem] lg:text-[0.8rem] font-[550] mt-[0.7rem]">
          {Title}
        </div>

        <div className="text-[0.4rem] lg:text-[0.5rem] text-gray-500 mt-[0.7rem]">
         {Content}
        </div>
      </div>
    </>
  )
}

export default FeatureCard