import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
    const navigate = useNavigate();
    const [login, setLogin] = useState("");

    function handleLogin(){
        alert("teste");
        return;
    }
    return(
        <>
            <main
                className="w-full flex justify-center items-center"
            >
                <div>
                    <h1 className="text-5xl font-bold text-black">
                        Web<span className="text-red-500">Casas</span>
                    </h1>

                    <input 
                        type="text"
                        placeholder="Insira o seu email..." 
                    />
                </div>
            </main>
        </>
    );
}