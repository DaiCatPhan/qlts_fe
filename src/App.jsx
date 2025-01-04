import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute/protectedPageAdmin";
import ProtectedRouteUserManager from "./components/ProtectedRoute/protectedPageUserManager";
import LayoutAdmin from "./Layouts/LayoutAdmin/LayoutAdmin";
import LayoutUserManager from "./Layouts/LayoutUserManager/LayoutUserManager";
import Footer from "./Layouts/OnlyLayout/Footer";
import AdminHomePage from "./pages/AdminHomePage";
import CreateData from "./pages/CreateData";
import DetailCustomer from "./pages/DetailCustomer";
import DetailData from "./pages/DetailData";
import DetailDataUsermanager from "./pages/DetailDataUsermanager";
import DivisionData from "./pages/DivisionData";
import EditData from "./pages/EditData";
import EditDataUsermanager from "./pages/EditDataUsermanager";
import HomePage from "./pages/HomePage";
import ListData from "./pages/ListData";
import Login from "./pages/Login";
import ManagerDataUsermanager from "./pages/um/ManagerDataUsermanager";
import ManagerDoanDuLieu from "./pages/um/ManagerDoanDuLieu";
import ManagerThematic from "./pages/ManagerThematic";
import ManagerThematicUsermanager from "./pages/ManagerThematicUsermanager";
import ManagerUser from "./pages/ManagerUser";
import ProfileAdmin from "./pages/ProfileAdmin";
import ProfileUser from "./pages/ProfileUser";
import SegmentData from "./pages/SegmentData";
import SegmentDetail from "./pages/SegmentDetail";
import StatisticalContact from "./pages/StatisticalContact";
import StatisticalDay from "./pages/StatisticalDay";
import StatisticalThematic from "./pages/StatisticalThematic";
import TimeLogin from "./pages/TimeLogin";
import UserManagerHomePage from "./pages/UserManagerHomePage";
import Story from "./pages/Story";
import { useEffect } from "react";
import ManagerFile from "./pages/ManagerFile";
import UM_ManagerFile from "./pages/UM_ManagerFile";
import UM_ManagerThematic from "./pages/UM_ManagerThematic";
import authService from "./service/AuthService";
import { API_AUTH } from "./constants";
import ProfileUserManager from "./pages/ProfileUserManager";
import Danhsachchiadoandulieu from "./pages/ql/quanlydulieu/Danhsachchiadoandulieu";
import Danhsachdoandulieu from "./pages/ql/quanlydulieu/Danhsachdoandulieu";
import Danhsachsinhvien from "./pages/ql/quanlynguoidung/Danhsachsinhvien";
import DanhSachSinhVienTheoDoanUM from "./pages/um/DanhSachSinhVienTheoDoanUM";
import DanhSachSinhVienUM from "./pages/um/DanhSachSinhVienUM";
import DuLieuChamCongUM from "./pages/um/DuLieuChamCongUM";

const LayoutOnly = () => {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
};

function App() {
  useEffect(() => {
    const handleBeforeUnload = async () => {
      navigator.sendBeacon(`${API_AUTH}/logout`);
      authService.logout();
    };

    const handleUnload = async () => {
      navigator.sendBeacon(`${API_AUTH}/logout`);
      authService.logout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("unload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("unload", handleBeforeUnload);
    };
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutOnly />,
      children: [
        {
          index: true,
          // element: <HomePage />,
          element: <Login />,
        },
        {
          path: "/thongtinkhachhang",
          element: <DetailCustomer />,
        },
      ],
    },
    {
      path: "/sinhvien",
      element: <HomePage />,
    },

    // ADMIN
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <LayoutAdmin />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          element: <AdminHomePage />,
        },
        {
          path: "user",
          element: <ManagerUser />,
        },
        {
          path: "story",
          element: <Story />,
        },
        {
          path: "user/:id",
          element: <ProfileUser />,
        },
        {
          path: "add",
          element: <CreateData />,
        },
        {
          path: "data",
          element: <ListData />,
        },
        {
          path: "data/:id",
          element: <DetailData />,
        },
        {
          path: "data/edit/:id",
          element: <EditData />,
        },
        {
          path: "segment",
          element: <SegmentData />,
        },
        {
          path: "division/:id",
          element: <SegmentDetail />,
        },
        {
          path: "division",
          element: <DivisionData />,
        },
        {
          path: "time",
          element: <TimeLogin />,
        },
        {
          path: "thematic",
          element: <ManagerThematic />,
        },
        {
          path: "profile",
          element: <ProfileAdmin />,
        },
        {
          path: "statistical/day",
          element: <StatisticalDay />,
        },
        {
          path: "statistical/contact",
          element: <StatisticalContact />,
        },
        {
          path: "statistical/thematic",
          element: <StatisticalThematic />,
        },
        {
          path: "file",
          element: <ManagerFile />,
        },
        {
          path: "quanlydulieu/danhsachdoandulieu",
          element: <Danhsachdoandulieu />,
        },
        {
          path: "quanlydulieu/danhsachchiadoandulieu",
          element: <Danhsachchiadoandulieu />,
        },
        {
          path: "quanlynguoidung/danhsachsinhvien",
          element: <Danhsachsinhvien />,
        },
      ],
    },

    // USER MANAGER
    {
      path: "/usermanager",
      element: (
        <ProtectedRouteUserManager>
          <LayoutUserManager />
        </ProtectedRouteUserManager>
      ),
      children: [
        {
          index: true,
          element: <UserManagerHomePage />,
        },
        {
          path: "doandulieu",
          element: <ManagerDoanDuLieu />,
        },
        {
          path: "data",
          element: <ManagerDataUsermanager />,
        },
        {
          path: "danhsachsinhvientheodoan",
          element: <DanhSachSinhVienTheoDoanUM />,
        },
        {
          path: "danhsachsinhvien",
          element: <DanhSachSinhVienUM />,
        },
        {
          path: "dulieuchamcong",
          element: <DuLieuChamCongUM />,
        },

        {
          path: "file",
          element: <UM_ManagerFile />,
        },
        {
          path: "thematic",
          element: <UM_ManagerThematic />,
        },
        {
          path: "profile",
          element: <ProfileUserManager />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
