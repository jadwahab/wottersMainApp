import React, { Component } from 'react'
import './imageUpload.css'
import { Row, Col, Image } from 'reactstrap';
import { Base64 } from 'js-base64';
import {createBlobServiceWithSas} from './libs/azure'
import App from './bitboxFunc'
const image2base64 = require('image-to-base64');


const account = {
    name: "wotters",
    sas:  "se=2099-01-01&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=Tre0bT/ks8SP01B7KAigI1dh5w9RYShUniIzW0HnadI%3D"
};

let BITBOXSDK = require("bitbox-sdk/lib/bitbox-sdk").default;
let BITBOX = new BITBOXSDK({
  // restURL: 'https://rest.bitcoin.com/v1/' // -> change to mainnet
  restURL: 'https://trest.bitcoin.com/v1/'
});



class ViewUpload extends Component {
    constructor(){
        super()
        this.state = {
            file: ''
        }
    }

    removeUpload() {
    }

    async readURL (file) {
        // console.log(file)
        let url = URL.createObjectURL(file)
        const blobUri = 'https://' + account.name + '.blob.core.windows.net';
        const blobService = createBlobServiceWithSas(blobUri, account.sas);

        var reader = new FileReader();
        
        reader.onload = function() {
            var arrayBuffer = this.result,
            array = new Uint8Array(arrayBuffer),
            binaryString = String.fromCharCode.apply(null, array);

            //console.log("binaryString:" + binaryString);

            console.log("content hash:" + BITBOX.Crypto.sha256(binaryString));
            console.log("file hash:" + BITBOX.Crypto.sha256(file));

            console.log("content hash 2:" + BITBOX.Crypto.sha256(binaryString));
            console.log("file hash 2:" + BITBOX.Crypto.sha256(file));    
            // const hashedName = `${BITBOX.Crypto.sha256(file)}`
            const base64FileString = Base64.encode(binaryString)
            const base64FileName = Base64.encode(BITBOX.Crypto.sha256(file))
            
            // console.log(hashedName)
            console.log(base64FileString)
            blobService.createAppendBlobFromText('json', base64FileName, base64FileString, (error, result) => {
                if(error) {
                // Handle blob error
                } else {
                console.log('Upload is successful');
                window.open('/about', '_self')
            }});
        }
        reader.readAsArrayBuffer(file);
 
    }

    onClick() {
       const itWorks = "$('.file-upload-input').trigger( 'click' )"
    }

    UploadImage() {
        
    }
    
  render() {
    return (
        <div>
            <title>W3.CSS Template</title>
            <meta charSet="UTF-8" />  
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="./css/styles.css" />
 
            <Row>
            <Col xs="4" sm="4">
                <App />
            </Col>
        

            <Col xs="4" sm="4">
            {/* <img src="https://wotters.blob.core.windows.net/images/AAAA.jpg" width='200px' alt="Italian Trulli"></img> */}
            {/* <img scr='' /> */}
                {/* <Col xs="6" sm="4"> */}
                <div className="file-upload">
            {/* <button className="file-add-btn" type="button" >Add Image</button> */}
            <div className="image-upload-wrap">
                <input id="fileinput" className="file-upload-input" type="file" onChange={(image) => this.readURL(image.target.files[0])} accept="image/*" />
                <div className="drag-text">
                <h3>Drag and drop a file or select add Image</h3>
                </div>
            </div>
            <div className="file-upload-content">
                <img className="file-upload-image" src="#" alt="your image" />
                <div className="image-title-wrap">
                <button className="file-upload-btn marg_bottom " type="button" onClick={this.UploadImage()} >Upload Image</button> 
                <button type="button" onClick={this.removeUpload()} className="remove-image">Remove <span className="image-title">Uploaded Image</span></button>
                </div>
            </div>
            <div>
                <label id="response">
                </label>
            </div>
            </div>    
            {/* <div className="file-list">
            <button className="file-upload-btn" type=" button" id="list-button" style={{marginTop: 20}}>List</button>
            </div> */}
            <div id="list_images" />

</Col>

                {/* </Col> */}
            {/* <Col xs="6" sm="4"></Col> */}
            </Row>
        
      </div>
    )
  }
}

export default ViewUpload