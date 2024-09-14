<div className="h-full relative"> <a href="#" className="block h-full hover:opacity-75"><img src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixid=MXwyMDkyMnwwfDF8c2VhcmNofDE0MHx8Y29sb3JzJTIwd2Vic2l0ZXxlbnwwfHx8&ixlib=rb-1.2.1q=85&fm=jpg&crop=faces&cs=srgb&w=240&h=260&fit=crop" className="h-full object-cover w-full" alt="..." width="240" height="260"/></a> 
    <div className="absolute bg-blue-600 font-semibold leading-tight left-0 ml-3 mt-3 px-3 py-2 text-center text-white top-0"> 
        <div className="text-sm">Oct</div>         
        <div className="text-2xl">21</div>         
    </div>     
</div>

<section className='w-full flex items-center justify-center py-16'>
          <div className="container p-0 px-2 md:py-2">
            <div className="flex items-center justify-center flex-col space-y-5 px-80 p-0">
              <h1 className="text-4xl md:text-6xl font-bold text-center font-serif">
                Your Gateway to Tech Opportunities
              </h1>
              <p className="text-sm md:text-base lg:text-xl text-center text-gray-600 max-w-3xl mx-auto">
                Discover tech roles that value diversity and inclusion. At BlacKin Tech, we connect Black professionals with top-tier companies in Germany looking for talent in software development, data science, cybersecurity, and more.
              </p>
            </div>
          </div>
        </section>
        
        <Lottie
        animationData={animationData}
        loop={true}
        className="w-full h-full"
      />
    </div>\

    
import Lottie from 'lottie-react';
import animationData from '../assets/animations/Animation - TechJobs.json'

    
    <div className='w-full space-y-10 pb-20 px-0'>
    <h1 className="text-4xl md:text-6xl font-bold text-center font-serif">
      Your Gateway to Tech Opportunities
    </h1>
    <p className="text-sm md:text-base lg:text-xl text-center text-gray-600 max-w-3xl mx-auto">
      Discover tech roles that value diversity and inclusion. At BlacKin Tech, we connect Black professionals with top-tier companies in Germany looking for talent in software development, data science, cybersecurity, and more.
    </p>
  </div>

<JobList filters={filters} />
<JobFilter onFilterChange={handleFilterChange} />