import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Container, Row, Col } from 'reactstrap';
import StackGrid, { transitions } from "react-stack-grid";
// import fetch from 'node-fetch'
const { scaleDown } = transitions;

const data = [
  {
      "hash": "7cbb",
      "pubKey": "0x45623423",
      "assignment": "White hat, green sweater, devil sign",
      "prevHash": "9ee3",
      "imageHash": "AAAA",
      "timeStamp": "2018-01-01 12:31"
  }, 
  {
      "hash": "8a34",
      "pubKey": "0x34524543",
      "assignment": "Green hat, red sweater, peace sign",
      "prevHash": "9ee3",
      "imageHash": "4805_110886908573_8281698_n",
      "timeStamp": "2018-01-01 12:30"
  }, 
  {
      "hash": "9ee3",
      "pubKey": "0x34452834",
      "assignment": "Blue hat, white sweater, o sign",
      "prevHash": "6e3b",
      "imageHash": "582069_10151283054588574_1283163895_n",
      "timeStamp": "2018-01-01 12:12"
  }
]


class ViewImages extends Component {

    state = {
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

  onYes() {
    console.log('click yes')
  }

  onNo() {
    console.log('click no')
  }

  render() {
    const { items } = this.state
    // console.log(items)
    return (
      <div className="App">
        <StackGrid
          columnWidth={300}
          appear={scaleDown.appear}
          appeared={scaleDown.appeared}
          enter={scaleDown.enter}
          entered={scaleDown.entered}
          leaved={scaleDown.leaved}
        >
        {
          items.map(({ hash, pubKey, assignment,prevHash, imageHash, timeStamp }) => {
            const status = {display: 'none'} 
            return (
              // <Row>
              //   <Col >
              
                <div onClick={() => {
                  console.log('you click')
                  this.setState({
                    items: items.map(o => ({
                      ...o,
                      active: o.hash === hash ? !o.active : o.active,
                    })),
                  });
                }}  key={hash} style={{marginButton: '2%', status}} className="boxes">
                <div className="card" style={{width: '18rem'}}>
                  <img className="card-img-top" src={`https://wotters.blob.core.windows.net/images/${imageHash}.jpg`} alt="Card image cap" />
                  <div className="card-body">
                    <h5 className="card-title">Challenge</h5>
                    <p className="card-text">{assignment}</p>
                    <Button block onClick={() => this.onYes()} style={{marginRight: '30px'}} color="success">Yes</Button> 
                    <Button block onClick={() => this.onNo()} color="danger">No</Button>
                  </div>
                </div>
              </div>
            //   </Col>
            // </Row>
            )
          })
        }   
        </StackGrid>
      </div>
    );
  }
}

export default ViewImages
