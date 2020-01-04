import React, { Component } from 'react';
import '..//css/Footer.css';
class Footer extends Component {
    render() {
        return (
            <div>

		<footer className="pt-5 pb-4 mt-5" id="contact">
			<div className="container">
				<div className="row">
					<div className="col-lg-3 col-md-6 col-sm-6 mt-2 mb-4">
						<h5 className="mb-4 font-weight-bold">THÔNG TIN</h5>
						<p className="mb-4">Công ty cổ phần dich vụ thương mại Pet Hotel</p>
						<ul className="f-address">
							<li>
								<div className="row">
									<div className="col-1"><i className="fas fa-map-marker"></i></div>
									<div className="col-10">
										<h6 className="font-weight-bold mb-0">Địa chỉ:</h6>
										<p>Tầng 6, 13 Thành Công, Hà Nội</p>
									</div>
								</div>
							</li>
							<li>
								<div className="row">
									<div className="col-1"><i className="far fa-envelope"></i></div>
									<div className="col-10">
										<h6 className="font-weight-bold mb-0">Liên hệ với chúng tôi</h6>
										<p><a href="#">tungduongdinh9921@gmail.com</a></p>
									</div>
								</div>
							</li>
							<li>
								<div className="row">
									<div className="col-1"><i className="fas fa-phone-volume"></i></div>
									<div className="col-10">
										<h6 className="font-weight-bold mb-0">Số điện thoại:</h6>
										<p><a href="#">+84 (0) 765.870.407</a></p>
									</div>
								</div>
							</li>
						</ul>
					</div>
					<div className="col-lg-3 col-md-6 col-sm-6 mt-2 mb-4">
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6 mt-2 mb-4">
          </div>
					<div className="col-lg-3 col-md-6 col-sm-6 mt-2 mb-4">
						<h5 className="mb-4 font-weight-bold">Facebook</h5>
						
						<ul className="social-pet mt-4">
							<li><a href="https://www.facebook.com/tduong.dinh21" title="facebook"><i className="fab fa-facebook-f"></i></a></li>
							<li><a href="https://www.facebook.com/loi.nguyentien.22" title="facebook"><i className="fab fa-facebook-f"></i></a></li>
							<li><a href="https://www.facebook.com/profile.php?id=100009918433290" title="facebook"><i className="fab fa-facebook-f"></i></a></li>
							<li><a href="https://www.facebook.com/hideonbush99" title="facebook"><i className="fab fa-facebook-f"></i></a></li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
		<section className="copyright">
			<div className="container">
				<div className="row">
					<div className="col-md-12 ">
						<div className="text-center text-white">
							&copy; 2020 PET HOTEL
						</div>
					</div>
				</div>
			</div>
		</section>
            </div>
        );
    }
}

export default Footer;
