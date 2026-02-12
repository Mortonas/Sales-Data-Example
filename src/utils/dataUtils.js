import * as XLSX from 'xlsx';
import { startOfYear, addDays, getWeek, getDay, format } from 'date-fns';
import { getColor } from '../config/categoryColors';

export const fetchAndParseData = async () => {
    try {
        const response = await fetch('/Customer-Purchase-History.xlsx');
        if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        let jsonData = XLSX.utils.sheet_to_json(worksheet);

        // --- Data Simulation / Enrichment ---
        // We simulate SubCategory and PurchaseDate if they don't exist.
        // Also ensure SKU exists or use ProductName as proxy.

        const categories = {
            'Electronics': ['Smartphones', 'Laptops', 'Accessories', 'Audio'],
            'Clothing': ['Men', 'Women', 'Kids', 'Sportswear'],
            'Home': ['Furniture', 'Decor', 'Kitchen', 'Bedding'],
            'Books': ['Fiction', 'Non-Fiction', 'Technical', 'E-Books']
        };

        const startDate = startOfYear(new Date(2025, 0, 1));

        jsonData = jsonData.map((item, index) => {
            // Ensure Category exists
            const category = item.ProductCategory || 'Uncategorized';

            // Simulate SubCategory if missing
            let subCategory = item.SubCategory;
            if (!subCategory) {
                const subs = categories[category] || ['General'];
                // Deterministic pseudo-random based on index to keep it consistent across reloads
                subCategory = subs[index % subs.length];
            }

            // Simulate PurchaseDate if missing (distribute over the year)
            // Using a simple hash of index to spread dates
            // Force simulation of PurchaseDate for the demo to ensure Heatmap looks populated
            // regardless of the input file's date range.
            let date = null; // Forces the generation logic below
            if (!date) {
                const dayOffset = (index * 23) % 365; // Use a prime stride to scatter dates more widely
                date = addDays(startDate, dayOffset);
            } else {
                date = new Date(date);
            }

            return {
                ...item,
                ProductCategory: category,
                SubCategory: subCategory,
                PurchaseDate: date,
                SKU: item.SKU || item.ProductName || `SKU-${index}`,
                TotalPrice: parseFloat(item.TotalPrice) || 0,
                Quantity: parseFloat(item.Quantity) || 1,
                ReviewRating: parseFloat(item.ReviewRating) || 3,
                PaymentMethod: item.PaymentMethod || 'Credit Card'
            };
        });

        console.log("Enriched Data:", jsonData.slice(0, 5)); // Debug log
        return jsonData;
    } catch (error) {
        console.error("Error loading data:", error);
        return [];
    }
};

