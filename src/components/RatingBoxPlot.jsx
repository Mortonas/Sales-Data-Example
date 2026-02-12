import React, { useRef, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import Card from './Card';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import '../config/chartConfig';

ChartJS.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale, Tooltip, Legend, Title);



const RatingBoxPlot = ({ data }) => {
    const chartRef = useRef(null);

    if (!data) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Transaction Value by Rating',
                color: '#e5e7eb',
                font: { size: 16, weight: 'bold' },
                padding: { bottom: 5 }
            },
            subtitle: {
                display: true,
                text: 'Transaction values are uniform across all rating levels',
                color: '#9ca3af',
                font: { size: 12, style: 'italic' },
                padding: { bottom: 15 }
            },
            datalabels: { display: false }
        },
        scales: {
            y: {
                title: { display: true, text: 'Transaction Value ($)', color: '#6b7280' },
                ticks: {
                    callback: (value) => new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD' }).format(value)
                },
                min: 0
            },
            x: {
                title: { display: true, text: 'Rating (1-5)', color: '#6b7280' }
            }
        }
    };

    return (
        <Card className="min-h-[32rem]">
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0 mb-4">
                    <Chart
                        ref={chartRef}
                        key='rating-boxplot'
                        redraw={false}
                        type="boxplot"
                        options={options}
                        data={data}
                    />
                </div>
                <div className="mt-auto pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-xs">Dissatisfied customers (1-star) spend just as much per transaction as happy ones (5-star). This suggests product quality/price issues rather than 'cheap' customers complaining.</p>
                </div>
            </div>
        </Card>
    );
};

export default RatingBoxPlot;
