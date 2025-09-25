import { useEffect, useContext  } from "react";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiLockClosed, HiOutlineMail, HiUserCircle } from "react-icons/hi";
import { auth } from "../../services/firebaseConnection";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/authContext";
import { signOut } from "firebase/auth";


const schema = z.object({
    name: z.string().nonempty("O campo do nome é obrigatório!").min(3,"O campo do nome deve conter no minímo 3 caractéres!"),
    email: z.string().nonempty("O campo de email é obrigatório!").email("Insira um email válido!"),
    password: z.string().nonempty("O campo de senha é obrigatório!").min(6, "O campo de senha deve conter no minímo 6 caracteres!")
})
type FormData = z.infer<typeof schema>

export default function Register(){
    const {handleInfoUser} = useContext(AuthContext)
    const navigate = useNavigate();
    const {register, handleSubmit, formState: {errors}} = useForm({
        resolver: zodResolver(schema),
        mode: "onChange"
    });
    useEffect(()=>{
        async function handleLogOut(){
            await signOut(auth);
        }
        handleLogOut();
    }, [])
    async function onSubmit(data: FormData){
        createUserWithEmailAndPassword(auth, data.email, data.password)
        .then(async (user) => {
            await updateProfile(user.user, {
            displayName: data.name,
            })
            handleInfoUser({
            name: data.name,
            email: data.email,
            uid: user.user.uid
            })
            toast.success("Cadastrado com sucesso!");
            navigate("/dashboard", {replace: true})
        })
        .catch((error) => {
            toast.error("Erro ao cadastrar usuário!");
            console.log(error)
        })
    }
    return(
        <Container>
            <div
                className="w-full min-h-screen flex justify-center items-center flex-col gap-4"
            >
                <Link to="/" className="mb-4">
                    <h1 className="text-5xl text-center font-bold text-black">
                        Web<span className="text-red-500">Casas</span>
                    </h1>
                </Link>
                <form 
                    className='bg-white max-w-full w-md rounded-lg p-4 my-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-4 relative">
                        <HiUserCircle size={23} className="absolute top-2.5 left-3 text-gray-400"/>
                        <Input
                            type="name"
                            placeholder="Digite o seu nome completo"
                            register={register}
                            name="name"
                            error={errors?.name?.message}
                        
                        />
                    </div>
                    <div className="mb-4 relative w-full w-max-full ">
                        <HiOutlineMail size={23} className="absolute top-2.5 left-3 text-gray-400"/>
                        <Input
                            type="email"
                            placeholder="Digite o seu email"
                            register={register}
                            name="email"
                            error={errors?.email?.message}

                        />
                    </div>
                    <div className="mb-4 relative">
                        <HiLockClosed size={23} className="absolute top-2.5 left-3 text-gray-400"/>
                        <Input
                            type="password"
                            placeholder="Digite a sua password"
                            register={register}
                            name="password"
                            error={errors?.password?.message}
                        
                        />
                    </div>
                    <button className="bg-red-500 w-full rounded-md text-white h-10 font-medium cursor-pointer">
                        Cadastrar
                    </button>
                </form>
                <Link to="/login">
                    <p>Já possui uma conta? Faça o login.</p>
                </Link>
            </div>
        </Container>
    );
}