import { StorageService } from "../services/storageService";

describe("StorageService", () => {
  beforeEach(() => {
    // Reset localStorage before each test
    localStorage.clear();
  });

  test("saveTree stores a new tree", () => {
    const tree = { treeId: "tree_1", treeName: "My Tree", ornaments: [] };

    const result = StorageService.saveTree(tree);
    const allTrees = StorageService.getAllTrees();

    expect(result).toBe(true);
    expect(allTrees).toHaveLength(1);
    expect(allTrees[0]).toEqual(tree);
  });

  test("saveTree updates an existing tree with the same id", () => {
    const tree = { treeId: "tree_1", treeName: "Original", ornaments: [] };
    const updatedTree = {
      treeId: "tree_1",
      treeName: "Updated name",
      ornaments: [{ id: "orn_1" }],
    };

    StorageService.saveTree(tree);
    StorageService.saveTree(updatedTree);

    const allTrees = StorageService.getAllTrees();
    expect(allTrees).toHaveLength(1);
    expect(allTrees[0]).toEqual(updatedTree);
  });

  test("loadTree returns a specific tree by id", () => {
    const tree1 = { treeId: "tree_1", treeName: "Tree 1" };
    const tree2 = { treeId: "tree_2", treeName: "Tree 2" };

    StorageService.saveTree(tree1);
    StorageService.saveTree(tree2);

    const loaded = StorageService.loadTree("tree_2");
    expect(loaded).toEqual(tree2);
  });

  test("loadTree returns null when tree is not found", () => {
    const loaded = StorageService.loadTree("unknown");
    expect(loaded).toBeNull();
  });

  test("deleteTree removes a tree from storage", () => {
    const tree1 = { treeId: "tree_1", treeName: "Tree 1" };
    const tree2 = { treeId: "tree_2", treeName: "Tree 2" };

    StorageService.saveTree(tree1);
    StorageService.saveTree(tree2);

    StorageService.deleteTree("tree_1");

    const allTrees = StorageService.getAllTrees();
    expect(allTrees).toHaveLength(1);
    expect(allTrees[0]).toEqual(tree2);
  });
});
