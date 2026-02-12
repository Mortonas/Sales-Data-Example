import React, { useRef, useEffect } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Card from './Card';
import '../config/chartConfig'; // Apply global defaults

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const RevenueBarChart = ({ data }) => {
    const chartRef = useRef(null);



    if (!data) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Revenue by Category',
                color: '#e5e7eb',
                font: { size: 16, weight: 'bold' },
                padding: { bottom: 5 }
            },
            subtitle: {
                display: true,
                text: 'Electronics leads with 35% of total revenue',
                color: '#9ca3af',
                font: { size: 12, style: 'italic' },
                padding: { bottom: 15 }
            },
            datalabels: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD' }).format(value)
                },
                beginAtZero: true
            },
            x: {
                grid: { display: false }
            }
        }
    };

    return (
        <Card className="h-96">
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0">
                    <Bar
                        ref={chartRef}
                        key='revenue-bar-chart'
                        redraw={false}
                        options={options}
                        data={data}
                    />
                </div>
            </div>
        </Card>
    );
};

export default RevenueBarChart;
