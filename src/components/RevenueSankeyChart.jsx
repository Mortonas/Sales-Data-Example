import React from 'react';
import { Chart as ChartJS, Tooltip, Legend } from 'chart.js';
import { SankeyController, Flow } from 'chartjs-chart-sankey';
import Card from './Card';
import { getColor } from '../config/categoryColors';

ChartJS.register(SankeyController, Flow, Tooltip, Legend);

const RevenueSankeyChart = ({ data }) => {
    // Sankey plugin requires specific options
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: { display: false },
            legend: {
                display: false // Sankeys generally don't utilize standard legends well
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const raw = context.raw;
                        if (raw.from && raw.to) {
                            return `${raw.from} → ${raw.to}: $${Number(raw.flow).toLocaleString()}`;
                        }
                        return `${raw.key || raw.name || ''}: $${Number(raw.value || 0).toLocaleString()}`;
                    },
                    labelColor: (context) => {
                        const raw = context.raw;
                        const key = raw.from || raw.key || raw.name; // Use 'from' for flows, key/name for nodes
                        const color = getColor(key);
                        return {
                            borderColor: color,
                            backgroundColor: color
                        };
                    }
                }
            }
        },
        layout: {
            padding: 20
        },
        // Increase nodeWidth/nodePadding to help with label overlap
        nodePadding: 20
    };

    return (
        <Card
            title="Revenue Flow Analysis"
            description="Traces the journey of capital from category origin to final payment reconciliation. This reveals operational efficiency and customer payment preferences across the entire sales funnel."
            tags={['#DataFlow', '#OperationalEfficiency']}
            className="h-[400px]"
        >
            {/* We must use the 'Chart' component for custom controllers usually, or basic 'Chart' from react-chartjs-2 */}
            <div className="relative h-full w-full">
                {/* 
                  Note: react-chartjs-2 generic Chart component is needed for custom controllers like Sankey 
                  if we don't have a specific export.
                */}
                <canvas id="sankeyCanvas" ref={(node) => {
                    if (node) {
                        const ctx = node.getContext('2d');
                        // We check if a chart instance exists to destroy it (React strict mode handling)
                        if (node.chart) node.chart.destroy();

                        node.chart = new ChartJS(ctx, {
                            type: 'sankey',
                            data: data,
                            options: options
                        });
                    }
                }} />
            </div>
        </Card>
    );
};

export default RevenueSankeyChart;
