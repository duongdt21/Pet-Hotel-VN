import React, { Component } from 'react';
import TableThree from '..//components/TableThree';
import NavBar from '..//components/AdminNavbar';



class AdminBlogScreen extends Component {

    state = {
        data : undefined,
        errorMessage: '',
        idDelete: '',
        loading: false,
        contentMail: '',
        total: undefined,
        keyWord: '',
        pageNumber: 1,
    };
    
    fetchData = (pageNumber,keyWord) => {
        fetch(`http://localhost:3001/api/blog?pageNumber=${pageNumber}&keyWord=${keyWord}`,{
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
                this.fetchData(this.state.pageNumber,this.state.keyWord);
            } else {
                //href to 404 pages
                window.location.href= '/';
                
            }

            
        })
        .catch((error)=> {
            console.log(error);
        })
    }
    handleDeleteBlog(event) {
        this.setState({
            idDelete: event,
        })
    };
    handleChangeMail = (event) => {
        this.setState({
            contentMail: event.target.value,
        })
    }
    handleDelete = (event) => {
        this.setState({
            loading: true,
        })
        fetch(`http://localhost:3001/api/blog/ban-blog/${this.state.idDelete}`,{
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    emailContent: this.state.contentMail,
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
                    errorMessage: 'Successfull! Please Reload this page',
                    contentMail: '',
                })
            } else {
                this.setState({
                    loading: false,
                    errorMessage: data.message,
                })
            }
        })
        .catch((err)=> {
            console.log(err);
            this.setState({
                loading: false
            })
        })
    }
    handleSearch = (event) => {
        this.setState({
            keyWord: event.target.value,
        })
    };
    handleSearchSubmit = (event) => {
        event.preventDefault();
        this.fetchData(this.state.pageNumber,this.state.keyWord);

    };
    loadPrevPage = () => {
        if (this.state.pageNumber>1) {
            this.fetchData(this.state.pageNumber-1,this.state.keyWord);
            this.setState({
                pageNumber:  this.state.pageNumber-1,
            })
        };
    };

    loadNextPage = () => {
        if (this.state.pageNumber!==Math.ceil(this.state.total / 12)) {
            this.fetchData(this.state.pageNumber+1,this.state.keyWord);
            this.setState({
                pageNumber:  this.state.pageNumber+1,
            })
        };
    };
    handlePageChange = (pageNumber) => {
        //fetch new data --- set state ---
        this.fetchData(pageNumber,this.state.keyWord);
        this.setState({
            pageNumber: pageNumber,
        })
        
    }

    render() {
        const numberOfPages = Math.ceil(this.state.total / 12);
        //
        const pages = [];
        for (let i=0;i<numberOfPages;i+=1) {
            pages.push(i+1);
        }
        return (
            <div>
                <NavBar
                Active={''}
                hrActive={''}
                blActive={'active'}/>
                <div className='container mt-3' style={{
                  minHeight: '1000px',
                }}>
                <h4 className='mt-2'>Control Content Blog</h4>
                <form className="form-inline" onSubmit={this.handleSearchSubmit}>
    <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" onChange={this.handleSearch} value={this.state.keyWord}/>
    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
  </form>
                <div className='content mt-5'>
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
                            <td> <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal"  onClick={()=>{
                                    this.handleDeleteBlog(item._id);
                                }}>
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
                    <h5>You don't have any request </h5>
                    </>
                )}
                <nav aria-label="Page navigation example" className='mt-5 mb-5'> 
                    <ul className="pagination">
                    <li className="page-item" onClick={this.loadPrevPage}><a className="page-link" >Previous</a></li>
                    {pages.map((item)=> {
                        let className = 'page-item';
                        if (item === this.state.pageNumber) {
                            className+=' active';
                        }
                        return (
                            <li className={className} key={item} onClick={() => {
                                this.handlePageChange(item);
                            }}> 
                        <a className="page-link" >{item}</a>
                        </li>
                        )
                        
                    })}
                    
                    <li className="page-item"onClick={this.loadNextPage}><a className="page-link">Next</a></li>
  </ul>
</nav>
                </div>
                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Reason for ban</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <p style={{color: 'red'}}>{this.state.errorMessage}</p>
      <div className="form-group">
            <label for="message-text" className="col-form-label">Message:</label>
            <textarea className="form-control" value={this.state.contentMail} onChange={this.handleChangeMail}></textarea>
          </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        {this.state.loading ? (
            <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
            <button type="button" className="btn btn-danger" onClick={this.handleDelete}> Delete</button>
        ) } 
      </div>
    </div>
  </div>
</div>
                </div>
            </div>
        );
    }
}

export default AdminBlogScreen;