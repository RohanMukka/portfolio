import React from 'react';
import '../loader.css';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
            <div className="ai-matrix-loader">
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="digit">1</div>
                <div className="digit">0</div>
                <div className="digit">0</div>
                <div className="digit">1</div>
                <div className="glow"></div>
            </div>
        </div>
    );
};

export default Loader;
