import { Link } from 'react-router-dom';

const NavBar = () => {

    return (
        <nav className="sticky left-0 top-0 w-full z-20">
            <div className='w-full bg-white shadow-md py-4 px-10 flex justify-between items-center'>

                <div className="flex gap-6">
                    <Link className="text-2xl text-gray-800 font-semibold hover:text-blue-500 transition" to="/tasks">
                        Home
                    </Link>
                    <Link className="text-2xl text-gray-800 font-semibold hover:text-blue-500 transition" to="/tasks/create">
                        Create Task
                    </Link>
                </div>

                <div className="flex gap-6">
                    <button
                        className="text-2xl text-red-500 font-semibold hover:text-red-700 hover:cursor-pointer transition"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
