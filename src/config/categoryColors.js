export const CATEGORY_COLORS = {
    // Top Level Categories
    'Office Supplies': '#10b981', // Emerald 500
    'Electronics': '#3b82f6',     // Blue 500
    'Furniture': '#f59e0b',       // Amber 500
    'Clothing': '#ec4899',        // Pink 500
    'Home': '#8b5cf6',            // Violet 500
    'Books': '#ef4444',           // Red 500

    // Sub Categories (Derived/Related)
    'General': '#34d399',         // Emerald 400
    'Smartphones': '#2563eb',     // Blue 600
    'Laptops': '#60a5fa',         // Blue 400
    'Accessories': '#93c5fd',     // Blue 300
    'Audio': '#1d4ed8',           // Blue 700

    // Payment Methods (High Contrast)
    'Credit Card': '#7c3aed',     // Violet 600
    'PayPal': '#0ea5e9',          // Sky 500
    'Cash': '#84cc16',            // Lime 500 (Distinct from Emerald)
    'Debit Card': '#db2777',      // Pink 600
    'Gift Card': '#facc15',       // Yellow 400
    'Online': '#06b6d4',          // Cyan 500

    // Fallback
    'Unknown': '#94a3b8'          // Slate 400
};

export const getColor = (key) => CATEGORY_COLORS[key] || CATEGORY_COLORS['Unknown'];
