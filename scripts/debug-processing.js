import { processDataForCharts } from '../src/utils/dataUtils.js';
import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Mocking window/fetch for node environment if needed, or just bypassing fetch
// We will manually read the excel file and pass it to processDataForCharts if possible
// Or just mock the data array if parsing is fine.

// Let's try to verify if processDataForCharts throws with valid data.
const mockData = [
    { CustomerName: 'A', TotalPrice: '100', Quantity: '2', ReviewRating: '4', PaymentMethod: 'Cash', ProductCategory: 'Electronics', UnitPrice: '50' },
    { CustomerName: 'B', TotalPrice: '200', Quantity: '3', ReviewRating: '5', PaymentMethod: 'Card', ProductCategory: 'Furniture', UnitPrice: '60' },
    // Add edge cases
    { CustomerName: 'C', TotalPrice: 'invalid', Quantity: null, ReviewRating: undefined }
];

try {
    console.log("Testing processDataForCharts with mock data...");
    const result = processDataForCharts(mockData);
    console.log("Success! Result keys:", Object.keys(result));
    console.log("Checking specific keys:");
    if (result.volumeBoxPlotData) console.log("volumeBoxPlotData present");
    if (result.ratingBoxPlotData) console.log("ratingBoxPlotData present");
} catch (e) {
    console.error("Error in processDataForCharts:", e);
}

// Also try to read the actual file to see if parsing fails? 
// The error "Failed to load data" in Dashboard.jsx catches everything.

const filePath = path.join(process.cwd(), 'public', 'Customer-Purchase-History.xlsx');
try {
    console.log(`\nReading file from ${filePath}...`);
    if (fs.existsSync(filePath)) {
        const buf = fs.readFileSync(filePath);
        const workbook = XLSX.read(buf, { type: 'buffer' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        console.log(`File read successfully. ${jsonData.length} rows.`);

        console.log("Testing processDataForCharts with REAL data...");
        const realResult = processDataForCharts(jsonData);
        console.log("Real data processing Success!");
    } else {
        console.log("File not found (expected if running in wrong Content Root, but script is simple)");
    }
} catch (e) {
    console.error("Error reading/processing real file:", e);
}
