import React, { Component } from 'react';
import NavBar from '..//components/AdminNavbar';
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{<i style={{color: 'red',
fontSize: '50px'}} className="fas fa-map-marker-alt"></i>}</div>;
class DetailSpaAdmin extends Component {
    state = {
        name:'',
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
        lat: undefined,
        lng: undefined,
        openTime: undefined,
        closeTime: undefined,
        highestPrice: undefined,
        lowestPrice: undefined,
        user: undefined,
        phoneNumber: '',
        loading: false,
        contentMail: '',
        errorMessage: '',
    };
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
            
            if (data.success&&data.data.role===1) {
                //get data
                const LocationId = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length-1];
                fetch(`http://localhost:3001/api/location/location-request/${LocationId}`,{
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
                    //console.log(dataResult);

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
                    });

                   
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
    fetchCheck(status) {
        fetch(`http://localhost:3001/api/location/location-confirm/${this.state._id}/${status}`, {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
                },
            credentials: 'include',
        }
        )
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            window.location.href='/admin/';
        })
    }
    handleConfirm = (event) => {
        this.fetchCheck('confirm');
    }
    handleReject = (event) => {
        this.setState({
            loading: true,
        })
        if (!this.state.contentMail) {
            this.setState({
                errorMessage: 'Content can not be blank',
                loading: false,
            })
        } else {
            const LocationId = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length-1];

            fetch(`http://localhost:3001/api/location/send-reject/${LocationId}`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    content: this.state.contentMail,
                }),
                credentials: 'include', //auto add cookies 
            })
            .then((res)=> {
                return res.json();
            })
            .then((data)=> {
                if (data.success) {
                    this.fetchCheck('reject');
                    this.setState({
                        loading: false,
                        errorMessage: data.message,
                    });
                }
            })
            .catch((error)=> {
                console.log(error);
            })
        }
        //this.fetchCheck('reject');
    }
    handleChangeMail = (event) => {
        this.setState({
            contentMail: event.target.value,
        });
    }
    render() {

        console.log(this.state.center);
        
        return (
            <div className='pb-5'>
                <NavBar
                Active={'active'}
                hrActive={''}/>
                <div className='container mt-3' style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '1400px'
                }}>
                <h2>{this.state.name}</h2>
                <div className='image' style={{
                    width : '600px',
                    height: '500px',
                    float: 'left',
                    
                }}>
                    <img src={`http://localhost:3001`+this.state.imageURL} style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        marginBottom: '20px',
                    }}></img>
                    <h5>
                    City: {this.state.city},  District: {this.state.district} 
                    </h5>
                    <p className='mt-3'>
                    Address Detail: {this.state.detail}, {this.state.city}
                    </p>
                    <p>
                    Pet Type:
                     {this.state.dog ? (<>Dog </>) : (<></> )}
                    {this.state.cat ? (<>Cat </>) : (<></> )}

                    </p>

                    <p>
                        Service: {this.state.hair ? (<>Hair Trimming and Cut,  </>) : (<></>)}
                        {this.state.takeCare ? (<> Take Care (in hours),</>) : (<></>)}
                        {this.state.bath ? (<>  Spa and Bath</>) : (<></>)}
                    </p>   
                    <p>
                        Open Time: {this.state.openTime}h - {this.state.closeTime}h
                    </p>
                    {this.state.highestPrice ? (
                        <>

                        <p>
                            Highest Price: {this.state.highestPrice} 
                        </p>
                        <p>
                            Lowest Price: {this.state.lowestPrice}
                        </p>
                        </>
                    ) : (<></>)}
                    <p>
                        Contact: {this.state.phoneNumber}
                    </p>
                    {this.state.lat ? (
                                      <>
                                      <div style={{ height: '400px', width: '800px' }}>
                                      <GoogleMapReact
                            bootstrapURLKeys={{ key:'Your Key'}}
                            center={
                                {lat: this.state.lat, lng: this.state.lng}
                            }
                            defaultZoom={14}
                            

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
                    <div className='mt-3' style={{
                        color: 'red'
                    }}>
                    <p>
                        Check information carefully before confirm location 
                    </p>
                </div>
                <button type="button" className="btn btn-success" style={{
                    marginRight:'10px',
                }} onClick={this.handleConfirm}>Confirm</button>
                <button type="button" className="btn btn-danger" data-toggle="modal" data-target="#exampleModal">Reject</button>
                </div>
                
            </div>
            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Reason for refusal </h5>
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
            <button type="button" className="btn btn-danger" onClick={this.handleReject}> Reject</button>
        ) } 
        
      </div>
    </div>
  </div>
</div>
        </div>   
        );
    }
}

export default DetailSpaAdmin;