const express = require('express');
const router = express.Router();
const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');
const Booking = require('../models/Booking');

// 1. API TẠO LINK THANH TOÁN VNPAY
router.post('/create_payment_url', async (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
    
    let tmnCode = process.env.VNP_TMN_CODE;
    let secretKey = process.env.VNP_HASH_SECRET;
    let vnpUrl = process.env.VNP_URL;
    let returnUrl = process.env.VNP_RETURN_URL;

    let bookingId = req.body.bookingId;
    let amount = req.body.amount;
    let bankCode = req.body.bankCode || ''; // Có thể truyền 'NCB' để test

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = bookingId; // Mã đơn hàng
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan don dat tour ' + bookingId;
    vnp_Params['vnp_OrderType'] = 'billpayment';
    vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu nhân 100
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp tham số
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký (Hash)
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
    
    res.status(200).json({ success: true, paymentUrl: vnpUrl });
});

// 2. API CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG KHI VNPAY TRẢ VỀ
router.post('/update-status', async (req, res) => {
    try {
        const { bookingId, vnp_ResponseCode } = req.body;
        if (vnp_ResponseCode === '00') {
            await Booking.findByIdAndUpdate(bookingId, { status: 'paid', paymentMethod: 'vnpay' });
            res.json({ success: true, message: 'Cập nhật thanh toán thành công' });
        } else {
            res.json({ success: false, message: 'Thanh toán thất bại hoặc đã hủy' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
});

// Hàm hỗ trợ sắp xếp theo chuẩn VNPay
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) str.push(encodeURIComponent(key));
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;