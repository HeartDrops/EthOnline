import React from 'react';
import BuyForm from '../components/buyForm';
import Countdown from '../components/countdown';

const BuyerPage = () => { 
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

                        <BuyForm />

                    </div>


                </div>
            </div>
        </div>
    </>
    );
};

export default BuyerPage;