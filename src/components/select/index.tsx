import { type RegisterOptions, type UseFormRegister } from "react-hook-form";

interface SelectProps{
    name: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions;
    options: { value: string; label: string }[];
}
  
  
export function SelectRegister({register, name, error, options}:SelectProps){
    return(
        <>
            <select {...register(name)} className="w-full max-w-full border-1 rounded-md h-11 text-gray-500 px-3 border-gray-800">
                <option value="">Selecione</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                    {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="my-1 text-red-500">{error}</p>}
        </>
    );
}