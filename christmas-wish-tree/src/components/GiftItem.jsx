import React from "react";

const priorityEmoji = {
  high: "⭐⭐⭐",
  medium: "⭐⭐",
  low: "⭐",
};

export default function GiftItem({ gift, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-800">
            🎁 {gift.giftName}
          </h4>
          {gift.description && (
            <p className="text-gray-600 text-sm mt-1">{gift.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-green-600 font-bold">${gift.price}</span>
            <span className="text-gray-500">
              Priority: {priorityEmoji[gift.priority]}
            </span>
          </div>
          {gift.link && (
            <a
              href={gift.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm mt-1 inline-block"
            >
              View Product →
            </a>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={onEdit}
            className="text-blue-500 hover:text-blue-700 px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
