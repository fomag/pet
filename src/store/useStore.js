import { create } from 'zustand';

export const useStore = create((set, get) => ({
  blocks: [],
  selectedBlockId: null,
  history: [],
  historyIndex: -1,

  setBlocks: (blocks) => set({ blocks, history: [], historyIndex: -1 }),
  
  selectBlock: (id) => set({ selectedBlockId: id }),

  updateBlock: (id, updated) => {
    set((state) => ({
      blocks: state.blocks.map(b => b.id === id ? { ...b, ...updated } : b)
    }));
  },

  deleteBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter(b => b.id !== id),
      selectedBlockId: null
    }));
  },

  addBlock: (block) => {
    set((state) => ({
      blocks: [...state.blocks, block]
    }));
  }
}));
