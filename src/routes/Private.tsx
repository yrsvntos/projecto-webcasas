import { type ReactNode, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";


interface PrivateProps{
    children: ReactNode;
}

export default function Private({children}: PrivateProps){
    const {signed, loadingAuth} = useContext(AuthContext);

    if(loadingAuth){
        return <div></div>
    }

    if(!signed){
        return <Navigate to="/login"/>
    }
    return children;
}