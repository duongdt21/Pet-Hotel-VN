import React, { Component } from 'react';
import Navbar from '../components/Navbar';
class ForgotPass extends Component {
    state = {
        email: '',
        message: '',
    }
    handleChangeMail = (event) => {
        this.setState({
            email: event.target.value,
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        fetch(`http://localhost:3001/api/auth/forgotPassword?email=${this.state.email}`,{
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            if (data.success) {
                this.setState({
                    message: 'Hãy kiểm tra lại hòm thư email của bạn'
                })
            } else {
                this.setState({
                    message: data.message,
                })
            }
        })
        .catch((err)=> {
            console.log(err);
        })
    }
    render() {
        return (
            <div>
                <Navbar/>
                <div className='container' style={{
                    minHeight: '400px',
                    marginTop: '150px'
                }}>
                    <div className="shadow-lg p-3 mb-5 bg-white rounded">
                        <p style={{
                            color: 'red'
                        }}>{this.state.message}</p>
                    <form onSubmit={this.handleSubmit}>
  <div className="form-group">
    <label for="exampleInputEmail1">Địa chỉ email của bạn</label>
    <input type="email" className="form-control" value={this.state.email} onChange={this.handleChangeMail}/>
  </div>
  <button type="submit" className="btn btn-primary">Gửi</button>
                    </form>    
                    

                </div>
            </div>
            </div>
        );
    }
}

export default ForgotPass;
