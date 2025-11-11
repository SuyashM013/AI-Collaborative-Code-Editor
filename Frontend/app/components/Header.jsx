'use client';

import React from 'react';
import Image from 'next/image';
import { toast } from "react-hot-toast";


const Header = () => {
    return (
        <header className="flex items-center justify-between backdrop-blur-sm rounded-lg z-10 absolute top-4 left-1/2 transform -translate-x-1/2 w-11/12 max-w-4xl shadow-lg bg-accent/20 text-white">

            <div>
                <Image src='/Logo.png' alt="Logo" width={80} height={80} />

            </div>

            <div className="flex items-center space-x-4 text-2xl text-white main-font mx-5 z-15">
                <h2
                    onClick={() => toast("🚀 Features cooking, wait for some time", {
                        style: {
                            borderRadius: "10px",
                            background: "#1a1a1a",
                            color: "#fff",
                        },
                    })}
                    className="cursor-pointer hover:text-blue-200 transition-colors"
                >
                    Features
                </h2>
                <h2
                    onClick={() => toast("💬 Coming Soon for help", {
                        style: {
                            borderRadius: "10px",
                            background: "#1a1a1a",
                            color: "#fff",
                        },
                    })}
                    className="cursor-pointer hover:text-blue-200 transition-colors"
                >
                    Support
                </h2>
            </div>

        </header>
    );
};

export default Header;