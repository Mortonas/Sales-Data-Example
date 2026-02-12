import React from 'react';
import { Chart as ChartJS, Tooltip, Legend, Title } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import Card from './Card';

ChartJS.register(MatrixController, MatrixElement, Tooltip, Legend, Title);

const SalesHeatmap = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: { display: false },
            legend: { display: false },
            tooltip: {
                callbacks: {
                    title() { return ''; },
                    label(context) {
                        const v = context.raw;
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        return `Week ${v.x}, ${days[v.y]}: $${v.v.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                min: 1,
                max: 53, // Weeks in year
                ticks: {
                    stepSize: 4, // Show every 4th week roughly
                    color: '#9ca3af'
                },
                grid: { display: false },
                title: { display: true, text: 'Week of Year', color: '#6b7280' }
            },
            y: {
                type: 'linear',
                min: 0, // Sun
                max: 6, // Sat
                offset: true,
                ticks: {
                    stepSize: 1,
                    callback: (val) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][val],
                    color: '#9ca3af'
                },
                grid: { display: false }
            }
        }
    };

    return (
        <Card
            title="Sales Velocity (Heatmap)"
            description="Uncovers temporal demand patterns and seasonal spikes. This granularity is essential for optimizing operational logistics, staffing requirements, and promotional timing."
            tags={['#TemporalAnalysis', '#DemandForecasting']}
            className="h-[400px]"
        >
            {/* 
                We use a custom canvas approach or the generic Chart component from react-chartjs-2 
                because 'Matrix' isn't a standard named export component.
            */}
            <div className="relative h-full w-full">
                <canvas id="heatmapCanvas" ref={(node) => {
                    if (node) {
                        const ctx = node.getContext('2d');
                        if (node.chart) node.chart.destroy();

                        node.chart = new ChartJS(ctx, {
                            type: 'matrix',
                            data: data,
                            options: options
                        });
                    }
                }} />
            </div>
        </Card>
    );
};

export default SalesHeatmap;
