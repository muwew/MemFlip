export interface CardState{
    vibrating: boolean;
    flipped: boolean;
    matched: boolean;
}

export const handleCardFlip = (
    index: number,
    image: number,
    flippedCards: { index: number; image: number }[],
    setFlippedCards: React.Dispatch<React.SetStateAction<{ index: number; image: number }[]>>,
    cardStates: CardState[],
    setCardStates: React.Dispatch<React.SetStateAction<CardState[]>>,
    matchedPairs: number,
    setMatchedPairs: React.Dispatch<React.SetStateAction<number>>,
    disabled: boolean,
    setDisabled: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (disabled) return; // Prevent clicking while disabled

    const newCardStates = [...cardStates];
    newCardStates[index].flipped = false;
    setCardStates(newCardStates);

    const newFlippedCards = [...flippedCards, { index, image }];
    setFlippedCards(newFlippedCards);

    // If two cards are flipped
    if (newFlippedCards.length === 2) {
        const [firstCard, secondCard] = newFlippedCards;

        // If match
        if (firstCard.image === secondCard.image) {
            newCardStates[firstCard.index].matched = true;
            newCardStates[secondCard.index].matched = true;
            setCardStates(newCardStates);
            setMatchedPairs((prev) => prev + 1);
        } else {
            setDisabled(true);

            newCardStates[firstCard.index].vibrating = true;
            newCardStates[secondCard.index].vibrating = true;
            setCardStates([...newCardStates]);

            // Set timeout to flip back cards
            setTimeout(() => {
                requestAnimationFrame(() => {
                    setCardStates((prevState) => {
                        const updatedStates = [...prevState];
                        updatedStates[firstCard.index].flipped = true;
                        updatedStates[secondCard.index].flipped = true;
                        updatedStates[firstCard.index].vibrating = false;
                        updatedStates[secondCard.index].vibrating = false;
                        return updatedStates;
                    });

                    setTimeout(() => {
                        setDisabled(false);
                    }, 100); // Set delay to appropriate value
                });
            }, 800); // Set delay to appropriate value
        }

        setFlippedCards([]);
    }
};
