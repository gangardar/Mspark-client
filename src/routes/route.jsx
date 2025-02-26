import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../layouts/Layout";
import NotFound from "../component/NotFound";
import RegisterGem from "../pages/RegisterGem";
import { AdminLayout } from "../layouts/AdminLayout";
import DashboardPage from "../pages/AdminPages/DashboardPage";
import GemPage from "../pages/AdminPages/GemPage";
import MerchantListPage from "../pages/AdminPages/MerchantListPage";

const route = createBrowserRouter([
    {
        path : '/',
        element : <Layout/>,
        errorElement : <NotFound/>,
        children: [
            {
            index : true,
            element : <Home/>
            },
            {
                path : 'RegisterGem',
                element: <RegisterGem/>
            }
        ]
    },
    {
        path : '/admin',
        element : <AdminLayout/>,
        errorElement : <NotFound/>,
        children : [
            {
                index : true,
                element: <DashboardPage/>
            },
            {
                path : 'gems/all',
                element : <GemPage/>
            },
            {
                path : 'merchant/all',
                element : <MerchantListPage/>
            }
        ]
    },
    {
        path : "*",
        element: <NotFound/>
    }
]);

export default route