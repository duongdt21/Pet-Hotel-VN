import React from 'react';
import './App.css';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import AdminHomeScreen from './pages/AdminHomeScreen';
import LoginScreen from './pages/loginScreen';
import DetailScreen from './pages/DetailSpaAdmin';
import HRScreen from './pages/AdminHRScreen';
import UpdateScreen from './pages/UpdateInforScreen';
import CreateBlogScreen from './pages/CreateBlogScreen';
import WatchBlog from './pages/WatchBlog';
import AdminBlog from './pages/AdminBlogScreen';
import UserBlogManager from './pages/UserBlogManager';
import HomeScreen from './pages/HomeScreen';
import BlogScreen from './pages/BlogScreen';
import LocationDetail from './pages/DetailScreen';
import CreateLocation from './pages/locationForm';
import ForgotPass from './pages/ForgotPass';
import ResetPass from './pages/ResetPassScreen';
import NotFound from './pages/NotFound';
function App() {
  function NoMatch() {
  
    return (
      <NotFound/>
    );
  }
  return (
    <div>
      <BrowserRouter>
          <Switch>
            <Route path='/admin' exact={true} component={AdminHomeScreen} />
            <Route path='/login' exact={true} component={LoginScreen} />
            <Route path='/' exact={true} component={HomeScreen} />
            <Route path='/user/update' exact={true} component={UpdateScreen} />
            <Route path='/admin/detail' component={DetailScreen} />
            <Route path='/admin/hr' component={HRScreen} />
            <Route path='/blog/createBlog' component={CreateBlogScreen} />
            <Route path='/see' component={WatchBlog} />
            <Route path='/admin/blog' component={AdminBlog} />
            <Route path='/blog/manager' component={UserBlogManager}/>
            <Route path='/blog' exact={true} component={BlogScreen}/>
            <Route path='/watch' component={LocationDetail}/>
            <Route path='/location/create' component={CreateLocation}/>
            <Route path='/forgot' component={ForgotPass}/>
            <Route path='/reset' component={ResetPass}/>
            <Route path='/abc' component={NotFound}/>
            <Route path="*">
            <NoMatch />
          </Route>
          </Switch>
      </BrowserRouter>

    </div> 
  )
}

export default App;
