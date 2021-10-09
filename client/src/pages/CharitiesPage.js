import React from 'react';
import ShowcaseCharities from '../components/showcaseCharities';
import DB from '../db.json';

const CharitiesPage = () => {
  return (
    <>
        <div className="py-5">
            <h2 className="my-5 text-5xl font-bold text-center">List of charities</h2>
            <div className="container mx-auto p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 lg:gap-20">
                    {DB.charities && DB.charities.length>0 && DB.charities.map((item) => <ShowcaseCharities key={item.id} item={item}/>)}
                </div>
            </div>
        </div>
    </>
    );
};

export default CharitiesPage;
