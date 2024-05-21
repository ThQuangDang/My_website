import React from 'react';
import './Footer.css'


function Footer(props) {
    return (
        <section id="footer">
            <div className="footer">
                <div className="footer-top">
                    <div className="footer-top-name">
                        <h2>ShopdunkS</h2>
                    </div>
                    <div className="footer-top-about">
                        <h2>Thông tin</h2>
                        <ul>
                            <li>
                                <a>Tin tức</a>
                            </li>
                            <li>
                                <a>Giới thiệu</a>
                            </li>
                            <li>
                                <a>Check IMEI</a>
                            </li>
                            <li>
                                <a>Phương thức thanh toán</a>
                            </li>
                            <li>
                                <a>Thuê điểm bán lẻ</a>
                            </li>
                            <li>
                                <a>Bảo hành và sửa chữa</a>
                            </li>
                            <li>
                                <a>Tuyển dụng</a>
                            </li>
                            <li>
                                <a>Đánh giá chất lượng, khiếu nại</a>
                            </li>
                            <li>
                                <a><img src="https://theme.hstatic.net/1000075078/1000610097/14/gov.png?v=664"></img></a>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-top-sp">
                        <h2>Địa chỉ & Liên hệ</h2>
                        <p>Tài khoản của tôi</p>
                        <p>Đơn đặt hàng</p>
                        <p>Hệ thống cửa hàng</p>
                        <p>Tìm Store trên Google Map</p>
                        <p>Mua hàng: 1900.6626</p>
                        <p>Nhánh 1: khu vực Hà Nội và các tỉnh phía Bắc</p>
                        <p>Nhánh 2: khu vực Hồ Chí Minh và các tỉnh phía Nam</p>
                        <p>Nhánh 3: Khiếu nại và góp ý</p>
                    </div>
                    <div className="footer-top-delivery">
                        <h2>Chính sách</h2>
                        <ul>
                            <li>
                                <a>Thu cũ đổi mới</a>
                            </li>
                            <li>
                                <a>Giao hàng nhanht</a>
                            </li>
                            <li>
                                <a>Hủy giao dịch</a>
                            </li>
                            <li>
                                <a>Đổi trả</a>
                            </li>
                            <li>
                                <a>Bảo hành</a>
                            </li>
                            <li>
                                <a>Giải quyết khiếu nại</a>
                            </li>
                            <li>
                                <a>Bảo mật thông tin</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bot">
                    
                <p>&copy; 2016 Công ty Cổ Phần HESMAN Việt Nam GPDKKD: 0107465657 do Sở KH & ĐT TP. Hà Nội cấp ngày 08/06/2016.</p>
                </div>
            </div>
        </section>
    );
}

export default Footer;