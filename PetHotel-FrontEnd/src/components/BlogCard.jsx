import React, { Component } from 'react';

class BlogCard extends Component {
    render() {
        return (
            <div>
                <div className='container mt-3'>
                <article className="blog_item">
                    <div className="blog_item_img" style={{
                        height: '300px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeate',
                        backgroundSize: 'cover',
                        backgroundImage: `url(${this.props.imageUrl})`
                    }}>
                    </div>

                    <div className="blog_details" style={{
                        height: '150px'
                    }}>
                        <a className="d-inline-block" href={this.props.href}>
                <h2>{this.props.title}</h2>
                        </a>
                <p style={{color: 'grey'}}>{this.props.author}</p>
                        
                    </div>
                </article>
            </div>
            </div>
        );
    }
}

export default BlogCard;