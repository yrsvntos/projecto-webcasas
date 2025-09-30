import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import toast from "react-hot-toast";

export function DashboardHeader(){

    async function handleLogOut() {
        await signOut(auth);1
        toast.success("Logout feito com sucesso!");
    }
    return(
        <div className="w-full flex items-center h-10 bg-red-500 rounded-lg text-white font-medium gap-4 px-4 mb-4">
            <Link to="/dashboard">
                Dashboard
            </Link>
            <Link to="/dashboard/new">
                Cadastrar casa
            </Link>
            <button className="ml-auto cursor-pointer" onClick={handleLogOut}>
                Sair da conta
            </button>
        </div>
    )
}