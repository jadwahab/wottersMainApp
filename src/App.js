import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Row, Col } from 'reactstrap';
import './landing.css'
// import StackGrid, { transitions } from "react-stack-grid";
import ViewImages  from './viewImages'
import ImageUpload from './imageUpload'
import Bitbox from './bitboxFunc'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// using ES6 modules
// import { Router, Route, Switch } from 'react-router'
//
const Index = () => <ViewImages />;
const About = () => <ImageUpload />;
const Users = () => <Bitbox />;

const AppRouter = () => (
  <Router>
    <div>
      {/* <nav pills>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about/">About</Link>
          </li>
          <li>
            <Link to="/users/">Users</Link>
          </li>
        </ul>
      </nav> */}

      <Route path="/" exact component={Index} />
      <Route path="/about/" component={About} />
      <Route path="/users/" component={Users} />
    </div>
  </Router>
);

export default AppRouter;


