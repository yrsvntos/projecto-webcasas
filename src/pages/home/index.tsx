import { useState, useEffect } from "react";
import { Container } from "../../components/container";
import { HiLocationMarker } from "react-icons/hi";
import { BiSolidCarGarage, BiBed, BiBath } from "react-icons/bi";
import { MdSquareFoot } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { getDocs, collection, query, orderBy, where } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { Link } from "react-router-dom";

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

export function Home(){
    const [properties, setProperties] = useState<PropertyProps[]>([]);
    const [loadImage, setLoadImage] = useState<string[]>([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        async function loadProperty(){
            const propertyRef = collection(db, "property");
            const queryRef = query(propertyRef, orderBy("created", "desc"));

            getDocs(queryRef)
            .then((snapshot) => {
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
    }, [])

    function handleImageLoad(id: string){
        setLoadImage((prevImageLoaded) => [...prevImageLoaded, id])
    }
    function loadProperty(){
        const propertyRef = collection(db, "property");
        const queryRef = query(propertyRef, orderBy("created", "desc"));

        getDocs(queryRef)
        .then((snapshot) => {
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
    async function handleSearchHouse(){

        if(input === ''){
          loadProperty();
          return;
        }
        setProperties([]);
        setLoadImage([]);
    
        const q = query(collection(db, "property"),
        where("name", ">=", input.toUpperCase()),
        where("name", "<=", input.toUpperCase() + "\uf8ff")
        );
    
        const querySnapshot = await getDocs(q);
    
        let listProperty = [] as PropertyProps[];
    
        querySnapshot.forEach((doc) => {
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
    }
    return(
        <Container>
            <div className="min-h-screen">
                <section 
                    className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2"
                >
                    <input 
                        className="w-full border-2 rounded-lg h-9 px-3 outline-none"
                        placeholder="Pesquisar por endereço..." 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button

                        onClick={handleSearchHouse}
                        className="cursor-pointer bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                    >
                        Buscar
                    </button>
                </section>
                <h1 className="font-bold text-center mt-6 text-2xl mb-4">
                    Aluguel e Venda de Casas
                </h1>

                <main
                    className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-4"
                >
                    {properties.map(property => (
                        <Link to={`/casas/${property.id}`}>
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
                                    <div className="bg-red-500 text-white text-sm font-bold rounded-md py-1 px-3 type-property absolute top-3 right-3">
                                        <small>{property.type.toLocaleUpperCase()}</small>
                                    </div>
                                </div>
                                <div className="house-info bg-white rounded-md rounded-t-none p-4">
                                    <h3 className="font-bold text-xl">{property.name}</h3>
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
                        </Link>
                    ))}
                    
                </main>
            </div>
            
        </Container>
    );
}