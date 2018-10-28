import React from 'react';

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

class ChainIDForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        value: '',
        mnemonic: mnemonic,
        hex: "",
        txid: "",
        imageHash: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async getImageHash(result, cID) {
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
              let imageHash = BITBOX.Crypto.sha256(response);
              let buff = Buffer.from(imageHash);
              let buffHex = '';
              for (let index = 0; index < buff.length; index++) {
                // ugly hack
                let i = buff[index].toString(16);
                if (i<9) {
                  buffHex = buffHex + '0' + i;
                }
                else {
                  buffHex = buffHex + i;
                }
              }
              this.setState({
                imageHash: buffHex
              });

              console.log("ASDASDADA")
              console.log(typeof parseInt(cID))
              console.log(typeof parseInt(cID).toString(16))
              
              let prefix = Buffer.from('00574f54', 'hex');
              
              let buffCID = new Buffer(parseInt(cID).toString(16), 'hex');
              
              console.log("ASDASDADA")
              console.log(buffCID)

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

              console.log('image hash');
              console.log(this.state.imageHash);
              
              console.log('txid');
              console.log(this.state.txid);
          }
      )
      .catch(
          (error) => {
              console.log(error); //Exepection error....
          }
      )
    }

  handleChange(event) {
    this.setState({value: event.target.value});
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
      <form onSubmit={this.handleSubmit}>
        <label>
          ChainID:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default ChainIDForm;