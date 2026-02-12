import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.resolve(__dirname, '../public/Customer-Purchase-History.xlsx');

console.log(`Checking file at: ${filePath}`);

if (!fs.existsSync(filePath)) {
    console.error("❌ File not found!");
    process.exit(1);
}

try {
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
        console.error("❌ Excel file is empty or could not be parsed.");
        process.exit(1);
    }

    const firstRow = jsonData[0];
    const requiredColumns = ['ProductCategory', 'TotalPrice', 'ReviewRating', 'PaymentMethod'];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

    if (missingColumns.length > 0) {
        console.error(`❌ Missing columns: ${missingColumns.join(', ')}`);
        console.log("Available columns:", Object.keys(firstRow));
    } else {
        console.log("✅ Data structure verified.");
        console.log(`✅ Loaded ${jsonData.length} rows.`);
        console.log("Sample row:", firstRow);
    }

} catch (err) {
    console.error("❌ Error parsing Excel file:", err);
}
