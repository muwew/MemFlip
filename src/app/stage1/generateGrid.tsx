// This function generates a randomised grid of pairs
export function generateGrid(numPairs: number) {
    // Create array pair
    const pairs = Array.from({ length: numPairs }, (_, index) => index + 1);
  
    // Duplicate array to create pairs
    const gridItems = [...pairs, ...pairs];
  
    // Shuffle array
    for (let i = gridItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gridItems[i], gridItems[j]] = [gridItems[j], gridItems[i]]; // Swap elements
    }
  
    console.log(gridItems);
    return gridItems;
  }