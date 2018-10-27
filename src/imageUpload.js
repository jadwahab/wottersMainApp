

import React, { Component } from 'react'
import './imageUpload.css'

class ViewUpload extends Component {

    removeUpload() {

    }

    readURL () {

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
            <div className="file-upload">
            <button className="file-add-btn" type="button" >Add Image</button>
            <div className="image-upload-wrap">
                <input id="fileinput" className="file-upload-input" type="file" onChange={this.readURL(this)} accept="image/*" />
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
            <button className="file-upload-btn" type=" button" id="list-button" onclick="GetListOfImages()" style={{marginTop: 20}}>List</button>
            </div>
            <div id="list_images" />
      </div>
    )
  }
}

export default ViewUpload