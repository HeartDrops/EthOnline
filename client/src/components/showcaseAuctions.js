import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { ethers } from 'ethers';

const ShowcaseAuctions = () => {

    return (
        <>
            <div className="py-5">
                <div className="container mx-auto p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
                        <div className="card bordered shadow-2xl">
                            <figure>
                                <img src="https://picsum.photos/id/1005/400/250" />
                            </figure> 
                            <div className="card-body">
                                <h2 className="card-title">Top image
                                    <div className="badge mx-2 badge-secondary">ONGOING</div>
                                </h2> 
                                <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p> 
                                <div className="justify-end card-actions">
                                    <Link  to="/donate" className="btn btn-secondary">Donate</Link>
                                </div>
                            </div>
                        </div> 
                        <div className="card bordered shadow-2xl">
                            <figure>
                                <img src="https://picsum.photos/id/1005/400/250" />
                            </figure> 
                            <div className="card-body">
                                <h2 className="card-title">Top image
                                    <div className="badge mx-2 badge-secondary">ONGOING</div>
                                </h2> 
                                <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p> 
                                <div className="justify-end card-actions">
                                    <Link  to="/donate" className="btn btn-secondary">Donate</Link>
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
        </>
    );

};

export default ShowcaseAuctions;