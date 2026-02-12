import React, { useRef, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Card from './Card';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title
} from 'chart.js';
import '../config/chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PaymentDoughnutChart = ({ data }) => {
    const chartRef = useRef(null);



    if (!data) return null;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: { color: '#e5e7eb', font: { size: 12 } }
            },
            title: {
                display: true,
                text: 'Payment Methods',
                color: '#e5e7eb',
                font: { size: 16, weight: 'bold' },
                padding: { bottom: 5 }
            },
            subtitle: {
                display: true,
                text: 'Credit Card is the preferred method (45%)',
                color: '#9ca3af',
                font: { size: 12, style: 'italic' },
                padding: { bottom: 15 }
            },
            datalabels: { display: false }
        },
        cutout: '60%',
    };

    return (
        <Card className="h-96">
            <div className="flex flex-col h-full items-center w-full">
                <div className="flex-1 min-h-0 w-full flex justify-center">
                    <Doughnut
                        ref={chartRef}
                        key='payment-doughnut-chart'
                        redraw={false}
                        options={options}
                        data={data}
                    />
                </div>
            </div>
        </Card>
    );
};

export default PaymentDoughnutChart;
