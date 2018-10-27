import React, { Component } from "react";
import logo from "./logo.png";

import "./App.css";
let BITBOXSDK = require("bitbox-sdk/lib/bitbox-sdk").default;
let BITBOX = new BITBOXSDK({
  // restURL: 'https://rest.bitcoin.com/v1/' // -> change to mainnet
  restURL: 'https://trest.bitcoin.com/v1/'
});

/* --> remove different languages
let langs = [
  "english",
  "chinese_simplified",
  "chinese_traditional",
  "korean",
  "japanese",
  "french",
  "italian",
  "spanish"
];
let lang = langs[Math.floor(Math.random() * langs.length)];
*/

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
      mnemonic: mnemonic,
      // lang: lang, --> remove different languages
      hex: "",
      txid: ""
    };
  }

  componentDidMount() {
    BITBOX.Address.utxo(cashAddress).then(
      result => {
        if (!result[0]) {
          return;
        }

        // console.log(result);
        // return false;

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


        /* -> send to change address
        // add output w/ address and amount to send
        transactionBuilder.addOutput(cashAddress, sendAmount);
        */
     
        // OP_RETURN DATA
        // encode some text as a buffer
        let buf = new Buffer('BCHDEVON WINNERS: WOTTERS');
        // create array w/ OP_RETURN code and text buffer and encode
        let data = BITBOX.Script.encode([
        BITBOX.Script.opcodes.OP_RETURN,
        Buffer.from('00574f54', 'hex'),
        buf
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
      },
      err => {
        console.log(err);
      }
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">WOTTERS</h1>
        </header>
        <div className="App-content">
          <h2>BIP44 $BCH Wallet</h2>
          <h3>256 bit BIP39 Mnemonic:</h3> <p>{this.state.mnemonic}</p>

          <h3>Output transaction raw hex</h3>
          <p>{this.state.hex}</p>
          <h3>Output transaction ID</h3>
          <p>{this.state.txid}</p>
        </div>
      </div>
    );
  }
}

export default App;
