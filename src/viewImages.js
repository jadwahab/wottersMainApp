import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Row, Col } from 'reactstrap';
import StackGrid, { transitions } from "react-stack-grid";
// import fetch from 'node-fetch'
const { scaleDown } = transitions;


class ViewImages extends Component {
    state = {
      a: {display: ''},
      b: {display: ''},
      c: {display: ''},
      items: [
        {
          hash: '7cbb',
          pubKey: '0x45623423',
          assignment: 'White hat, green sweater, devil sign',
          prevHash: '9ee3',
          imageHash: 'AAAA',
          timeStamp: '2018-01-01 12:31',
          active: true
      }, 
      {
          hash: '8a34',
          pubKey: '0x34524543',
          assignment: 'Green hat, red sweater, peace sign',
          prevHash: '9ee3',
          imageHash: '4805_110886908573_8281698_n',
          timeStamp: '2018-01-01 12:30',
          active: false
      }, 
      {
          hash: '9ee3',
          pubKey: '0x34452834',
          assignment: 'Blue hat, white sweater, o sign',
          prevHash: '6e3b',
          imageHash: '582069_10151283054588574_1283163895_n',
          timeStamp: '2018-01-01 12:12',
          active: false
      }
      ]
  }

  onYes(hash) {
    console.log('clicked')
    window.open('/about','_self')
  }

  onNo() {
    console.log('click no')
    window.open('/about','_self')
  }


  render() {
    const { items } = this.state
    console.log(items)
    return (
      <div className="App">
              <Row>
                <Col xs="6" sm="4"></Col>
                <Col >
                <div key={items[0].hash} style={items[0].statusThing}>
                <div className="card" style={{width: '18rem'}}>
                  <img className="card-img-top" src={`https://wotters.blob.core.windows.net/images/${items[0].imageHash}.jpg`} alt="Card image cap" />
                  <div className="card-body">
                    <h5 className="card-title">Challenge</h5>
                    <p className="card-text">{items[0].assignment}</p>
                    <Button block onClick={() => this.onYes(items[0].hash)} style={{marginRight: '30px'}} color="success">Yes</Button> 
                    <Button block onClick={() => this.onNo()} color="danger">No</Button>
                  </div>
                </div>
              </div>
              </Col>
              <Col xs="6" sm="4"></Col>
            </Row>
      </div>
    );
  }
}

export default ViewImages
