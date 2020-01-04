import React, { Component } from 'react';

class TableThree extends Component {
    render() {
        return (
            
            <>
            <th scope="row">{this.props.index}</th>
                <td>{this.props.spaName}</td>
                <td>{this.props.address}</td>
                <td><a href={this.props.checkLink}>{this.props.action}</a></td>
                
            </>    
                
                
        
        );
    }
}

export default TableThree;