import React, { useState, useEffect } from 'react';

function calculateTimeLeft() {
    const endDate = new Date('October 10, 2021 00:00:00').getTime();
    const difference = endDate - new Date().getTime();
    let timeLeft = {};
  
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
};

const Countdown = (props) => {
    
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const id = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        return () => {
          clearTimeout(id);
        };
      });

    return (
        <>
        <div>
            { timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0
                ? <span>Auction finished !</span>
                : <> 
                    <div>
                        <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="font-mono text-5xl countdown">
                                    <span style={{'--value':`${timeLeft.days}`}}></span>
                                </span>
                                    days
                                
                            </div> 
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="font-mono text-5xl countdown">
                                <span style={{'--value':`${timeLeft.hours}`}}></span>
                                </span>
                                    hours
                                
                            </div> 
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="font-mono text-5xl countdown">
                                <span style={{'--value':`${timeLeft.minutes}`}}></span>
                                </span>
                                    min
                                
                            </div> 
                            <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                                <span className="font-mono text-5xl countdown">
                                <span style={{'--value':`${timeLeft.seconds}`}}></span>
                                </span>
                                    sec
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
        </>
    );
};
export default Countdown;


