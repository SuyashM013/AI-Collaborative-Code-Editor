'use client';

import React from 'react';
import Image from 'next/image';

const Header = () => {
    return (
        <header className="flex items-center justify-between backdrop-blur-sm rounded-lg z-10 absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl shadow-lg bg-accent/20 text-white">
            

            <div>
                <Image src='/Logo.png' alt="Logo" width={80} height={80} />

            </div>

            <div className="flex items-center space-x-4 gap-6 text-2xl text-white main-font">

                <h2>Features</h2>
                <h2>Support</h2>

            </div>
        </header>
    );
};

export default Header;