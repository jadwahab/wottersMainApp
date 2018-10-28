import React, { Component } from "react";
import fetch from 'isomorphic-fetch';

import "./App.css";

const image2base64 = require('image-to-base64');

let BITBOXSDK = require("bitbox-sdk/lib/bitbox-sdk").default;
let BITBOX = new BITBOXSDK({
  // restURL: 'https://rest.bitcoin.com/v1/' // -> change to mainnet
  restURL: 'https://trest.bitcoin.com/v1/'
});

// create 256 bit BIP39 mnemonic
// let mnemonic = BITBOX.Mnemonic.generate(256, BITBOX.Mnemonic.wordLists()[lang]); --> remove different languages
let mnemonic = "abuse river unaware denial lake wagon slice rigid airport pool system arena slide foot install window goddess change glove hamster solar wave void tray";

// root seed buffer
let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic);

// master HDNode
// let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "bitcoincash"); // -> change to mainnet
let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "testnet"); 

// HDNode of BIP44 account
let account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

// derive the first external change address HDNode which is going to spend utxo
let change = BITBOX.HDNode.derivePath(account, "0/0");

// get the cash address
let cashAddress = BITBOX.HDNode.toCashAddress(change);


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      height: '',
      mnemonic: mnemonic,
      hex: "",
      txid: "",
      imageHash: "",
      result: [{},{}]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeH = this.handleChangeH.bind(this)
  }

  result() {
    const array = this.state.result
    let array2 = []
    for (let items of array) {
      let hex = items.script_hex
      if (hex){
        let fromAsm = BITBOX.Script.fromASM(hex)
        let decoded = BITBOX.Script.decode(fromAsm)
        array2.push(decoded[0].toString('ascii'))
      }
    }
    return (
      <div>
      {array2.map((list) => {
        return (
          <p>{list}</p>
        )
      })}
      </div>
    )
   
  }

  async getWOTTxs() {
    try {
      let response = await fetch(`https://api.blockchair.com/bitcoin-cash/outputs?q=script_hex(^6a0400574f54)#`);
      response = await response.json();
      // console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      console.warn(`Call to API was unsuccessful`);
      return null;
    }
  }
  
  // const getWOTTxs = async (CID) => {
  //   try {
  //     let response = await fetch(`https://api.blockchair.com/bitcoin-cash/outputs?q=script_hex(^6a0400574f54${CID})#`);
  //     response = await response.json();
  //     // console.log(response);
  //     return response;
  //   } catch (err) {
  //     console.log(err);
  //     console.warn(`Call to API was unsuccessful`);
  //     return null;
  //   }
  // };
  

  async getImageHash(result) {
    // instance of transaction builder
    // let transactionBuilder = new BITBOX.TransactionBuilder("bitcoincash"); // -> change to mainnet
    let transactionBuilder = new BITBOX.TransactionBuilder("testnet");
    // original amount of satoshis in vin
    let originalAmount = result[0].satoshis;

    // index of vout
    let vout = result[0].vout;
    
    // txid of vout
    let txid = result[0].txid;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // get byte count to calculate fee. paying 1 sat/byte
    let byteCount = BITBOX.BitcoinCash.getByteCount(
      { P2PKH: 1 },
      { P2PKH: 3 }
    );
    // 192
    // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
    let sendAmount = originalAmount - byteCount;


      image2base64("./logo.png")
      .then(
          (response) => {
            // image

            let cID = this.state.value.toString()
            let h = this.state.height.toString()

            let buffImgHex = cID+h+response;

              let imageHash = BITBOX.Crypto.ripemd160(buffImgHex);
              let buff = Buffer.from(imageHash);

              for (let index = 0; index < buff.length; index++) {
                // ugly hack
                let i = buff[index].toString(16);
                if (i<9) {
                  buffImgHex = buffImgHex + '0' + i;
                }
                else {
                  buffImgHex = buffImgHex + i;
                }
              }
              this.setState({
                imageHash: buffImgHex
              });

              let prefix = Buffer.from('00574f54', 'hex');

              // entered value is in decimal and posted to the blockchain in hex
              let CID, buffCID;
              // for some reason CID can't be less than 16 or else becomes undefined
              if (this.state.value < 16) {
                CID = this.state.value
                buffCID = new Buffer (CID);
              } else {
                CID = parseInt(this.state.value).toString(16);
                buffCID = Buffer.from(CID, 'hex');
              }

              let H, buffH;
              // for some reason CID can't be less than 16 or else becomes undefined
              if (this.state.height < 16) {
                H = this.state.height
                buffH = new Buffer (H);
              } else {
                H = parseInt(this.state.value).toString(16);
                buffH = Buffer.from(H, 'hex');
              }

              console.log(prefix)
              console.log(buffCID)
              console.log(buffH)
              console.log(buff)

              // create array w/ OP_RETURN code and text buffer and encode
              let data = BITBOX.Script.encode([
              BITBOX.Script.opcodes.OP_RETURN,
              prefix,
              buffCID,
              buff
              ])

              // add encoded data as output and send 0 satoshis
              transactionBuilder.addOutput(data, 0);
              transactionBuilder.addOutput(cashAddress, sendAmount);
              console.log("Satoshis spent: " + byteCount);

              // keypair
              let keyPair = BITBOX.HDNode.toKeyPair(change);

              // sign w/ HDNode
              let redeemScript;
              transactionBuilder.sign(
                0,
                keyPair,
                redeemScript,
                transactionBuilder.hashTypes.SIGHASH_ALL,
                originalAmount
              );

              // build tx
              let tx = transactionBuilder.build();
              // output rawhex
              let hex = tx.toHex();
              this.setState({
                hex: hex
              });

              // sendRawTransaction to running BCH node
              BITBOX.RawTransactions.sendRawTransaction(hex).then(
                result => {
                  this.setState({
                    txid: result
                  });
                },
                err => {
                  console.log(err);
                }
              );

              console.log(`BIP44 Account: m/44'/145'/0'`);
              console.log(`BIP44 external change addresses:`);
              let addresses = [];
              for (let i = 0; i < 10; i++) {
                let account = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
                addresses.push(BITBOX.HDNode.toCashAddress(account));
              }
              console.log(addresses);
          }
      ).then(async(result) => {
        const data = await this.getWOTTxs(result)
        console.log(data)
        this.setState({result: data.data})
      })
      // .catch(
      //     (error) => {
      //         console.log(error); //Exepection error....
      //     }
      // )
    }

  async componentDidMount() {
    BITBOX.Address.utxo(cashAddress).then(
      async (result) => {
        if (!result[0]) {
          return;
        }
        // console.log(result);
        // return false;

      },
      err => {
        console.log(err);
      }
    );
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }
  handleChangeH(event) {
    this.setState({height: event.target.value});
  }

  handleSubmit(event) {
    // alert('A name was submitted: ' + this.state.value);
    BITBOX.Address.utxo(cashAddress).then(
        async (result) => {
          if (!result[0]) {
            return;
          } 
          
          await this.getImageHash(result, this.state.value)
        },
        err => {
          console.log(err);
        }
      );
    event.preventDefault();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">WOTTERS</h1>
        </header>
        <div className="App-content">
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="ChainID"/>
              <input type="text" value={this.state.height} onChange={this.handleChangeH} placeholder="Height"/>
            </label>
            <input type="submit" value="Submit" />
          </form>
          <h2>BIP44 $BCH Wallet</h2>
          <h3>256 bit BIP39 Mnemonic:</h3> <p>{this.state.mnemonic}</p>

          <h3>Output image hash in hex:</h3>
          <p>{this.state.imageHash}</p>

          {/* <h3>Output transaction raw hex</h3>
          <p>{this.state.hex}</p> */}

          <h3>Output transaction ID:</h3>
          <p>{this.state.txid}</p>

          <h3>List of WOT transactions:</h3>
          {/* {this.state.result.map((list) => {
          return (
              <p>{list.block_id}</p>
            )
          })} */}
          {this.result()}
         
        </div>
      </div>
    );
  }
}

export default App;
