import React, { useRef, useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import Card from './Card';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const RevenueVolumeScatterChart = ({ data }) => {
    const chartRef = useRef(null);

    const jitteredData = useMemo(() => {
        if (!data) return null;
        return {
            ...data,
            datasets: data.datasets.map(dataset => {
                if (dataset.type === 'line') return dataset;
                return {
                    ...dataset,
                    data: dataset.data.map(point => ({
                        ...point,
                        originalX: point.originalX ?? point.x,
                        x: (point.originalX ?? point.x) + (Math.random() * 0.3 - 0.15)
                    }))
                };
            })
        };
    }, [data]);

    if (!data) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Revenue vs. Volume (Price vs Quantity)',
                color: '#e5e7eb',
                font: { size: 16 }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const point = context.raw;
                        const qty = point.originalX !== undefined ? point.originalX : point.x;
                        const price = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(point.y);
                        return `${point.product || 'Product'}: Qty ${qty}, Price ${price}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Unit Price ($)', color: '#6b7280' },
                ticks: {
                    color: '#9ca3af',
                    callback: (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumSignificantDigits: 3 }).format(value)
                },
                grid: { color: 'rgba(75, 85, 99, 0.2)' }
            },
            x: {
                title: { display: true, text: 'Quantity Sold', color: '#6b7280' },
                ticks: { color: '#9ca3af' },
                grid: { color: 'rgba(75, 85, 99, 0.2)' },
            }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                staggerChildren: 0.05
            }
        }
    };

    return (
        <Card className="min-h-[24rem] neon-glow overflow-hidden">
            <div className="flex flex-col h-full">
                <motion.div
                    className="flex-1 min-h-0"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Scatter
                        ref={chartRef}
                        key='revenue-volume-scatter'
                        redraw={false}
                        options={options}
                        data={jitteredData}
                    />
                </motion.div>
                <div className="mt-auto pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-xs">High-density clusters reveal that mid-range items sold in quantities of 4-6 drive the bulk of volume-based revenue.</p>
                </div>
            </div>
        </Card>
    );
};

export default RevenueVolumeScatterChart;
