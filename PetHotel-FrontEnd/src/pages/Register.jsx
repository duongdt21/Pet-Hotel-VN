import React from "react";
import loginImg from '..//..//src/dog-304206.svg';

export class Register extends React.Component {
    constructor(props) {
        super(props);
    }
    state = { 
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPass: '',
        phoneNumber: '',
        loading: false,
        errorMessage: '',
    };

    handleInputEmail = (event) => {
        this.setState({
            email: event.target.value,
        })
    };

    handleInputfirstName = (event) => {
        this.setState({
            firstName: event.target.value,
        })
    };
    handleInputlastName = (event) => {
        this.setState({
            lastName: event.target.value,
        })
    };

    handleInputPassword = (event) => {
        this.setState({
            password: event.target.value,
        })
    };
    handleInputconfirmPass = (event) => {
        this.setState({
            confirmPass: event.target.value,
        })
    };
    handleInputphoneNumber = (event) => {
        this.setState({
            phoneNumber: event.target.value,
        })
    };
    handleRegister = (event) => {
        this.setState({
            loading: true,
        })
        event.preventDefault();
        //fetch API login

        fetch('http://localhost:3001/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: {
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                },
                email: this.state.email,
                password: this.state.password,
                confirmPass: this.state.confirmPass,
                phoneNumber: this.state.phoneNumber,
            })
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (!data.success) {
                    this.setState({
                        errorMessage: data.message,
                        loading: false,
                    });
                } else {
                    this.setState({
                        loading: false,
                        errorMessage: 'Tao tai khoan thanh cong. Kiem tra email cua ban de xac nhan',
                        firstName: '',
                        lastName: '',
                        email: '',
                        password: '',
                        confirmPass: '',
                        phoneNumber: '',
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    };
    render() {
        console.log(this.state);
        return (
            <div className="base-container">
                <div className="content">
                    <div className="row">
                        <div className="col-4">
                            <div className="image">
                                <img src={loginImg} />
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="form">
                                <div className="form-group">
                                    <label htmlFor="username">Họ</label>
                                    <input type="text" name="FirstName"  onChange={this.handleInputfirstName} value={this.state.firstName} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="username">Tên</label>
                                    <input type="text" name="LastName"  onChange={this.handleInputlastName} value={this.state.lastName} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" placeholder="ex: abcd123@xyz.com" onChange={this.handleInputEmail} value={this.state.email} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="PhoneNumber">Số điện thoại</label>
                                    <input type="text" name="PhoneNumber"  onChange={this.handleInputphoneNumber} value={this.state.phoneNumber} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <input type="password" name="password"  onChange={this.handleInputPassword} value={this.state.password} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="Confirm Password">Xác nhận mật khẩu</label>
                                    <input type="password" name="Confirm Password" onChange={this.handleInputconfirmPass} value={this.state.confirmPass} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p style={{
                    color: 'red'
                }}>
                    {this.state.errorMessage}
                </p>
                {this.state.loading ? (
                    <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                ) : (
                        <div className="footer">
                            <button type="button" className="btn btn-secondary" onClick={this.handleRegister}>
                                Đăng ký
                            </button>
                        </div>
                    )}
            </div>
        );
    }
}
