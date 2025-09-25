import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";



export default function Header(){
  const {signed, loadingAuth} = useContext(AuthContext)

    return(
      <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
        <header className="flex w-full max-w-7xl justify-between items-center px-4 mx-auto">
            <Link to="/" className="my-4">
                <h1 className="text-5xl text-center font-bold text-black">
                    Web<span className="text-red-500">Casas</span>
                </h1>
            </Link>
          {!loadingAuth && signed && (
            <Link to="/dashboard">
              <div className="border-2 rounded-full p-1 border-gray-900">
                <FiUser size={24} color="#000"/>
              </div>
            </Link>
          )}
          {!loadingAuth && !signed && (
            <Link to="/login">
              <div className="border-2 rounded-full p-1 border-gray-900">
                <FiLogIn size={24} color="#000"/>
              </div>
            </Link>
          )}
        </header>
        
      </div>
    );
  }
