// src/App.jsx
// High-level app shell: routes between pages and wires services together.

import React, { useState } from "react";
import HomePage from "./pages/Homepage";
import TreeEditor from "./pages/TreeEditor";
import ShareModal from "./components/ShareModal";
import { StorageService } from "./services/storageService";
import { ShareService } from "./services/shareService";

export default function ChristmasWishTreeApp() {
  const [currentView, setCurrentView] = useState("home");
  const [currentTree, setCurrentTree] = useState(null);
  const [showShare, setShowShare] = useState(false);

  // Create a new tree
  const createNewTree = () => {
    const newTree = {
      treeId: "tree_" + Date.now(),
      ownerName: "You",
      treeName: "My Christmas Wish Tree",
      createdAt: new Date().toISOString(),
      shareId: ShareService.generateShareId(),
      ornaments: [],
    };

    setCurrentTree(newTree);
    setCurrentView("editor");
    StorageService.saveTree(newTree);
  };

  // Add a new ornament (gift) to the current tree
  const addOrnament = (ornamentData) => {
    if (!currentTree) return;

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

  // Update an existing ornament
  const updateOrnament = (ornamentId, updates) => {
    if (!currentTree) return;

    const updatedTree = {
      ...currentTree,
      ornaments: currentTree.ornaments.map((o) =>
        o.id === ornamentId ? { ...o, ...updates } : o
      ),
    };

    setCurrentTree(updatedTree);
    StorageService.saveTree(updatedTree);
  };

  // Delete an ornament from the tree
  const deleteOrnament = (ornamentId) => {
    if (!currentTree) return;

    if (window.confirm("Delete this gift?")) {
      const updatedTree = {
        ...currentTree,
        ornaments: currentTree.ornaments.filter((o) => o.id !== ornamentId),
      };
      setCurrentTree(updatedTree);
      StorageService.saveTree(updatedTree);
    }
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
