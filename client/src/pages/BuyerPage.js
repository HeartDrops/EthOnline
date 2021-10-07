import React from 'react';
import BuyForm from '../components/buyForm';
import Countdown from '../components/countdown';

const BuyerPage = () => { 

    const supplyToken = 250; // total nb of supply token
    // get information on artists + charity 

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
                            <div className="text-center">
                                <h2 className="card-title">Donate to charity X
                                    <div className="badge mx-2 badge-secondary">ONGOING</div>
                                </h2>
                            </div> 
                        </div>
                        <div className=""> 
                            <div>Information on charity</div>
                            <div className="center-cnt">
                                <a href="/donate#my-modal" className="btn btn-primary">More information on charity</a> 
                                <div id="my-modal" className="modal">
                                    <div className="modal-box">
                                        <p>Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut adipisci qui iusto illo eaque. Consequatur repudiandae et. Nulla ea quasi eligendi. Saepe velit autem minima.</p> 
                                        <div className="modal-action">
                                            <a href="/donate#" className="btn">Close</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className=""> 
                            <span>Total supply token : {supplyToken} $TOKEN</span>
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