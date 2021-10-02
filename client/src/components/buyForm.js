import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import Countdown from './countdown';

const BuyForm = () => {
  
    return (
      <>
        <div className="container mx-auto p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
                <div className="card">
                    <figure>
                        <img src="https://picsum.photos/id/1005/400/250" className="rounded-lg shadow-lg" />
                    </figure> 
                </div>
                <div className="">
                    <div className="card shadow-2xl p-7">
                        <div className=""> 
                            <div className="text-center">
                                <h2 className="card-title">Title
                                    <div className="badge mx-2 badge-secondary">ONGOING</div>
                                </h2>
                            </div> 
                        </div>
                        <div className=""> 
                            <span>Artist - description</span>
                        </div>
                        <div className=""> 
                            <span>Owner + charity</span>
                        </div>
                        <div className=""> 
                            <span>Total supply token</span>
                        </div>

                        <div className="divider"></div> 

                        <div className="center-cnt">
                            <Countdown />
                        </div>


                        <form className="">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Pay</span>
                                    <span>Balance: X ETH</span>
                                </label> 
                                <div className="input-primary input-bordered">
                                    <input type="text" placeholder="0.0" className="input input-primary input-bordered" /> 
                                    <span className=""> ETH</span>
                                </div>
                            </div> 
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Receive</span>
                                    <span>Balance floor: X tokens</span>
                                </label> 
                                <div className="input-primary input-bordered">
                                    <input type="text" placeholder="0.0" className="input input-primary input-bordered" /> 
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
                                <button className="btn btn-secondary btn-wide">Donate</button>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
        </div>
      </>
    )
  }
  
  export default BuyForm;