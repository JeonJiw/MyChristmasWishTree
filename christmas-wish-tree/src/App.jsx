// ==================== Christmas Wish Tree React App ====================
// Save this as: src/App.jsx

import React, { useState } from "react";
import treeImage from "./assets/christmas-tree.jpg"; // Adjust the path based on your actual image location

// ==================== DATA SERVICES ====================

const StorageService = {
  saveTree: (tree) => {
    try {
      const trees = StorageService.getAllTrees();
      const index = trees.findIndex((t) => t.treeId === tree.treeId);
      if (index >= 0) {
        trees[index] = tree;
      } else {
        trees.push(tree);
      }
      localStorage.setItem("christmasTrees", JSON.stringify(trees));
      return true;
    } catch (error) {
      console.error("Save failed:", error);
      return false;
    }
  },

  loadTree: (treeId) => {
    const trees = StorageService.getAllTrees();
    return trees.find((t) => t.treeId === treeId) || null;
  },

  getAllTrees: () => {
    try {
      const data = localStorage.getItem("christmasTrees");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  deleteTree: (treeId) => {
    const trees = StorageService.getAllTrees().filter(
      (t) => t.treeId !== treeId
    );
    localStorage.setItem("christmasTrees", JSON.stringify(trees));
  },
};

const ShareService = {
  generateShareId: () => Math.random().toString(36).substr(2, 9),

  createShareURL: (shareId) => `${window.location.origin}/#/tree/${shareId}`,

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    }
  },
};

// ==================== MAIN APP ====================

