import React, { Component } from 'react';
import '../css/navbar.css';
import LoginScreen from '..//pages/loginScreen';

class Navbar extends Component {
    state = {
        currentUser: undefined,
    }

    componentWillMount() {
        fetch('http://localhost:3001/api/auth/check',{
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    this.setState({
                        currentUser: data.data,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    handleLogout = () => {
        // fetch to /auth/logout
        fetch('http://localhost:3001/api/auth/logout', {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    // clear authUser in state
                    this.setState({
                        currentUser: undefined,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });;
    };


    render() {
        
        return (
            
            <div style={{
            }}>
                <nav className="navbar navbar-expand-lg " style={{
                    backgroundColor: ' #000c16 ',
                    color: 'white',
                    display: 'flex',
            
                }}>
  <a className="navbar-brand" href="http://localhost:3000/">
    <img src="https://image.flaticon.com/icons/png/512/2138/2138348.png" width="50" height="50" className="d-inline-block align-top" alt=""/>
  </a>
  <div className="collapse navbar-collapse" id="navbarSupportedContent">
  <ul className="nav mr-auto ">
  <li className="nav-item">
    <a className="nav-link active" href="http://localhost:3000/">Khám phá địa điểm dành cho thú cưng </a>
  </li>
  <li className="nav-item">
    <a className="nav-link" href="http://localhost:3000/blog">Chia sẻ kinh nghiệm chăm sóc thú cưng </a>
  </li>
  
</ul>
<nav className='navbar-nav bd-navbar-nav flex-row pr-5 mr-5'>
{this.state.currentUser ? (
    <>
    <li className="nav-item mr-auto">
    <a className="nav-link" href="http://localhost:3000/blog/createBlog">Tạo bài viết</a>
  </li>
    <li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">{this.state.currentUser.name.firstName}</a>
    <div className="dropdown-menu">
      <a className="dropdown-item" href="http://localhost:3000/location/create">Tạo địa điểm</a>
      <a className="dropdown-item" href="http://localhost:3000/blog/manager">Quản lý bài viết</a>
      <a className="dropdown-item" href="http://localhost:3000/user/update">Thay đổi thông tin</a>
      <div className="dropdown-divider"></div>
      <a className="dropdown-item" onClick={this.handleLogout}>Đăng xuất</a>
    </div>
  </li>
  </>
) : (
    <li>
    <a href="/login" className="btn btn-outline-primary">Đăng nhập \ Đăng ký</a>

 </li>
)}
</nav>
   
  </div>
</nav>

            </div>    
            
        );
    }
}

export default Navbar;
