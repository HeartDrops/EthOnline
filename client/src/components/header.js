import React from 'react';
import { NavLink } from 'react-router-dom';

const HeaderSite = () => {

    return (
        <>
          <div className="navbar bg-primary-focus text-neutral-content">
            <div className="flex-none px-2 mx-2">
                <span className="text-lg font-bold">
                        <NavLink to="/"><img height="100" width="200" src="https://freight.cargo.site/t/thumbnail/w/100/i/887ac2e88349f644bf4718496c686b8d9101eb1b295bf3b0852f54e68dcf9d76/logotype-heart-drops.svg" /></NavLink>
                </span>
            </div>
            <div className="flex-1 px-2 mx-2">
                <div className="items-stretch hidden lg:flex">
                  <nav>
                      <NavLink to="/auctions" activeClassName="active" className="btn btn-ghost btn-sm rounded-btn">Auctions</NavLink>
                  </nav>
                  <nav>
                      <NavLink to="/artists" activeClassName="active" className="btn btn-ghost btn-sm rounded-btn">Artists</NavLink>
                  </nav>
                  <nav>
                      <NavLink to="/charities" activeClassName="active" className="btn btn-ghost btn-sm rounded-btn">Charities</NavLink>
                  </nav>
                  <nav>
                      <NavLink to="/about" activeClassName="active" className="btn btn-ghost btn-sm rounded-btn">About</NavLink>
                  </nav>
                </div>
              </div>

              <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
              <div className="flex-none">
                <button className="btn btn-square btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                </button>
              </div>
              <div className="flex-1 lg:flex-none">
                  <div className="form-control">
                    <input type="text" placeholder="Search" className="input input-ghost" />
                  </div>
              </div>
              <div className="flex-none">
                  <button className="btn btn-info">Connect Wallet</button>
              </div>
            </div>

        </>
    );

};

export default HeaderSite;
