import { useState, useEffect, useContext } from "react";
import { Container } from "../../components/container";
import { db } from "../../services/firebaseConnection";
import { getDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { BiBed, BiBath, BiSolidCarGarage } from "react-icons/bi";
import { MdSquareFoot } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { FiUser, FiHome } from "react-icons/fi";
import { AuthContext } from "../../context/authContext";


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
    description: string;
    
}

interface PropertyImageProps{
    name: string;
    uid: string;
    url: string;
}


export function HouseDetail(){
    const {id} = useParams();
    const [property, setProperty] = useState<PropertyProps>();
    const [sliderPreview, setSliderPreview] = useState<number>(2);
    const navigate = useNavigate();
    const {user} = useContext(AuthContext);
    const [loadImage, setLoadImage] = useState<string[]>([]);
    useEffect(() => {
        async function loadProperty(){
            if(!id){return};
            const getRef = doc(db, "property", id);
            getDoc(getRef)
            .then((snapshot => {
                if(!snapshot.data()){
                    navigate("/");
                }
                setProperty({
                    id: snapshot.id,
                    name: snapshot.data()?.name,
                    price: snapshot.data()?.price,
                    location: snapshot.data()?.location,
                    rooms: snapshot.data()?.rooms,
                    type: snapshot.data()?.type,
                    whatsapp: snapshot.data()?.whatsapp,
                    wc: snapshot.data()?.wc,
                    garage: snapshot.data()?.garage,
                    area: snapshot.data()?.area,
                    images: snapshot.data()?.images,
                    description: snapshot.data()?.description,
                    uid: snapshot.data()?.uid

                })
            }))
            .catch((error) => {
                console.log(error)
            })
        }
        loadProperty();
    }, [id])
    useEffect(() => {
        function handleResize(){
            if(window.innerWidth < 720){
            setSliderPreview(1);
            }else{
            setSliderPreview(1);
            }
        }
        handleResize();

        window.addEventListener("resize", handleResize);

        return() => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    function handleImageLoad(id: string){
        setLoadImage((prevImageLoaded) => [...prevImageLoaded, id])
    }
    return(
        <Container>
            <main>
                {property && (
                    <Swiper
                        slidesPerView={sliderPreview}
                        pagination={{clickable: true}}
                        navigation
                        className="custom-swiper"
                    >
                        {property?.images.map(image => (
                        <SwiperSlide key={image.name} className="relative">
                            <div 
                                className="w-full  relative h-100 rounded-lg bg-gray-400"
                                style={{display: loadImage.includes(property.id) ? "none" : "block"}}
                            >
                                <FiHome size={78} color="#fff" className="absolute top-36 left-145"/>
                            </div>
                            <img
                                src={image.url}
                                alt={`Foto do Imóvel  - ${property.name} `} 
                                className="w-full h-100 object-cover rounded-md"
                                onLoad={() => handleImageLoad(property.id)}
                                    style={{display: loadImage.includes(property.id) ? "block" : "none"}}
                            />
                        </SwiperSlide>
                        ))}
                    </Swiper>
                    )
                }
                {property && (
                    <main className="grid grid-cols-[65%_33.8%] gap-4">
                        
                        <div className="col">
                            <div className="bg-white rounded p-4 my-4 border border-zinc-300">
                                <h1 className="font-bold text-2xl mb-4">{property?.name} | {property?.location}</h1>
                                <p className="text-xl"><strong>{property?.type.toLocaleUpperCase()}</strong>: MZN {property?.price} </p>
                                <div className="gap-3 flex items-center mt-4">
                                    <div className="rooms flex items-center gap-2 relative group ">
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
                                
                            </div>
                            <div className="bg-white rounded p-4 my-4 border border-zinc-300">
                                <h3 className="font-bold text-xl mb-3">Descrição do imóvel</h3>
                                <p>{property?.description}</p>
                            </div>
                        </div>
                        <div className="col">
                            <div className="bg-white rounded p-4 flex flex-col items-center text-center my-4 border border-zinc-300">
                                <div className="flex justify-between items-center">
                                    <div className="border-2 rounded-full p-1 border-gray-900">
                                        <FiUser size={24} color="#000"/>
                                    </div>
                                </div>
                                
                                <div className="text-center my-3">
                                    <p className="font-medium text-xl">{user?.name}</p>
                                    <p className="font-medium text-sm text-gray-500">{user?.email}</p>
                                </div>
                                <a 
                                    href={`https://api.whatsapp.com/send?phone=${property.whatsapp}`} 
                                    target="_blank"
                                    className="bg-green-600 w-full vendor-contact border flex justify-center items-center text-white rounded outline px-2 mt-2 py-1 gap-1 cursor-pointer">
                                    <FaWhatsapp size={18}/> Contactar
                                </a>
                            </div>
                        </div>
                    </main>
                    
                )}
                
                
            </main>
            
        </Container>
    );
}