import React, { useEffect, useState } from "react";


const API_KEY = "a75ab44e4d0efd38bbea9ca6013bfdb3";
const TOKEN = "c3c6f728b1dbf78cc5d853257bbe15a9bf55c4883d12695e0ec8edaa3550254e";
const TODO_LIST_ID = "68033d5e32a4f5b01f87cfd1";
const DONE_LIST_ID = "68033d60b3ee0f88fee53437";

export default function App() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(
          `https://api.trello.com/1/lists/${TODO_LIST_ID}/cards?key=${API_KEY}&token=${TOKEN}`
        );
        const data = await res.json();
        setCards(data.filter(card => !card.closed));
      } catch (err) {
        console.error("Failed to fetch Trello cards:", err);
      }
    };

    fetchCards();
  }, []);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const moveToDone = async () => {
    const card = cards[currentIndex];
    try {
      await fetch(
        `https://api.trello.com/1/cards/${card.id}?idList=${DONE_LIST_ID}&key=${API_KEY}&token=${TOKEN}`,
        { method: "PUT" }
      );
      const updatedCards = cards.filter((_, i) => i !== currentIndex);
      setCards(updatedCards);
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to move card:", err);
    }
  };

  if (cards.length === 0) return <p className="text-center mt-10 text-gray-500">No TODO tasks found.</p>;

  const card = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-600 p-6 flex flex-col items-center justify-center">
      <div className="bg-white font-mono shadow-md rounded-lg p-6 w-full max-w-xl text-center">
        <h2 className="text-2xl font-bold text-black mb-4">{card.name}</h2>
        <div className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
          {card.desc || "No description available."}
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={prevCard} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded">
            ＜ Prev
          </button>
          <button onClick={moveToDone} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded">
            ✓ Move to Done
          </button>
          <button onClick={nextCard} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded">
            Next ＞
          </button>
        </div>
      </div>
    </div>
  );
}
