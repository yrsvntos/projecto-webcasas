import Header from '../header/index';
import { Outlet } from 'react-router-dom';
import Footer from '../footer';

export default function Layout(){
    return(
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    );
}