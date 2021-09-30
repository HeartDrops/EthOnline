import React from 'react';
import { Link } from 'react-router-dom';
import { LogoTwitter32 } from '@carbon/icons-react';
// import { LogoDiscord32 } from '@carbon/icons-react'; // get error can't export this logo

const Footer = () => {

    return (
        <footer className="site-footer">
            <div className="bx--grid">
                <div className="bx--row">
                    <div className="bx--offset-lg-1 bx--col-lg-5">
                        <p>Copyright © 2021 Heart Drops. All rights reserved.</p>
                    </div>
                    <div className="bx--col-lg-5 site-social">
                        <Link href="#"><LogoTwitter32/></Link>
                        <Link href="#"><LogoTwitter32/></Link>
                    </div>
                </div>
            </div>
        </footer>
    );

};

export default Footer;