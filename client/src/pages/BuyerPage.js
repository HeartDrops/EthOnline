import React, { useState, useEffect } from 'react';
import BuyForm from '../components/buyForm';

const BuyerPage = ({match, location}) => { 

    const data = location.state;
    console.log('data', data);
    // console.log('location', location);
    // console.log('match', match);

    return (
        <>
            <div className="container mx-auto p-5">
                <BuyForm props={data} />
            </div>
        </>
    );
};

export default BuyerPage;