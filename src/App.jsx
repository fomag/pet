import { parseHTML, renderHTML, getDefaultContent } from './utils/htmlRenderer';
import React, { useState } from 'react';
import { useStore } from './store/useStore';
import TopBar from './components/TopBar';
import Preview from './components/Preview';
import PropertyPanel from './components/PropertyPanel';
import ComponentLibrary from './components/ComponentLibrary';
import CodeView from './components/CodeView';
import './App.css';

export default function App() {
  const { blocks, selectedBlockId, selectBlock, updateBlock, deleteBlock, addBlock, setBlocks } = useStore();
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="app">
      <TopBar 
        onLoadPage={handleLoadPage} 
        onExport={handleExport}
        onCodeToggle={() => setShowCode(!showCode)}
      />
      
      <div className="editor-layout">
        {/* Left: Component Library */}
        <aside className="sidebar sidebar-left">
          <ComponentLibrary onInsert={handleInsertComponent} />
        </aside>

        {/* Center: Preview */}
        <div className="preview-container">
          {showCode ? (
            <CodeView 
              blocks={blocks} 
              onChange={setBlocks}
            />
          ) : (
            <Preview 
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={selectBlock}
            />
          )}
        </div>

        {/* Right: Property Panel */}
        <aside className="sidebar sidebar-right">
          {selectedBlock ? (
            <PropertyPanel 
              block={selectedBlock}
              onChange={(updated) => updateBlock(selectedBlock.id, updated)}
              onDelete={() => deleteBlock(selectedBlock.id)}
            />
          ) : (
            <div className="empty-state">Select an element to edit</div>
          )}
        </aside>
      </div>
    </div>
  );

  async function handleLoadPage(input) {
    setLoading(true);
    try {
      let html;
      
      // Detect if URL or paste
      if (input.startsWith('http')) {
        const response = await fetch(input);
        html = await response.text();
      } else {
        html = input;
      }
      
      const parsed = parseHTML(html);
      setBlocks(parsed);
      selectBlock(null);
    } catch (err) {
      alert('Error loading page: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    const html = renderHTML(blocks);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(html));
    element.setAttribute('download', 'page.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function handleInsertComponent(componentType) {
    const newBlock = {
      id: 'block_' + Date.now(),
      type: componentType,
      version: '1.0.0',
      content: getDefaultContent(componentType),
      selected: false
    };
    addBlock(newBlock);
    selectBlock(newBlock.id);
  }
}
