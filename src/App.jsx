import React, { useState } from 'react';
import { useStore } from './store/useStore';
import TopBar from './components/TopBar';
import BlocksList from './components/BlocksList';
import EditorView from './components/EditorView';
import PropertyPanel from './components/PropertyPanel';
import PreviewModal from './components/PreviewModal';
import './App.css';

export default function App() {
  const { blocks, selectedBlockId, selectBlock, updateBlock, deleteBlock, addBlock, moveBlock, setBlocks } = useStore();
  const [showPreview, setShowPreview] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  const handleLoadPage = async (input) => {
    try {
      let html;
      if (input.startsWith('http')) {
        const response = await fetch(input);
        html = await response.text();
      } else {
        html = input;
      }
      const { parseHTML } = await import('./utils/htmlRenderer');
      const parsed = parseHTML(html);
      setBlocks(parsed);
      selectBlock(null);
    } catch (err) {
      alert('Error loading page: ' + err.message);
    }
  };

  const handleExport = () => {
    const { renderHTML } = require('./utils/htmlRenderer');
    const html = renderHTML(blocks);
    const fullPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/css/wet-boew.min.css">
  <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/css/theme.min.css">
  <title>Page</title>
</head>
<body>
  <main class="container">
    ${html}
  </main>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/wet-boew/js/wet-boew.min.js"></script>
  <script src="https://www.canada.ca/etc/designs/canada/wet-boew/v4_0_47/GCWeb/js/theme.min.js"></script>
</body>
</html>`;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(fullPage));
    element.setAttribute('download', 'page.html');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="app">
      <TopBar 
        onLoadPage={handleLoadPage}
        onExport={handleExport}
        onPreview={() => setShowPreview(true)}
        onCodeToggle={() => setShowCode(!showCode)}
      />

      <div className="editor-layout">
        {/* Left: Blocks List */}
        <aside className="sidebar sidebar-left">
          <BlocksList
            blocks={blocks}
            selectedBlockId={selectedBlockId}
            onSelectBlock={selectBlock}
            onDeleteBlock={deleteBlock}
            onMoveBlock={moveBlock}
            onAddBlock={addBlock}
          />
        </aside>

        {/* Center: Editor View */}
        <div className="editor-center">
          {showCode ? (
            <CodeView blocks={blocks} />
          ) : (
            <EditorView 
              blocks={blocks}
              selectedBlockId={selectedBlockId}
              onSelectBlock={selectBlock}
            />
          )}
        </div>

        {/* Right: Properties Panel */}
        <aside className="sidebar sidebar-right">
          {selectedBlock ? (
            <PropertyPanel 
              block={selectedBlock}
              onChange={(updated) => updateBlock(selectedBlock.id, updated)}
              onDelete={() => deleteBlock(selectedBlock.id)}
            />
          ) : (
            <div className="empty-state">
              <p>Select a block to edit</p>
              <small>Click any component on the left or center</small>
            </div>
          )}
        </aside>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal 
          blocks={blocks}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}

// CodeView component (simple for now)
function CodeView({ blocks }) {
  const { renderHTML } = require('./utils/htmlRenderer');
  const html = renderHTML(blocks);
  return (
    <div className="code-view">
      <h3>HTML Source</h3>
      <textarea readOnly value={html} className="code-editor" />
    </div>
  );
}
