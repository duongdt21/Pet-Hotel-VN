import React, { Component } from 'react';

import Navbar from '../components/Navbar';

class WatchBlog extends Component {
    state = {
        title: '',
        content: '',
        author: '',
        date: undefined,
        img: ''

    };
    
    componentWillMount() {
        const idBlog = this.props.location.pathname.split('/')[this.props.location.pathname.split('/').length-1];

        fetch(`http://localhost:3001/api/blog/watch/${idBlog}`,{
            headers: {
                'Content-Type': 'application/json',

            },
            
            credentials: 'include', //auto add cookies 
        })
        .then((res)=> {
            return res.json();
        })
        .then((data)=> {
            if(data.success) {
                this.setState({
                    title: data.data.title,
                    content: data.data.content,
                    author: data.data.userManager.name.firstName + ' ' + data.data.userManager.name.lastName,
                    date: data.data.createdAt,
                    img: data.data.imgDescribe,
                })
            } else {
                //href 404
            } 

        })
        .catch((error)=> {
            console.log(error);
        })
    }
    render() {
        
        return (
            <div>
                <Navbar />
                <div className='container' style={{
                  minHeight: '1000px',
                }}>
                   <div className='blog mt-5' style={{display: 'inline-flex', flexDirection: 'column',justifyContent: 'flex-start'}}>
                   <h2>{this.state.title}</h2>
                    <i style={{color: 'grey'}}> Dang boi: {this.state.author}   Ngay {this.state.date}  </i>
                    <br></br>
                    
                    <div className='content mt-5' dangerouslySetInnerHTML={{ __html: this.state.content }}>
                    
                    </div>
                   </div>
                    
                </div>
            </div>
        );
    }
}

export default WatchBlog;