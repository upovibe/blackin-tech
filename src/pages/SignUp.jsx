import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../assets/animations/Animation - Signup.json';
import SignUpForm from '../components/forms/SignUpForm'
import Logo from '../components/common/Logo';

function SignUp() {
    return (
        <main className="flex h-screen w-screen">
            <section className="h-screen hidden overflow-hidden md:w-6/12 lg:w-5/12 xl:w-4/12 md:block">
                <div className="bg-slate-800 h-3/6 w-full relative">
                    <div className='absolute top-0 left-0 w-full h-full flex flex-col justify-center text-white gap-2 px-6'>
                        <Logo />
                        <h1 className="text-3xl mt-4 font-bold">Empowering Your Next Tech Career Move.</h1>
                    </div>
                </div>
                <div className="h-3/6 w-full bg-slate-100">
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
                        <SignUpForm />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default SignUp
