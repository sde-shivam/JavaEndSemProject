import React from 'react'
import HeroSection from '../../Component/homecomponent/Herosection'
import HomeNavbar from '../../Component/homecomponent/HomeNavbar'
import PosInfoSection from '../../Component/homecomponent/PosInfoSection'
import ServicesSection from '../../Component/homecomponent/ServicesSection'
const HomePage = () => {
  return (
    <div className='home'>
        <HomeNavbar/>
      <HeroSection/>
      <PosInfoSection/>
      <ServicesSection/>
    </div>
  )
}

export default HomePage
