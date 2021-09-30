import React from 'react';
import { Link } from 'react-router-dom';

const FrontPage = () => {
  return (
    <>
    <div className="hero min-h-screen bg-base-200">
      <div className="flex-col hero-content lg:flex-row-reverse">
        <img src="https://picsum.photos/id/1005/600/600" className="max-w-sm rounded-lg shadow-2xl" /> 
        <div>
          <h1 className="mb-5 text-5xl font-bold">
            Heart Drops
          </h1> 
          <p className="mb-5">
            An NFT fractionalization platform that allows an art community to donate art, share art ownership, and raise funds for charities.
          </p>
          <Link  to="/auctions" className="btn btn-primary mr-2">Discover Heart Drops</Link>
          <Link  to="/create" className="btn btn-secondary">Create an Heart Drops</Link>
        </div>
      </div>
    </div>
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

export default FrontPage;
