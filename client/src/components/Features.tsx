import FeaturesHeader from "./FeaturesHeader"
import FeatureCard from "./FeatureCard"
import  FlowIcon from "../assets/flow.svg?react";
import PdfIcon from "../assets/pdflogo.svg?react"
import AuthIcon from "../assets/Auth.svg?react"
import SaveIcon from "../assets/Save.svg?react"
import SaveImageIcon from "../assets/SaveImage.svg?react"
import ResponsivePhoneIcon from "../assets/ResposivePhone.svg?react"

const Features = () => {
  return(
    <>
    <div className="flex flex-col justify-center items-center">
      <FeaturesHeader/>
      <div className="flex mt-[2rem] grid grid-rows-3 md:grid-rows-2 grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-10">
        <FeatureCard Icon={FlowIcon} Background="#fbe2df" Stroke="#bd625b" Title="Generate Smart Flowcharts" Content="Auto-generate detailed flowcharts that map your logic and workflows seamlessly."/>
        <FeatureCard Icon={AuthIcon} Background="#fee6f3" Stroke="#bd625b" Title="Secure OAuth Connection" Content="Sign in safely using industry-standard OAuth protocols — your data stays encrypted and your workflow seamless."/>
        <FeatureCard Icon={PdfIcon} Background="#dae9fc" Stroke="#547cc3" Title="PDF Upload Embeddings" Content="Upload PDFs to auto-embed their content, giving the LLM richer context for smarter, more accurate flowcharts."/>
        <FeatureCard Icon={SaveIcon} Background="#fef8bf" Stroke="#a58f48" Title="Effortless Chat Saving" Content="Save and revisit your AI chat sessions instantly, keeping every idea and interaction accessible whenever you need it."/>
        <FeatureCard Icon={SaveImageIcon} Background="#dffae7" Stroke="#5a8d69" Title="Save Your Creations" Content="Store your generated flowcharts, diagrams, and projects directly within your workspace — no need to export or lose progress."/>
        <FeatureCard Icon={ResponsivePhoneIcon} Background="#f2f4f6" Stroke="#5e636c" Title="Responsive Experience" Content="Enjoy a consistent and optimized experience across all devices — from desktops to tablets and mobiles."/>

      </div>
    </div>

    </>
  )
}

export default Features