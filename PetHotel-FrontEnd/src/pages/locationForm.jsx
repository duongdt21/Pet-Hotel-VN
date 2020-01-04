import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import {Marker} from 'google-map-react';
import Navbar from '../components/Navbar';
const AnyReactComponent = ({ text }) => <div>{<i style={{color: 'red',
fontSize: '50px'}} className="fas fa-map-marker-alt"></i>}</div>;
export default class locationForm extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        name: '',
        city: 'Hà Nội',
        district: '',
        detailAddress: '',
        spaBath: false,
        takeCare: false,
        hairTrimming: false,
        dog: false,
        cat: false,
        productivity: undefined,
        openTime: '',
        closeTime: '',
        highestPrice: '',
        lowestPrice: '',
        arrayCity: [],
        arrayDistrist: [],
        lat: '',
        lng: '',
        imageFile: undefined, 
        loading: false, 
        errorMessage: '' ,
        mapLat: 0,
        mapLng: 0,     
    };
    // 
    success = (position) => {
        const latitude  = position.coords.latitude;
        const longitude = position.coords.longitude;
        
        this.setState({
            mapLat: latitude,
            mapLng: longitude
        })
        
      }
    
    error() {
        console.log("404");
      }

    componentWillMount() {
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
            .then((respon) => {
                return respon.json();
            })
            .then((dataresult) => {
                if (dataresult.success) {


                    this.setState({
                        arrayDistrist: dataresult.data.district
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
            navigator.geolocation.getCurrentPosition(this.success, this.error);
    }

    //

    handleShowMap = (event) => {
        navigator.geolocation.getCurrentPosition(this.success, this.error);
    }
    
    handleChangeCity = (event) => {
        this.setState({
            city: event.target.value,
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
    };
    handleChangeOpenTime = (event) => {
        this.setState({
            openTime: event.target.value,
        })
    };
    handleChangeCloseTime = (event) => {
        this.setState({
            closeTime: event.target.value,
        })
    }
    handleChangeDistrict = (event) => {
        console.log(event.target.value);
        this.setState({
            district: event.target.value,
        })
    }
    handleChangeName = (event) => {
        this.setState({
            name: event.target.value,
        })
    };
    handleChangeDetailAddress = (event) => {
        this.setState({
            detailAddress: event.target.value,
        })
    }
    handleChangeProductivity = (event) => {
        this.setState({
            productivity: event.target.value,
        })
    };
    handleChangeHiPrice = (event) => {
        this.setState({
            highestPrice: event.target.value,
        })
    };
    handleChangeLoPrice = (event) => {
        this.setState({
            lowestPrice: event.target.value,
        })
    };
    onCheckCat = () => {
        this.setState({
            cat: !this.state.cat,
        })
    }
    onCheckDog = () => {
        this.setState({
            dog: !this.state.dog,
        })
    }
    onCheckSpaBath = () => {
        this.setState({
            spaBath: !this.state.spaBath,
        })
    }
    onCheckTakeCare = () => {
        this.setState({
            takeCare: !this.state.takeCare,
        })
    }
    onCheckHair = () => {
        this.setState({
            hairTrimming: !this.state.hairTrimming,
        })
    }
    
    handleFileChange = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({
                    imageFile: imageFile,
                });
            };
            reader.readAsDataURL(imageFile);
        }
    }

    handleSendLocation = (event) => {
        this.setState({
            lat: this.state.mapLat.toString(),
            lng: this.state.mapLng.toString()
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();

        this.setState({
            loading: true,
        });

        // fetch upload file
        const formData = new FormData();
        formData.append('image', this.state.imageFile);
        fetch('http://localhost:3001/api/uploadImages/image', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (!data.success) {
                    this.setState({
                        loading: false,
                        errorMessage: data.message,
                    });
                } else {
                    // fetch to save 
                    fetch('http://localhost:3001/api/location/createNewLocation', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                nameLocation: this.state.name,
                address: {
                    city: this.state.city,
                    district: this.state.district,
                    detailAddress: this.state.detailAddress,
                },
                locationMap: {
                    lat: this.state.lat,
                    lng: this.state.lng,
                },
                service: {
                    hairTrimming: this.state.hairTrimming,
                    spaBath: this.state.spaBath,
                    takeCare: this.state.takeCare,
                },
                petType: {
                    dog: this.state.dog,
                    cat: this.state.cat,
                },
                productivity: this.state.productivity,
                openTime: this.state.openTime,
                closeTime: this.state.closeTime,
                highestPrice: this.state.highestPrice,
                lowestPrice: this.state.lowestPrice,
                imageUrl: [data.data.imageUrl]
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((dataResult) => {
                console.log(dataResult);
                if (dataResult.success) {
                    this.setState({
                        loading: false,
                        errorMessage: 'Thành công. Vui lòng chờ xác thực từ phía hệ thống. Xin cảm ơn',
                        name: '',
                        detailAddress: '',
                        spaBath: false,
                        takeCare: false,
                        hairTrimming: false,
                        dog: false,
                        cat: false,
                        productivity: 0,
                        highestPrice: '',
                        lowestPrice: '',
                        imageFile: undefined,
                    })
                } else {
                    this.setState({
                        errorMessage: dataResult.message,
                        loading: false,
                    })
                }
                
            })
            .catch((err) => {
                console.log(err)
            })
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                  errorMessage: err.message,
                  loading: false,
                });
              });
            }  
                    render() {
                        console.log(this.state);
                        return (
                            <div>
                                <Navbar/>
                                <div className='container'>
                                <div className="locationContainer">
                                <div className="header mt-5">
                                    <h1>Thêm địa điểm</h1>
                                </div>
                                <div className="feedback-form">
                                    <div className="feedback-table">
                                        <div className="information-name">
                                            Thông tin cơ bản
                        </div>
                                        <hr />
                                        <div className="information-content">
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Tên địa điểm
                                        <span style={{color: 'red'}}> *</span>
                                                </div>
                                                <div className="details mb-3">
                                                    <input type="text" name="Name" value={this.state.name} onChange={this.handleChangeName} />
                                                </div>
                                            </div>

                                            <div className="box-information-normal">
                                                <div className="label " >
                                                    Tỉnh thành
                                        <span style={{color: 'red'}}> *</span>
                                                </div>
                                                <div className="details mb-3">
                                                    <div className="province" >
                                                        <select className="provinceId" onChange={this.handleChangeCity} value={this.state.city}>

                                                            {this.state.arrayCity.map((item) => {
                                                                return (
                                                                    <option key={item}>{item.name}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div className="district mt-2">
                                                        <select className="districtId" value={this.state.district} onChange={this.handleChangeDistrict}>
                                                            <option>--Chọn quận/huyện</option>
                                                            {this.state.arrayDistrist.map((item) => {
                                                                return (
                                                                    <option key={item}>{item}</option>
                                                                )
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Địa chỉ
                                        <span style={{color: 'red'}}> *</span>
                                                </div>
                                                <div className="details">
                                                    <input type="text" name="Address" onChange={this.handleChangeDetailAddress} value={this.state.detailAddress} />
                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Vị trí
                                        
                                                </div>
                                                <div className="details">
                                                    <a className="updateLocation">Cập nhật vị trí</a>
                                                    <div style={{
                                                        marginBottom: '15px',
                                                        marginTop: '15px',
                                                    }}>
                                                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" onClick={this.handleShowMap}>
Sử dụng vị trí trên bản đồ
</button>


<div className="modal fade " id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalCenterTitle">Vị trí</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div style={{ height: '400px', width: '770px' }}>
                                      <GoogleMapReact
                            bootstrapURLKeys={{ key:'Your Key'}}
                            center={
                                {lat: this.state.mapLat, lng: this.state.mapLng}
                            }
                            defaultZoom={16}
                           

                          >
                              <AnyReactComponent
    lat={this.state.mapLat}
    lng={this.state.mapLng}
    text=''
    
  />
</GoogleMapReact>
                              
        
                        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Đóng</button>
        <button type="button" className="btn btn-primary" onClick={this.handleSendLocation}>Gửi vị trí</button>
      </div>
    </div>
  </div>
</div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                       
                                     
                                      
                                        <div className="information-name">
                                            Thông tin khác
                        </div>
                                        <hr />
                                        <div className="information-content">
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Dịch vụ
                                        <span style={{color: 'red'}}> *</span>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" checked={this.state.spaBath} onChange={this.onCheckSpaBath} />
                                                    <label className="form-check-label" for="exampleCheck1">Tắm</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" checked={this.state.hairTrimming} onChange={this.onCheckHair} />
                                                    <label className="form-check-label" for="exampleCheck1">Tóc</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" checked={this.state.takeCare} onChange={this.onCheckTakeCare} />
                                                    <label className="form-check-label" for="exampleCheck1">Trông</label>
                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Loại pet
                                        <span style={{color: 'red'}}> *</span>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" checked={this.state.dog} onChange={this.onCheckDog} />
                                                    <label className="form-check-label" for="exampleCheck1">Chó</label>
                                                </div>
                                                <div className="form-check">
                                                    <input type="checkbox" className="form-check-input" checked={this.state.cat} onChange={this.onCheckCat} />
                                                    <label className="form-check-label" for="exampleCheck1">Mèo</label>
                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Số lượng phục vụ
                                        <span style={{color: 'red'}}> *</span>
                                                </div>
                                                <div className="details">
                                                    <input type="number" name="Quanties" onChange={this.handleChangeProductivity} value={this.state.productivity} />
                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Giờ mở cửa
                                        <span style={{color: 'red'}}> *</span>
                                                </div>
                                                <div className="details">
                                                    <div className="hourPet">
                                                        <select className="hourOpen" value={this.state.openTime} onChange={this.handleChangeOpenTime}>
                                                            <option>00</option>
                                                            <option>01</option>
                                                            <option>02</option>
                                                            <option>03</option>
                                                            <option>04</option>
                                                            <option>05</option>
                                                            <option>06</option>
                                                            <option>07</option>
                                                            <option>08</option>
                                                            <option>09</option>
                                                            <option>10</option>
                                                            <option>11</option>
                                                            <option>12</option>
                                                            <option>13</option>
                                                            <option>14</option>
                                                            <option>15</option>
                                                            <option>16</option>
                                                            <option>17</option>
                                                            <option>18</option>
                                                            <option>19</option>
                                                            <option>20</option>
                                                            <option>21</option>
                                                            <option>22</option>
                                                            <option>23</option>
                                                        </select>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Giờ đóng cửa
                                        <span style={{color: 'red'}}> *</span>
                                                 </div>
                                                <div className="details">
                                                    <div className="hourPet">
                                                        <select className="hourClose" value={this.state.closeTime} onChange={this.handleChangeCloseTime}>
                                                            <option>01</option>
                                                            <option>02</option>
                                                            <option>03</option>
                                                            <option>04</option>
                                                            <option>05</option>
                                                            <option>06</option>
                                                            <option>07</option>
                                                            <option>08</option>
                                                            <option>09</option>
                                                            <option>10</option>
                                                            <option>11</option>
                                                            <option>12</option>
                                                            <option>13</option>
                                                            <option>14</option>
                                                            <option>15</option>
                                                            <option>16</option>
                                                            <option>17</option>
                                                            <option>18</option>
                                                            <option>19</option>
                                                            <option>20</option>
                                                            <option>21</option>
                                                            <option>22</option>
                                                            <option>23</option>
                                                            <option>24</option>
                                                        </select>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Giá cao nhất
                
                                </div>
                                                <div className="details">
                                                    <input type="text" name="Quanties" onChange={this.handleChangeHiPrice} value={this.state.highestPrice} />
                                                </div>
                                            </div>
                                            <div className="box-information-normal">
                                                <div className="label">
                                                    Giá thấp nhất
                
                                </div>
                                                <div className="details">
                                                    <input type="text" name="Quanties" onChange={this.handleChangeLoPrice} value={this.state.lowestPrice} />
                                                </div>
                                            </div>
                                            <div>

                                                <div className='container mt-2 mb-2'>
                                                    <h5>Hình ảnh mô tả</h5>
                                                    <p>Sử dụng hình ảnh thật cho địa điểm của bạn để Quản trị viên có thể xác nhận</p>
                                                    <br></br>
                                                    <input
                                                                type='file'
                                                                className='btn btn-outline-primary file-input'
                                                                onChange={this.handleFileChange}
                                                            />
                                                </div>
                                            </div>
                                        </div>
                                        <p style={{color: 'red'}}>
            {this.state.errorMessage}
        </p>
                                        {this.state.loading ? (
            <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
            <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Tạo địa điểm</button>

        ) } 
        
                                    </div>
                                </div>
                            </div>
                            </div>
                            </div>
                            
                            
                        )
                    }
                }
