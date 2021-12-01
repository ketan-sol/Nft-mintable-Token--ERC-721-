const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.API))
const Common = require('@ethereumjs/common')
const common =  new Common.default({ chain: 'ropsten' })
const Tx = require('@ethereumjs/tx').Transaction
const dotenv = require('dotenv')
dotenv.config()

const MyNft = require('./build/contracts/MyNft.json')
const address =  'contract address'
const account1 = 'public key'
const privateKey = process.env.KEY
let myContract = new web3.eth.Contract( MyNft.abi,address)

//console.log(JSON.stringify(MyNft.abi))



async function NftMint(tokenURI){
const nonce = await web3.eth.getTransactionCount(account1,'latest');
let data =   myContract.methods.safeMint(account1,tokenURI).encodeABI()


const rawTx = {
    nonce: nonce,
    from: account1,
    to: address, //contract address
    data: data,
    gasLimit: web3.utils.toHex(1000000) ,
    gasPrice: web3.utils.toHex(web3.utils.toWei('6', 'Gwei')),
    privateKey: privateKey,
}

const transaction =  new Tx(rawTx, {common})
const signedTx = transaction.sign(Buffer.from(privateKey,'hex'))
const serializedTx = signedTx.serialize()
console.log(serializedTx.toString('hex'))


web3.eth.net.isListening()
   .then(() => console.log('is connected'))
   .catch(e => console.log('Something went wrong'));

 web3.eth.sendSignedTransaction(
    `0x${serializedTx.toString('hex')}`
    
 ).on('receipt',console.log)

}

NftMint('tokenURI')