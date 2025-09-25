import { type RegisterOptions, type UseFormRegister } from "react-hook-form";

interface InputProps{
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}


export function Input({rules, register,  type, name, placeholder, error}:InputProps){
    return(
        <>
            <input 
                className="w-full border-2 rounded-md h-11 px-4 border-gray-200"    
                type= {type}
                id={name}
                placeholder={placeholder}
                {...register(name, rules)}
                
            />
            {error && <p className="my-1 text-red-500">{error}</p>}
        </>
    );
}