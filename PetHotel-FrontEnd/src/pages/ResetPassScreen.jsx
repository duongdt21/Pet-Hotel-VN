import React, { Component } from 'react';
import Navbar from '../components/Navbar';

class LoginScreen extends Component {
    
    state = {
        password: '',
        errorMessage: '',
        loading: false,
        resetPassword: '',
        token: ''
    };


    handleResetPassword = (event) => {
        this.setState({
            resetPassword: event.target.value,
        });
    }

    handlePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };
    handleSubmit = (event) => {
        const token = this.props.location.search.split('?token=')[1];
        event.preventDefault();
        this.setState({
            loading: true,
        })
        //validate    
        //fetch API
        fetch('http://localhost:3001/api/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                password: this.state.password,
                confirmPass: this.state.resetPassword,
            }),
            credentials: 'include', //auto add cookies 
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    this.setState({
                        errorMessage: 'Đổi mật khẩu thành công',
                        loading: false,
                        password: '',
                        resetPassword: '',
                    })
                } else {
                    this.setState({
                        errorMessage: data.message,
                        loading: false
                    })
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    errorMessage: error.message,
                    loading: false,
                });
            })
    };

    render() {
        console.log(this.props.location.search.split('?token=')[1]);
        return (
            <div>
                <Navbar/>
                <div style={{
                    minHeight: '500px'
                }}>
                    <div className="container mt-5">
                    <div className="shadow-lg p-5 mb-5 bg-white rounded" style={{
                        marginTop: '200px'
                    }}>
                        <p style={{color: 'red'}}>
                        {this.state.errorMessage}
                        </p>
                    <form className="register-form" onSubmit={this.handleSubmit}>

                        
<div className="form-group">
    <label for="exampleInputPassword1">Mật khẩu mới</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Mật khẩu" value={this.state.password} onChange={this.handlePassword} />
</div>

<div className="form-group">
    <label for="exampleInputPassword1">Xác nhận mật khẩu</label>
    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Nhập lại mật khẩu" value={this.state.resetPassword} onChange={this.handleResetPassword} />
</div>
{this.state.loading ? (
    <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
    </div>
) : (
        <button type="submit" className="btn btn-primary">Xác nhận</button>
    )}

</form>
                    </div>
                       
                    </div>
                </div>

            </div>
        );
    }
}

export default LoginScreen;
