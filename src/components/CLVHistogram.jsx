import React, { useRef, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Card from './Card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import '../config/chartConfig';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CLVHistogram = ({ data }) => {
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
                text: 'Customer Lifetime Value Distribution',
                color: '#e5e7eb',
                font: { size: 16, weight: 'bold' },
                padding: { bottom: 5 }
            },
            subtitle: {
                display: true,
                text: '80% of customers have a CLV under $2,000',
                color: '#9ca3af',
                font: { size: 12, style: 'italic' },
                padding: { bottom: 15 }
            }
        },
        scales: {
            y: {
                title: { display: true, text: 'Customer Count', color: '#6b7280' },
                beginAtZero: true
            },
            x: {
                title: { display: true, text: 'CLV Range ($)', color: '#6b7280' },
                grid: { display: false }
            }
        }
    };

    return (
        <Card
            title="Customer Loyalty (Lifetime Value)"
            description="The CLV chart shows us the long-term value of a single user. There is a sharp drop-off after the $1,250 mark, which reveals that most people are one-time visitors. We are great at getting people through the door, but we haven't yet found the hook that turns a casual user into a high-value regular."
            tags={['#CustomerSegmentation', '#CohortAnalysis']}
            className="min-h-[32rem]"
        >
            <div className="flex flex-col h-full">
                <div className="flex-1 min-h-0">
                    <Bar
                        ref={chartRef}
                        key='clv-histogram'
                        redraw={false}
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

export default CLVHistogram;