export default function ChristmasWishTreeApp() {
  const [currentView, setCurrentView] = useState("home");
  const [currentTree, setCurrentTree] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const createNewTree = () => {
    const newTree = {
      treeId: "tree_" + Date.now(),
      ownerName: "You",
      treeName: "My Christmas Wishes",
      createdAt: new Date().toISOString(),
      shareId: ShareService.generateShareId(),
      ornaments: [],
    };
    setCurrentTree(newTree);
    setCurrentView("editor");
    StorageService.saveTree(newTree);
  };

  const addOrnament = (ornamentData) => {
    const newOrnament = {
      id: "orn_" + Date.now(),
      ...ornamentData,
      position: {
        x: 150 + Math.random() * 100,
        y: 150 + Math.random() * 100,
      },
    };

    const updatedTree = {
      ...currentTree,
      ornaments: [...currentTree.ornaments, newOrnament],
    };

    setCurrentTree(updatedTree);
    StorageService.saveTree(updatedTree);
  };

  const deleteOrnament = (ornamentId) => {
    if (window.confirm("Delete this gift?")) {
      const updatedTree = {
        ...currentTree,
        ornaments: currentTree.ornaments.filter((o) => o.id !== ornamentId),
      };
      setCurrentTree(updatedTree);
      StorageService.saveTree(updatedTree);
    }
  };

  const updateOrnament = (ornamentId, updates) => {
    const updatedTree = {
      ...currentTree,
      ornaments: currentTree.ornaments.map((o) =>
        o.id === ornamentId ? { ...o, ...updates } : o
      ),
    };
    setCurrentTree(updatedTree);
    StorageService.saveTree(updatedTree);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      {currentView === "home" && <HomePage onCreateTree={createNewTree} />}

      {currentView === "editor" && currentTree && (
        <TreeEditor
          tree={currentTree}
          onAddGift={addOrnament}
          onUpdateGift={updateOrnament}
          onDeleteGift={deleteOrnament}
          onShare={() => setShowShare(true)}
          onBack={() => setCurrentView("home")}
        />
      )}

      {showShare && currentTree && (
        <ShareModal
          shareUrl={ShareService.createShareURL(currentTree.shareId)}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

// ==================== HOME PAGE ====================

function HomePage({ onCreateTree }) {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-red-50 via-emerald-50 to-green-100">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-10">
        <div className="text-center md:text-left max-w-md">
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow-sm mb-3">
            🎄 My Christmas Wish Tree
          </h1>
          <p className="text-gray-700 mb-6 text-sm md:text-base">
            Turn your wish list into a cozy Christmas tree and share it with
            family and friends.
          </p>

          <button
            onClick={onCreateTree}
            className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-xl transform transition hover:scale-105 hover:shadow-2xl"
          >
            Create Your Wish Tree
          </button>

          <div className="mt-6 text-xs md:text-sm text-gray-500 flex flex-col gap-1">
            <span>✨ Simple • Visual • Shareable</span>
            <span>🎁 Add gifts, set priorities, and send a magic link.</span>
          </div>
        </div>

        <div className="w-full md:w-1/2 mt-10 md:mt-0">
          {/* Preview tree with no ornaments yet */}
          <TreeCanvas ornaments={[]} isPreview />
        </div>
      </div>
    </div>
  );
}

// ==================== TREE EDITOR ====================

function TreeEditor({
  tree,
  onAddGift,
  onUpdateGift,
  onDeleteGift,
  onShare,
  onBack,
}) {
  const [editingGift, setEditingGift] = useState(null);
  const [giftName, setGiftName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [link, setLink] = useState("");
  const [priority, setPriority] = useState("medium");

  const resetForm = () => {
    setEditingGift(null);
    setGiftName("");
    setDescription("");
    setPrice("");
    setLink("");
    setPriority("medium");
  };

  const handleSubmit = () => {
    if (!giftName || !price) {
      alert("Please fill in gift name and price");
      return;
    }
    const payload = {
      giftName,
      description,
      price: parseFloat(price),
      link,
      priority,
    };

    if (editingGift) {
      onUpdateGift(editingGift.id, payload);
    } else {
      onAddGift(payload);
    }
    resetForm();
  };

  const handleEditClick = (gift) => {
    setEditingGift(gift);
    setGiftName(gift.giftName || "");
    setDescription(gift.description || "");
    setPrice(gift.price != null ? String(gift.price) : "");
    setLink(gift.link || "");
    setPriority(gift.priority || "medium");
  };

  const handleDeleteClick = (giftId) => {
    onDeleteGift(giftId);
    if (editingGift && editingGift.id === giftId) {
      resetForm();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-green-700">
          🎄 {tree.treeName}
        </h2>
        <button
          onClick={onShare}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Share
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-2 items-start">
        <div className="flex justify-center">
          <TreeCanvas ornaments={tree.ornaments} />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            {editingGift ? "Edit gift" : "Add a new gift"}
          </h3>

          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gift name *
              </label>
              <input
                type="text"
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="e.g. Nintendo Switch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="e.g. Animal Crossing edition"
                rows="2"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase link
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex gap-3 mb-5">
            {editingGift && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex-1"
              >
                Cancel edit
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex-1"
            >
              {editingGift ? "Update gift" : "Add gift"}
            </button>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Your wish list
            </h4>
            {tree.ornaments.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No gifts yet. Add your first wish on the form above.
              </p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {tree.ornaments.map((ornament) => (
                  <GiftItem
                    key={ornament.id}
                    gift={ornament}
                    onEdit={() => handleEditClick(ornament)}
                    onDelete={() => handleDeleteClick(ornament.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== TREE CANVAS (iPhone + Instagram story mock) ====================

function TreeCanvas({ ornaments, isPreview = false }) {
  const displayOrnaments = isPreview
    ? [
        { id: "preview-1", giftName: "Bag" },
        { id: "preview-2", giftName: "Perfume" },
        { id: "preview-3", giftName: "Book" },
        { id: "preview-4", giftName: "Shoes" },
      ]
    : ornaments || [];

  return (
    <div className="flex justify-center">
      {/* iPhone frame */}
      <div className="relative bg-black rounded-[2.5rem] p-3 shadow-2xl w-[260px] md:w-[280px]">
        {/* side button hints */}
        <div className="hidden md:block absolute -left-1 top-16 h-10 w-0.5 bg-neutral-700 rounded-full" />
        <div className="hidden md:block absolute -left-1 top-28 h-20 w-0.5 bg-neutral-700 rounded-full" />
        <div className="hidden md:block absolute -right-1 top-20 h-16 w-0.5 bg-neutral-700 rounded-full" />

        {/* inner screen */}
        <div className="relative rounded-[2rem] overflow-hidden bg-black">
          {/* top notch */}
          <div className="absolute top-0 inset-x-0 flex justify-center pt-1 z-20">
            <div className="h-5 w-28 bg-black rounded-b-3xl" />
          </div>

          {/* fake Instagram top bar */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-3 pb-1 text-[10px] text-white/90">
            <button className="opacity-80">✕</button>
            <span className="font-medium">Your story</span>
            <div className="flex items-center gap-2">
              <span className="text-xs">Aa</span>
              <span>😊</span>
              <span>✨</span>
            </div>
          </div>

          {/* main story content */}
          <div className="relative mt-5 px-2 pb-3">
            <div
              className="relative w-full mx-auto rounded-xl overflow-hidden border border-white/10"
              style={{ aspectRatio: "9 / 16" }} // Instagram Story ratio
            >
              {/* Tree photo */}
              <img
                src={treeImage}
                alt="Christmas tree"
                className="w-full h-full object-cover"
              />

              {/* right-side editor icons (mock) */}
              <div className="absolute inset-y-0 right-1 flex flex-col items-center justify-center gap-3 text-xs text-white drop-shadow">
                <button className="bg-black/40 rounded-full w-7 h-7 flex items-center justify-center">
                  😊
                </button>
                <button className="bg-black/40 rounded-full w-7 h-7 flex items-center justify-center">
                  🔖
                </button>
                <button className="bg-black/40 rounded-full w-7 h-7 flex items-center justify-center">
                  ✏️
                </button>
              </div>

              {/* Gift markers over the tree */}
              {displayOrnaments.map((gift, index) => {
                const count = displayOrnaments.length || 1;
                const top = 22 + (50 / count) * index; // distribute from ~22% to ~72%
                const left = index % 2 === 0 ? "32%" : "68%"; // alternate left/right

                return (
                  <div
                    key={gift.id || index}
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                    style={{ top: `${top}%`, left }}
                  >
                    <div className="w-7 h-7 rounded-full bg-red-600/90 border border-white/80 flex items-center justify-center text-[10px] text-white shadow-lg">
                      🎁
                    </div>
                    {!isPreview && gift.giftName && (
                      <div className="px-2 py-0.5 rounded-full bg-black/70 text-[9px] text-white whitespace-nowrap">
                        {gift.giftName}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* bottom editing bar (mock) */}
              <div className="absolute inset-x-0 bottom-0 pb-1 px-2">
                <div className="flex items-center justify-between text-[9px] text-white/90">
                  <div className="flex items-center gap-1">
                    <div className="h-0.5 w-10 bg-white/60 rounded-full" />
                    <div className="h-0.5 w-6 bg-white/30 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🎵</span>
                    <span>✨</span>
                    <span>⋯</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom story action bar */}
          <div className="absolute bottom-0 inset-x-0 px-4 pb-3 pt-1 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-between text-[10px] text-white/90">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/80" />
              <span className="font-medium">Your story</span>
            </div>
            <button className="bg-blue-500 px-3 py-1 rounded-full text-[10px] font-semibold">
              Share
            </button>
          </div>
        </div>

        {/* home indicator */}
        <div className="mt-2 flex justify-center">
          <div className="h-1 w-16 rounded-full bg-white/40" />
        </div>
      </div>
    </div>
  );
}

// ==================== GIFT ITEM ====================

function GiftItem({ gift, onEdit, onDelete }) {
  const priorityEmoji = {
    high: "⭐⭐⭐",
    medium: "⭐⭐",
    low: "⭐",
  };

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

// ==================== SHARE MODAL ====================

function ShareModal({ shareUrl, onClose }) {
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
