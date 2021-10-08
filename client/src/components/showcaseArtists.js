import React from 'react';
import { Link } from 'react-router-dom';

const ShowcaseArtists = (key, item) => {

    return (
        <>
            <div className="card bordered shadow-2xl">
                <figure>
                    <img src={key.item.image} />
                </figure> 
                <div className="card-body" >
                    <h2 className="card-title">{key.item.name}
                        <div className="badge mx-2 badge-secondary">{key.item.domain}</div>
                    </h2> 
                    <p>{key.item.description}</p> 
                    <div className="justify-end card-actions">
                        <Link  to="/donate" className="btn btn-secondary">Donate</Link>
                    </div>
                </div>
            </div> 
        </>
    );

};

export default ShowcaseArtists;