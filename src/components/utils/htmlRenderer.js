export function renderHTML(blocks) {
  return blocks.map(block => {
    const wrapperAttrs = `data-block-id="${block.id}"`;
    const classes = block.content.classes ? ` class="${block.content.classes}"` : '';

    switch (block.type) {
      case 'heading':
        const level = block.content.level || 'h2';
        return `<${level} ${wrapperAttrs}${classes}>${block.content.text || 'Heading'}</${level}>`;
      
      case 'text':
        return `<p ${wrapperAttrs}${classes}>${block.content.text || 'Text block'}</p>`;
      
      case 'subway':
        return `
          <nav class="provisional gc-subway" ${wrapperAttrs}${classes} aria-label="Subway navigation">
            <h1>${block.content.title || 'Navigation'}</h1>
            <ul>
              <li><a href="#" class="active">Step 1</a></li>
              <li><a href="#">Step 2</a></li>
              <li><a href="#">Step 3</a></li>
            </ul>
          </nav>
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

export function parseHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks = [];

  // Parse headings
  doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
    blocks.push({
      id: 'block_' + Date.now() + Math.random(),
      type: 'heading',
      content: {
        text: el.textContent,
        level: el.tagName.toLowerCase(),
        classes: el.className
      }
    });
  });

  // Parse paragraphs
  doc.querySelectorAll('p:not(nav p)').forEach(el => {
    blocks.push({
      id: 'block_' + Date.now() + Math.random(),
      type: 'text',
      content: {
        text: el.innerHTML,
        classes: el.className
      }
    });
  });

  // Parse subway nav
  doc.querySelectorAll('nav.gc-subway').forEach(el => {
    const title = el.querySelector('h1')?.textContent || 'Navigation';
    blocks.push({
      id: 'block_' + Date.now() + Math.random(),
      type: 'subway',
      content: {
        title,
        classes: el.className
      }
    });
  });

  // Parse alerts
  doc.querySelectorAll('.alert').forEach(el => {
    blocks.push({
      id: 'block_' + Date.now() + Math.random(),
      type: 'alert',
      content: {
        text: el.textContent,
        classes: el.className
      }
    });
  });

  return blocks.length > 0 ? blocks : [
    {
      id: 'block_welcome',
      type: 'text',
      content: {
        text: 'Load a page or insert components to get started'
      }
    }
  ];
}

export function getDefaultContent(type) {
  const defaults = {
    heading: { text: 'New Heading', level: 'h2', classes: '' },
    text: { text: 'New text block', classes: '' },
    subway: { title: 'Steps', classes: '' },
    alert: { text: 'Alert message', classes: 'alert alert-info' },
    accordion: { title: 'Section', classes: '' },
    button: { text: 'Button', classes: 'btn btn-primary' }
  };
  return defaults[type] || { text: '', classes: '' };
}
