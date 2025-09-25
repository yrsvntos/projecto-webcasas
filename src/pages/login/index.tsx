import { useEffect } from "react";
import { Container } from "../../components/container";
import { Input } from "../../components/input";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { HiOutlineMail, HiLockClosed } from "react-icons/hi";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";

const schema = z.object({
    email: z.string().nonempty("O campo email é obrigatório").email("Insira um email válido!"),
    password: z.string().nonempty("O campo de senha é obrigatório!").min(6, "A senha deve conter no minímo 6 caracteres!")
});

type FormData = z.infer<typeof schema>;

export default function Login(){
    const navigate = useNavigate();

    // Criar o formulário usando React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema), // <-- Aqui usamos o zodResolver
        mode: "onChange" // vai registar tudo sempre que o user modificar algo no input
    });

    useEffect(()=>{
        async function handleLogOut(){
            await signOut(auth);
        }
        handleLogOut();
    }, [])
    function onSubmit(data: FormData){
        signInWithEmailAndPassword(auth, data.email, data.password)
        .then((user) => {
          
          console.log(user)
          navigate("/dashboard", {replace: true})
          toast.success("Bem vindo ao sistema!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("Erro ao fazer o login!");
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
                        <HiOutlineMail size={23} className="text-gray-400 absolute top-2.5 left-3" />
                        <Input 
                            placeholder="Digite o seu email"
                            name="email"
                            type="email"
                            register={register}
                            error={errors?.email?.message}
                        />
                    </div>
                    <div className="mb-4 relative">
                        <HiLockClosed size={23} className="text-gray-400 absolute top-2.5 left-3" />
                        <Input 
                            placeholder="Digite a sua password"
                            name="password"
                            type="password"
                            register={register}
                            error={errors?.password?.message}
                        />
                    </div>
                    <button
                        className="bg-red-500 w-full rounded-md text-white h-10 font-medium cursor-pointer"
                    >
                        Login
                    </button>
                </form>
                <Link to="/register">
                    <p className="text-center">Ainda não possui uma conta? Faça o cadastro.</p>
                </Link>
            </div>
        </Container>
    );
}