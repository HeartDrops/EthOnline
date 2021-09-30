import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';

const ShowcaseAuctions = () => {

    return (
        <>
            <div className="">
                <h2 className="m-5 text-5xl font-bold text-center">Current Heart Drops</h2>
                <div className="grid grid-cols-12">
                    <div className="col-start-2 col-end-6">
                    <div className="card bordered">
                        <figure>
                        <img src="https://picsum.photos/id/1005/400/250" />
                        </figure> 
                        <div className="card-body">
                        <h2 className="card-title">Top image
                            <div className="badge mx-2 badge-secondary">ONGOING</div>
                        </h2> 
                        <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p> 
                        <div className="justify-end card-actions">
                            <Link  to="/" className="btn btn-secondary">Donate</Link>
                        </div>
                        </div>
                    </div> 
                    </div>
                    <div className="col-start-7 col-span-4">
                    <div className="card bordered">
                        <figure>
                        <img src="https://picsum.photos/id/1005/400/250" />
                        </figure> 
                        <div className="card-body">
                        <h2 className="card-title">Top image
                            <div className="badge mx-2 badge-secondary">ONGOING</div>
                        </h2> 
                        <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus veritatis sed molestiae voluptates incidunt iure sapiente.</p> 
                        <div className="justify-end card-actions">
                            <Link  to="/" className="btn btn-secondary">Donate</Link>
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