import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard = ({ className = "" }) => {
    return (
        <div className={`glass rounded-xl p-6 relative overflow-hidden ${className}`}>
            {/* Shimmer Effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />

            {/* Content Placeholders */}
            <div className="flex flex-col h-full space-y-4">
                <div className="h-6 w-1/3 bg-gray-700/50 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-700/30 rounded"></div>
                <div className="flex-1 bg-gray-700/20 rounded mt-4"></div>
                <div className="h-8 w-full bg-gray-700/20 rounded border-t border-gray-700/30 mt-auto"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
