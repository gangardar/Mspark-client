import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Layout from "../layouts/Layout";
import NotFound from "../component/NotFound";
import RegisterGem from "../pages/RegisterGem";
import { AdminLayout } from "../layouts/AdminLayout";
import DashboardPage from "../pages/AdminPages/DashboardPage";
import GemPage from "../pages/AdminPages/GemPage";
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
import { DetailMsparkPage } from "../pages/AdminPages/Mspark/DetailMsparkPage";
import FailedPayment from "../pages/PaymentPages/FailedPayment";
import PendingPayment from "../pages/PaymentPages/PendingPayment";
import SoldGemForMerchantPage from "../pages/GemPages/SoldGemForMerchantPage";
import VerifiedGemForMerchantPage from "../pages/GemPages/VerifiedGemForMerchantPage";
import AuctionsPageUser from "../pages/AuctionsPages/merchant/AuctionsPageUser";
import AllDeliveriesPage from "../pages/DeliveryPages/AllDeliveriesPage";
import CreateDeliveryPage from "../pages/DeliveryPages/CreateDeliveryPage";
import PendingDeliveryPage from "../pages/DeliveryPages/PendingDeliveryPage";
import TransitDeliveryPage from "../pages/DeliveryPages/TransitDeliveryPage";
import { AllPaymentsPage } from "../pages/AdminPages/Payments/AllPaymentsPage";
import AllUsersPage from "../pages/UserPages/AllUserPage";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../component/common/Unauthorized";

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
    element: (
      <ProtectedRoute roles={["admin"]}>
        <AdminLayout isAdmin={true} />
      </ProtectedRoute>
    ),
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
        path: "gems/assigned",
        element: <AssignedGemPage />,
      },
      {
        path: "gems/verify/:id",
        element: <VerificationPage />,
      },
      // Auction Routes
      {
        path: "auctions/active",
        element: <ActiveAuctionPage />,
      },
      // Admin Payment Routes

      {
        path: "payment/all",
        element: <AllPaymentsPage />,
      },
      {
        path: "payment/pending",
        element: <AllPaymentsPage status={"pending"} />,
      },
      {
        path: "payment/failed",
        element: <AllPaymentsPage status={"failed"} />,
      },
      // Admin Delivery Routes
      {
        path: "deliveries/all",
        element: <AllDeliveriesPage />,
      },
      {
        path: "deliveries/create",
        element: <CreateDeliveryPage />,
      },
      {
        path: "deliveries/inTransit",
        element: <TransitDeliveryPage />,
      },
      {
        path: "deliveries/pending",
        element: <PendingDeliveryPage />,
      },
      // User Routes
      {
        path: "users/all",
        element: <AllUsersPage />,
      },
      {
        path: "users/merchants",
        element: <AllUsersPage role={"merchant"} />,
      },
      {
        path: "users/bidders",
        element: <AllUsersPage role={"bidder"} />,
      },
      {
        path: "users/admin",
        element: <AllUsersPage role={"admin"} />,
      },
      {
        path: "mspark",
        children: [
          {
            index: true,
            element: <DetailMsparkPage />,
          },
          {
            path: "detail",
            element: <DetailMsparkPage />,
          },
        ],
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
      // User Payment Routes
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
      // User Delivery Routes
      {
        path: "deliveries/all",
        element: <AllDeliveriesPage />,
      },
      {
        path: "deliveries/create",
        element: <CreateDeliveryPage />,
      },
      {
        path: "deliveries/inTransit",
        element: <TransitDeliveryPage />,
      },
      {
        path: "deliveries/pending",
        element: <PendingDeliveryPage />,
      },
      {
        path: "account-setting",
        element: <NewWalletPage />,
      },
      {
        path: "address",
        element: <AddAddressPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized/>
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default route;
