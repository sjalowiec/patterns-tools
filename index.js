/**
 * Neckline Shaping Calculator
 * Interactive console application for calculating knitting neckline patterns
 */

const readline = require('readline');
const { cmToStitches, cmToRows, calculateStitchGauge, calculateRowGauge } = require('./modules/gauge');
const { necklineRound } = require('./modules/neckline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Prompt user for input
 * @param {string} question - Question to ask user
 * @returns {Promise<string>} User's response
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Main application function
 */
async function main() {
  console.log('=== Neckline Shaping Calculator ===\n');
  
  try {
    // Get gauge information
    console.log('First, let\'s establish your gauge:');
    const swatchStitches = parseFloat(await askQuestion('How many stitches in your gauge swatch? '));
    const swatchWidth = parseFloat(await askQuestion('Width of your swatch in cm? '));
    const swatchRows = parseFloat(await askQuestion('How many rows in your gauge swatch? '));
    const swatchHeight = parseFloat(await askQuestion('Height of your swatch in cm? '));
    
    // Calculate gauge
    const gaugeSts = calculateStitchGauge(swatchStitches, swatchWidth);
    const gaugeRows = calculateRowGauge(swatchRows, swatchHeight);
    
    console.log(`\nCalculated gauge: ${gaugeSts.toFixed(2)} stitches/cm, ${gaugeRows.toFixed(2)} rows/cm\n`);
    
    // Get garment dimensions
    console.log('Now, garment dimensions:');
    const garmentWidthCm = parseFloat(await askQuestion('Garment width in cm? '));
    const neckWidthCm = parseFloat(await askQuestion('Neck opening width in cm? '));
    const neckDepthCm = parseFloat(await askQuestion('Neck depth in cm? '));
    const bodyHeightCm = parseFloat(await askQuestion('Body height before neckline in cm? '));
    
    // Convert to stitches and rows
    const widthSts = cmToStitches(garmentWidthCm, gaugeSts);
    const neckWidthSts = cmToStitches(neckWidthCm, gaugeSts);
    const depthRows = cmToRows(neckDepthCm, gaugeRows);
    const startRow = cmToRows(bodyHeightCm, gaugeRows);
    
    console.log(`\nConverted to stitches/rows:`);
    console.log(`- Garment width: ${widthSts} stitches`);
    console.log(`- Neck width: ${neckWidthSts} stitches`);
    console.log(`- Neck depth: ${depthRows} rows`);
    console.log(`- Start shaping at row: ${startRow}\n`);
    
    // Calculate neckline shaping
    const necklinePattern = necklineRound({
      widthSts,
      depthRows,
      startRow,
      neckWidthSts
    });
    
    // Output results
    console.log('=== NECKLINE SHAPING PATTERN ===\n');
    console.log(JSON.stringify(necklinePattern, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    rl.close();
  }
}

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nGoodbye!');
  rl.close();
  process.exit(0);
});

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };