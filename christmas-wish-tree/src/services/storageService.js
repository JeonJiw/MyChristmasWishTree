// Utility to save/load trees (wish lists) to/from LocalStorage

export const StorageService = {
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
