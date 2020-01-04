import React, { Component } from 'react';
import TableThree from '..//components/TableThree';
import NavBar from '..//components/AdminNavbar';

class AdminHomeScreen extends Component {
    
    state = {
        data : undefined,
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
                fetch('http://localhost:3001/api/location/request-on-stack',{
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
    render() {
        
        return (
            <div>
                <NavBar
                Active={'active'}
                hrActive={''}/>
                <div className='container' style={{
                  minHeight: '1000px',
                }}>
                    <h4 className='mt-2'>Request On Stack</h4>
                <div className='content mt-5'>
                {this.state.data ? (
                    <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Spa's Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((item)=> {
                          return (
                            <tr>
                            <TableThree
                            key={item._id}
                            index={item._id}
                            spaName={item.nameLocation}
                            address={item.address.detailAddress}
                            action={'Check'}
                            checkLink={`/admin/detail/${item._id}`}/>
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
    };
    
}

export default AdminHomeScreen;