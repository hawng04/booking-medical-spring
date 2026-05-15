import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Info } from 'lucide-react';
import { appointmentService } from "../../api/appointmentService";
import Header from '../../components/Home/Header';
import HomeFooter from '../../components/Home/HomeFooter';

const PaymentStatus = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [transactionStatus, setTransactionStatus] = useState(null); // 'success' hoặc 'failed'
    const [orderId, setOrderId] = useState(null); // Mã tham chiếu (vnp_TxnRef)
    
    const [appointmentDetails, setAppointmentDetails] = useState(null); // Chi tiết đơn hàng từ DB
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- HELPER: Lấy Tham số từ URL ---
    

    // --- LOGIC FETCH CHI TIẾT ĐƠN HÀNG ---
    useEffect(() => {
        const getQueryParams = () => {
            const params = new URLSearchParams(location.search);
            return {
                status: params.get('status'),
                orderId: params.get('orderId'),
                message: params.get('message') 
            };
        };
        const { status, orderId, message } = getQueryParams();
        
        setTransactionStatus(status);
        setOrderId(orderId);
        
        if (orderId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    // Gọi API Backend để lấy chi tiết lịch hẹn đã được cập nhật bởi IPN
                    const details = await appointmentService.getAppointmentDetails(orderId); 
                    setAppointmentDetails(details);
                } catch (err) {
                    setError("Không thể tải chi tiết đơn hàng.");
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        } else {
            setLoading(false);
            setError(message || "Thông tin giao dịch không hợp lệ.");
        }
    }, [location.search]);

    // --- RENDER TRẠNG THÁI ---
    if (loading) {
        return <div className="text-center p-20 text-blue-600">Đang xác minh giao dịch và tải chi tiết...</div>;
    }
    
    // Nếu không phải trạng thái thành công
    if (transactionStatus !== 'success' || error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96">
                <XCircle size={64} className="text-red-500 mb-4"/>
                <h1 className="text-2xl font-bold text-red-600">THANH TOÁN THẤT BẠI</h1>
                <p className="text-gray-600 mt-2">Mã giao dịch: {orderId || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-1">{error || 'Giao dịch không thành công hoặc bị hủy.'}</p>
                <button onClick={() => navigate('/')} className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">Về trang chủ</button>
            </div>
        );
    }
    
    // --- RENDER THÀNH CÔNG ---
    const app = appointmentDetails;
    
    return (
        <>
            <Header/>
            <div className="flex flex-col items-center p-10 bg-gray-50 min-h-screen">
                <CheckCircle size={64} className="text-green-500 mb-4"/>
                <h1 className="text-3xl font-extrabold text-green-700 mb-8">THANH TOÁN THÀNH CÔNG</h1>
                
                {app && (
                    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl text-left">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Phiếu Xác nhận Đặt lịch</h2>
                        
                        <div className="space-y-3">
                            <p className="flex justify-between">
                                <span className="text-gray-600">Mã lịch hẹn:</span>
                                <span className="font-bold text-lg">{app.maLichHen || '---'}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Ngày giờ khám:</span>
                                <span className="font-semibold">{app.lichGio?.lichTong?.tenNgay || '---'} | {app.lichGio?.khungGio || '---'}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Bệnh nhân:</span>
                                <span className="font-semibold">{app.user?.fullName || '---'}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Tổng tiền:</span>
                                <span className="font-bold text-blue-600">
                                    {app.finalPrice ? app.finalPrice.toLocaleString('vi-VN') + 'đ' : '0đ (BHYT/Miễn phí)'}
                                </span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Hình thức:</span>
                                <span className="font-medium">{app.examType === 'thuong' ? 'Khám Thường' : (app.examType === 'bhyt' ? 'Khám BHYT' : '---')}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Trạng thái:</span>
                                <span className="font-bold text-green-700">{app.trangThai || 'Đã thanh toán'}</span>
                            </p>
                        </div>
                        
                        <div className="mt-6 p-3 bg-yellow-100 rounded flex items-start text-sm text-gray-700">
                            <Info size={16} className="mr-2 mt-1 text-yellow-600 flex-shrink-0" />
                            <p>Vui lòng đến trước giờ hẹn 15 phút và mang theo Phiếu xác nhận này.</p>
                        </div>
                    </div>
                )}
                <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                    Về trang chủ
                </button>
            </div>
            <HomeFooter/>
        </>
    );
};

export default PaymentStatus;