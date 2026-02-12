import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            className="glass rounded-xl p-6 neon-glow border-l-4 border-l-[#2a788e]"
        >
            <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</h3>
            <div className="text-3xl font-bold text-white font-mono tracking-tight neon-text">
                {value}
            </div>
        </motion.div>
    );
};

export default StatCard;
