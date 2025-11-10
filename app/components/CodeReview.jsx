"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function CodeReview() {
    const [isOpen, setIsOpen] = useState(false);
    const [userCode, setUserCode] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loading, setLoading] = useState(false);

    // 🔹 Toggle sidebar open/close
    const toggleSidebar = () => {
        setIsOpen((prev) => !prev);
    };

    // 🔹 Send code for AI review
    const handleReview = async () => {
        if (!userCode.trim()) {
            toast.error("Please enter your code for review.");
            return;
        }

        setLoading(true);
        setAiResponse("");

        try {
            const res = await fetch("/api/ai/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: userCode }),
            });

            const data = await res.json();

            if (data.feedback) {
                setAiResponse(data.feedback);
                toast.success("✅ Review completed!");
            } else {
                toast.error("AI review failed. Try again later.");
            }
        } catch (err) {
            toast.error("Something went wrong during AI review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* 🪄 Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-5 right-5 z-50 bg-gray-600 text-white px-4 py-2 rounded-md shadow-md main-font text-2xl hover:bg-gray-700 transition-all"
            >
                {isOpen ? "Close Reviewer" : "Open Reviewer"}
            </button>

            {/* 💬 Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] bg-[#0e0e0e] text-white shadow-2xl transform transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="p-4 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-3xl font-semibold main-font"> Code Reviewer</h2>
                    <button
                        onClick={toggleSidebar}
                        className="text-gray-400 hover:text-white text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 flex flex-col h-[calc(100%-60px)]">
                    {/* Input Area */}
                    <textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="Paste your code here..."
                        className="flex-1 p-2 rounded-md bg-gray-900 text-gray-100 resize-none outline-none border border-gray-700 focus:border-gray-500"
                    />

                    {/* Submit Button */}
                    <button
                        onClick={handleReview}
                        disabled={loading}
                        className="mt-3 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md disabled:opacity-50 text-2xl secon-font"
                    >
                        {loading ? "Reviewing..." : "Send for Review"}
                    </button>

                    {/* AI Response */}
                    <div className="mt-4 overflow-y-auto bg-gray-800 p-3 rounded-md h-7/12 border border-gray-700">
                        {aiResponse ? (
                            <pre className="whitespace-pre-wrap text-font text-gray-100">
                                {aiResponse}
                            </pre>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                {loading ? "Analyzing your code..." : "AI feedback will appear here..."}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
