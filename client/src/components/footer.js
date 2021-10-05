import React from 'react';

const Footer = () => {

    return (
        <footer className="items-center p-4 footer bg-neutral text-neutral-content">
            <div className="items-center grid-flow-col">
                <p>Copyright © 2021 Heart Drops - All right reserved</p>
            </div>
            <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
                <a href="https://twitter.com/heartdrops" target="blank"><button class="btn btn-xs bg-accent">Twitter</button></a>
                <a href="https://discord.gg/hxpphqev" target="blank"><button class="btn btn-xs bg-accent">Discord</button></a>
            </div>
        </footer>
    );

};

export default Footer;
