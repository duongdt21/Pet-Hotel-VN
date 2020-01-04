import React, { Component } from 'react';
import Navbar from '../components/Navbar';
class UpdateInforScreen extends Component {
    state = {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        loadingUpdate: false,
        loadingChagePass: false,
        errorMessageUpdate: '',
        errorChagePass: '',
        oldPass: '',
        newPass: '',
        confirmPass: '',
    };
    componentWillMount() {
        fetch('http://localhost:3001/api/auth/check',{
            headers: {
                'Content-Type' : 'Application/json',
            },
            credentials: 'include',
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            if(data.success) {
                this.setState({
                    firstName: data.data.name.firstName,
                    lastName: data.data.name.lastName,
                    phoneNumber: data.data.phoneNumber,
                })
            }
        })
        .catch((error)=> {
            console.log(error);
        })
    }
    handleChangeFirstName = (event) => {
        this.setState({
            firstName: event.target.value,
        })
    }
    handleChangeLastName = (event) => {
        this.setState({
            lastName: event.target.value,
        })
    }
    handleChangePhoneNumber = (event) => {
        this.setState({
            phoneNumber: event.target.value,
        })
    }
    handleUpdate = (event) => {
        event.preventDefault();
        this.setState({
            loadingUpdate: true,
        })
        //fetch Update 
        fetch('http://localhost:3001/api/auth/updateInfo',{
            method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            phoneNumber: this.state.phoneNumber,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        }),
        credentials: 'include', //auto add cookies 
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            if(data.success) {
                this.setState({
                    errorMessageUpdate: 'Cap nhat thong tin thanh cong',
                    loadingUpdate: false

                })
            } else {
                this.setState({
                    errorMessageUpdate: data.message,
                    loadingUpdate: false
                })
            }
        })
        .catch((error)=> {
            console.log(error);
            
        })
    };
    handleChageOldPass = (event) => {
        this.setState({
            oldPass: event.target.value
        })
    }
    handleChageNewPass = (event) => {
        this.setState({
            newPass: event.target.value
        })
    }
    handleChageConfirmPass = (event) => {
        this.setState({
            confirmPass: event.target.value
        })
    }
    handleUpdatePass = (event) => {
        event.preventDefault();
        this.setState({
            loadingChagePass: true,
        })
        //fetch Update 
        fetch('http://localhost:3001/api/auth/changePassword',{
            method: 'POST',
        headers: {
            'Content-Type': 'application/json',

        },
        body: JSON.stringify({
            oldPass: this.state.oldPass,
            newPass: this.state.newPass,
            confirmPass: this.state.confirmPass,
        }),
        credentials: 'include', //auto add cookies 
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            if(data.success) {
                this.setState({
                    errorChagePass: 'Thay đổi mật khẩu thành công',
                    loadingChagePass: false,
                    oldPass: '',
                    newPass: '',
                    confirmPass: '',
                    
                })
            } else {
                this.setState({
                    errorChagePass: data.message,
                    loadingChagePass: false
                })
            }
        })
        .catch((error)=> {
            console.log(error);
            
        })
    }
    render() {
        return (
            <div>
                <Navbar/>
                <div className='container mt-4' style={{
                  minHeight: '1000px',
                }}>
                    <h3>Thay đổi thông tin</h3>
                    <p style={{
                        color: 'red',
                    }}>{this.state.errorMessageUpdate}</p>
                    <form onSubmit={this.handleUpdate}>
    <div className="form-group">
    <label for="exampleInputEmail1">Họ</label>
    <input type="text" className="form-control" value={this.state.firstName} onChange={this.handleChangeFirstName} />
  </div>
  <div className="form-group">
    <label for="exampleInputEmail1">Tên</label>
    <input type="text" className="form-control" value={this.state.lastName} onChange={this.handleChangeLastName} />
  </div>
  <div className="form-group">
    <label for="exampleInputEmail1">Số điện thoại</label>
    <input type="text" className="form-control" value={this.state.phoneNumber} onChange={this.handleChangePhoneNumber} />
  </div>
  {this.state.loadingUpdate ? (
      <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (<button type="submit" className="btn btn-primary" >Cập nhật</button>)}

</form>
        <br></br>
        <br></br>
        
        <button className="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
    Thay đổi mật khẩu
  </button>

<div className="collapse" id="collapseExample">
  <div className="card card-body">

        <p style={{color: 'red'}}>{this.state.errorChagePass}</p>
        <form onSubmit={this.handleUpdatePass}
        >
  
  <div className="form-group">
    <label for="exampleInputPassword1">Mật khẩu cũ</label>
    <input type="password" className="form-control"   value={this.state.oldPass} onChange={this.handleChageOldPass}/>
  </div>
  <div className="form-group">
    <label for="exampleInputPassword1">Mật khẩu mới</label>
    <input type="password" className="form-control"   value={this.state.newPass} onChange={this.handleChageNewPass}/>
  </div>
  <div className="form-group">
    <label for="exampleInputPassword1">Xác nhận mật khẩu</label>
    <input type="password" className="form-control"   value={this.state.confirmPass} onChange={this.handleChageConfirmPass}/>
  </div>

  {this.state.loadingChagePass ? (
      <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  ) : (<button type="submit" className="btn btn-primary" >Thay đổi </button>)}
</form>
  </div>
</div>

                </div>
            </div>
        );
    }
}

export default UpdateInforScreen;
