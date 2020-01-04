import React, { Component } from 'react';
import NavBar from '../components/Navbar';
import GoogleMapReact from 'google-map-react';
const AnyReactComponent = ({ text }) => <div>{<i style={{color: 'red',
fontSize: '50px'}} className="fas fa-map-marker-alt"></i>}</div>;
class DetailScreen extends Component {
    state = {
        name: '',
        city: '',
        district: '',
        detail: '',
        _id: undefined,
        // service
        hair: false,
        bath: false,
        takeCare: false,
        // pet type
        dog: false,
        cat: false,
        imageURL: '',
        // location Map
        openTime: undefined,
        closeTime: undefined,
        highestPrice: undefined,
        lowestPrice: undefined,
        user: undefined,
        lat: 0,
        lng: 0,
        phoneNumber: '',

    };

    componentWillMount() {
        const LocationId = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length - 1];
        console.log(LocationId);
        fetch(`http://localhost:3001/api/location/watch/${LocationId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        })
            .then((res) => {
                return res.json();
            })
            .then((dataResult) => {
                console.log(dataResult);
                this.setState({
                    name: dataResult.data.nameLocation,
                    city: dataResult.data.address.city,
                    district: dataResult.data.address.district,
                    detail: dataResult.data.address.detailAddress,
                    _id: dataResult.data._id,
                    // service
                    bath: dataResult.data.service.spaBath,
                    takeCare: dataResult.data.service.takeCare,
                    hair: dataResult.data.service.hairTrimming,
                    // pet type
                    dog: dataResult.data.petType.dog,
                    cat: dataResult.data.petType.cat,

                    imageURL: dataResult.data.imageUrl[0],
                    // location
                    lat: Number(dataResult.data.locationMap.lat),
                    lng: Number(dataResult.data.locationMap.lng),

                    openTime: dataResult.data.openTime,
                    closeTime: dataResult.data.closeTime,
                    highestPrice: dataResult.data.highestPrice,
                    lowestPrice: dataResult.data.lowestPrice,
                    user: dataResult.data.userManager,
                    phoneNumber: dataResult.data.userManager.phoneNumber,
                })
            })
            .catch((error) => {
                console.log(error.message);
            });

    }


    render() {

        return (
            <div>
                <NavBar />
                <div style={{
                  minHeight: '1000px',
                }}>
                <div className="container mt-3" >
                    <div className="row">
                        <div className="col-sm mr-3" style={{

                            width: '200px',
                            height: '500px',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeate',
                            backgroundSize: 'cover',
                            backgroundImage: `url(${'http://localhost:3001'+this.state.imageURL})`
                        }}>

                        </div>
                        <div className="col-sm">
				<h3>{this.state.name}</h3>
				<br></br>
                            <h5>
                                Thành Phố: {this.state.city},  Khu Vực: {this.state.district}
                            </h5>
                            <p className='mt-3'>
                                Địa chỉ cụ thể: {this.state.detail}, {this.state.city}
                            </p>
                            <p>
                                Loại thú cưng hỗ trợ:
                     {this.state.dog ? (<> Chó </>) : (<></>)}
                                {this.state.cat ? (<> Mèo </>) : (<></>)}

                            </p>

                            <p>
                                Dịch vụ: {this.state.hair ? (<>Cắt lông,  </>) : (<></>)}
                                {this.state.takeCare ? (<> Chăm soc (theo giờ),</>) : (<></>)}
                                {this.state.bath ? (<>  Spa và Tắm</>) : (<></>)}
                            </p>
                            <p>
                                Mở cửa tư: {this.state.openTime}h - {this.state.closeTime}h
                    </p>
                            {this.state.highestPrice ? (
                                <>

                                    <p>
                                        Mức giá cao nhất: {this.state.highestPrice}
                                    </p>
                                    <p>
                                        Mức giá thấp nhất: {this.state.lowestPrice}
                                    </p>
                                </>
                            ) : (<></>)}
                            <p>
                                Số điện thoại liên hệ: {this.state.phoneNumber}
                            </p>
                        </div>

                    </div>
                </div>

                           <div className='container mt-5'>
                               
                           {this.state.lat !=0 ? (
                                      <>
                                      <h2>Vị trí trên bản đồ</h2>
                                      <div style={{ height: '300px', width: '1000px' }}>
                                      <GoogleMapReact
                            bootstrapURLKeys={{ key:'Your Key'}}
                            defaultCenter={
                                
                            {lat: this.state.lat, lng: this.state.lng}
                            }
                            defaultZoom={17}
                          >
                              <AnyReactComponent
    lat={this.state.lat}
    lng={this.state.lng}
    text=''
    
  />
</GoogleMapReact>
                        </div>
                                      </>      
                    ) : (<></>)}
                           </div>

                </div>
                
            </div>
        );
    }
}

export default DetailScreen;
