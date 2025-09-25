import { useState } from "react";
import { Container } from "../../components/container";
import { HiLocationMarker } from "react-icons/hi";
import { BiSolidCarGarage, BiBed, BiBath } from "react-icons/bi";
import { MdSquareFoot } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export function Home(){
    const [input, setInput] = useState("");

    function handleSearchCar(){
        alert("Teste");
        return;
    }
    return(
        <Container>
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

                    onClick={handleSearchCar}
                    className="cursor-pointer bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                >
                    Buscar
                </button>
            </section>
            <h1 className="font-bold text-center mt-6 text-2xl mb-4">
                Aluguel e Venda de Casas
            </h1>

            <main
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                <div className="rounded border bg-white outline-none border-zinc-100">
                    <div className="house-img">
                        <img 
                            src="https://img.jamesedition.com/listing_images/2025/07/30/05/58/39/35306823-59df-4a6e-98a8-b25d652b2621/je/1100xxs.jpg" 
                            alt="" 
                            className="object-cover rounded-bl-none rounded-br-none rounded-md"
                        />
                    </div>
                    <div className="house-info p-4">
                        <p className="font-medium text-xl">500.000 €</p>
                        <small className="flex items-center font-medium text-zinc-500 mt-2 gap-1">
                            <HiLocationMarker size={16}/> Vila Nova de Gaia, Portugal
                        </small>
                        <div className="house-details text-sm mt-4 p-2 bg-zinc-200 gap-3 flex items-center rounded-md">
                            <div className="rooms flex items-center gap-1">
                                <BiBed size={23} className="text-zinc-500"/> 5
                            </div>
                            <div className="rooms flex items-center gap-1">
                                <BiBath size={23} className="text-zinc-500"/> 3
                            </div>
                            <div className="rooms flex items-center gap-1">
                                <BiSolidCarGarage size={23} className="text-zinc-500"/> 1
                            </div>
                            <div className="rooms flex items-center gap-1">
                                <MdSquareFoot size={23} className="text-zinc-500"/> 110m<sup>2</sup>
                            </div>
                        </div>
                        <div className="house-vendor flex items-center justify-between mt-4 text-sm">
                            <div className="vendor-name flex items-center gap-1">
                                <FaRegUserCircle size={20} className="text-zinc-500"/> Yanik dos Santos
                            </div>
                            <div className="bg-green-600 vendor-contact border flex items-center text-white rounded outline px-2 py-1 gap-1 cursor-pointer">
                                <FaWhatsapp size={18}/> Contactar
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </Container>
    );
}