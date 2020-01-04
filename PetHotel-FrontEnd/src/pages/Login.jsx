import React from "react";
import loginImg from '..//..//src/dog-304206.svg';;

export class Login extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        email: '',
        password: '',
        message: '',
    };
    handleInputEmail = (event) => {
        this.setState({ 
            email: event.target.value,

        })
    };
    handleInputPass = (event) => {
        this.setState({
            password: event.target.value,

        });
    };
    handleLogin = (event) => {
        event.preventDefault();
        //fetch API login

        fetch('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (!data.success) {
                    this.setState({
                        message: data.message,
                        loading: false,
                    });
                } else {
                    if (data.role==1) {
                        window.location.href = '/admin';
                    } else {
                        window.location.href = '/';
                    }
                    
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {

        return (
            <div className="base-container">
                <div className="header">Đăng Nhập</div>
                <div className="content">
                    <div className="row">
                        <div className="col-4">
                            <div className="image">
                                <img src={loginImg} />
                            </div>
                        </div>
                        <div className="col-8 ">
                            <div className="form">
                                <div className="form-group">
                                    <label htmlFor="username">Email</label>
                                    <input type="text" name="username"  onChange={this.handleInputEmail} value={this.state.email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <input type="password" name="password"  onChange={this.handleInputPass} value={this.state.password} />
                                </div>
                            </div>
                            <p style={{
                    color: 'red',
                }}>
                    {this.state.message}
                </p>
                <div className="footer">
                    <button type="button" className="btn btn-secondary" onClick={this.handleLogin}>
                        Đăng nhập
                    </button>
                    
                </div>



                        </div>
                    </div>
                </div>
               


                
                <a href='http://localhost:3000/forgot'>Quên Mật Khẩu</a>
            </div>
        );
    }
}
