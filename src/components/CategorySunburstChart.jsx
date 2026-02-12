import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Card from './Card';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const CategorySunburstChart = ({ data }) => {
    // Breadcrumb State
    const [path, setPath] = React.useState(['All Categories']);

    const totalRevenue = data.totalRevenue || 0;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt, elements, chart) => {
            if (!elements.length) {
                setPath(['All Categories']);
                return;
            }
            // Simple Breadcrumb Logic (Just visual based on clicked item)
            const index = elements[0].index;
            const datasetIndex = elements[0].datasetIndex;

            if (datasetIndex === 0) {
                // Inner Ring: Category
                const label = data.labels[index];
                setPath(['All Categories', label]);
            } else {
                // Outer Ring: Sub-Category
                // Finding parent is tricky without structural link, but we can approximate or just show sub
                // For now, let's just show what we clicked
                // Accessing the raw data to find the label is needed. 
                // chartjs-plugin-datalabels config below has access to ring2Labels logic if we moved it here, 
                // but dataUtils handles it. 
                // Let's just reset to All if clicked outside, or specific if clicked inside.
                setPath(['All Categories', 'Selection']);
            }
        },
        plugins: {
            legend: {
                display: true, // Keep legend as filter
                position: 'right',
                labels: {
                    color: '#ffffff',
                    font: { family: 'Inter, sans-serif', size: 11 },
                    generateLabels: (chart) => {
                        const d = chart.data;
                        if (d.labels.length && d.datasets.length) {
                            return d.labels.map((label, i) => ({
                                text: label,
                                fillStyle: d.datasets[0].backgroundColor[i],
                                strokeStyle: d.datasets[0].backgroundColor[i],
                                hidden: !!chart.getDataVisibility(i) === false,
                                index: i
                            }));
                        }
                        return [];
                    }
                },
                onClick: (e, legendItem, legend) => {
                    const index = legendItem.index;
                    const ci = legend.chart;
                    if (ci.isDatasetVisible(0)) {
                        ci.toggleDataVisibility(index);
                        ci.update();
                    }
                }
            },
            datalabels: {
                display: true, // Enable globally, specific configs in dataset
                color: '#fff',
                textAlign: 'center',
                anchor: 'center',
                align: 'center',
                clamp: true, // Keep labels inside properly
            },
            tooltip: {
                enabled: true, // Tooltips still useful for exact numbers
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                titleColor: '#fff',
                bodyColor: '#e5e7eb',
                callbacks: {
                    label: (context) => {
                        const val = context.raw;
                        const label = context.dataset.tooltipLabels ? context.dataset.tooltipLabels[context.dataIndex] : '';
                        return `${label}: $${Number(val).toLocaleString()}`;
                    }
                }
            }
        },
        rotation: -90, // Start at 12 o'clock
        cutout: '60%', // Larger cutout to prevent text overlap
        radius: '90%'
    };

    // Custom Plugin to draw text in center
    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: function (chart) {
            const { ctx, width, height, chartArea } = chart;

            if (!chartArea) return;

            // robust center calculation based on the plotting area (excluding legend)
            const x = (chartArea.left + chartArea.right) / 2;
            const y = (chartArea.top + chartArea.bottom) / 2;

            ctx.restore();

            // Draw Total Label
            const fontSizeKey = Math.round(height / 28);
            ctx.font = `bold ${fontSizeKey}px Inter, sans-serif`;
            ctx.fillStyle = '#9ca3af'; // Gray label
            ctx.textBaseline = 'middle';
            const text = "Total Revenue";
            const textX = Math.round(x - ctx.measureText(text).width / 2);
            const textY = y - fontSizeKey; // Move up by one line height
            ctx.fillText(text, textX, textY);

            // Draw Total Value
            const fontSizeVal = Math.round(height / 16);
            ctx.font = `bold ${fontSizeVal}px Inter, sans-serif`;
            ctx.fillStyle = '#ffffff'; // White Value
            const val = `$${(totalRevenue / 1000000).toFixed(1)}M`;
            const valX = Math.round(x - ctx.measureText(val).width / 2);
            const valY = y + fontSizeKey; // Move down
            ctx.fillText(val, valX, valY);

            ctx.save();
        }
    };


    return (
        <Card
            title="Hierarchical Revenue Attribution"
            description="This sunburst visualization maps revenue concentration across nested categories. It is designed to reveal the 'drill-down' relationship between high-level sectors and their sub-segments, allowing stakeholders to identify specific niche drivers of top-line growth at a glance."
            tags={['#HierarchyLogic', '#MarketSnapshot']}
            className="h-[500px]"
        >
            <div className="flex flex-col h-full w-full">
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2 px-4">
                    {path.map((item, index) => (
                        <React.Fragment key={index}>
                            <span className={index === path.length - 1 ? "text-white font-medium" : "hover:text-white cursor-pointer"}>
                                {item}
                            </span>
                            {index < path.length - 1 && <span>&gt;</span>}
                        </React.Fragment>
                    ))}
                </div>

                <div className="relative flex-grow flex items-center justify-center">
                    <Doughnut
                        data={data}
                        options={options}
                        plugins={[centerTextPlugin]}
                    />
                </div>
            </div>
        </Card>
    );
};

export default CategorySunburstChart;
