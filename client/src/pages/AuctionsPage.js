import React from 'react';
import ShowcaseAuctions from '../components/showcaseAuctions';

const AuctionsPage = () => {
  return (
    <>
      <h2 className="title text-4xl mb-8 my-10 mx-auto text-center font-bold text-purple-700">Current Heart Drops</h2>
      <ShowcaseAuctions/>
      <ShowcaseAuctions/>
    </>
    );
};

export default AuctionsPage;