import React from 'react'
import UserProfileList from '../components/lists/UserProfileList'
import TabComponent from '../components/common/TabComponent'
import HorizontalLineWithText from '../components/common/HorizontalLineWithText'

const Nodes = () => {
  return (
    <main className='min-h-screen '>
        <section className='flex justify-center items-center pb-10'>
        <div className="container pt-16 px-2 md:px-0">
          <div className='flex flex-col space-y-6 items-center justify-center px-0 md:px-20 lg:px-40 xl:px-60'>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-center font-serif">
            Find Tech Professionals
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-center text-gray-600 max-w-3xl mx-auto">
            Connect with skilled Black professionals in tech. Whether you need software developers, data scientists, or cybersecurity experts, BlackIn Tech links you with diverse talent across Germany. Build powerful connections that drive innovation.
            </p>
          </div>
          <div className='w-full flex justify-center items-center mt-16'>
            <HorizontalLineWithText>Opportunities Await</HorizontalLineWithText>
          </div>
        </div>
      </section>
        <section className='w-full flex items-center justify-center p-4 md:px-0'>
            <div className="">
                <UserProfileList />
            </div>
        </section>
    </main>
  )
}

export default Nodes