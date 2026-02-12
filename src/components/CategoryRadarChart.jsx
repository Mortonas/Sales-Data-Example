import React from 'react';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import Card from './Card';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const CategoryRadarChart = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                angleLines: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                pointLabels: {
                    color: '#9ca3af',
                    font: {
                        size: 11
                    }
                },
                ticks: {
                    display: false, // Hide 0-100 ticks for cleaner look
                    backdropColor: 'transparent'
                },
                suggestedMin: 0,
                suggestedMax: 100
            }
        },
        plugins: {
            datalabels: { display: false },
            legend: {
                position: 'top',
                labels: {
                    color: '#fff',
                    font: { size: 12 }
                }
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        // Display the metric name and normalized score
                        // Optionally, if we had raw values, we'd map them back here.
                        return `${context.dataset.label}: ${Math.round(context.raw)} (Index)`;
                    }
                }
            }
        }
    };

    return (
        <Card
            title="Category Health (Radar)"
            description="A multivariate performance assessment comparing categories across five dimensions. It highlights operational imbalances, such as high-revenue sectors suffering from low margins or poor volume."
            tags={['#MultivariateAnalysis', '#PerformanceMetrics']}
            className="h-[400px]"
        >
            <Radar data={data} options={options} />
        </Card>
    );
};

export default CategoryRadarChart;
