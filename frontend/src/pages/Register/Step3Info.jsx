

import React, { useState, useEffect } from "react"; 
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/auth';
import axios from 'axios';

// === PHẦN DÀNH CHO CÁC COMPONENT CON (để code chính gọn gàng) ===

// Component InputField (ô nhập liệu)
const InputField = ({ label, name, value, onChange, type = "text", placeholder, required, readOnly }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder || `Nhập ${label.toLowerCase()}`}
      required={required}
      readOnly={readOnly}
      className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${readOnly ? 'bg-gray-100' : 'border-gray-300'}`}
    />
  </div>
);

// Component SelectField (ô chọn dropdown)
const SelectField = ({ label, name, value, onChange, required, children }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      {children}
    </select>
  </div>
);

// ================================================================
// === COMPONENT CHÍNH: Step3Info ===
// ================================================================
const Step3Info = ({ fullName, phone, password }) => {
  // Nhận props từ RegisterPage (như đã setup ở bước trước)

  const navigate = useNavigate();
  const API_BASE_URL = "https://provinces.open-api.vn/api";
  
  // State và API cho Tỉnh/Huyện/Xã
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

    // State cho Dân tộc
    const [ethnicities, setEthnicities] = useState([]);
  
  const [formData, setFormData] = useState({
    // Cột 1
    fullName: fullName || "", // Lấy từ prop
    phone: phone || "",     // Lấy từ prop
    dob: "",
    idCard: "",
    gender: "Nam", // Giá trị mặc định
    email: "",
    ethnicity: "Kinh", // Dân tộc
    
    // Cột 2
    healthInsurance: "",
    province: "", // Tỉnh/Thành phố
    district: "", // Quận/Huyện
    ward: "",     // Phường/Xã
    address: "",
    referralCode: "",
    occupation: "", // Nghề nghiệp
  });

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/p/`);
        setProvinces(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (!formData.province) {
      setDistricts([]);
      setWards([]);
      return;
    }
    const selectedProvince = provinces.find(p => p.name === formData.province);
    if (selectedProvince) {
      axios.get(`${API_BASE_URL}/p/${selectedProvince.code}?depth=2`)
        .then(res => setDistricts(res.data.districts))
        .catch(err => console.error(err));
    }
  }, [formData.province, provinces]);

  useEffect(() => {
    if (!formData.district) {
      setWards([]);
      return;
    }
    const selectedDistrict = districts.find(d => d.name === formData.district);
    if (selectedDistrict) {
      axios.get(`${API_BASE_URL}/d/${selectedDistrict.code}?depth=2`)
        .then(res => setWards(res.data.wards))
        .catch(err => console.error(err));
    }
  }, [formData.district, districts]);

  // Tải danh sách Dân tộc
    useEffect(() => {
    setEthnicities([
      "Kinh",
      "Tày",
      "Thái",
      "Hoa",
      "Khmer",
      "Mường",
      "Nùng",
      "H'Mông",
      "Dao",
      "Gia Rai",
      "Ngái",
      "Ê Đê",
      "Ba Na",
      "Sán Dìu",
      "Chăm",
      "Sán Chay",
      "Cơ Ho",
      "Xơ Đăng",
      "Bru-Vân Kiều",
      "Thổ",
      "Giáy",
      "Tà Ôi",
      "Mạ",
      "Khác"
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newState = { ...prev, [name]: value };
      if (name === "province") {
        newState.district = "";
        newState.ward = "";
      }
      if (name === "district") newState.ward = "";
      return newState;
    });
  };


  const handleRadioChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      gender: e.target.value,
    }));
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    if (!formData.fullName || !formData.dob) {
      return alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
    }

    // Đảm bảo tên key khớp với User.java (ví dụ: phoneNumber)
    const registrationData = {
      fullName: fullName,
      phoneNumber: phone, 
      password: password,
      dob: formData.dob,
      idCard: formData.idCard,
      gender: formData.gender,
      email: formData.email,
      ethnicity: formData.ethnicity,
      healthInsurance: formData.healthInsurance,
      province: formData.province,
      district: formData.district,
      ward: formData.ward,
      address: formData.address,
      referralCode: formData.referralCode,
      occupation: formData.occupation
      // role sẽ được set mặc định ở backend
    };

    console.log("Dữ liệu chuẩn bị gửi đi:", registrationData);

    try {

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate('/login'); // Chuyển đến trang đăng nhập

    } catch (err) {
      console.error('Lỗi khi gọi API đăng ký:', err);
      
      // 5. SỬA LẠI LOGIC BẮT LỖI
      if (err.response && err.response.status === 400) {
        // Lỗi 400 (Bad Request) - Backend trả về message
        // (err.response.data là "Email đã tồn tại" hoặc "SĐT đã tồn tại")
        alert(`Đăng ký thất bại: ${err.response.data}`); 
      } else if (err.code === 'ERR_NETWORK') {
        alert('Đăng ký thất bại: Không thể kết nối tới máy chủ.');
      } else {
        alert('Đăng ký thất bại: Lỗi không xác định.');
      }
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-blue-600">
          Tạo hồ sơ
        </h2>
      </div>

      {/* 2. Tiêu đề */}
      <h2 className="text-xl font-semibold mb-2">Tạo hồ sơ y tế</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Tạo hồ sơ y tế đầy đủ thông tin sẽ hỗ trợ việc khám chữa bệnh của bạn tốt hơn.
      </p>

      {/* 3. Form nội dung */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          
          {/* === CỘT 1: Thông tin hồ sơ === */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin hồ sơ</h3>
            
            <InputField label="Họ và tên" name="fullName" value={formData.fullName} onChange={handleChange} required />
            <InputField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} readOnly />
            <InputField label="Ngày sinh" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
            <InputField label="Số CMND/CCCD" name="idCard" value={formData.idCard} onChange={handleChange} />

            {/* Giới tính */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
              <div className="flex items-center gap-x-6">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="gender" value="Nam" checked={formData.gender === "Nam"} onChange={handleRadioChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Nam</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="gender" value="Nữ" checked={formData.gender === "Nữ"} onChange={handleRadioChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Nữ</span>
                </label>
              </div>
            </div>

            <InputField label="Địa chỉ email của bạn" name="email" type="email" value={formData.email} onChange={handleChange} />
            
            <SelectField 
              label="Dân tộc"
              name="ethnicity"
              value={formData.ethnicity}
              onChange={handleChange}
            >
              <option value="">Chọn dân tộc</option>
              {ethnicities.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </SelectField>
          </div>

          {/* === CỘT 2: Thông tin bổ sung === */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Thông tin bổ sung</h3>

            <InputField label="Mã thẻ Bảo hiểm y tế" name="healthInsurance" value={formData.healthInsurance} onChange={handleChange} />
            
            <SelectField label="Tỉnh/Thành phố" name="province" value={formData.province} onChange={handleChange} required>
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
            </SelectField>
            <SelectField label="Quận/Huyện" name="district" value={formData.district} onChange={handleChange} required disabled={!formData.province}>
              <option value="">Chọn quận/huyện</option>
              {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
            </SelectField>
            <SelectField label="Phường/Xã" name="ward" value={formData.ward} onChange={handleChange} required disabled={!formData.district}>
              <option value="">Chọn phường/xã</option>
              {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
            </SelectField>

            <InputField label="Địa chỉ cụ thể" name="address" value={formData.address} onChange={handleChange} placeholder="Số nhà, tên đường"/>
            <InputField label="Mã giới thiệu" name="referralCode" value={formData.referralCode} onChange={handleChange} />
            
            <SelectField label="Nghề nghiệp" name="occupation" value={formData.occupation} onChange={handleChange}>
              <option value="">Chọn nghề nghiệp</option>
              <option value="Văn phòng">Văn phòng</option>
              <option value="Học sinh/Sinh viên">Học sinh/Sinh viên</option>
              <option value="Kinh doanh">Kinh doanh</option>
              <option value="Khác">Khác</option>
              {/* Thêm các nghề nghiệp khác */}
            </SelectField>
          </div>
        </div>

        {/* 4. Nút Hoàn tất */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Hoàn tất
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step3Info;

