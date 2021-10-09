import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { ethers } from 'ethers';

const ShowcaseCharities = ({item, onSelectCharity, checkCharity=false}) => {
    const selectCharity = () => {
        if (checkCharity) {
            onSelectCharity(item.id)
        } else {
            return None;
        }
    }
    return (
        <>
            <div 
                className={checkCharity ? "0 35px 60px -15px rgba(0, 0, 0, 0.3) relative max-w-sm min-w-[340px] bg-white shadow-lg rounded-3xl p-2 mx-10 my-3 cursor-pointer motion-safe:hover:scale-105 transition duration-500 ease-in-out": "card bordered shadow-2xl"}
                onClick={selectCharity}
                >
                <figure>
                    <img src={item.image} />
                </figure> 
                <div className="card-body" >
                    <h2 className="card-title">{item.name}
                        <div className="badge mx-2 badge-secondary">{item.domain}</div>
                    </h2> 
                    <p>{item.description}</p> 
                    <div className="justify-end card-actions">
                        <Link  to="/donate" className="btn btn-secondary">Donate</Link>
                    </div>
                </div>
            </div> 
        </>
    );

};
export default ShowcaseCharities;