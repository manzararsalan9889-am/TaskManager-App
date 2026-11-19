import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { setLoginInfo } from '../LoginInfo';
import { useAuthenticate } from '../useAuthenticate';

function Navbar() {
  const location = useLocation();
  const [authenticate, setAuthenticate] = useAuthenticate()
  const isActive = (path) => location.pathname === path;
  const logout = () => {
    setAuthenticate({
      isLogin: false,
      loginData: ""
    })
    setLoginInfo({
      isLogin: false,
      loginData: ""
    })
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl border-b-2 border-blue-300 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <ul className="flex space-x-6 text-sm sm:text-base md:text-lg text-white tracking-wider uppercase">
            {[
              { name: 'Tasks', path: '/get' },
              { name: 'Status Check', path: '/status' },
              { name: 'Users', path: '/getuser' },
              { name: 'Change Pass', path: '/changepass' },
            ].map(({ name, path }) => (
              <li key={name} className="relative group">
                <Link
                  to={path}
                  className={`py-2 px-3 inline-block transition-all duration-300 border-b-2 
                    ${isActive(path)
                      ? 'text-yellow-300 border-yellow-300 font-bold'
                      : 'border-transparent hover:border-yellow-200 hover:text-yellow-200'
                    }`}
                >
                  {name}
                </Link>
                <div className={`absolute bottom-0 left-0 h-[2px] w-full bg-yellow-300 
                                transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left
                                ${isActive(path) ? 'scale-x-100' : ''}`}>
                </div>
              </li>
            ))}
            <li>
              <button className='py-2 px-3 inline-block transition-all duration-300 
                      border-transparent hover:border-yellow-200 hover:text-yellow-200'
                onClick={logout}>LogOut </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
