import { createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout";
import {Home} from "./pages/home"
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import { HouseDetail } from "./pages/house";
import Register from "./pages/register";
import Error from "./pages/error";
import Private from "./routes/Private";
import New from "./pages/dashboard/new";

const router = createBrowserRouter(
  [
    {
      element: <Layout/>,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/dashboard",
          element: 
          <Private>
            <Dashboard/>
          </Private>
            
        },
        {
          path: "/dashboard/new",
          element: 
          <Private>
            <New/>
          </Private>
            
        },
        {
          path: "/casas/:id",
          element: <HouseDetail/>
        },
      ]
    },
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/register",
      element: <Register/>
    },
    {
      path: "*",
      element: <Error/>
    }
  ]
)

export {router}
