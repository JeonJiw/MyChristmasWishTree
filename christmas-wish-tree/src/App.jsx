// ==================== Christmas Wish Tree React App ====================
// Save this as: src/App.jsx

import React, { useState, useEffect } from 'react';

// ==================== DATA SERVICES ====================

const StorageService = {
  saveTree: (tree) => {
    try {
      const trees = StorageService.getAllTrees();
      const index = trees.findIndex(t => t.treeId === tree.treeId);
      if (index >= 0) {
        trees[index] = tree;
      } else {
        trees.push(tree);
      }
      localStorage.setItem('christmasTrees', JSON.stringify(trees));
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  },

  loadTree: (treeId) => {
    const trees = StorageService.getAllTrees();
    return trees.find(t => t.treeId === treeId) || null;
  },

  getAllTrees: () => {
    try {
      const data = localStorage.getItem('christmasTrees');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  deleteTree: (treeId) => {
    const trees = StorageService.getAllTrees().filter(t => t.treeId !== treeId);
    localStorage.setItem('christmasTrees', JSON.stringify(trees));
  }
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
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  }
};

// ==================== MAIN APP ====================

export default function ChristmasWishTreeApp() {
  const [currentView, setCurrentView] = useState('home');
  const [currentTree, setCurrentTree] = useState(null);
  const [showAddGift, setShowAddGift] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [editingGift, setEditingGift] = useState(null);

  const createNewTree = () => {
    const newTree = {
      treeId: 'tree_' + Date.now(),
      ownerName: 'You',
      treeName: 'My Christmas Wishes',
      createdAt: new Date().toISOString(),
      shareId: ShareService.generateShareId(),
      ornaments: []
    };
    setCurrentTree(newTree);
    setCurrentView('editor');
    StorageService.saveTree(newTree);
  };

  const addOrnament = (ornamentData) => {
    const newOrnament = {
      id: 'orn_' + Date.now(),
      ...ornamentData,
      position: {
        x: 150 + Math.random() * 100,
        y: 150 + Math.random() * 100
      }
    };

    const updatedTree = {
      ...currentTree,
      ornaments: [...currentTree.ornaments, newOrnament]
    };

    setCurrentTree(updatedTree);
    StorageService.saveTree(updatedTree);
    setShowAddGift(false);
  };

  const deleteOrnament = (ornamentId) => {
    if (window.confirm('Delete this gift?')) {
      const updatedTree = {
        ...currentTree,
        ornaments: currentTree.ornaments.filter(o => o.id !== ornamentId)
      };
      setCurrentTree(updatedTree);
      StorageService.saveTree(updatedTree);
    }
  };

  const updateOrnament = (ornamentId, updates) => {
    const updatedTree = {
      ...currentTree,
      ornaments: currentTree.ornaments.map(o =>
        o.id === ornamentId ? { ...o, ...updates } : o
      )
    };
    setCurrentTree(updatedTree);
    StorageService.saveTree(updatedTree);
    setEditingGift(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-green-50">
      {currentView === 'home' && <HomePage onCreateTree={createNewTree} />}

      {currentView === 'editor' && currentTree && (
        <TreeEditor
          tree={currentTree}
          onAddGift={() => setShowAddGift(true)}
          onDeleteGift={deleteOrnament}
          onEditGift={setEditingGift}
          onShare={() => setShowShare(true)}
          onBack={() => setCurrentView('home')}
        />
      )}

      {showAddGift && (
        <GiftModal
          onSave={addOrnament}
          onClose={() => setShowAddGift(false)}
        />
      )}

      {editingGift && (
        <GiftModal
          gift={editingGift}
          onSave={(data) => updateOrnament(editingGift.id, data)}
          onClose={() => setEditingGift(null)}
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-green-700 mb-2">
          🎄 My Christmas Wish Tree
        </h1>
        <p className="text-gray-600 mb-8">
          Create and share your perfect Christmas gift list with family and friends
        </p>

        <button
          onClick={onCreateTree}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transform transition hover:scale-105"
        >
          Create Your Wish Tree
        </button>

        <div className="mt-8 text-sm text-gray-500">
          ✨ Simple • Visual • Shareable ✨
        </div>
      </div>
    </div>
  );
}

// ==================== TREE EDITOR ====================

function TreeEditor({ tree, onAddGift, onDeleteGift, onEditGift, onShare, onBack }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800"
        >
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

      <div className="text-center mb-6">
        <button
          onClick={onAddGift}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg"
        >
          + Add Gift
        </button>
      </div>

      <TreeCanvas ornaments={tree.ornaments} />

      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">📝 Your Wish List:</h3>
        {tree.ornaments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No gifts added yet. Click "Add Gift" to start!
          </p>
        ) : (
          <div className="space-y-3">
            {tree.ornaments.map(ornament => (
              <GiftItem
                key={ornament.id}
                gift={ornament}
                onEdit={() => onEditGift(ornament)}
                onDelete={() => onDeleteGift(ornament.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== TREE CANVAS ====================

function TreeCanvas({ ornaments }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 relative" style={{ height: '400px' }}>
      <svg width="100%" height="100%" viewBox="0 0 400 400">
        <text x="190" y="30" fontSize="30">⭐</text>
        <polygon points="200,50 150,120 250,120" fill="#2d5016" />
        <polygon points="200,90 130,180 270,180" fill="#2d5016" />
        <polygon points="200,140 110,250 290,250" fill="#2d5016" />
        <rect x="180" y="250" width="40" height="60" fill="#8b4513" />
        <rect x="140" y="310" width="120" height="10" fill="#654321" rx="5" />

        {ornaments.map((ornament, index) => (
          <g key={ornament.id}>
            <circle
              cx={150 + (index % 3) * 50}
              cy={120 + Math.floor(index / 3) * 50}
              r="15"
              fill={['#ff4444', '#ffcc00', '#4444ff', '#ff44ff'][index % 4]}
              className="animate-pulse"
            />
            <text
              x={150 + (index % 3) * 50}
              y={125 + Math.floor(index / 3) * 50}
              textAnchor="middle"
              fontSize="20"
            >
              🎁
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ==================== GIFT ITEM ====================

function GiftItem({ gift, onEdit, onDelete }) {
  const priorityEmoji = {
    high: '⭐⭐⭐',
    medium: '⭐⭐',
    low: '⭐'
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-bold text-lg text-gray-800">🎁 {gift.giftName}</h4>
          {gift.description && (
            <p className="text-gray-600 text-sm mt-1">{gift.description}</p>
          )}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-green-600 font-bold">${gift.price}</span>
            <span className="text-gray-500">Priority: {priorityEmoji[gift.priority]}</span>
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

// ==================== GIFT MODAL ====================

function GiftModal({ gift, onSave, onClose }) {
  const [giftName, setGiftName] = useState(gift?.giftName || '');
  const [description, setDescription] = useState(gift?.description || '');
  const [price, setPrice] = useState(gift?.price || '');
  const [link, setLink] = useState(gift?.link || '');
  const [priority, setPriority] = useState(gift?.priority || 'medium');

  const handleSubmit = () => {
    if (!giftName || !price) {
      alert('Please fill in gift name and price');
      return;
    }
    onSave({
      giftName,
      description,
      price: parseFloat(price),
      link,
      priority
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {gift ? 'Edit Gift' : 'Add Gift to Tree'}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gift Name *
            </label>
            <input
              type="text"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="e.g. Animal Crossing edition"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Link
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <div className="flex gap-4">
              {['low', 'medium', 'high'].map(p => (
                <label key={p} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={(e) => setPriority(e.target.value)}
                    className="mr-2"
                  />
                  <span className="capitalize">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {gift ? 'Update' : 'Add Gift'}
            </button>
          </div>
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

        <p className="text-sm text-gray-600 mb-3">
          Your shareable link:
        </p>

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
            {copied ? '✓ Copied!' : 'Copy'}
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