import { type RegisterOptions, type UseFormRegister } from "react-hook-form";

interface InputProps{
    type: string;
    placeholder: string;
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
}


export function InputRegister({rules, register,  type, name, placeholder, error}:InputProps){
    return(
        <>
            <input 
                className="w-full max-w-full border-1 rounded-md h-11 text-black px-3 border-gray-800"    
                type= {type}
                id={name}
                placeholder={placeholder}
                {...register(name, rules)}
                
            />
            {error && <p className="my-1 text-red-500">{error}</p>}
        </>
    );
}