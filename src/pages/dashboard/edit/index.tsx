import { useParams } from "react-router-dom"

export default function Edit(){
    const {id} = useParams();
    return(
        <h1>Página de Edição do imóvel: {id}</h1>
    )
}