import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import './blog.css';
import BlogCard from '..//components/BlogCard';
class BlogScreen extends Component {
    state= {
        data: undefined,
        pageNumber: 1,
        total: 0,
        keyWord: '',
        loading: false,
    }
    fetchData = (pageNumber,keyWord) => {
        this.setState({
            loading: true,
        })
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
                        console.log(dataResult);
                        this.setState({
                            loading: false,
                            data: dataResult.data,
                            total: dataResult.total,
                        })
                    })
                    .catch((err)=> {
                        console.log(err);
                    })
    }
    componentWillMount() {
        this.fetchData(this.state.pageNumber,this.state.keyWord);
    }
    handleSearch = (event) => {
        this.setState({
            keyWord: event.target.value,
        })
    };
    handleSearchSubmit = (event) => {
        
        event.preventDefault();
        // fetch 
        this.fetchData(this.state.pageNumber,this.state.keyWord);
    }
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
              <Navbar/>
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
  

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
    
    <form className="form-inline my-2 my-lg-0" onSubmit={this.handleSearchSubmit}>
      <input className="form-control mr-sm-2" placeholder="Tìm Kiếm" aria-label="Search" value={this.state.keyWord} onChange={this.handleSearch}/>
      <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Tìm Kiếm</button>
    </form>
  </div>
</nav>
            <div className='container' style={{
                minHeight: '800px',
            }}>
            
            {this.state.loading ? (
                <div className="text-center" >
                <div className="spinner-border" role="status" style={{
                    width: '10rem',
                    height: '10rem',
                    marginTop: '250px'
                }}>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (<>
                {this.state.data ? (
                    <>
                    {this.state.data.map((item)=> {
                        return(
                            <BlogCard
                        key={item._id}
                        title={item.title}
                        imageUrl={`http://localhost:3001${item.imgDescribe}`}
                        href={`http://localhost:3000/see/${item._id}`}
                        author={`Đăng bởi: ${item.userManager.name.firstName+' '+item.userManager.name.lastName}`}
                        />
                        )
                        
                    })}
                    </>
                    
                ) : (
                    <>
                    
                    </>
                )}
                <nav aria-label="Page navigation example" className='mt-5 mb-5'> 
                        <ul className="pagination">
                        <li className="page-item" onClick={this.loadPrevPage}><a className="page-link" >Trước</a></li>
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
                        
                        <li className="page-item"onClick={this.loadNextPage}><a className="page-link">Tiếp</a></li>
      </ul>
    </nav>
    </>
            )}
            
            </div>  
                
            </div>
                    
                    );
                }
            }
            
export default BlogScreen;
