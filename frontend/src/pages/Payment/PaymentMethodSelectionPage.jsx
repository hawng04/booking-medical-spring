import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, QrCode, ArrowLeft, Check } from 'lucide-react';
import { PaymentService } from '../../api/paymentService';

const PaymentMethodSelectionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const { bookingPayload, hospital } = location.state || {}; 
    
    const [selectedMethod, setSelectedMethod] = useState(null);
    const [ setProcessing] = useState(false); 
    
    if (!bookingPayload || !hospital) {
        return <div className="text-red-600 p-10">Lỗi: Thiếu dữ liệu đơn hàng cần thiết.</div>;
    }

    const price = bookingPayload.finalPrice || 0;
    const priceDisplay = price.toLocaleString('vi-VN') + 'đ';


    const handleProceedToMockCheckout = async () => {
        if (!selectedMethod) return; 
        setProcessing(true);
        
        const requestPayload = {
            bookingDetails: bookingPayload,
            paymentMethod: selectedMethod.toUpperCase() 
        };
    
        try {
            console.log("Check var requestPayload",requestPayload);
            const response = await PaymentService.createCheckoutUrl(requestPayload);
            console.log("response",response);
            const payUrl = response?.payUrl;
            console.log("payUrl", payUrl);
           
            if (payUrl) {
                window.location.href = payUrl;
            } else {
                throw new Error("Backend không trả về URL thanh toán. Vui lòng kiểm tra log.");
            }

        } catch (error) {
            setProcessing(false);
            console.error("Lỗi đặt lịch trước thanh toán:", error);
            alert("Không thể tạo đơn hàng. Khung giờ đã đầy hoặc lỗi hệ thống.");
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-xl">
                
                <h1 className="text-xl font-bold text-gray-800 mb-6 border-b pb-3">Chọn Phương thức Thanh toán</h1>
                
                {/* Chi tiết đơn hàng tóm tắt */}
                <div className="text-left mb-6 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium">Bệnh viện: {hospital.name}</p>
                    <p className="text-lg font-extrabold text-blue-600 mt-1">Tổng tiền: {priceDisplay}</p>
                </div>

                {/* Danh sách Tùy chọn */}
                <div className="space-y-3">
                    
                    {/* Tùy chọn MoMo */}
                    <MethodOption 
                        id="momo" 
                        label="Thanh toán qua Ví MoMo"
                        icon={<QrCode size={24} className="text-pink-500" />}
                        selected={selectedMethod === 'momo'}
                        onSelect={setSelectedMethod}
                    />

                    {/* Tùy chọn VNPay */}
                    <MethodOption 
                        id="vnpay" 
                        label="Thanh toán qua VNPay"
                        icon={<CreditCard size={24} className="text-red-600" />}
                        selected={selectedMethod === 'vnpay'}
                        onSelect={setSelectedMethod}
                    />
                    
                    {/* ... (có thể thêm các tùy chọn khác) ... */}
                </div>

                {/* Nút Hành động */}
                <div className="mt-8 flex justify-between space-x-3">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center justify-center w-1/3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                         <ArrowLeft size={16} className="mr-1"/> Quay lại
                    </button>
                    <button 
                        onClick={handleProceedToMockCheckout}
                        disabled={!selectedMethod}
                        className={`w-2/3 py-3 rounded-lg font-bold text-white transition ${!selectedMethod ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        Tiếp tục thanh toán
                    </button>
                </div>

            </div>
        </div>
    );
};

// Component con cho từng tùy chọn thanh toán
const MethodOption = ({ id, label, icon, selected, onSelect }) => (
    <div 
        onClick={() => onSelect(id)}
        className={`flex items-center p-4 border rounded-lg cursor-pointer transition 
            ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300 bg-white'}`}
    >
        <div className="mr-3">{icon}</div>
        <span className="font-medium flex-grow text-left">{label}</span>
        {selected && <Check size={20} className="text-blue-500 ml-2"/>}
    </div>
);

export default PaymentMethodSelectionPage;