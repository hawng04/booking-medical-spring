import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";

// --- Import các trang ---
import HomePage from "../pages/Home/HomePage";
import BookingPage from "../pages/Booking/BookingPage";
import BookingSearch from "../pages/Booking/BookingSearch";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import DoctorProfile from "../pages/Booking/DoctorProfile";
import HospitalProfile from "../pages/Booking/HospitalProfile";
import ClinicProfile from "../pages/Booking/ClinicProfile";
import OnlineConsultation from "../pages/Consultation/OnlineConsultationPage";
import MedicalNews from "../pages/MedicalNews/MedicalNewsPage";

import DoctorWorkspaceIntro from "../pages/DoctorWorkspace/DoctorWorkspaceIntro";
import DoctorWorkspacePage from "../pages/Doctor/DoctorWorkspacePage";
import HospitalWorkspacePage from "../pages/Hospital/HospitalWorkspacePage";
import ClinicWorkspacePage from "../pages/Clinic/ClinicWorkspacePage";


import CompleteBookingDoctor from "../pages/Booking/CompleteBookingDoctor";
import BookingSuccessPage from "../pages/Booking/BookingSuccessPage";
import CompleteBookingClinic from "../pages/Booking/CompleteBookingClinic";
import CompleteBookingHospital from "../pages/Booking/CompleteBookingHospital";

import MockPaymentPage from "../pages/Payment/MockPaymentPage";
import PaymentMethodSelectionPage from "../pages/Payment/PaymentMethodSelectionPage";
import CompletePayment from "../pages/Payment/CompletePayment";

// === IMPORT CÁC TRANG DASHBOARD  ===
import UserDashboardLayout from "../pages/UserDashboard/UserDashboardLayout";
import AppointmentsPage from "../pages/UserDashboard/AppointmentsPage";
import PaymentHistoryPage from "../pages/UserDashboard/PaymentHistoryPage";
import ProfilePage from "../pages/UserDashboard/ProfilePage";
import AccountPage from "../pages/UserDashboard/AccountPage";

// 1. IMPORT ADMIN 
import AdminRoute from './AdminRoute';
import AdminLayout from '../pages/Admin/AdminLayout'; 
import UserManagementPage from '../pages/Admin/UserManagementPage';
import SpecialtyManagementPage from '../pages/Admin/SpecialtyManagementPage';
import DoctorManagementPage from '../pages/Admin/DoctorManagementPage';
import HospitalManagementPage from '../pages/Admin/HospitalManagementPage';
import ClinicManagementPage from '../pages/Admin/ClinicManagementPage';
import AppointmentManagementPage from '../pages/Admin/AppointmentManagementPage';



const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  // replace: thay thế trang hiện tại trong lịch sử (user không thể back lại)
  return token ? children : <Navigate to="/login" replace />; 
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- CÁC ROUTE CÔNG KHAI (Ai cũng xem được) --- */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />


      {/* Menu Booking  */}
      <Route
        path="/dat-kham/bac-si"
        element={
          <MainLayout>
            <BookingPage selectedTab={1} />
          </MainLayout>
        }
      />
      <Route path="/dat-kham/bac-si/search" element={<BookingSearch />} />
      <Route path="/dat-kham/bac-si/:id" element={<DoctorProfile />} />
      <Route path="/dat-kham/bac-si/:id/hoan-tat-dat-kham" element={<CompleteBookingDoctor />} />
      <Route path="/dat-kham/phieu-kham" element={<BookingSuccessPage />} />

      {/* Đặt khám Bệnh viện */}

      <Route
        path="/dat-kham/benh-vien"
        element={
          <MainLayout>
            <BookingPage selectedTab={2} />
          </MainLayout>
        }
      />
      <Route path="/dat-kham/benh-vien/:id" element={<HospitalProfile />} />
      <Route path="/payment/select-method" element={<PaymentMethodSelectionPage/>} />
      <Route path="/payment/mock-checkout" element={<MockPaymentPage/>} />
      <Route path="/payment-status" element={<CompletePayment />} />
      {/* <Route path="/payment-status" element={<CompletePayment />} /> */}

      
      <Route path="/dat-kham/benh-vien/:id/hoan-tat-dat-kham" element={<CompleteBookingHospital />} />
      <Route
        path="/dat-kham/phong-kham"
        element={
          <MainLayout>
            <BookingPage selectedTab={3} />
          </MainLayout>
        }
      />
      <Route path="/dat-kham/phong-kham/:id" element={<ClinicProfile />} />
      <Route path="/dat-kham/phong-kham/:id/hoan-tat-dat-kham" element={<CompleteBookingClinic />} />
      <Route
        path="/dat-kham/tiem-chung"
        element={
          <MainLayout>
            <BookingPage selectedTab={4} />
          </MainLayout>
        }
      />
      <Route
        path="/dat-kham/xet-nghiem"
        element={
          <MainLayout>
            <BookingPage selectedTab={5} />
          </MainLayout>
        }
      />
      {/* End Menu Booking */}

      {/* OnlineConsultation  */}
      <Route
        path="/tu-van-truc-tuyen"
        element={
          <MainLayout>
            <OnlineConsultation />
          </MainLayout>
        }
      />

      {/* MedicalNews  */}
      <Route
        path="/tin-y-te"
        element={
          <MainLayout>
            <MedicalNews />
          </MainLayout>
        }
      />

      {/* DocterWorkspace */}

      <Route path="/doctor-workspace-intro" element={<DoctorWorkspaceIntro />} />
      <Route path="/doctor-workspace-page" element={<DoctorWorkspacePage />} />
      <Route path="/hospital-workspace-page" element={<HospitalWorkspacePage />} />
      <Route path="/clinic-workspace-page" element={<ClinicWorkspacePage />} />


      {/* Auth  */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      {/* 3. THÊM KHỐI ROUTE CÁ NHÂN (YÊU CẦU ĐĂNG NHẬP) */}
      {/* Tất cả các route con bên trong sẽ:
        1. Được bảo vệ bởi <PrivateRoute>
        2. Dùng chung layout <UserDashboardLayout> 
      */}
      <Route
        path="/user"
        element={
          <PrivateRoute>
            <UserDashboardLayout />
          </PrivateRoute>
        }
      >
        {/* Khi user vào /user, tự động chuyển đến /user/appointments */}
        <Route index element={<Navigate to="appointments" replace />} />
        
        {/* Các trang con trong dashboard */}
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="payment-history" element={<PaymentHistoryPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="account" element={<AccountPage />} />
      </Route>

      {/* 2. ADMIN */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        {/* Trang mặc định của admin (ví dụ: /admin) */}
        <Route index element={<UserManagementPage />} /> 
        <Route path="users" element={<UserManagementPage />} />
        <Route path="specialties" element={<SpecialtyManagementPage />} />
        <Route path="doctors" element={<DoctorManagementPage />} />
        <Route path="hospitals" element={<HospitalManagementPage />} />
        <Route path="clinics" element={<ClinicManagementPage />} />
        <Route path="appointments" element={<AppointmentManagementPage />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;