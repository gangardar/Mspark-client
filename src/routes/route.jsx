import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../layouts/Layout";
import NotFound from "../component/NotFound";
import RegisterGem from "../pages/RegisterGem";
import { AdminLayout } from "../layouts/AdminLayout";
import DashboardPage from "../pages/AdminPages/DashboardPage";
import GemPage from "../pages/AdminPages/GemPage";
import MerchantListPage from "../pages/AdminPages/MerchantListPage";
import UserDashboardPage from "../pages/UserPages/UserDashboardPage";
import Register from "../component/Gem/Register";
import AssignedGemPage from "../pages/UserPages/AssignedGemPage";
import VerificationPage from "../pages/AdminPages/VerificationPage";
import ViewAllAuctions from "../pages/AuctionsPages/ViewAllAuctions";
import AuctionDetailPage from "../pages/AuctionsPages/AuctionDetailPage";
import { BidHistoryPage } from "../pages/AuctionsPages/BidHistoryPage";
import NewAuctionPage from "../pages/AuctionsPages/NewAuctionPage";
import ActiveAuctionPage from "../pages/AdminPages/Auctions/ActiveAuctionPage";

const route = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "RegisterGem",
        element: <RegisterGem />,
      },
      {
        path: "auctions",
        element: <ViewAllAuctions />,
      },
      {
        path: "auction-detail/:id",
        element: <AuctionDetailPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout isAdmin={true} />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "gems/all",
        element: <GemPage />,
      },
      {
        path : "gems/assigned",
        element :<AssignedGemPage/>
      },
      {
        path : "gems/verify/:id",
        element :<VerificationPage/>
      },
      {
        path: "merchant/all",
        element: <MerchantListPage />,
      },
      {
        path: "auctions/active",
        element: <ActiveAuctionPage />,
      },
    ],
  },
  {
    path: "/dashboard/:user/",
    element: <AdminLayout isAdmin={false} />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <UserDashboardPage />,
      },
      {
        path: "gem/all",
        element: <GemPage />,
      },
      {
        path: "gem/register",
        element: <Register />,
      },
      {
        path: "auction/bid",
        element: <BidHistoryPage />,
      },
      {
        path: "auction/new-auction",
        element: <NewAuctionPage />,
      },
      {
        path: "auction/active",
        element: <ActiveAuctionPage />,
      },
      
      
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default route;
