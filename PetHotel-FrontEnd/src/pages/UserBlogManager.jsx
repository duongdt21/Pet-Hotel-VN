import React, { Component } from 'react';
import TableThree from '..//components/TableThree';
import Navbar from '../components/Navbar';
class UserBlogManager extends Component {
    state = {
        pageNumber: 1,
        data: undefined,
        total: 0,
        message: ''
    };

    fetchData = (pageNumber) => {
        fetch(`http://localhost:3001/api/blog/blog-list?pageNumber=${pageNumber}`,{
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
                            total: dataResult.total,
                        })
                        console.log(dataResult);
                    })
                    .catch((err)=> {
                        console.log(err);
                    })
    }
    componentWillMount() {
        //check login 
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
            if (data.success) {
                //get data
                this.fetchData(this.state.pageNumber);
            } else {
                //href to 404 pages
                //window.location.href= '/';
            }

            
        })
        .catch((error)=> {
            console.log(error);
        })
    };
    handleDeleteBlog = (idBlog) => {
        fetch(`http://localhost:3001/api/blog/blog-delete/${idBlog}`,{
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
                this.fetchData(this.state.pageNumber);
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
                <div className='container mt-3'style={{
                  minHeight: '1000px',
                }}
                >
                <h4 className='mt-2'>Quan Li Blog Cua Ban</h4>
                <div className='content mt-5'>
                    <p style={{color: 'red'}}>{this.state.message}</p>
                {this.state.data ? (
                    <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Blog Title </th>
                        <th scope="col">Author</th>
                        <th scope="col">Date</th>
                        <th scope="col">Blog Detail</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.data.map((item)=> {
                          return (
                            <tr>
                            <TableThree
                            key={item._id}
                            index={item.title}
                            spaName={item.userManager.name.lastName}
                            address={item.createdAt}
                            action={'See'}
                            checkLink={`/see/${item._id}`}

                            />
                            <td> <button type="button" className="btn btn-primary" 
                            onClick={()=>{
                                this.handleDeleteBlog(item._id);
                            }} >
                            Delete
                            </button>
                                </td>
                            </tr>  
                            
                          )
                      })}
                    </tbody>
                  </table>
                ) : (
                    <>
                    <h5>You don't have any blog </h5>
                    </>
                )}
                
                </div>   
               
               
                </div>                
            </div>
        );
    }
}

export default UserBlogManager;