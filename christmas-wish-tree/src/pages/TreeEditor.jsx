import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import TreeCanvas from "../components/TreeCanvas";
import GiftItem from "../components/GiftItem";

export default function TreeEditor({
  tree,
  onAddGift,
  onUpdateGift,
  onDeleteGift,
  onShare,
  onBack,
}) {
  const treeRef = useRef(null);
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

  const handleDownloadImage = async () => {
    if (!treeRef.current) return;
    try {
      const canvas = await html2canvas(treeRef.current, { scale: 2 });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${tree.treeName || "my-christmas-wish-tree"}.png`;
      link.click();
    } catch (error) {
      console.error("Failed to save image:", error);
      alert("Sorry, could not save the image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-16 flex flex-col justify-center">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="text-gray-600 hover:text-gray-800">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-green-700">
          🎄 {tree.treeName}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadImage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
          >
            Save Story Image
          </button>
          <button
            onClick={onShare}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Share
          </button>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2 items-start md:items-stretch">
        <div className="flex justify-center items-center md:pr-4">
          <TreeCanvas
            ref={treeRef}
            ornaments={tree.ornaments}
            variant="editor"
          />
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-7">
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
