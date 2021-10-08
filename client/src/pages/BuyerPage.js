import React, { useState, useEffect } from 'react';
import BuyForm from '../components/buyForm';
import Countdown from '../components/countdown';
import DB from '../db.json';

const BuyerPage = () => { 
    
    // info on auction selected
	const [charityID, setCharityID] = useState(null);
    
    useEffect(() => {
        
        // fetch data of charity
        setCharityID(0);

    });

  return (
    <>
        <div className="container mx-auto p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
                <div className="card shadow-2xl">
                    <figure>
                        <img src="https://picsum.photos/id/1005/400/250" className="shadow-lg" />
                    </figure> 
                    <div className="card-body">
                        <h2 className="card-title">Info on artist and NFT</h2> 
                        <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p> 
                        {/* <div className="justify-center card-actions">
                            <button className="btn btn-secondary">More info</button>
                        </div> */}
                    </div>
                </div>
                <div className="">
                    <div className="card shadow-2xl p-7">
                        <div className=""> 
                            <div className="text-center mb-2">
                                {DB.charities && DB.charities.length>0 && DB.charities.map((item) => item.id == charityID &&
                                <h2 className="card-title" key={item.id}>Donate to {item.name}
                                    <div className="badge mx-2 badge-secondary">ONGOING</div>
                                </h2>
                                )}
                            </div> 
                        </div>
                        <div className=""> 
                            {DB.charities && DB.charities.length>0 && DB.charities.map((item) => item.id == charityID &&
                                    <div className="mb-2" key={item.id}>
                                        <p>{item.description}</p>
                                    </div>
                                    )}
                            <div className="center-cnt my-3">
                                <a href="/donate#my-modal" className="btn btn-primary">More information on charity</a> 
                                <div id="my-modal" className="modal">
                                    <div className="modal-box">
                                        {DB.charities && DB.charities.length>0 && DB.charities.map((item) => item.id == charityID &&
                                        <div className="mb-2" key={item.id}>
                                            <p>{item.long_description}</p>
                                        </div>
                                        )}
                                        <div className="modal-action">
                                            <a href="/donate#" className="btn">Close</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="divider"></div> 

                        <div className="center-cnt mb-5">
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