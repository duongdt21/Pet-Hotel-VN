import React, { Component } from 'react';
import '../css/card.css';


class LocationCard extends Component {
    render() {
        return (

            <div className="card mt-3" style={{
                height: '400px'
            }}>
                

                <div className="card-img-top" style={{
                    height: '250px',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeate',
                    backgroundSize: 'cover',
                    backgroundImage: `url(${this.props.imageUrl})`
                }}>

                </div>

                <div className="card-body">
                <h5 className="name-location">{this.props.nameLocation}</h5>
                    <div className="address">Địa chỉ: {this.props.address}</div>
                </div>


            </div>
        );
    }
}

export default LocationCard;