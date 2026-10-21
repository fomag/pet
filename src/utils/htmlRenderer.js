export function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks = [];

  // Find main content area
  const main = doc.querySelector('main') || doc.body;
  
  // Remove page details section
  main.querySelectorAll('.pagedetails').forEach(el => el.remove());

  // Parse h1 (page title)
  const h1 = main.querySelector('h1');
  if (h1) {
    blocks.push({
      id: 'block_' + Date.now() + Math.random(),
      type: 'heading',
      content: {
        text: h1.textContent.trim(),
        level: 'h1',
        classes: h1.className
      }
    });
  }

  // Parse all paragraphs (top-level content)
  main.querySelectorAll(':scope > p, .mwsgeneric-base-html > p').forEach(el => {
    if (el.textContent.trim() && !el.closest('.pagedetails')) {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'text',
        content: {
          text: el.innerHTML.trim(),
          classes: el.className
        }
      });
    }
  });

  // Parse unordered lists (not nested in other elements)
  main.querySelectorAll(':scope > ul, .mwsgeneric-base-html > ul').forEach(el => {
    if (!el.closest('nav')) {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'text',
        content: {
          text: el.outerHTML,
          classes: el.className
        }
      });
    }
  });

  // Parse subway navigation (with dl structure)
  main.querySelectorAll('nav.gc-subway, nav.provisional.gc-subway').forEach(nav => {
    const title = nav.querySelector('h2')?.textContent.trim() || 'Navigation';
    
    // Extract dt/dd pairs into items
    const items = [];
    nav.querySelectorAll('dt').forEach(dt => {
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
        classes: nav.className
      }
    });
  });

  // Parse sections (with h2 headings and lists)
  main.querySelectorAll('section:not(.pagedetails)').forEach(section => {
    const h2 = section.querySelector('h2');
    if (h2) {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'heading',
        content: {
          text: h2.textContent.trim(),
          level: 'h2',
          classes: h2.className
        }
      });
    }

    // Parse lists within sections
    section.querySelectorAll('ul, ol').forEach(list => {
      blocks.push({
        id: 'block_' + Date.now() + Math.random(),
        type: 'text',
        content: {
          text: list.outerHTML,
          classes: list.className
        }
      });
    });
  });

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
