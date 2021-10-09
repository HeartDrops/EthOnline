import React from 'react';
import { Link } from 'react-router-dom';

const ShowcaseArtists = ({item}) => {

    return (
        <>
            <div className="card bordered shadow-2xl">
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

export default ShowcaseArtists;