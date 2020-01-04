import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import LocationCard from '../components/LocationCard';
class HomeScreen extends Component {
    state = {
        total: 0,
        data: [],
        pageNumber: 1,
        city: 'Hà Nội',
        district: '',
        keyWord: '',
        loading: '',
        arrayCity: [],
        arrayDistrist: [],
    };
    

    componentWillMount() {
        this.fetchData(this.state.pageNumber,this.state.city);

        fetch('http://localhost:3001/api/city/getCity', {
            headers: {
                'Content-Type': 'Application/json',
            },
            credentials: 'include'
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    console.log("aaaa");
                    this.setState({
                        arrayCity: data.data
                    })
                }
            })
            .catch((err) => {
                console.log(err);
            });

            fetch(`http://localhost:3001/api/city/getDistrict?city=${this.state.city}`, {
              headers: {
                  'Content-Type': 'Application/json',
              },
              credentials: 'include'
          })
              .then((res) => {
                  return res.json();
              })
              .then((data) => {
                  if (data.success) {
  
                      console.log(data);
                      this.setState({
                          arrayDistrist: data.data.district
                      });
                  }
              })
              .catch((err) => {
                  console.log(err);
              })    
      }
    
      fetchData = (pageNumber,city) => {
        this.setState({
          loading: true,
        })
        fetch(`http://localhost:3001/api/location/get-all?city=${city}&pageNumber=${pageNumber}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            console.log(data);
            this.setState({
              data: data.data,
              total: data.total,
              loading: false,
            });
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    
      handleSearchInput = (event) => {
        this.setState({
          keyWord: event.target.value,
        })
      }
      
      handleChangeCity = (event) => {
        this.setState({
            city: event.target.value,
            pageNumber: 1,
        })
        fetch(`http://localhost:3001/api/city/getDistrict?city=${event.target.value}`, {
            headers: {
                'Content-Type': 'Application/json',
            },
            credentials: 'include'
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data.success) {

                    console.log(data);
                    this.setState({
                        arrayDistrist: data.data.district
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })

         this.fetchData(this.state.pageNumber,event.target.value)   
    };
    handleChangeDistrict = (event) => {
      console.log(event.target.value);
      this.setState({
          district: event.target.value,
      })
  }
  loadPrevPage = () => {
    if (this.state.pageNumber>1) {
        this.fetchData(this.state.pageNumber-1,this.state.city);
        this.setState({
            pageNumber:  this.state.pageNumber-1,
        })
    };
};

loadNextPage = () => {

    if (this.state.pageNumber!==Math.ceil(this.state.total / 12)) {
        this.fetchData(this.state.pageNumber+1,this.state.city);
        this.setState({
            pageNumber:  this.state.pageNumber+1,
        })
    };
};
handlePageChange = (pageNumber) => {
    //fetch new data --- set state ---
    this.fetchData(pageNumber,this.state.city);
    this.setState({
        pageNumber: pageNumber,
    })
    
} 
    handleSearchSubmit = (event) => {
      event.preventDefault();

      
      // replace Choose
      if (this.state.district) {
        if (this.state.district!= '--Choose--') {
          this.setState({
            loading: true,
          });
          fetch(`http://localhost:3001/api/location/find?city=${this.state.city}&district=${this.state.district}&pageNumber=1&keyword=${this.state.keyWord}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            console.log(data);
            this.setState({
              data: data.data,
              total: data.total,
              loading: false,
            });
          })
          .catch((error) => {
            console.log(error.message);
          });
        }
      }
      

    }

    render() {
      console.log(this.state);
      const numberOfPages = Math.ceil(this.state.total / 12);
        //
        const pages = [];
        for (let i=0;i<numberOfPages;i+=1) {
            pages.push(i+1);
        }
        return (

            <div>
                <Navbar />
                <div>
                <nav className="navbar navbar-light bg-light justify-content-center">
                <a className="navbar-brand" href="#"></a>
  <form className="form-inline" onSubmit={this.handleSearchSubmit} >
  <select className="provinceId" onChange={this.handleChangeCity} value={this.state.city} style={{
    fontSize: '18px',
    marginRight: '10px',
    border: '1px soild 1800E7',
    borderRadius: '2px',
    width: '139px',
    height: '35px',
    boxSizing: 'border-box',
    backgroundColor: 'white'
  }}>

{this.state.arrayCity.map((item) => {
    return (
        <option key={item}>{item.name}</option>
    )
})}
</select>
<select className="districtId" value={this.state.district} onChange={this.handleChangeDistrict} style={{
    fontSize: '18px',
    marginRight: '10px',
    border: '1px soild 1800E7',
    borderRadius: '2px',
    width: '190px',
    height: '35px',
    boxSizing: 'border-box',
    backgroundColor: 'white'
  }}>
                                                            <option>--Chọn quận/huyện</option>
                                                            {this.state.arrayDistrist.map((item) => {
                                                                return (
                                                                    <option key={item}>{item}</option>
                                                                )
                                                            })}
                                                        </select>
    <input className="form-control mr-sm-2" type="search" placeholder="Tìm Kiếm" aria-label="Search" value={this.state.keyWord} onChange={this.handleSearchInput}/>
    <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Tìm Kiếm</button>
  </form>
</nav>  
                </div>
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" style={{
                  height: '340px'
                }}>
  <ol className="carousel-indicators">
    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
  </ol>
  <div className="carousel-inner">
    <div className="carousel-item active"style={{
      height: '310px',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeate',
      backgroundSize: 'cover',
      backgroundImage: `url('https://images.unsplash.com/photo-1563354860-799d15199ac3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')`
    }}
    >
    </div>
    <div className="carousel-item "style={{
      height: '310px',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeate',
      backgroundSize: 'cover',
      backgroundImage: `url('https://images.unsplash.com/photo-1576441335949-c4f4a2baf347?ixlib=rb-1.2.1&auto=format&fit=crop&w=1267&q=80')`
    }}
    >
    </div>
    <div className="carousel-item"style={{
      height: '310px',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeate',
      backgroundSize: 'cover',
      backgroundImage: `url('https://images.unsplash.com/photo-1467810563316-b5476525c0f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1349&q=80')`
    }}
    >
    </div>
  </div>
  <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="sr-only">Previous</span>
  </a>
  <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="sr-only">Next</span>
  </a>
</div>
                <div className='container' style={{
                  minHeight: '1000px',
                }}>
                  <i style={{
                    fontSize: '18px',
                    marginBottom: '10px',
                    color: '#626262'
                  }}>Khám phá các địa điểm mới nhất cùng Pet Hotel</i>
                  {this.state.total==0 ? (
                      <h5>Không có kết quả được tìm thấy</h5>
                  ) : (
                    <>
                    </>
                  )}
                  {this.state.loading ? (<>
                    <div className="text-center" >
                <div className="spinner-border" role="status" style={{
                    width: '10rem',
                    height: '10rem',
                    marginTop: '250px'
                }}>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
                  </>) : (
                    <>
                    <div className="row">
                    {this.state.data.map((item) => {
                        return(
                            
                              <div className="col-xs-12 col-md-6 col-lg-4 col-xl-3" key = {item._id}>
                                <a href={`http://localhost:3000/watch/${item._id}`}>
                                <LocationCard 
                                    
                                    imageUrl = {`http://localhost:3001${item.imageUrl}`}
                                    nameLocation = {item.nameLocation}
                                    address = {item.address.detailAddress}
                                />
                                </a>
                            </div>
                            
                        );
                    })}                    
                    </div>    
                       
                    </>
                  )}

                {this.state.total>12 ? (
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
                ) : (
                  <>
                  </>
                )}  
                
                          
                </div>
            </div>
        );
    }
}

export default HomeScreen;
