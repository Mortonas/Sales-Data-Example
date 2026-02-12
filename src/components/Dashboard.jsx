import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAndParseData, processDataForCharts } from '../utils/dataUtils';
import StatCard from './StatCard';
import SkeletonCard from './SkeletonCard';
import RevenueSankeyChart from './RevenueSankeyChart';
import CategorySunburstChart from './CategorySunburstChart';
import CategoryRadarChart from './CategoryRadarChart';
import ParetoChart from './ParetoChart';
import SalesHeatmap from './SalesHeatmap';
import Card from './Card';

// Legacy / Standard Charts
// keeping some for "Granular Details"
import RevenueVolumeBoxPlot from './RevenueVolumeBoxPlot';
import CLVHistogram from './CLVHistogram';
import RatingRevenueDualChart from './RatingRevenueDualChart';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger effect
            delayChildren: 0.2
        }
    }
};

const Dashboard = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // Simulate slightly longer buffer to show off skeleton state if data loads too fast locally
            await new Promise(resolve => setTimeout(resolve, 800));

            try {
                const rawData = await fetchAndParseData();
                const processed = processDataForCharts(rawData);
                setChartData(processed);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto space-y-6">
                <div className="mb-8 p-4">
                    <div className="h-8 w-64 bg-gray-800 rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-48 bg-gray-800/50 rounded animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SkeletonCard className="h-32" />
                    <SkeletonCard className="h-32" />
                    <SkeletonCard className="h-32" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <SkeletonCard className="lg:col-span-3 h-96" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonCard className="h-96" />
                    <SkeletonCard className="h-96" />
                </div>
            </div>
        );
    }

    if (!chartData) {
        return <div className="text-center text-red-500 mt-10">Failed to load data.</div>;
    }

    const {
        stats,
        sankeyData,
        sunburstData,
        radarData,
        paretoData,
        heatmapData,
        // Legacy props for bottom rows
        clvHistogram,
        volumeBoxPlotData,
        ratingRevenueDual
    } = chartData;

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="p-6 max-w-7xl mx-auto space-y-6"
        >
            <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Alexander Morton's Sales Dashboard</h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        Advanced Data Storytelling & Analytics
                        <span className="hidden sm:inline text-gray-600">|</span>
                        <a
                            href="/Customer-Purchase-History.xlsx"
                            className="text-blue-400/80 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-1 group"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Example Dataset (.xlsx)
                        </a>
                    </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold mb-1">Property of</span>
                    <div className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm font-bold text-blue-400 shadow-sm transition-all hover:bg-blue-500/20">
                        Alexander Morton
                    </div>
                </div>
            </header>

            {/* The Big Picture / Intro */}
            <Card
                className="mb-8"
                title="The Big Picture: $3.2M in Activity"
                description="My dashboard tracks a massive dataset of 8,260 transactions, totaling over $3.2 million. While the sheer volume is impressive, the pulse of the project sits at a 3.0 rating. This tells us that while the engine is running fast, there is a consistent friction in the experience that keeps the satisfaction levels at a perfect average."
            >
            </Card>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Revenue" value={`$${new Intl.NumberFormat('en-US').format(stats.totalRevenue)}`} />
                <StatCard title="Total Quantity Sold" value={new Intl.NumberFormat('en-US').format(stats.totalQuantity)} />
                <StatCard title="Avg. Review Rating" value={stats.avgRating.toFixed(1)} />
            </div>

            {/* Row 1: The Big Picture (Sankey Flow) */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
                <div className="w-full">
                    <RevenueSankeyChart data={sankeyData} />
                </div>
            </motion.div>

            {/* Row 2: Category Analysis (Sunburst & Radar) */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CategorySunburstChart data={sunburstData} />
                <CategoryRadarChart data={radarData} />
            </motion.div>

            {/* Row 3: Product Performance & Distribution (Pareto & Dist) */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ParetoChart data={paretoData} />
                <RevenueVolumeBoxPlot data={volumeBoxPlotData} />
            </motion.div>

            {/* Row 4: Seasonal Trends (Heatmap) */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 gap-6">
                <SalesHeatmap data={heatmapData} />
            </motion.div>

            {/* Row 5: Customer & Rating Deep Dive (Legacy Keepers) */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                <CLVHistogram data={clvHistogram} />
                <RatingRevenueDualChart data={ratingRevenueDual} />
            </motion.div>

            <footer className="mt-12 pt-8 border-t border-gray-800 text-center">
                <p className="text-gray-500 text-xs">
                    &copy; {new Date().getFullYear()} Alexander Morton. All Rights Reserved.
                </p>
                <p className="text-gray-600 text-[10px] mt-1 italic uppercase tracking-wider">
                    Property of Alexander Morton - Strictly Confidential
                </p>
            </footer>
        </motion.div>
    );
};

export default Dashboard;
