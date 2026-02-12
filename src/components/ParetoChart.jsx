import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LineController } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import Card from './Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LineController);

const ParetoChart = ({ data }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        stacked: false,
        plugins: {
            datalabels: { display: false },
            legend: {
                position: 'top',
                labels: { color: '#fff' }
            },
            title: {
                display: true,
                text: 'Top 20 Products: Revenue vs Cumulative %',
                color: '#9ca3af',
                font: { size: 12, weight: 'normal' }
            }
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: { color: '#9ca3af' }
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
                ticks: {
                    callback: (value) => value + '%',
                    color: '#fde725'
                },
                min: 0,
                max: 100
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#9ca3af',
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    return (
        <Card
            title="Product Pareto (80/20)"
            description="Segregates the 'critical few' from the 'trivial many.' This identifies the top 20% of products driving 80% of revenue, enabling strategic prioritization of inventory and marketing resources."
            tags={['#80/20Rule', '#StatisticalDistribution']}
            className="h-[400px]"
        >
            <Chart type='bar' data={data} options={options} />
        </Card>
    );
};

export default ParetoChart;
