import React, { useRef, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import Card from './Card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    LineController
} from 'chart.js';
import '../config/chartConfig';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    LineController
);

const RatingRevenueDualChart = ({ data }) => {
    const chartRef = useRef(null);



    if (!data) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#e5e7eb' }
            },
            title: {
                display: true,
                text: 'Rating vs. Revenue Correlation',
                color: '#e5e7eb',
                font: { size: 16, weight: 'bold' },
                padding: { bottom: 5 }
            },
            subtitle: {
                display: true,
                text: 'Revenue remains consistent regardless of average rating',
                color: '#9ca3af',
                font: { size: 12, style: 'italic' },
                padding: { bottom: 15 }
            }
        },
        scales: {
            x: {
                grid: { display: false }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: { display: true, text: 'Total Revenue ($)', color: '#2a788e' },
                ticks: {
                    callback: (value) => new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD' }).format(value)
                },
                grid: { color: 'rgba(75, 85, 99, 0.2)' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                title: { display: true, text: 'Avg Rating (1-5)', color: '#fde725' },
                grid: { display: false },
                min: 0,
                max: 5
            }
        }
    };

    return (
        <Card
            title="Rating vs. Revenue"
            description="Correlates customer satisfaction with financial performance. It identifies whether brand reputation (ratings) acts as a leading or lagging indicator for revenue growth in specific categories."
            tags={['#CorrelationAnalysis', '#BrandHealth']}
            className="min-h-[32rem]"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0">
                    <Chart
                        ref={chartRef}
                        key='rating-revenue-dual'
                        redraw={false}
                        type='bar'
                        options={{
                            ...options,
                            plugins: {
                                ...options.plugins,
                                datalabels: { display: false },
                                title: { display: false },
                                subtitle: { display: false }
                            }
                        }}
                        data={data}
                    />
                </div>
            </div>
        </Card>
    );
};

export default RatingRevenueDualChart;
