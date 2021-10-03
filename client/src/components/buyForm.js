import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import Connect from './connect';
import { ethers } from 'ethers';
import Web3Modal from "web3modal";
import GenericERC20ABI from '../../../build/contracts/Erc20.json';


const BuyForm = () => { 

    const [connected, setConnected] = useState(false);
    const [balance, setBalance] = useState(0);
    const [valueTokens, setValueTokens] = useState(null);
    const [errors, setErrors] = useState(null); 
    const [timer, setTimer] = useState(null);
    const [transactionSucceeded, setTransactionSucceeded] = useState(null);


    useEffect(() => {

        async function getUserInfo() {
            if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {

                // Web3 browser user detected. You can now use the provider.
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
                // const curProvider = window['ethereum'] || window.web3.currentProvider
                const provider = new ethers.providers.Web3Provider(window.ethereum);
            
                // console.log('accounts: ', accounts);
                // console.log('provider: ', provider);
            
                const signer = provider.getSigner();
                // console.log('signer:', signer);
    
                setConnected(true);
    
                signer.getAddress().then((address) => {
                    // console.log('address', address);
                    return provider.getBalance(address);
                  }).then((rawBalance) => {
                    // console.log(rawBalance);
                    const value = parseFloat(ethers.utils.formatEther(rawBalance));
                    // console.log('balance:', value);
                    setBalance(value);
                  });    
                // const test = provider.getGasPrice();
                // console.log('gas price:', test);
            }
          }
          getUserInfo();
      });

    const changeInputETH = (e) => {

        setErrors(null);
        setValueTokens(null);

        if (timer) {
            clearTimeout(timer);
            setTimer(null);
        }
        setTimer(
            setTimeout(() => {
                // console.log('input has changed');
                // console.log('value entered : ', e.target.value);

                // Check if input is a number
                const pattern = /^(0|[1-9]\d*)(\.\d+)?$/; // check if number 
                const ETHamount = e.target.value;

                if(pattern.test(ETHamount)){
                    // input is a number
                    // console.log('c 1 un nombre');
        
                    // check that amount is covered by wallet of user
                    if (balance > 0 && ETHamount > balance) {
                        // console.log('oops you don\' have enough in your wallet');
                        const newError = 'Oops ! You don\' have enough in your wallet';
                        setErrors(newError);

                        // mais calculer quand même combien ça vaut 
                    } else {
                        // console.log('you have enough in your wallet');

                        setValueTokens('new amount of tokens');
                        
                        // calculate estimated fees
                        // check wallet has enough
        
                        // calculate implied valuation
                        // calculate donation amount to charity
                    }
        
                } else {
                    // input is not a number
                    // console.log('PAS un nombre');
                    const newError = 'Please enter a decimal number';
                    setErrors(newError);
                }

            }, 1000)
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('form submitted');

        // 1. check that all variables are ok

        // 2. effectuer la transaction 

        // 3. check that transaction was complete
        // and get nb of TOKENS owned + amount donated to charity

        // 4. show conclusion page 
        setTransactionSucceeded(true);
    };
  
    return (
      <>
      { !transactionSucceeded ? 
        <form className="" onSubmit={handleSubmit}>
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Pay</span>
                    <span>Balance: {balance} ETH</span>
                </label> 
                <div>
                    <input type="text" placeholder="0.0" className="input input-primary input-bordered" required inputMode="decimal" pattern="^\d*[.,]?\d*$" onChange={changeInputETH} /> 
                    <span className=""> ETH</span>
                </div>
                { errors ? 
                    <div className="alert alert-error">
                        <div className="flex-1">
                            <label>{errors}</label>
                        </div>
                    </div>
                    : ''
                }
            </div> 
            <div className="form-control">
                <label className="label">
                    <span className="label-text">Receive</span>
                    <span>Balance floor: X tokens</span>
                </label> 
                <div className="input-primary input-bordered">
                    <input type="text" placeholder="0.0" value={valueTokens || ''} className="input input-primary input-bordered" disabled="disabled" inputMode="decimal" /> 
                    <span className=""> $TOKENS</span>
                </div>
            </div> 
            <div className="py-2">
                <span>Estimated fees: X$</span>
            </div>
            <div className="py-2">
                <span>Min. received: X$</span>
            </div>
            <div className="py-2">
                <span>Implied valuation: X$</span>
            </div>
            <div className="py-2">
                <span>Donation amount to charity: X$</span>
            </div>
            <div className="center-cnt py-2">
                    { connected ? <button className="btn btn-secondary btn-wide">Donate</button>
                        : <Connect /> 
                    }
                
            </div>
        </form>
        : 
            <div>
                <div className="py-3 text-center">Congratulations ! You now own XX $TOKENS</div>
                <div className="py-3 text-center">You donated YYY ETH to CHARITY_NAME</div>
                <div className="center-cnt py-2">
                    <button className="btn btn-secondary btn-wide">Share</button>
                </div>
            </div>
        
        
        }

      </>
    )
  }
  
  export default BuyForm;