import { useState, useContext, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import z, { url } from "zod";
import { InputRegister } from "../../../components/inputRegister";
import { SelectRegister } from "../../../components/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/dashboardheader";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { v4 as uuidV4 } from "uuid";
import { AuthContext } from "../../../context/authContext";
import { ref, getDownloadURL, uploadBytes, deleteObject} from "firebase/storage";
import { storage, db } from "../../../services/firebaseConnection";
import { FiTrash } from "react-icons/fi";
import { addDoc, collection } from "firebase/firestore";

const schema = z.object({
    name: z.string().nonempty("O tipo de Imóvel é obrigatório!"),
    location: z.string().nonempty("A localização do Imóvel é obrigatória!"),
    rooms: z.string().nonempty("O número de quartos é obrigatório!"),
    wc: z.string().nonempty("O número de casas de banho é obrigatório!"),
    garage: z.string().nonempty("O número de garagens é obrigatório!"),
    area: z.string().nonempty("A areá total do imóvel é obrigatória!"),
    description: z.string().nonempty("A descrição do imóvel é obrigatória!").min(10, "A descrição do imóvel deve ter no minímo 10 caracteres!"),
    whatsapp: z.string().nonempty("O número de telefone é obrigatório!").refine((value) => /^(\d{9,10})$/.test(value), {
        message: "Número de telefone inválido"
    }),
    type: z.string().refine((val) => ["venda", "aluguel"].includes(val), {
        message: "O tipo de negociação é obrigatório!"
    })
      
})
type FormData = z.infer<typeof schema>

interface ImageItemProps{
   uid: string;
   name: string;
   previewUrl: string;
   url: string; 
}
export default function New(){
    const {user} = useContext(AuthContext);
    const [propertyImages, setPropertyImages] = useState<ImageItemProps[]>([]);
    const {register, handleSubmit, formState: {errors, isValid}, reset} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
      })
    async function onSubmit(data: FormData){
        if(propertyImages.length === 0){
            toast.error("Faça o upload da imagem para este imóvel!");
            return;
        }

        const propertyImageList = propertyImages.map( property => {
            return{
                uid: property.uid,
                name: property.name,
                url: property.url
            }
        })

        addDoc(collection(db, "property"), {
            name: data.name,
            location: data.location,
            rooms: data.rooms,
            wc: data.wc,
            garage: data.garage,
            area: data.area,
            type: data.type,
            whatsapp: data.whatsapp,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: propertyImageList,
        })
        .then(() => {
            reset(); // função que limpa os campos do formulário
            setPropertyImages([]);
            toast.success("Imóvel cadastrado com sucesso!")
        })
        .catch((error) => {
            console.log("Erro ao cadastrar no banco!", error);
        })  
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>){
        if(e.target.files && e.target.files[0]){
            const image = e.target.files[0];
            if(image.type === 'image/png' || image.type === 'image/jpeg'){
                await handleUpload(image);
            }else{
                toast.error("Envie uma imagem com a extensão png ou jpeg")!
            }
        }
    }

    async function handleUpload(image: File){
        if(!user?.uid){
            return;
        }

        const currentUid = user?.uid;
        const uidImage = uuidV4();

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`);
        
        uploadBytes(uploadRef, image)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadUrl) => {
                const imageItem = {
                    uid: currentUid,
                    name: uidImage,
                    previewUrl: URL.createObjectURL(image),
                    url: downloadUrl
                }

                setPropertyImages((images) => [...images, imageItem]);
                toast.success("Imagem carregada com sucesso!");
            })
        })


    }

    async function handleDeleteImage(item: ImageItemProps){
        const imagePath = `images/${item.uid}/${item.name}`;
    
        const imageRef = ref(storage, imagePath);
    
        try{
          await deleteObject(imageRef);
          setPropertyImages(propertyImages.filter((house) => house.url !== item.url));
          toast.success("Imagem excluída com sucesso!");
        }catch(error){
          console.log("Erro ao excluir a imagem");
        }
    }
    return(
        <Container>
            <DashboardHeader/>
            <div className="w-full bg-white rounded-lg p-3 flex flex-col gap-2 sm:flex-row items-center">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000"/>
                    </div>
                    <div className="cursor-pointer">
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="opacity-0 cursor-pointer"
                            onChange={handleFile}
                        />
                    </div>
                </button>
                {propertyImages.map(item => 
                     <div 
                     key={item.name} 
                     className="w-full h-32 flex items-center justify-center relative">
                     <button
                       className="absolute cursor-pointer"
                       onClick={() => handleDeleteImage(item)}
                     >
                       <FiTrash size={28} color="#fff"/>
                     </button>
                       <img 
                         src={item.previewUrl} 
                         alt="Foto do carro"
                         className="rounded-lg w-full h-32 object-cover" 
                       />
                   </div>
                )}
            </div>
            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                onSubmit={handleSubmit(onSubmit)} 
                className="w-full" 
                >   
                    <div className="mb-3">
                        <p className="font-medium mb-2">Tipo de Imóvel</p>
                        <InputRegister
                            placeholder="Insira o tipo de imóvel"
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                        />
                    </div>
                    <div className="mb-3">
                        <p className="font-medium mb-2">Localização do Imóvel</p>
                        <InputRegister
                            placeholder="Insira a localização do imóvel"
                            type="text"
                            register={register}
                            name="location"
                            error={errors.location?.message}
                        />
                    </div>
                    <div className="flex w-full flex-row items-center gap-4">
                        <div className="mb-3 w-full">
                            <p className="mb-2 font-medium">Número de quartos</p>
                            <InputRegister
                                type="text"
                                register={register}
                                name="rooms"
                                error={errors.rooms?.message}
                                placeholder="Insira o número de quartos"
                            />
                        </div>
                        <div className="mb-3 w-full">
                            <p className="mb-2 font-medium">Número de casas de banho</p>
                            <InputRegister
                                type="text"
                                register={register}
                                name="wc"
                                error={errors.wc?.message}
                                placeholder="Insira o número de casas de banho"
                            />
                        </div>
                        <div className="mb-3 w-full">
                            <p className="mb-2 font-medium">Número de garagens</p>
                            <InputRegister
                                type="text"
                                register={register}
                                name="garage"
                                error={errors.garage?.message}
                                placeholder="Insira o número de garagens"
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-row items-center gap-4">
                        
                        <div className="mb-3 w-full">
                            <p className="mb-2 font-medium">Área Bruta</p>
                            <InputRegister
                                type="text"
                                register={register}
                                name="area"
                                error={errors.area?.message}
                                placeholder="Insira a área bruta do imóvel"
                            />
                        </div>
                        <div className="mb-3 w-full">
                            <p className="mb-2 font-medium">Tipo de negociação</p>
                            <SelectRegister
                                name="type"
                                register={register}
                                error={errors.type?.message}
                                options={[
                                { value: "venda", label: "Venda" },
                                { value: "aluguel", label: "Aluguel" }
                                ]}
                            />
                        </div>
                        <div className="mb-3 w-full">
                            <p className="mb-2 font-medium">Contacto Telefónico</p>
                            <InputRegister
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Insira o contacto telefónico"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-1 border-gray-800 w-full rounded-md h-24 p-2"
                            {...register("description")}
                            name="description"
                            id="description"
                            placeholder="Descrição completa do imóvel"
                        >
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                        </textarea>
                    </div>
                    <button 
                        type="submit" 
                        
                        disabled={!isValid}
                        className={`rounded-md font-medium h-10 w-full 
                            ${isValid ? "bg-zinc-900 text-white cursor-pointer" : "bg-zinc-300 text-zinc-500 cursor-not-allowed"}
                        `}
                        >
                        Cadastrar
                    </button>
                </form>
            </div>
        </Container>
    );
}