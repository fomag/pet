import { create } from 'zustand';

export const useStore = create((set) => ({
  blocks: [],
  selectedBlockId: null,

  setBlocks: (blocks) => set({ blocks, selectedBlockId: null }),
  
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

  addBlock: (type) => {
    const { getDefaultContent } = require('../utils/htmlRenderer');
    const newBlock = {
      id: 'block_' + Date.now() + Math.random(),
      type,
      version: '1.0.0',
      content: getDefaultContent(type)
    };
    set((state) => ({
      blocks: [...state.blocks, newBlock],
      selectedBlockId: newBlock.id
    }));
  },

  moveBlock: (fromIdx, toIdx) => {
    set((state) => {
      const newBlocks = [...state.blocks];
      const [moved] = newBlocks.splice(fromIdx, 1);
      newBlocks.splice(toIdx, 0, moved);
      return { blocks: newBlocks };
    });
  }
}));
