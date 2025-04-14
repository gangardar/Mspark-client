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
import { NewWalletPage } from "../pages/Wallet/NewWalletPage";
import { AddAddressPage } from "../pages/UserPages/AddAddressPage";
import { ProfilePage } from "../pages/UserPages/ProfilePage";
import { AllPayment } from "../pages/PaymentPages/AllPayment";
import FailedPayment from "../pages/PaymentPages/FailedPayment";
import PendingPayment from "../pages/PaymentPages/PendingPayment";
import SoldGemForMerchantPage from "../pages/GemPages/SoldGemForMerchantPage";
import VerifiedGemForMerchantPage from "../pages/GemPages/VerifiedGemForMerchantPage";
import AuctionsPageUser from "../pages/AuctionsPages/merchant/AuctionsPageUser";

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
    element: <AdminLayout isAdmin={true}/>,
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
    element: <AdminLayout />,
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
        path: "gem/verified",
        element: <VerifiedGemForMerchantPage />,
      },
      {
        path: "gem/sold",
        element: <SoldGemForMerchantPage />,
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
        path: "auction/all",
        element: <AuctionsPageUser />,
      },
      {
        path: "auction/active",
        element: <AuctionsPageUser auctionStatus={"active"} />,
      },
      {
        path: "auction/completed",
        element: <AuctionsPageUser auctionStatus={"completed"} />,
      },
      {
        path: "payment/all",
        element: <AllPayment />,
      },
      {
        path: "payment/pending",
        element: <PendingPayment />,
      },
      {
        path: "payment/failed",
        element: <FailedPayment />,
      },
      {
        path : "account-setting",
        element : <NewWalletPage/>      
      },
      {
        path : "address",
        element : <AddAddressPage/>      
      },
      {
        path : "profile",
        element : <ProfilePage/>      
      }
      
      
    ],
  },  
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default route;
