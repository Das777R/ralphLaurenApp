import { useEffect } from 'react'
import './HeroSection.css'
import api from '../../../api/api.js'
import { useState } from 'react'

function HeroSection() {

    const [heroSectionData, setHeroSectionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    
      const fetchForHeroSection = async () => {
        try{
        const resforDeskTop = await api.get(`/landingPage/rlc-hero`);
        setHeroSectionData(resforDeskTop.data.data);
        }catch(err){console.log(err)}finally{setIsLoading(false)}
      }

      fetchForHeroSection();

  },[])


    if(isLoading){
    return (
      <div className="d-flex w-100 d-flex justify-content-center align-items-center" style={{height:"20rem"}}>
        <div className="spinner-grow text-dark" style={{width: "4rem", height:"4rem"}} role="status">
        </div>
      </div>
    )
}

  return (
<div className="rlph-img w-100 bg-body">
  <section className="rlph-img-container position-relative">
<video src={heroSectionData[0]?.media[0]} 
alt="Ralph Lauren summer campaign desktop" 
className="rlc-hero-video d-none d-md-block w-100 object-fit-cover" autoPlay loop muted playsInline></video>
    <div className="poloByralph-p user-select-none">
      <div className="Polo-ralph-Lauren-text text-white text-uppercase">
          <h1 className="text-white text-uppercase text-nowrap display-lg-4 display-5 text-center">{heroSectionData[0]?.brand}</h1>
          <div className="text-white text-uppercase text-nowrap fs-5 fs-lg-4 text-center">{heroSectionData[0]?.title}</div>
        <p className="text-truncate text-uppercase text-decoration-underline text-center  text-center poloByralph-shopnow-p mt-4">explore now</p>
        </div>
    </div>
  </section>
 <video src={heroSectionData[1]?.media[0]} 
  alt="Ralph Lauren summer campaign"
  className="rlc-hero-video d-block d-md-none w-100 object-fit-cover" autoPlay loop muted playsInline/> 
</div>
  )
}

export default HeroSection
