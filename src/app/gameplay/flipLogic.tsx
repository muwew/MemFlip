export interface CardState{
    vibrating: boolean;
    flipped: boolean;
    matched: boolean;
}

export const handleCardFlip =(
    index: number,
    image: number,
    flippedCards: {index: number, image: number}[],
    setFlippedCards: React.Dispatch<React.SetStateAction<{index: number, image: number}[]>>,
    cardStates: CardState[],
    setCardStates: React.Dispatch<React.SetStateAction<CardState[]>>,
    matchedPairs: number,
    setMatchedPairs: React.Dispatch<React.SetStateAction<number>>,
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const newCardStates = [...cardStates];
    newCardStates[index].flipped = false; // flip the card
    setCardStates(newCardStates);

    // Add flipped card to flippedCards array
    const newFlippedCards = [...flippedCards, {index, image}];
    setFlippedCards(newFlippedCards);

    if(newFlippedCards.length === 2){
        const newCardStates = [...cardStates];
        const [firstCard, secondCard] = newFlippedCards;

        // if the two flipped cards match
        if(firstCard.image === secondCard.image){
            newCardStates[firstCard.index].matched = true;
            newCardStates[secondCard.index].matched = true;

            setCardStates(newCardStates);
            const updatePairs = matchedPairs + 1;
            setMatchedPairs((prev) => {
                const updatedMatchedPairs = prev + 1;
                // console.log(`Matched pairs: ${updatedMatchedPairs}`);
                return updatedMatchedPairs;
            });
        }

        // if the two flipped cards do not match
        else{
            setDisabled(true); // disable all cards
            newCardStates[firstCard.index].vibrating = true;
            newCardStates[secondCard.index].vibrating = true;
            setCardStates(newCardStates);
            // flip them back after a delay (1000ms)
            setTimeout(() => {
                newCardStates[firstCard.index].flipped = true;
                newCardStates[secondCard.index].flipped = true;

                newCardStates[firstCard.index].vibrating = false;
                newCardStates[secondCard.index].vibrating = false;

                setCardStates(newCardStates);
                setDisabled(false); // enable all cards
            }, 1000);
        }

        // Reset flipped cards
        setFlippedCards([]);
    }
}