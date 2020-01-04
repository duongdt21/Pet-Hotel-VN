import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import './NotFound.css'
class NotFound extends Component {
    render() {
        return (
            <div>
                <Navbar/>
                <div id="notfound">
		<div className="notfound">
			<div className="notfound-404"></div>
			<h1>404</h1>
			<h2>Oops! Page Not Be Found</h2>
			<p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
			<a href="http://localhost:3000/">Back to homepage</a>
		</div>
	</div>

            </div>
        );
    }
}

export default NotFound;