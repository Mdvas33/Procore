const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const filePath = path.resolve(__dirname, '../checklist_inspección_Marketing.xlsx');
const wb = XLSX.readFile(filePath);
const ws = wb.Sheets[wb.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

console.log(JSON.stringify(rows.slice(0, 80), null, 2));
