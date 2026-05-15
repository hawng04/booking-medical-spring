import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appointmentService } from "../../api/appointmentService"; 
import { DollarSign, ArrowLeft } from 'lucide-react'; // Thêm ArrowLeft

const MOCK_TIME_LIMIT = 300; 

const MockPaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { bookingPayload, redirectPath, paymentMethod, hospital, orderId } = location.state || {};
    
    const [processing, setProcessing] = useState(false);
    const [countdown, setCountdown] = useState(MOCK_TIME_LIMIT);
    const [orderCode] = useState(`MOCK${Date.now().toString().slice(-6)}`); 

    const isMomo = paymentMethod === 'momo';
    
    
    const price = bookingPayload?.finalPrice || 0; 
    const priceDisplay = price.toLocaleString('vi-VN') + 'đ';

    useEffect(() => {
        if (countdown <= 0) {
            alert('Giao dịch hết thời gian chờ. Đơn hàng bị hủy.');
            navigate(redirectPath); 
            return;
        }
        const timer = setInterval(() => {
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown, navigate, redirectPath]);

    const handleConfirmMockPayment = async () => {
        if (processing || countdown <= 0) return;
        setProcessing(true);

        try {
            const successCode = '0'; 
            const confirmationResponse = await appointmentService.confirmPaymentStatus({
                maLichHen: orderId, 
                successCode: successCode,
                paymentMethod: paymentMethod
            });
            
            const confirmedAppointment = confirmationResponse.data;
            
            const successData = {
                mainName: hospital?.name || 'Bệnh viện',
                stt: confirmedAppointment?.trangThai || 'Đã thanh toán', 
                code: confirmedAppointment?.maLichHen, 
                date: bookingPayload.selectedDate,
                time: bookingPayload.selectedTime,
            };
            
            navigate(redirectPath, { state: successData });
            
        } catch (error) {
            setProcessing(false);
            const errorMsg = error.response?.data?.message || error.message || "Lỗi giao dịch mô phỏng.";
            alert(`Thanh toán thất bại: ${errorMsg}`);
            navigate(`/dat-kham/benh-vien/${hospital.id}`); 
        }
    };
    if (!bookingPayload || !hospital) {
        return <div className="text-red-600 p-10">Lỗi: Thiếu dữ liệu đặt lịch cần thiết.</div>;
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl text-center">
                
                {/* Header và Logo Cổng Thanh toán */}
                <div className="flex items-center justify-center mb-4">
                    <span className={`text-4xl font-extrabold mr-2 ${isMomo ? 'text-pink-600' : 'text-green-700'}`}>
                        {isMomo ? 'Momo' : 'VNPay'}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-800">Cổng Giả lập</h1>
                </div>

                <p className="text-gray-600 mb-6">Thời gian chờ: 
                    <span className="font-mono text-red-600 font-semibold ml-1">
                        {Math.floor(countdown / 60).toString().padStart(2, '0')}:
                        {(countdown % 60).toString().padStart(2, '0')}
                    </span>
                </p>

                <div className="mb-6 p-4 border rounded-lg bg-gray-100 text-left">
                    <p className="font-semibold text-gray-800">Đơn hàng: {orderCode}</p>
                    <p className="text-sm text-gray-600">Bệnh viện: {hospital.name}</p>
                    <p className="text-sm text-gray-600">Hình thức: Khám Thường</p>
                </div>
                
                {/* Khu vực Mã QR Giả lập */}
                <div className="flex justify-center mb-6">
                    <div className="w-36 h-36 bg-gray-200 rounded-lg flex items-center justify-center">
                        <DollarSign size={50} className={isMomo ? 'text-pink-500' : 'text-green-500'}/>
                    </div>
                </div>

                <div className="text-xl font-bold text-gray-800 mb-4">
                    Tổng tiền: <span className={`font-extrabold ${isMomo ? 'text-pink-600' : 'text-green-700'}`}>{priceDisplay}</span>
                </div>

                <button
                    onClick={handleConfirmMockPayment}
                    disabled={processing || countdown <= 0}
                    className={`w-full py-3 rounded-lg font-bold text-white transition ${
                        (processing || countdown <= 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {processing ? 'Đang xác nhận...' : 'Xác nhận Thanh toán (Giả lập)'}
                </button>
                
                <button
                    onClick={() => navigate(`/dat-kham/benh-vien/${hospital.id}`)}
                    disabled={processing}
                    className="w-full py-2 mt-3 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center"
                >
                    <ArrowLeft size={16} className="mr-1"/> Quay lại trang đặt lịch
                </button>
            </div>
        </div>
    );
};

export default MockPaymentPage;