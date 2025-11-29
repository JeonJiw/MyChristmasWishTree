import React, { useState } from "react";
import { ShareService } from "../services/shareService";

export default function ShareModal({ shareUrl, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await ShareService.copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">Share Your Wish Tree 🎄</h3>

        <p className="text-sm text-gray-600 mb-3">Your shareable link:</p>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Anyone with this link can view your wish list.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Done
        </button>
      </div>
    </div>
  );
}
