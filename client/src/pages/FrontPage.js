import React from 'react';
import { Link } from 'react-router-dom';
import ShowcaseAuctions from '../components/showcaseAuctions'

const FrontPage = () => {
  return (
    <>

    <div class="hero min-h-screen bg-primary">
  <div class="text-center hero-content text-primary-content">
    <div class="max-w-lg">
      <center><img class="mb-6" height="100" width="200" src="https://freight.cargo.site/t/thumbnail/w/100/i/7f7bbd305c0db77b741361e48b637588c0c47f141fcfb76be3e751b2adf3fff5/logo-heart-drops.svg" /></center>
      <img class="mt-6 mb-6" src="https://freight.cargo.site/t/thumbnail/w/100/i/887ac2e88349f644bf4718496c686b8d9101eb1b295bf3b0852f54e68dcf9d76/logotype-heart-drops.svg" />
      <p class="mb-5">
      A Decentralized Philanthropy (AKA “DePhi”) platform focused on bringing people together who want to make a difference in the world through life-changing NFT Drops.
          </p>
          <Link to="/auctions" className="btn bg-accent mr-2">Discover Heart Drops</Link>
          <Link to="/create" className="btn btn-secondary text-primary-content">Create an Heart Drops</Link>
    </div>
  </div>
</div>



    <ShowcaseAuctions />



    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">How it works</h2>
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-20">
          <div className="card lg:card-side bg-base-200">
            <div className="card-body">
              <p>The Heart Drops mission is to create an egalitarian and inclusive global community of Artists, Collectors and NGOs who want to bring about a better future using Fractionalized NFTs as the catalyst for change.</p>
            </div>
          </div>
          <div className="card lg:card-side bg-base-200">
            <div className="card-body">
              <p>Heart Drops was created as a platform where people could come together to make a difference. We believe that we are stronger together, and by setting the platform up as a Decentralized Autonomous Organization (DAO), we have the ability to put the power of positive change into many heartfelt hands.</p>
            </div>
          </div>
          <div className="card lg:card-side bg-base-200">
            <div className="card-body">
              <p>At Heart Drops we believe that every little bit helps, and everyone should have a chance to contribute to causes they feel passionate about. That is why we have focused on fractionalized NFTs using an ERC1155 smart contract to allow shared ownership of a one of a kind piece of art.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">Community Contributions</h2>
      <div className="container mx-auto p-5">
        <div className="w-full shadow stats">
          <div className="bg-primary stat place-items-center place-content-center">
            <div className="stat-title text-white">Our Charities</div>
            <div className="stat-value text-white">3</div>
          </div>
          <div className="bg-primary stat place-items-center place-content-center">
            <div className="stat-title text-white">Number of Heart Drop</div>
            <div className="stat-value text-white">4</div>
          </div>
          <div className="bg-primary stat place-items-center place-content-center">
            <div className="stat-title text-white">Total value distributed</div>
            <div className="stat-value text-white">120Ξ</div>
          </div>
        </div>
      </div>
    </div>

    <div className="py-5">
      <h2 className="my-5 text-5xl font-bold text-center">Get involved</h2>
      <div className="container mx-auto p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
          <div className="card shadow-2xl lg:card-side bg-accent text-secondary-content">
            <div className="card-body">
            <h2 className="text-xl font-bold">Artists, Donators & Collectors</h2>
            <p>We are so happy you want to be a part of the mission! We welcome the <a href="#">gifted artist</a>, <a href="#">generous donors</a> who already own a piece they want to give, and the <a href="#">collectors</a> who buy the incredible art and invest into a better the future.</p>

              <div className="justify-end card-actions">
                <button className="btn btn-secondary text-primary-content">
                      Learn more

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="card shadow-2xl lg:card-side bg-accent text-secondary-content">
            <div className="card-body">
            <h1 className="text-xl font-bold">Charities</h1>
            <p>Heart Drops is here to help you make the future a better place. Existing charties can find out how to get involved <a href="#">here</a>, and we’ll get you set up with our community DAO. Make sure that you have yourself set up with a <a href="#">Crypto Wallet</a> that will allow you to receive the funds raised for your cause.</p>

              <div className="justify-end card-actions">
                <button className="btn btn-secondary text-primary-content">
                      Learn more

                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 ml-2 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <br />
        <p><i>*Please note we do not work with any political groups or government organizations*</i></p>

      </div>
    </div>
    </>
  );
};

export default FrontPage;
