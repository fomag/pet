// In parseHTML function, update the subway parsing section:
if (tag === 'nav' && (classList.includes('gc-subway') || classList.includes('provisional'))) {
  const title = node.querySelector('h2')?.textContent.trim() || 'Navigation';
  
  const items = [];
  
  // Handle both <dl> (definition list) and <ul> structures
  const dts = node.querySelectorAll('dt');
  if (dts.length > 0) {
    // DL structure (dt/dd pairs)
    dts.forEach(dt => {
      const link = dt.querySelector('a');
      const dd = dt.nextElementSibling;
      if (link) {
        items.push({
          label: link.textContent.trim(),
          url: link.getAttribute('href') || '#',
          description: dd?.textContent.trim() || ''
        });
      }
    });
  } else {
    // Fallback to UL structure
    node.querySelectorAll('li').forEach(li => {
      const link = li.querySelector('a');
      if (link) {
        items.push({
          label: link.textContent.trim(),
          url: link.getAttribute('href') || '#'
        });
      }
    });
  }

  blocks.push({
    id: 'block_' + Date.now() + Math.random(),
    type: 'subway',
    version: '3.0.0',
    content: {
      title,
      items,
      classes: classList
    }
  });
  return;
}
