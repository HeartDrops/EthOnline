import React from 'react';

const ArtistsPage = () => {
  return (
    <>
    <div className="py-5">
        <h2 className="my-5 text-5xl font-bold text-center">About HEART DROPS</h2>
        <div className="container mx-auto p-5">

          <div className="bg-white shadow-lg rounded-3xl p-8 mb-5">
            <h3 className="font-bold text-xl mb-1">Where does the money go?</h3>
            <p>Great Question! We thought long and hard about the best breakdown of the funds, and who decides where they go. First, each digital asset has been generously donated by an extremely talented artist/collector/content creator. We want to recognize their amazing contributions by giving back 5% as a thank you. Second, the only other funds we use are to cover the gas fees, and we do our best to make sure those are as minimal as possible to ensure the maximum amount goes to the NGOs (Non-Government Organization).</p>
          </div>

          <div className="bg-white shadow-lg rounded-3xl p-8 mb-5">
            <h3 className="font-bold text-xl mb-1">How do I get involved?</h3>
            <p>We are so happy you want to be a part of the mission! We welcome the gifted artist, generous donors who already own a piece they want to give [LINK], and the collectors who buy the incredible art and invest into a better the future. <a href="#">Learn more...</a></p>
          </div>
          
          <div className="bg-white shadow-lg rounded-3xl p-8 mb-5">
            <h3 className="font-bold text-xl mb-1">So… who decides on the charity or NGO?</h3>
            <p>We all have passions for different causes, and at Heart Drops, we want to make sure everyone’s voice is heard. That is why we (Heart Drops) decided that we (Heart Drops) don’t make the decisions. Rather, WE, the global <a href="https://discord.gg/hxpphqev">community</a> involved in Heart Drops come together to vote on where the raised funds go. This helps to make sure that nobody’s specific interests get special treatment, and it also helps prevent instances of fraud that can be found in a traditional fundraising method. That being said, we understand that an Artist or Donor might want to contribute to a particular cause, so we give them the ability to select the donation category and/or charity they would like to endorse.</p>
          </div>

          <div className="bg-white shadow-lg rounded-3xl p-8 mb-5">
            <h3 className="font-bold text-xl mb-1">I represent a Charity/NGO, how do I get involved?</h3>
            <p>Heart Drops is here to help you make the future a better place. All you have to do is fill out the information found here [LINK], and we’ll get you set up with our community DAO. Make sure that you have yourself set up with a Crypto Wallet that will allow you to receive the funds raised for your cause. <a href="#">Learn more...</a></p>
            <p>*Please note we do not work with any political groups or government organizations*</p>
          </div>

          <div className="bg-white shadow-lg rounded-3xl p-8 mb-5">
            <h3 className="font-bold text-xl mb-1">Where are the Charities/NGOs located?</h3>
            <p>We are a global community, coming together to change the world. There is no one central location.</p>
          </div>

          <div className="bg-white shadow-lg rounded-3xl p-8 mb-5">
            <h3 className="font-bold text-xl mb-1">What Blockchains are supported?</h3>
            <p>Currently, all Heart Drops are located either on the Ethereum or Polygon MATIC blockchains.</p>
          </div>

        </div>
    </div>
    </>
    );
};

export default ArtistsPage;
