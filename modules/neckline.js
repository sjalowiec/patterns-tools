/**
 * Neckline shaping calculations for machine knitting
 */

/**
 * Calculate round neckline shaping
 * @param {Object} params - Neckline parameters
 * @param {number} params.widthSts - Total garment width in stitches
 * @param {number} params.depthRows - Neckline depth in rows
 * @param {number} params.startRow - Row to start neckline shaping
 * @param {number} params.neckWidthSts - Width of neck opening in stitches
 * @returns {Object} Neckline shaping instructions
 */
export function necklineRound({ widthSts, depthRows, startRow, neckWidthSts }) {
  // Ensure even shoulder division by adjusting neck width if needed
  let adjustedNeckSts = neckWidthSts;
  if ((widthSts - neckWidthSts) % 2 !== 0) {
    adjustedNeckSts = neckWidthSts + 1; // Add 1 to make shoulders even
  }
  
  // Calculate shoulder width
  const shoulderSts = Math.floor((widthSts - adjustedNeckSts) / 2);
  
  // Calculate shaping parameters
  const bindOffSts = Math.floor(widthSts / 3); // Initial center bind-off
  const sideTotal = Math.floor(widthSts / 2); // Stitches per side
  const totalDecreases = Math.max(0, adjustedNeckSts - bindOffSts);
  const perSideDecreases = Math.floor(totalDecreases / 2);
  
  // Split decreases into sections (every 2 rows, then every row)
  const section1Decreases = Math.floor(perSideDecreases / 2); // Every other row
  const section2Decreases = perSideDecreases - section1Decreases; // Every row
  
  // Calculate shaping rows
  const section1Rows = section1Decreases * 2;
  const section2Rows = section2Decreases;
  const shapingRows = section1Rows + section2Rows;
  
  // Calculate shoulder shaping
  const shoulderDropRows = Math.max(1, Math.round(depthRows * 0.25)); // 25% of depth for shoulder
  const remainingRows = Math.max(0, depthRows - shapingRows - shoulderDropRows);
  
  // Distribute shoulder shaping evenly
  const turnBlocks = distributeEvenly(shoulderDropRows, shoulderSts);
  
  const result = {
    style: "round",
    depthRows: depthRows,
    neckWidthSts: adjustedNeckSts,
    shoulderSts: shoulderSts,
    shapingSteps: {
      setup: {
        startRow: startRow,
        bindOffCenter: bindOffSts,
        scrapOffSide: sideTotal
      },
      leftSide: {
        section1: {
          decreases: section1Decreases,
          frequency: "every 2 rows",
          rows: section1Rows
        },
        section2: {
          decreases: section2Decreases,
          frequency: "every row", 
          rows: section2Rows
        },
        remainingRows: remainingRows,
        finalStitches: shoulderSts
      },
      rightSide: {
        section1: {
          decreases: section1Decreases,
          frequency: "every 2 rows",
          rows: section1Rows
        },
        section2: {
          decreases: section2Decreases,
          frequency: "every row",
          rows: section2Rows
        },
        remainingRows: remainingRows,
        finalStitches: shoulderSts
      },
      shoulders: {
        dropRows: shoulderDropRows,
        turnBlocks: turnBlocks,
        stitchesPerShoulder: shoulderSts
      }
    }
  };
  
  return result;
}

/**
 * Distribute stitches evenly across short-row groups
 * @param {number} groups - Number of short-row groups
 * @param {number} stitches - Total stitches to distribute
 * @returns {Array} Array of stitches per group
 */
export function distributeEvenly(groups, stitches) {
  if (groups <= 0 || stitches <= 0) return [];
  
  const perGroup = Math.floor(stitches / groups);
  const extra = stitches % groups;
  const result = [];
  
  for (let i = 0; i < groups; i++) {
    result.push(perGroup + (i < extra ? 1 : 0));
  }
  
  return result;
}

/**
 * Calculate shoulder width from total and neck stitches
 * @param {number} totalSts - Total cast-on stitches
 * @param {number} neckSts - Neck opening stitches
 * @returns {number} Stitches per shoulder
 */
export function calcShoulderWidth(totalSts, neckSts) {
  const remainingSts = totalSts - neckSts;
  return Math.floor(remainingSts / 2);
}