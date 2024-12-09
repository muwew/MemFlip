// generateGrid.ts
export function generateGrid(numPairs: number) {
    // Create an array of pairs (assuming images are numbered 1, 2, ..., numPairs)
    const pairs = Array.from({ length: numPairs }, (_, index) => index + 1);
  
    // Duplicate the array to create pairs (each image will appear twice)
    const gridItems = [...pairs, ...pairs];
  
    // Shuffle the array to randomize the positions
    for (let i = gridItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gridItems[i], gridItems[j]] = [gridItems[j], gridItems[i]]; // Swap elements
    }
  
    console.log(gridItems);
    return gridItems;
  }