import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import { collection, query, doc, deleteDoc, getDocs, where} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../services/firebaseConnection";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/dashboardheader";
import { FiHome } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { BiBed, BiBath, BiSolidCarGarage } from "react-icons/bi";
import { HiLocationMarker } from "react-icons/hi";
import { MdSquareFoot } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { BsFillPencilFill } from "react-icons/bs";

interface PropertyProps{
    id: string;
    name: string;
    price: string;
    location: string | number;
    rooms: string;
    type: string;
    whatsapp: string;
    wc: string;
    garage: string;
    area: string;
    images: PropertyImageProps[];
    uid: string;
    
}

interface PropertyImageProps{
    name: string;
    uid: string;
    url: string;
}

export default function Dashboard(){
    const {user} = useContext(AuthContext);
    const [properties, setProperties] = useState<PropertyProps[]>([]);
    const [loadImage, setLoadImage] = useState<string[]>([]);

    useEffect(() => {
        if(!user?.uid){
            return;
        }

        function loadProperty(){
            const propertyRef = collection(db, "property");
            const queryRef = query(propertyRef, where("uid",  "==", user?.uid))

            getDocs(queryRef)
            .then((snapshot) => {
                // criar lista vazia
                let listProperty = [] as PropertyProps[];

                snapshot.forEach( doc => {
                    listProperty.push({
                        id: doc.id,
                        name: doc.data().name,
                        price: doc.data().price,
                        location: doc.data().location,
                        rooms: doc.data().rooms,
                        type: doc.data().type,
                        whatsapp: doc.data().whatsapp,
                        wc: doc.data().wc,
                        garage: doc.data().garage,
                        area: doc.data().area,
                        images: doc.data().images,
                        uid: doc.data().uid
                    })
                })
                setProperties(listProperty)
            })
        }
        loadProperty();
    }, [user])

    function handleImageLoad(id: string){
        setLoadImage((prevImageLoaded) => [...prevImageLoaded, id])
    }
    async function handleDeleteCar(property: PropertyProps){
        const itemProperty = property;
        const docRef = doc(db, "property", itemProperty.id);
        await deleteDoc(docRef);
        itemProperty.images.map(async (image) => {
          const imagePath = `images/${image.uid}/${image.name}`;
          const imageRef = ref(storage, imagePath);
    
          try {
            toast.success("Imovél excluído com sucesso!");
            await deleteObject(imageRef);
            setProperties(properties.filter(property => property.id !== itemProperty.id));
            
          } catch (error) {
            console.log("Erro ao deletar a imagem.")
          }
        })
        
    }
    return(
        <Container>
            <main className="min-h-screen">
                <DashboardHeader/>
                {properties.length === 0 && (
                    <div className="w-full text-center mb-4 ">
                        <h1 className="font-medium text-xl my-4">Sem imóveis cadastrados no sistema!</h1>
                        <Link to="/dashboard/new">
                            <button className="h-10 bg-red-500 text-white font-medium px-3 rounded-lg cursor-pointer">
                                Cadastrar imóvel
                            </button>
                        </Link>
                    </div>
                )}
                <section
                        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-4"
                    >
                        {properties.map(property => (
                            
                                <div 
                                    key={property.id}
                                    className="border outline-none border-zinc-100"
                                >
                                    <div className="house-img relative">
                                        <div 
                                            className="w-full  relative h-50 rounded-lg bg-gray-400"
                                            style={{display: loadImage.includes(property.id) ? "none" : "block"}}
                                        >
                                            <FiHome size={78} color="#fff" className="absolute top-16 left-40"/>
                                        </div>
                                        <img 
                                            src={property.images[0].url} 
                                            alt={`Foto do Imóvel  - ${property.name} `} 
                                            className="w-full object-cover rounded-bl-none rounded-br-none rounded-md h-50"
                                            onLoad={() => handleImageLoad(property.id)}
                                            style={{display: loadImage.includes(property.id) ? "block" : "none"}}
                                        />
                                        <div className="bg-red-500 text-white text-sm font-bold rounded-md py-1 px-3 type-property absolute top-3 left-3">
                                            <small>{property.type.toLocaleUpperCase()}</small>
                                        </div>
                                        <button
                                            onClick={() => {handleDeleteCar(property)}}
                                            className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center right-2 top-2 drop-shadow cursor-pointer"
                                        >
                                            <FiTrash2 size={18} color="#000"/>
                                        </button>
                                        <Link
                                            to={`/dashboard/edit/${property.id}`}
                                            className="absolute bg-white w-10 h-10 rounded-full flex items-center justify-center right-14 top-2 drop-shadow cursor-pointer"
                                        >
                                            <BsFillPencilFill size={18} color="#000"/>
                                        </Link>
                                    </div>
                                    <div className="house-info bg-white rounded-md rounded-t-none p-4">
                                        <Link to={`/casas/${property.id}`}>
                                            <h3 className="font-bold text-xl">{property.name}</h3>
                                        </Link>
                                        <small className="flex items-center font-medium text-zinc-500 mt-2 gap-1">
                                            <HiLocationMarker size={16}/>{property.location}
                                        </small>
                                        <div className="house-details text-sm mt-4 p-2 bg-zinc-200 gap-3 flex items-center rounded-md">
                                            <div className="rooms flex items-center gap-1 relative group">
                                                <BiBed size={23} className="text-zinc-500"/> {property.rooms}
                                                <span 
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-1 shadow-lg" 
                                                >
                                                    Quartos
                                                </span>
                                            </div>

                                            <div className="rooms flex items-center gap-1 relative group">
                                                <BiBath size={23} className="text-zinc-500"/> {property.wc}
                                                <span 
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-1 shadow-lg" 
                                                >
                                                    WC
                                                </span>
                                            </div>
                                            <div className="rooms flex items-center gap-1 relative group">
                                                <BiSolidCarGarage size={23} className="text-zinc-500"/> {property.garage}
                                                <span 
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-1 shadow-lg" 
                                                >
                                                    Garagem
                                                </span>
                                            </div>
                                            <div className="rooms flex items-center gap-1 relative group">
                                                <MdSquareFoot size={23} className="text-zinc-500"/> {property.area}m<sup>2</sup>
                                                <span 
                                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-lg px-3 py-1 shadow-lg" 
                                                >
                                                    Área Bruta
                                                </span>
                                            </div>
                                        </div>
                                        <div className="house-vendor flex items-center justify-between mt-4 text-sm">
                                            <div className="vendor-name flex items-center gap-1">
                                                <p className="font-medium text-md text-zinc-900"><strong>MZN {property.price}</strong></p>
                                            </div>
                                            <Link 
                                                to={`https://api.whatsapp.com/send?phone=${property.whatsapp}`} 
                                                target="_blank"
                                                className="bg-green-600 vendor-contact border flex items-center text-white rounded outline px-2 py-1 gap-1 cursor-pointer">
                                                <FaWhatsapp size={18}/> Contactar
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            
                        ))}
                        
                </section>
            </main>
            
        </Container>
    );
}
