

import React, { Component } from 'react'
import './imageUpload.css'
import { Row, Col } from 'reactstrap';
import AzureStorage from './libs/azure'

// var azure = require('azure-storage')
// var blobService = azure.createBlobService();
// const accountName = 'wotters'
// const accountKey = 'c2U9MjA5OS0wMS0wMSZzcD1yd2RsYWMmc3Y9MjAxOC0wMy0yOCZzcz1iJnNydD1zY28mc2lnPVRyZTBiVC9rczhTUDAxQjdLQWlnSTFkaDV3OVJZU2hVbmlJelcwSG5hZEklM0Q='

// var blobService = azure.createBlobService(accountName, accountKey);

class ViewUpload extends Component {
    constructor(){
        super()
        this.state = {
            file: ''
        }
    }

    removeUpload() {

    }

    readURL (file) {
        // blobService.createAppendBlobFromText('json', 'test', '{ "test": true }', (error, result) => {
        //     if(error) {
        //     // Handle blob error
        //     } else {
        //     console.log('Upload is successful');
        //     }});

        // console.log(file)
        // const account = {
        //     name: "wotters",
        //     sas:  "se=2099-01-01&sp=rwdlac&sv=2018-03-28&ss=b&srt=sco&sig=Tre0bT/ks8SP01B7KAigI1dh5w9RYShUniIzW0HnadI%3D"
        // };
        // const blobUri = 'https://' + account.name + '.blob.core.windows.net';
        // const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, account.sas);

        // blobService.createBlockBlobFromBrowserFile('images', 
        // file.name, 
        // file, 
        // (error, result) => {
        //     if(error) {
        //         // Handle blob error
        //     } else {
        //         console.log('Upload is successful');
        //     }
        // });
        // fs.writeFile('test.jpg', image, (err) => {  
        //     // throws an error, you could also catch it here
        //     if (err) throw err;
        
        //     // success case, the file was saved
        //     console.log('Lyric saved!');
        // });
        // blobService.createBlockBlobFromLocalFile('fileinput', 'taskblob', 'task1-upload.jpg', function(error, result, response) {
        //     console.log(result)
        //     if (!error) {
        //         console.log(error)
        //       // file uploaded
        //     }
        //   });

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
            <Col xs="6" sm="4"></Col>
                <Col xs="6" sm="4">
                <h2>Challange</h2>
                <p>make a picture with</p>
                </Col>
            <Col xs="6" sm="4"></Col>
            </Row>
            <Row>
            <Col xs="6" sm="4"></Col>
                <Col xs="6" sm="4">
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
            <div className="file-list">
            <button className="file-upload-btn" type=" button" id="list-button" style={{marginTop: 20}}>List</button>
            </div>
            <div id="list_images" />



                </Col>
            <Col xs="6" sm="4"></Col>
            </Row>
        
      </div>
    )
  }
}

export default ViewUpload