import React from 'react';
import ShowcaseArtists from '../components/showcaseArtists';
import DB from '../db.json';

const ArtistsPage = () => {
  return (
    <>
        <div className="py-5">
            <h2 className="my-5 text-5xl font-bold text-center">List of artists</h2>
            <div className="container mx-auto p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
                    {DB.artists && DB.artists.length>0 && DB.artists.map((item) => <ShowcaseArtists key={item.id} item={item} />)}
                </div>
            </div>
        </div>
    </>
    );
};

export default ArtistsPage;

