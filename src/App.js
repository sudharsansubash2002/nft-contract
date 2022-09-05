// Importing modules
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import { Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {tokenaddress1,abi1} from "./abi";
import {tokenaddress2,abi2} from "./abi";
import web3 from "./web3";
import {useRef} from "react";
import {useAdd} from "react";


function App() {

// usetstate for storing and retrieving wallet details
const [data, setdata] = useState({
	address: "",
	Balance: null,
});
const [token_name, settokenname] = useState("");
const[total_supply,settotalsupply]=useState("");
const[symbol_,setsymbol]=useState("");
const[decimals_,setdecimals]=useState("");
const[amount,setAmount]=useState("");
const inputamt=useRef(null);
const inputadd=useRef(null);
const inputid=useRef(null);
const inputid2=useRef(null);

const erc20contract = new web3.eth.Contract(abi1, tokenaddress1);
const nftcontract = new web3.eth.Contract(abi2, tokenaddress2);
const senderAddress = "0x0493EC6235E53753BD812871f259842Bf2676Dd6";



// Button handler button for handling a
// request event for metamask
const btnhandler = () => {

	// Asking if metamask is already present or not
	if (window.ethereum) {

	// res[0] for fetching a first wallet
	window.ethereum
		.request({ method: "eth_requestAccounts" })
		.then((res) => accountChangeHandler(res[0]));
	} else {
	alert("install metamask extension!!");
	}
};
const mint = async(minterAddress,val)=>{
    console.log("Transfering....",val);
	console.log("Transfering to....",minterAddress);
    const accounts = await  web3.eth.getAccounts();
    await nftcontract.methods.safeMint(minterAddress,web3.utils.toBN(val*1000000000000000000)).send({from:accounts[0]});
    
  }
  function handle() {
    console.log(inputamt.current.value);
	console.log(inputadd.current.value);
    let f=inputamt.current.value;
	let d=inputadd.current.value;
    setAmount(f*1000000000000000000);
    mint(d,f);
  }

// getbalance function for getting a balance in
// a right format with help of ethers
const getbalance = (address) => {

	// Requesting balance method
	window.ethereum
	.request({
		method: "eth_getBalance",
		params: [address, "latest"]
	})
	.then((balance) => {
		// Setting balance
		setdata({
		Balance: ethers.utils.formatEther(balance),
		});
	});
};

// Function for getting handling all events
const accountChangeHandler = (account) => {
	// Setting an address data
	setdata({
	address: account,
	});

	// Setting a balance
	getbalance(account);
};
const tokenname = async()=>{
	let a = await erc20contract.methods.name().call();
	settokenname(a);
	// console.log("name",a)
	  }
	useEffect(()=>{tokenname()});

const totalSupply = async()=>{
	let b = await erc20contract.methods.totalSupply().call();
	  settotalsupply(b);
	  }
	  useEffect(()=>{totalSupply()});
const symbol = async()=>{
	let c = await erc20contract.methods.symbol().call();
		setsymbol(c);
		}
		useEffect(()=>{symbol()});
const decimals = async()=>{
	let d = await erc20contract.methods.decimals().call();
		setdecimals(d);
		}
		useEffect(()=>{decimals()});	  	
		const approve = async()=>{
			const accounts = await  web3.eth.getAccounts();
			await erc20contract.methods.approve("0xb08d517d7AA78588Ec0966FfCD7b4a2bc011142B",web3.utils.toBN(10000000000000000000)).send({from:accounts[0]});
		  }
const sell = async(tokenid)=>{
	const accounts = await  web3.eth.getAccounts();
    await nftcontract.methods.sell(tokenid).send({from:accounts[0]});
}

function handle2() {
    console.log(inputid.current.value);
	
	let e=inputid.current.value;
    sell(e);
  }

  const buy = async(tokenid2)=>{
	const accounts = await  web3.eth.getAccounts();
    await nftcontract.methods.buy(tokenid2).send({from:accounts[0]});
}

function handle3() {
    console.log(inputid2.current.value);
	
	let f=inputid2.current.value;
    buy(f);
  }

			

	  
	

return (
	<div className="App">
	{/* Calling all values which we
	have stored in usestate */}

	<Card className="text-center">
		<Card.Header>
		<strong>Address: </strong>
		{data.address}
		</Card.Header>
		<Card.Body>
		<Card.Text>
			<strong>Balance: </strong>
			{data.Balance}
		</Card.Text>
		<Button onClick={btnhandler} variant="primary">
			Connect to wallet
		</Button>
		
		
		<br/>
		<p>Token Name:{token_name}</p>
		<p>Total supply:{total_supply}</p>
		<p>Symbol:{symbol_}</p>
		<p>decimals:{decimals_}</p>

		<br/>
		<br/>
		<Button onClick={approve} >
		approve
		</Button><br/><br/>
		<h2>Mint NFT</h2>
		<label>Address</label>&nbsp;&nbsp;<input ref={inputadd} 
		type="text" 
		id="add" 
		name="add" placeholder='enter the address'/>
     <br/><br/>
		
     <label>NFT Amount</label>&nbsp;&nbsp;<input ref={inputamt}
        type="text"
        id="amt"
        name="amt"/>&nbsp;&nbsp;
     <button onClick={handle}>Mint</button>
     <p>{amount}</p>
	 <br/><br/>
	 <h2>Sell Nft</h2>
	 <label>TokenID</label>&nbsp;&nbsp;<input ref={inputid}
        type="text"
        id="id"
        name="id"/>&nbsp;&nbsp;
     <button onClick={handle2}>Sell</button>
	 <br/><br/>
	 <h2>Buy Nft</h2>
	 <label>TokenID</label>&nbsp;&nbsp;<input ref={inputid2}
        type="text"
        id="id2"
        name="id2"/>&nbsp;&nbsp;
     <button onClick={handle3}>Buy</button>

		
		</Card.Body>
	</Card>
	</div>
);
}

export default App;

