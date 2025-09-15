import Header from '../header/index';
import { Outlet } from 'react-router-dom';

export default function Layout(){
    return(
        <>
            <Header/>
            <Outlet/>
        </>
    );
}