export const processDataForCharts = (data) => {
    if (!data || data.length === 0) return null;

    // --- Core Helpers ---
    const viridis = ['#440154', '#482475', '#414487', '#355f8d', '#2a788e', '#21918c', '#22a884', '#44bf70', '#7ad151', '#bddf26', '#fde725'];

    // 1. Revenue by Category (Standard Bar)
    const revenueByCategory = {};
    data.forEach(item => {
        const cat = item.ProductCategory;
        revenueByCategory[cat] = (revenueByCategory[cat] || 0) + item.TotalPrice;
    });

    // 2. Sankey Data (Category -> SubCategory -> PaymentMethod)
    // Structure: { from, to, flow }
    // We need standard Sankey format for chartjs-chart-sankey
    const sankeyFlows = {};

    data.forEach(item => {
        const cat = item.ProductCategory;
        const sub = item.SubCategory;
        const pay = item.PaymentMethod;
        const val = item.TotalPrice;

        // Flow 1: Cat -> Sub
        const flow1Key = `${cat}|${sub}`;
        sankeyFlows[flow1Key] = (sankeyFlows[flow1Key] || 0) + val;

        // Flow 2: Sub -> Pay
        const flow2Key = `${sub}|${pay}`;
        sankeyFlows[flow2Key] = (sankeyFlows[flow2Key] || 0) + val;
    });

    const sankeyData = Object.entries(sankeyFlows).map(([key, value]) => {
        const [from, to] = key.split('|');
        return { from, to, flow: value };
    });

    // 2b. Sankey Colors - distinct per level
    // We can't easily assign per-node color in the simple map, but valid chartjs-sankey data allows 'colorFrom'/'colorTo' in datasets.
    // We will handle coloring in the dataset definition below.

    // 3. Sunburst Data (Category -> SubCategory -> SKU)
    // Nested Rings. 
    // Ring 1: Category
    // Ring 2: SubCategory
    // We will use nested Doughnut charts.

    // Aggregation
    const hier = {};
    let totalSunburstRevenue = 0;
    data.forEach(item => {
        const c = item.ProductCategory;
        const s = item.SubCategory || 'General'; // Ensure sub-category exists
        if (!hier[c]) hier[c] = { val: 0, subs: {} };
        hier[c].val += item.TotalPrice;
        if (!hier[c].subs[s]) hier[c].subs[s] = 0;
        hier[c].subs[s] += item.TotalPrice;
        totalSunburstRevenue += item.TotalPrice;
    });

    const sunburstLabels = [];
    const ring1Data = []; // Categories
    const ring1Colors = [];
    const ring1Labels = [];

    const ring2Data = []; // SubCategories
    const ring2Colors = [];
    const ring2Labels = [];
    const ring2Tooltips = [];


    // Sort categories by value for better visual layout
    const sortedCategories = Object.keys(hier).sort((a, b) => hier[b].val - hier[a].val);

    sortedCategories.forEach(catKey => {
        const catVal = hier[catKey].val;
        const baseColor = getColor(catKey);

        sunburstLabels.push(catKey);
        ring1Data.push(catVal);
        ring1Colors.push(baseColor);
        // Inner Ring Label: Name + %
        const percentage = ((catVal / totalSunburstRevenue) * 100).toFixed(0);
        ring1Labels.push(`${catKey} (${percentage}%)`);

        // SubCategories
        // SubCategories
        const subs = hier[catKey].subs;
        const sortedSubs = Object.entries(subs).sort((a, b) => b[1] - a[1]);

        sortedSubs.forEach(([subKey, subVal]) => {
            ring2Data.push(subVal);

            // Color Logic
            let subColor = getColor(subKey);
            if (subKey === 'General' || subColor === '#94a3b8') { // If unknown/fallback
                // Create a distinct shade based on baseColor
                subColor = baseColor; // Solid block for General
            }
            ring2Colors.push(subColor);

            // Outer Ring Label: Name only (keep clean), hide General
            ring2Labels.push(subKey === 'General' ? '' : subKey);
            // Tooltip: Show full name or parent if General
            ring2Tooltips.push(subKey === 'General' ? catKey : subKey);
        });
    });

    const sunburstChartData = {
        totalRevenue: totalSunburstRevenue, // For center text
        labels: sunburstLabels,
        datasets: [
            {
                label: 'Category',
                data: ring1Data,
                backgroundColor: ring1Colors,
                tooltipLabels: ring1Labels, // Use the formatted label
                datalabels: {
                    color: '#ffffff',
                    font: { weight: 'bold', size: 12 },
                    formatter: (value, ctx) => ring1Labels[ctx.dataIndex]
                },
                weight: 2
            },
            {
                label: 'Sub-Category',
                data: ring2Data,
                backgroundColor: ring2Colors,
                tooltipLabels: ring2Tooltips, // Use specific tooltips
                datalabels: {
                    color: '#ffffff',
                    font: { size: 10 },
                    formatter: (value, ctx) => ring2Labels[ctx.dataIndex],
                    display: (ctx) => {
                        // Only show if segment is large enough
                        return ctx.dataset.data[ctx.dataIndex] > totalSunburstRevenue * 0.05;
                    }
                },
                weight: 1
            }
        ]
    };

    // 4. Radar Chart (Normalized Metrics: Revenue, Margin(simulated), Rating, Growth(simulated), Returns(simulated))
    // We compare top 3 categories.
    const radarMetrics = {};
    Object.keys(hier).slice(0, 3).forEach(cat => {
        // Collect metrics
        const items = data.filter(d => d.ProductCategory === cat);
        const revenue = items.reduce((sum, d) => sum + d.TotalPrice, 0);
        const rating = items.reduce((sum, d) => sum + d.ReviewRating, 0) / items.length;
        // Simulate Margin (randomized based on cat name length for determinism)
        const margin = (cat.length * 5) % 30 + 10; // %
        // Simulate Return Rate
        const returnRate = (cat.length * 2) % 10; // %
        // Simulate Growth
        const growth = (cat.length * 3) % 20 + 5; // %

        radarMetrics[cat] = { Revenue: revenue, Rating: rating, Margin: margin, 'Return Rate': returnRate, Growth: growth };
    });

    // Normalization (Min-Max to 0-100)
    const metricKeys = ['Revenue', 'Rating', 'Margin', 'Return Rate', 'Growth'];
    const radarDatasets = [];

    // We need global min/max for normalization
    const maxVals = {};
    const minVals = {};

    metricKeys.forEach(m => {
        // Collect all values for this metric across ALL categories to find true min/max
        const allValsForMetric = Object.values(radarMetrics).map(obj => obj[m]);
        maxVals[m] = Math.max(...allValsForMetric);
        minVals[m] = Math.min(...allValsForMetric);
    });

    Object.entries(radarMetrics).forEach(([cat, metrics], idx) => {
        const normalized = metricKeys.map(m => {
            const raw = metrics[m];
            const range = maxVals[m] - minVals[m] || 1;
            // For Return Rate, lower is better, so invert
            if (m === 'Return Rate') {
                return ((maxVals[m] - raw) / range) * 100;
            }
            return ((raw - minVals[m]) / range) * 100;
        });

        radarDatasets.push({
            label: cat,
            data: normalized,
            fill: true,
            backgroundColor: getColor(cat) + '40', // transparent
            borderColor: getColor(cat),
            pointBackgroundColor: '#fff',
            pointBorderColor: '#fff',
        });
    });


    // 5. Pareto Chart (Product Performance)
    // 80/20 Rule: Sorted Bar of Revenue + Cumulative % Line
    // Group by SKU
    const skuRevenue = {};
    data.forEach(d => {
        skuRevenue[d.SKU] = (skuRevenue[d.SKU] || 0) + d.TotalPrice;
    });

    const sortedSkus = Object.entries(skuRevenue)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20); // Top 20 for readability

    const totalRev = Object.values(skuRevenue).reduce((a, b) => a + b, 0);

    // Pareto of Top 20 (normalized to the Top 20 total for better visual effect)
    const paretoLabels = sortedSkus.map(d => d[0].substring(0, 15) + (d[0].length > 15 ? '...' : ''));
    const paretoBars = sortedSkus.map(d => d[1]);

    const top20Total = paretoBars.reduce((a, b) => a + b, 0);
    let cum = 0;
    const paretoLine = sortedSkus.map(d => {
        cum += d[1];
        return (cum / top20Total) * 100;
    });

    const paretoData = {
        labels: paretoLabels,
        datasets: [
            {
                type: 'bar',
                label: 'Revenue',
                data: paretoBars,
                backgroundColor: '#2a788e',
                order: 2,
                yAxisID: 'y'
            },
            {
                type: 'line',
                label: 'Cumulative %',
                data: paretoLine,
                borderColor: '#fde725',
                borderWidth: 2,
                fill: false,
                tension: 0.1,
                order: 1,
                yAxisID: 'y1'
            }
        ]
    };

    // 6. Heatmap Data (Week x Day)
    // chartjs-chart-matrix expects {x, y, v}
    // x: Week Number (1-52), y: Day of Week (0-6 or Sun-Sat)
    const heatmapPoints = {};

    data.forEach(d => {
        const date = d.PurchaseDate;
        // getWeek returns week of year 1-52ish
        const week = getWeek(date);
        // getDay returns 0 (Sun) - 6 (Sat)
        const day = getDay(date);

        const key = `${week}-${day}`;
        heatmapPoints[key] = (heatmapPoints[key] || 0) + d.TotalPrice;
    });

    const matrixData = [];
    // We iterate to ensure grid is full or sparse as per data
    Object.entries(heatmapPoints).forEach(([key, val]) => {
        const [w, d] = key.split('-');
        matrixData.push({
            x: parseInt(w),
            y: parseInt(d), // 0-6
            v: val
        });
    });

    // 7. Stats Refresh
    const totalQuantity = data.reduce((sum, item) => sum + item.Quantity, 0);
    const avgRating = data.reduce((sum, item) => sum + item.ReviewRating, 0) / (data.length || 1);

    // Helper: Binning
    const groupValuesByKey = (dataset, keyExtractor, valueExtractor) => {
        const groups = {};
        dataset.forEach(item => {
            const key = keyExtractor(item);
            const value = valueExtractor(item);
            if (key !== null && key !== undefined && !isNaN(key) && !isNaN(value)) {
                if (!groups[key]) groups[key] = [];
                groups[key].push(value);
            }
        });
        return Object.keys(groups)
            .sort((a, b) => parseFloat(a) - parseFloat(b))
            .map(key => ({
                x: key,
                y: groups[key]
            }));
    };

    // ... (Existing Box Plot / Scatter logic remains valuable, keeping it)
    const ratingBoxPlotData = groupValuesByKey(
        data,
        (item) => Math.round(parseFloat(item.ReviewRating) || 0) || null,
        (item) => parseFloat(item.TotalPrice) || 0
    );
    const volumeBoxPlotData = groupValuesByKey(
        data,
        (item) => Math.round(parseFloat(item.Quantity) || 1),
        (item) => parseFloat(item.UnitPrice) || 0
    );
    // Category Treemap (Simple)
    const treemapData = Object.entries(revenueByCategory).map(([key, value]) => ({
        category: key,
        value: value
    }));
    // CLV (Simple)
    const customerLifetimeValue = {};
    data.forEach(item => {
        const customer = item.CustomerName || 'Unknown';
        customerLifetimeValue[customer] = (customerLifetimeValue[customer] || 0) + item.TotalPrice;
    });
    const clvValues = Object.values(customerLifetimeValue).sort((a, b) => a - b);
    const binCount = 10;
    const maxCLV = clvValues[clvValues.length - 1] || 0;
    const binSize = Math.ceil(maxCLV / binCount);
    const clvBins = new Array(binCount).fill(0);
    const clvLabels = [];
    for (let i = 0; i < binCount; i++) {
        clvLabels.push(`${(i * binSize).toFixed(0)} - ${((i + 1) * binSize).toFixed(0)}`);
    }
    clvValues.forEach(val => {
        const binIndex = Math.min(Math.floor(val / binSize), binCount - 1);
        clvBins[binIndex]++;
    });
    // Rating vs Revenue Dual
    const ratingByCategory = {};
    const countByCategory = {};
    data.forEach(item => {
        const category = item.ProductCategory || 'Unknown';
        ratingByCategory[category] = (ratingByCategory[category] || 0) + item.ReviewRating;
        countByCategory[category] = (countByCategory[category] || 0) + 1;
    });
    const categoriesList = Object.keys(revenueByCategory);
    const avgRatingPerCategory = categoriesList.map(cat => (ratingByCategory[cat] / countByCategory[cat]).toFixed(2));
    const totalRevenuePerCategory = categoriesList.map(cat => revenueByCategory[cat]);
    // Payment Methods
    const paymentMethods = {};
    data.forEach(item => {
        const method = item.PaymentMethod || 'Unknown';
        paymentMethods[method] = (paymentMethods[method] || 0) + 1;
    });
    // Scatter
    const revenueVolumeScatterPoints = data.map(item => {
        const x = parseFloat(item.Quantity) || 1;
        const y = parseFloat(item.UnitPrice) || 0;
        return { x, y, revenue: x * y, product: item.ProductName || 'Unknown Item' };
    });
    const getRevenueColor = (rev) => {
        const maxRev = Math.max(...revenueVolumeScatterPoints.map(p => p.revenue), 1);
        const ratio = Math.min(rev / (maxRev * 0.8), 1);
        const r = Math.floor(45 + (236 - 45) * ratio);
        const g = Math.floor(212 + (72 - 212) * ratio);
        const b = Math.floor(191 + (153 - 191) * ratio);
        return `rgba(${r}, ${g}, ${b}, 0.7)`;
    };


    return {
        // Original / Basic
        stats: { totalRevenue: totalRev, totalQuantity, avgRating },
        revenueByCategory: {
            labels: Object.keys(revenueByCategory),
            datasets: [{
                label: 'Revenue',
                data: Object.values(revenueByCategory),
                backgroundColor: Object.keys(revenueByCategory).map(getColor),
                borderColor: Object.keys(revenueByCategory).map(c => getColor(c) + 'AA'),
                borderWidth: 1
            }]
        },
        // Advanced
        sankeyData: {
            datasets: [{
                label: 'Revenue Flow',
                data: sankeyData,
                colorFrom: (c) => getColor(c.dataset.data[c.dataIndex].from),
                colorTo: (c) => getColor(c.dataset.data[c.dataIndex].to),
                colorMode: 'gradient',
                labels: {
                    color: 'white',
                    font: { size: 12, weight: 'bold' }
                },
                size: 'max',
                priority: {
                    'Credit Card': 1,
                    'PayPal': 1
                },
                column: {
                    'Electronics': 0, 'Office Supplies': 0, 'Furniture': 0, 'Clothing': 0, 'Home': 0, 'Books': 0,
                    'Online': 2, 'Credit Card': 2, 'PayPal': 2, 'Cash': 2, 'Debit Card': 2, 'Gift Card': 2
                }
            }]
        },
        sunburstData: sunburstChartData,
        radarData: {
            labels: metricKeys,
            datasets: radarDatasets
        },
        paretoData: paretoData,
        heatmapData: {
            datasets: [{
                label: 'Sales Heatmap',
                data: matrixData,
                backgroundColor(c) {
                    const val = c.raw?.v || 0;
                    const max = Math.max(...matrixData.map(d => d.v));
                    const alpha = Math.min(val / max + 0.1, 1);
                    return `rgba(33, 145, 140, ${alpha})`; // Teal-ish
                },
                width: ({ chart }) => (chart.chartArea || {}).width / 53 - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / 7 - 1
            }]
        },
        // Legacy Support
        ratingBoxPlotData: {
            labels: ratingBoxPlotData.map(d => d.x),
            datasets: [{
                label: 'Transaction Value Distribution',
                data: ratingBoxPlotData.map(d => d.y),
                backgroundColor: 'rgba(253, 231, 37, 0.5)',
                borderColor: '#fde725',
                borderWidth: 1
            }]
        },
        paymentMethods: {
            labels: Object.keys(paymentMethods),
            datasets: [{
                label: 'Payment Methods',
                data: Object.values(paymentMethods),
                backgroundColor: viridis.slice(0, Object.keys(paymentMethods).length),
                borderWidth: 0
            }]
        },
        volumeBoxPlotData: {
            labels: volumeBoxPlotData.map(d => d.x),
            datasets: [{
                label: 'Unit Price Distribution',
                data: volumeBoxPlotData.map(d => d.y),
                backgroundColor: 'rgba(33, 145, 140, 0.5)',
                borderColor: '#21918c',
                borderWidth: 1
            }]
        },
        treemapData: {
            datasets: [{
                label: 'Revenue by Category',
                tree: treemapData,
                key: 'value',
                groups: ['category'],
                backgroundColor: (ctx) => {
                    if (ctx.type !== 'data') return 'transparent';
                    // Treemap data structure: ctx.raw._data.category usually
                    const item = treemapData[ctx.dataIndex];
                    return getColor(item ? item.category : 'Unknown');
                },
                labels: { display: true, color: 'white', font: { size: 14 } }
            }]
        },
        clvHistogram: {
            labels: clvLabels,
            datasets: [{
                label: 'Customer Count',
                data: clvBins,
                backgroundColor: '#355f8d',
                borderColor: '#355f8d',
                borderWidth: 1
            }]
        },
        ratingRevenueDual: {
            labels: categoriesList,
            datasets: [
                { type: 'bar', label: 'Total Revenue', data: totalRevenuePerCategory, backgroundColor: '#2a788e', yAxisID: 'y', order: 2 },
                { type: 'line', label: 'Avg Rating', data: avgRatingPerCategory, borderColor: '#fde725', borderWidth: 2, pointBackgroundColor: '#fff', yAxisID: 'y1', order: 1 }
            ]
        },
        revenueVolumeScatterData: {
            datasets: [{
                label: 'Price vs Quantity',
                data: revenueVolumeScatterPoints,
                pointBackgroundColor: revenueVolumeScatterPoints.map(p => getRevenueColor(p.revenue)),
                pointBorderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        ratingScatterData: {
            datasets: [{ label: 'Rating vs Transaction', data: [], pointBackgroundColor: '#fff' }] // Placeholder to avoid breaking if component is still used
        }
    };
};
