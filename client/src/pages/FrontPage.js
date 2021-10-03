import React from 'react';
import { Link } from 'react-router-dom';
import ShowcaseAuctions from '../components/showcaseAuctions'

const FrontPage = () => {
  return (
    <>
    <div className="hero bg-base-200 py-5">
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

    <ShowcaseAuctions />

    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">How it works</h2>
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-20">
          <div class="card shadow-2xl lg:card-side bg-primary text-primary-content">
            <div class="card-body">
              <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p> 
            </div>
          </div> 
          <div class="card shadow-2xl lg:card-side bg-secondary text-secondary-content">
            <div class="card-body">
              <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p> 
            </div>
          </div>
          <div class="card shadow-2xl lg:card-side bg-accent text-secondary-accent">
            <div class="card-body">
              <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Rerum reiciendis beatae tenetur excepturi aut pariatur est eos.</p> 
            </div>
          </div> 
        </div>
      </div>
    </div>
    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">Get involved</h2>
      <div className="container mx-auto p-5"></div>
    </div>
    </>
  );
};

export default FrontPage;
