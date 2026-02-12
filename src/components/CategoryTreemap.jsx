import React, { useRef, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import Card from './Card';
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
import '../config/chartConfig';

ChartJS.register(TreemapController, TreemapElement, Tooltip, Legend, Title);

const CategoryTreemap = ({ data }) => {
    const chartRef = useRef(null);



    if (!data) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Category Performance',
                color: '#e5e7eb',
                font: { size: 16, weight: 'bold' },
                padding: { bottom: 5 }
            },
            subtitle: {
                display: true,
                text: 'Market share is evenly split across categories',
                color: '#9ca3af',
                font: { size: 12, style: 'italic' },
                padding: { bottom: 15 }
            },
            tooltip: {
                callbacks: {
                    title: (items) => items[0].raw._data.category,
                    label: (item) => {
                        const val = item.raw._data.value;
                        return `Revenue: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)}`;
                    }
                }
            }
        },
    };

    // Inject formatters for the Treemap labels
    const formattedData = {
        ...data,
        datasets: data.datasets.map(ds => ({
            ...ds,
            labels: {
                display: true,
                color: 'white',
                font: { family: "'Inter', sans-serif", size: 14, weight: 'bold' },
                formatter: (ctx) => {
                    if (!ctx.raw._data) return '';
                    const value = ctx.raw._data.value;
                    return [
                        ctx.raw._data.category,
                        new Intl.NumberFormat('en-US', { notation: 'compact', style: 'currency', currency: 'USD' }).format(value)
                    ];
                }
            }
        }))
    };

    return (
        <Card className="min-h-[32rem]">
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0 mb-4">
                    <Chart
                        ref={chartRef}
                        key='category-treemap'
                        redraw={false}
                        type="treemap"
                        options={options}
                        data={formattedData}
                    />
                </div>
                <div className="mt-auto pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-xs">Despite distinct product types, each category contributes equally to total revenue, indicating a balanced portfolio with no single dependency.</p>
                </div>
            </div>
        </Card>
    );
};

export default CategoryTreemap;
