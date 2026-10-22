export function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks = [];

  // Find main content area
  const main = doc.querySelector('main') || doc.body;
  
  // Remove page details and unwanted sections
  main.querySelectorAll('.pagedetails, gcds-date-modified').forEach(el => el.remove());

  // Process children in order (preserves layout)
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return;

    const tag = node.tagName?.toLowerCase();
    const classList = node.className || '';

    // Skip empty nodes
    if (!node.textContent?.trim()) return;

    // H1 - Page title
    if (tag === 'h1') {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'heading',
        content: {
          text: node.textContent.trim(),
          level: 'h1',
          classes: classList
        }
      });
      return;
    }

    // H2/H3/H4/H5/H6 - Section headings
    if (/^h[2-6]$/.test(tag)) {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'heading',
        content: {
          text: node.textContent.trim(),
          level: tag,
          classes: classList
        }
      });
      return;
    }

    // Paragraphs
    if (tag === 'p') {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'text',
        content: {
          text: node.innerHTML.trim(),
          classes: classList
        }
      });
      return;
    }

    // Lists (UL, OL)
    if (tag === 'ul' || tag === 'ol') {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'text',
        content: {
          text: node.outerHTML,
          classes: classList
        }
      });
      return;
    }

    // Subway navigation
    if (tag === 'nav' && (classList.includes('gc-subway') || classList.includes('provisional'))) {
      const title = node.querySelector('h2')?.textContent.trim() || 'Navigation';
      
      const items = [];
      node.querySelectorAll('dt').forEach(dt => {
        const link = dt.querySelector('a');
        const dd = dt.nextElementSibling;
        if (link) {
          items.push({
            label: link.textContent.trim(),
            url: link.href,
            description: dd?.textContent.trim() || ''
          });
        }
      });

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

    // Sections - process children recursively
    if (tag === 'section' && !classList.includes('pagedetails')) {
      node.childNodes.forEach(child => processNode(child));
      return;
    }

    // Divs with content - process children
    if (tag === 'div') {
      // Skip container divs (row, col-md-8, etc.)
      if (classList.includes('row') || classList.includes('col-')) {
        node.childNodes.forEach(child => processNode(child));
        return;
      }

      // Skip layout wrappers but process their content
      if (classList.includes('parbase') || classList.includes('mwsgeneric-base-html')) {
        node.childNodes.forEach(child => processNode(child));
        return;
      }

      // Treat other divs as text blocks if they have content
      if (node.textContent.trim()) {
        blocks.push({
          id: 'block_' + Date.now() + Math.random(),
          type: 'text',
          content: {
            text: node.innerHTML.trim(),
            classes: classList
          }
        });
        return;
      }
    }

    // For other tags, recursively process children
    node.childNodes.forEach(child => processNode(child));
  };

  // Start processing from main content
  main.childNodes.forEach(node => processNode(node));

  return blocks.length > 0 ? blocks : [
    {
      id: 'block_welcome',
      type: 'text',
      content: {
        text: 'No content blocks found. Load a page or insert components to get started.'
      }
    }
  ];
}

export function renderHTML(blocks) {
  return blocks.map(block => {
    const wrapperAttrs = `data-block-id="${block.id}"`;
    const classes = block.content.classes ? ` class="${block.content.classes}"` : '';

    switch (block.type) {
      case 'heading':
        const level = block.content.level || 'h2';
        return `<${level} ${wrapperAttrs}${classes}>${block.content.text || 'Heading'}</${level}>`;
      
      case 'text':
        // If it's already HTML (list or other), render as-is
        if (block.content.text.includes('<')) {
          return `<div ${wrapperAttrs}${classes}>${block.content.text}</div>`;
        }
        return `<p ${wrapperAttrs}${classes}>${block.content.text || 'Text block'}</p>`;
      
      case 'subway':
        const items = block.content.items || [];
        const itemsHtml = items.map(item => `
          <dt><a href="${item.url}">${item.label}</a></dt>
          <dd>${item.description}</dd>
        `).join('');
  
  return `
    <nav class="provisional gc-subway" ${wrapperAttrs} aria-label="Subway navigation">
      <h2>${block.content.title || 'Navigation'}</h2>
      <dl>
        ${itemsHtml}
      </dl>
    </nav>
  `;

        
        return `
          <div class="row">
            <div class="col-md-8">
              <nav class="provisional gc-subway" ${wrapperAttrs} aria-label="Subway navigation">
                <h2>${block.content.title || 'Navigation'}</h2>
                <dl>
                  ${itemsHtml}
                </dl>
              </nav>
            </div>
          </div>
        `;
      
      case 'alert':
        return `
          <div class="alert alert-info" ${wrapperAttrs}${classes} role="alert">
            <h2>${block.content.text || 'Alert message'}</h2>
          </div>
        `;
      
      case 'button':
        return `<button class="btn btn-primary" ${wrapperAttrs}${classes}>${block.content.text || 'Button'}</button>`;
      
      default:
        return `<div ${wrapperAttrs}${classes}>${block.content.text || 'Unknown block'}</div>`;
    }
  }).join('\n');
}

export function getDefaultContent(type) {
  const defaults = {
    heading: { text: 'New Heading', level: 'h2', classes: '' },
    text: { text: 'New text block', classes: '' },
    subway: { title: 'Steps', items: [], classes: '' },
    alert: { text: 'Alert message', classes: 'alert alert-info' },
    accordion: { title: 'Section', classes: '' },
    button: { text: 'Button', classes: 'btn btn-primary' }
  };
  return defaults[type] || { text: '', classes: '' };
}
