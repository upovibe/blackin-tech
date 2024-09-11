import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/animations/Animation - Signin.json';
import SignInForm from '../components/forms/SignInForm';
import Logo from '../components/common/Logo';

function SignIn() {
    return (
        <main className="flex h-screen w-screen">
            <section className="h-screen hidden overflow-hidden md:w-6/12 lg:w-5/12 xl:w-4/12 md:block">
                <div className="bg-slate-800 h-3/6 w-full relative">
                    {/* Image with blur */}
                    {/* <img
                        src="https://images.unsplash.com/photo-1504639725590-34d0984388bd?ixid=M3wyMDkyMnwwfDF8c2VhcmNofDQwN3x8dGVjaHxlbnwwfHx8fDE3MjYwMTgzOTZ8MA&ixlib=rb-4.0.3q=85&fm=jpg&crop=faces&cs=srgb&w=3333&h=6000&fit=crop"
                        alt="Black in Tech"
                        className="w-full h-full object-cover filter blur-xl drop-shadow-none"
                    /> */}
                    {/* Text on top of the blurred image */}
                    <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center text-white gap-2 px-6'>
                        <Logo />
                        <h1 className="text-3xl mt-4 font-bold">Empowering Your Next Tech Career Move.</h1>
                    </div>
                </div>
                <div className="h-3/6 w-full bg-slate-100">
                    {/* Replace the image with the Lottie animation */}
                    <Lottie
                        animationData={animationData}
                        loop={true}
                        className="w-full h-full"
                    />
                </div>
            </section>
            <section className="flex h-screen items-center justify-center w-full md:justify-start">
                <div className="container flex h-full items-center justify-center p-3 md:justify-start">
                    <div className='w-full max-w-[416px] m-0 md:ml-20'>
                        <SignInForm/>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default SignIn
