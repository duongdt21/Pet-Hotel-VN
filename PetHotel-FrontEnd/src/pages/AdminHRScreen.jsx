import React, { Component } from 'react';
import TableThree from '..//components/TableThree';
import NavBar from '..//components/AdminNavbar';
class AdminHRScreen extends Component {
    state = {
        data : undefined,
        newEmail: '',
        newFirstName: '',
        newLastName: '',
        newPhoneNumber: '',
        loading: false,
        message: '',
    };
    componentDidMount() {
        //check authentication
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
            // if not admin === href to 404 page.
            console.log(data);
            if (data.success&&data.data.role===1) {
                //get data
                fetch('http://localhost:3001/api/admin/allAdmin',{
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'Application/json',
                    },
                    credentials: 'include',
                })
                .then((response)=> {
                    return response.json();
                })
                .then((dataResult)=> {
                    this.setState({
                        data: dataResult.data,
                    })
                    console.log(dataResult);
                })
                .catch((err)=> {
                    console.log(err);
                })
            } else {
                //href to 404 pages
                window.location.href= '/';
            }

            
        })
        .catch((error)=> {
            console.log(error);
        })
    }
    handleEmail = (event) => {
        this.setState({
            newEmail: event.target.value,
        })
    };
    handleFirstName = (event) => {
        this.setState({
            newFirstName: event.target.value,
        })
    };
    handleLastName = (event) => {
        this.setState({
            newLastName: event.target.value,
        })
    };
    handlePhoneNumber = (event) => {
        this.setState({
            newPhoneNumber: event.target.value,
        })
    };
    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });
        fetch('http://localhost:3001/api/admin/createNewAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
    
            },
            body: JSON.stringify({
                email: this.state.newEmail,
                name: {
                    firstName: this.state.newFirstName,
                    lastName: this.state.newLastName
                },
                phoneNumber: this.state.newPhoneNumber,
            }),
            credentials: 'include', //auto add cookies 
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            if (data.success) {
                this.setState({
                    loading: false,
                    message: `Successfull. Default password for '${this.state.newEmail}' is 'pet123' .Reload this page!`,
                    newEmail: '',
                    newFirstName: '',
                    newLastName: '',
                    newPhoneNumber: '',
                })
            } else {
                this.setState({
                    loading: false,
                    message: data.message,
                })
            }
        })
        .catch((error)=> {
            console.log(error);
        })

    };
    handleDeleteMessage = (event) => {
        this.setState({
            message: '',
        })
    };
    handleDeleteAdmin(email) {
        console.log(email);
        fetch(`http://localhost:3001/api/admin/deleteAdmin?email=${email}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
    
            },
            credentials: 'include', //auto add cookies 
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            if (data.success) {
                alert('Delete Successfull');
                window.location.reload();
            } else {
                alert(data.message);
            }
        })
        .catch((error)=> {
            console.log(error);
        })
    }
    render() {
        return (
            <div>
                <NavBar
                Active={''}
                hrActive={'active'}/>
                <div className='container' style={{
                  minHeight: '1000px',
                }}>
                    <h4 className='mt-2'>List Admin</h4>
                    <button type="button" className="btn btn-secondary" data-toggle="modal" data-target="#exampleModalCenter" onClick={this.handleDeleteMessage}>
  Create New Admin
</button>


<div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalCenterTitle">Create New Admin</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
          <p style={{
              color: 'red',
    }}>{this.state.message}</p>
      <form onSubmit={this.handleSubmit}>
  <div className="form-group">
    <label for="exampleInputEmail1">Account</label>
    <input type="text" className="form-control"  value={this.state.newEmail} onChange={this.handleEmail}/>
  </div>
  <div className="form-group">
    <label for="exampleInputEmail1">First Name</label>
    <input type="text" className="form-control"  value={this.state.newFirstName} onChange={this.handleFirstName}/>
    
  </div>
  <div className="form-group">
    <label for="exampleInputEmail1">Last Name</label>
    <input type="text" className="form-control"  value={this.state.newLastName} onChange={this.handleLastName}/>
  </div>
  <div className="form-group">
    <label for="exampleInputEmail1">Phone Number</label>
    <input type="text" className="form-control"  value={this.state.newPhoneNumber} onChange={this.handlePhoneNumber}/>
  </div>
  {this.state.loading ? (
                    <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                    <button type="submit" className="btn btn-primary">Create New Admin</button>
                ) }
  
</form>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
                <div className='content mt-5'>
                {this.state.data ? (
                    <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Account</th>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Phone Number</th>
                        <th scope='col'>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((item)=> {
                          return (
                            <tr>
                            <TableThree
                            key={item._id}
                            index={item.email}
                            spaName={item.name.firstName}
                            address={item.name.lastName}
                            action={item.phoneNumber}
                            />
                            <td><i className="fas fa-trash-alt"  onClick={()=>{
                                    this.handleDeleteAdmin(item.email);
                                }}>  </i></td>
                            </tr>  
                            
                          )
                      })}
                    </tbody>
                  </table>
                ) : (
                    <>
                    <h5>You don't have any request </h5>
                    </>
                )}

                </div>    
                
                </div>
            </div>
        );
    }
}

export default AdminHRScreen;