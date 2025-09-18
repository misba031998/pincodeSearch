const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

// Load CSV data into memory
const csvFilePath = path.join('pincode.csv'); // Update file name as needed
let data = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Normalize pincode to string to avoid numeric mismatch
    if (row.pincode) {
      row.pincode = String(row.pincode).trim();
    }
    data.push(row);
  })
  .on('end', () => {
    console.log('✅ CSV file successfully processed.');
  })
  .on('error', (err) => {
    console.error('❌ Error reading the CSV file:', err);
  });

// API to get details by pincode
app.get('/get-sateDistict', (req, res) => {
  const { pincode } = req.query;

  if (!pincode) {
    return res.status(400).json({ message: 'Pincode is required' });
  }

  const result = data.find((row) => row.pincode === pincode.trim());

  if (result) {
    return res.json(result);
  } else {
    return res.status(404).json({ message: 'Pincode not found' });
  }
});

app.get('/get-details', (req, res) => {
  const { pincode } = req.query;

  if (!pincode) {
    return res.status(400).json({ message: 'Pincode is required' });
  }

  const results = data.filter((row) => row.pincode === pincode.trim());

  if (results.length > 0) {
    return res.json(results);
  } else {
    return res.status(404).json({ message: 'Pincode not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
