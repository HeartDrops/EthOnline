import React, { useState, useEffect } from 'react';
import BuyForm from '../components/buyForm';

const BuyerPage = ({match, location}) => { 

    const data = location.state;

    return (
        <>
            <div className="container mx-auto p-5">
                <BuyForm props={data} />
            </div>
        </>
    );
};

export default BuyerPage;