import React, { useEffect, useState } from "react";

const API_KEY = "YOUR_TRELLO_API_KEY";
const TOKEN = "YOUR_TRELLO_TOKEN";
const LIST_ID = "YOUR_LIST_ID";

export default function App() {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(
          `https://api.trello.com/1/lists/${LIST_ID}/cards?key=${API_KEY}&token=${TOKEN}`
        );
        const data = await res.json();
        setCards(data);
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

  if (cards.length === 0) return <p className="text-center mt-10 text-gray-500">Loading Trello cards...</p>;

  const card = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-xl text-center">
        <h2 className="text-2xl font-bold text-indigo-600 mb-4">{card.name}</h2>
        <p className="text-gray-700 mb-6">{card.desc || "No description available."}</p>
        <div className="flex justify-center gap-4">
          <button onClick={prevCard} className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded">
            ⏪ Prev
          </button>
          <button onClick={nextCard} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded">
            Next ⏩
          </button>
        </div>
      </div>
    </div>
  );
}
