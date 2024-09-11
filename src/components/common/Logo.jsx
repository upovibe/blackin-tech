import { Link } from 'react-router-dom';

const Logo = () => (
    <Link to="/" className="flex items-center gap-2 p-[5px]  bg-slate-100 rounded-xl w-max">
        {/* "BT" for medium and smaller screens */}
        <div className="md:hidden flex items-center gap-1">
            <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md ">
                B
            </span>
            <span className='h-10 w-0.5 bg-slate-700'></span>
            <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
                T
            </span>
        </div>

        {/* Full "BlackIn Tech" logo for larger screens */}
        <div className="hidden md:flex items-center">
            <span className="bg-slate-700 text-white px-3 py-1 rounded-lg text-2xl font-bold shadow-md">
                B
            </span>
            <span className="text-gray-900 text-2xl font-semibold border-b-2 border-slate-700 pb-[2px]">
                lack
                <span className="text-slate-700 text-2xl font-extrabold">
                    In
                </span>
                <span className="text-gray-900 text-2xl font-semibold">
                    Tech
                </span>
            </span>

        </div>
    </Link>
);

export default Logo;
