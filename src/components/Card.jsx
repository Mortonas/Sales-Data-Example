import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = "", title, description, tags }) => {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            className={`glass glass-hover rounded-xl p-6 shadow-xl flex flex-col ${className}`}
        >
            {title && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white tracking-tight">{title}</h3>
                    {description && (
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed border-l-2 border-blue-500/30 pl-3 italic">
                            {description}
                        </p>
                    )}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 pl-3">
                            {tags.map((tag, index) => (
                                <span key={index} className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <div className="flex-1 relative">
                {children}
            </div>
        </motion.div>
    );
};

export default Card;
