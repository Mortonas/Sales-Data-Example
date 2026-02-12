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



const RevenueVolumeBoxPlot = ({ data }) => {
    const chartRef = useRef(null);

    if (!data) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Unit Price Distribution by Qty',
                color: '#e5e7eb',
                font: { size: 16, weight: 'bold' },
                padding: { bottom: 5 }
            },
            subtitle: {
                display: true,
                text: 'No bulk discount trend observed',
                color: '#9ca3af',
                font: { size: 12, style: 'italic' },
                padding: { bottom: 15 }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const v = context.raw;
                        return `Min: $${v.min}, Med: $${v.median}, Max: $${v.max}`;
                    }
                }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Unit Price ($)', color: '#6b7280' },
                ticks: {
                    callback: (value) => new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD' }).format(value)
                },
                min: 0
            },
            x: {
                title: { display: true, text: 'Quantity per Order', color: '#6b7280' }
            }
        }
    };

    return (
        <Card
            title="Price Distribution (Box Plot)"
            description="Analyzes pricing consistency and elasticity across order volumes. This is used to detect pricing outliers and evaluate the impact of bulk-discounting strategies on profit margins."
            tags={['#PricingStrategy', '#OutlierDetection']}
            className="min-h-[32rem]"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0">
                    <Chart
                        ref={chartRef}
                        key='revenue-volume-boxplot'
                        redraw={false}
                        type="boxplot"
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

export default RevenueVolumeBoxPlot;
