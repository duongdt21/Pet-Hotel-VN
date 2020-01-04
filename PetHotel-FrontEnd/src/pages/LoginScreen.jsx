import React, { Component } from 'react';


class LoginScreen extends Component {
    state = {
        email:'',
        password: '',
        errorMessage: '',
        loading: false,
    };

    
    handleEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    };
    
    handlePassword = (event) => {
        this.setState({
            password: event.target.value,
        });
    };
    
    handleSubmit = (event) => {
        event.preventDefault();
        //validate
        if (!this.state.email) {
            this.setState({
                errorMessage: 'Please input email',
            });
        }
        else if (!this.state.password) {
            this.setState({
                errorMessage: 'Please input Password',
            });
        }
       
        else {
            this.setState({
                errorMessage: "",
                loading: true,
            });
        }
        //fetch API
        fetch ('http://localhost:3001/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
    
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
            credentials: 'include', //auto add cookies 
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=>{
            console.log(data);
            if (!data.success) {
                this.setState({
                    errorMessage: data.message,
                    loading: false,
                });
            } else {
                window.location.href='/admin';
            }
            
        })
        .catch((error)=> {
            console.log(error);
            console.log("1 "+error.message);
            this.setState({
                errorMessage: error.message,
                loading: false,
            });
        })
    };
    
        render() {
            return (
                <div>
                    
                    <div> 
                    <div className="container">
                        <form className="register-form" onSubmit={this.handleSubmit}> 
                        
                            <div className="form-group">
                                <label for="exampleInputEmail1">Email address</label>
                                <input type="input" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"value={this.state.email} onChange={this.handleEmail}/>
                                    
      </div>
                                <div className="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"value={this.state.password} onChange={this.handlePassword}/>
      </div>
                <p className="text-danger">{this.state.errorMessage}</p>
                {this.state.loading ? (
                    <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                    <button type="submit" className="btn btn-primary">Login</button>
                ) }
                                        
    </form>
                                </div>
                    </div>
                    
                            </div>
                            );
                        }
}

export default LoginScreen;