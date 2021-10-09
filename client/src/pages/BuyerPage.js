import React, { useState, useEffect, useRouter } from 'react';
import BuyForm from '../components/buyForm';
import Countdown from '../components/countdown';
import DB from '../db.json';

const BuyerPage = ({match, location}) => { 

    console.log('state', location);
    const data = location.state;
    const pathModal = location.pathname;
    
    const [charityInfo, setCharityInfo] = useState({
        id: null,
        name: null,
        domain: null
    });

    useEffect(() => {

        // fetch data of charity
        if (data.item.charityId && charityInfo.id == null) {
            setCharityInfo({
                id: data.item.charityId,
                name: DB.charities[data.item.charityId].name,
                domain: DB.charities[data.item.charityId].domain,
                description: DB.charities[data.item.charityId].description,
                long_description: DB.charities[data.item.charityId].long_description
            });
        }
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
                        <h2 className="card-title">{data.nft_metadata && data.nft_metadata.name}</h2> 
                        <p> created by ARTIST_NAME</p> 
                        <p> created by DONATOR_NAME</p> 
                        <p>{data.nft_metadata && data.nft_metadata.description}</p> 
                    </div>
                </div>
                <div className="">
                    <div className="card shadow-2xl p-7">
                        <div className=""> 
                            <div className="text-center mb-2">
                                <h2 className="card-title">Donate to {charityInfo.name}
                                    <div className="badge mx-2 badge-secondary">ONGOING</div>
                                </h2>
                            </div> 
                        </div>
                        <div className=""> 
                            <div className="mb-2">
                                <p>{charityInfo.long_description}</p>
                            </div>
                        </div>

                        <div className="divider"></div> 

                        <div className="center-cnt mb-5">
                            <Countdown end={data.end_date.timestamp} size="small" />
                        </div>

                        <BuyForm props={data} />

                    </div>


                </div>
            </div>
        </div>
    </>
    );
};

export default BuyerPage;