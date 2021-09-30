import React from 'react';
import { Link } from 'react-router-dom';
import ShowcaseAuctions from '../components/showcaseAuctions'

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
    <ShowcaseAuctions />
    </>
  );
};

export default FrontPage;
