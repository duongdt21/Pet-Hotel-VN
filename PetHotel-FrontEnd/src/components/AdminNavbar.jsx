import React, { Component } from 'react';

class AdminNavbar extends Component {

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
                window.location.href='/login';
            }
        })
        .catch((err) => {
            console.log(err);
        });;
};
    
    render() {

        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <a className="navbar-brand" href="http://localhost:3000/admin">Pet Hotel Admin</a>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarNavDropdown">
    <ul className="navbar-nav">
    <li className={'nav-item '+ this.props.Active}>
       <a className="nav-link" href="http://localhost:3000/admin">Request On Stack </a>
     </li>
     <li className={'nav-item '+ this.props.hrActive}>
       <a className="nav-link" href="http://localhost:3000/admin/hr">Humman Resource</a>
     </li>
     <li className={'nav-item '+ this.props.blActive}>
       <a className="nav-link" href="http://localhost:3000/admin/blog">Blog Checking</a>
     </li>
    </ul>
  </div>
  
    <li className="nav-item mr-auto">
    <a className="nav-link" href="http://localhost:3000/blog/createBlog">Tao bai viet</a>
  </li>
    <li className="nav-item dropdown">
    <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Admin </a>
    <div className="dropdown-menu">
      <a className="dropdown-item" href="http://localhost:3000/blog/manager">Quan li bai viet Blog</a>
      <a className="dropdown-item" href="http://localhost:3000/user/update">Thay doi thong tin</a>
      <div className="dropdown-divider"></div>
      <a className="dropdown-item" onClick={this.handleLogout}>Dang Xuat</a>
    </div>
  </li>
  
</nav>
            </div>
        );
    }
}

export default AdminNavbar;