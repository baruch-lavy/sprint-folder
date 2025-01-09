import {
  gImgs,
  gMeme,
  addLine,
  deleteLine,
  switchLine,
  setLineTxt,
  updateFontSize,
  setLineColor,
  addSticker,
  saveMeme,
  setDragging,
  updateDragPosition,
} from './meme-service.js';

let gCanvas, gCtx;

// Initialize the editor
document.addEventListener('DOMContentLoaded', () => {
  gCanvas = document.getElementById('meme-canvas');
  gCtx = gCanvas.getContext('2d');

  renderMeme(); // Initial rendering
  setupEventListeners(); // Setup button and canvas events
});

function renderMeme() {
  const img = new Image();
  const selectedImg = gImgs.find(img => img.id === gMeme.selectedImgId);

  // Handle missing selected image
  if (!selectedImg) {
    console.error('Selected image not found!');
    return;
  }

  img.src = selectedImg.url;

  img.onload = () => {
    gCanvas.width = img.width;
    gCanvas.height = img.height;
    gCtx.drawImage(img, 0, 0, img.width, img.height);
    renderTextLines();
    renderStickers();
  };
}


// Render text lines on the canvas
function renderTextLines() {
  gMeme.lines.forEach(line => {
    gCtx.font = `${line.size}px Impact`;
    gCtx.fillStyle = line.color;
    gCtx.textAlign = line.align;
    gCtx.strokeStyle = line.stroke;
    gCtx.lineWidth = 2;
    gCtx.fillText(line.txt, line.x, line.y);
    gCtx.strokeText(line.txt, line.x, line.y);
  });
}

// Render stickers on the canvas
function renderStickers() {
  gMeme.stickers.forEach(sticker => {
    const img = new Image();
    img.src = sticker.url;
    img.onload = () => {
      gCtx.drawImage(
        img,
        sticker.x - sticker.size / 2,
        sticker.y - sticker.size / 2,
        sticker.size,
        sticker.size
      );
    };
  });
}

// Set up button and canvas events
function setupEventListeners() {
  // Add a new text line
  document.getElementById('add-text').addEventListener('click', () => {
    addLine();
    renderMeme();
  });

  // Switch to the next text line
  document.getElementById('switch-line').addEventListener('click', () => {
    switchLine();
    renderMeme();
  });

  // Update text input for the selected line
  document.getElementById('text-input').addEventListener('input', event => {
    setLineTxt(event.target.value);
    renderMeme();
  });

  // Font size adjustments
  document.getElementById('increase-font').addEventListener('click', () => {
    updateFontSize(2);
    renderMeme();
  });
  document.getElementById('decrease-font').addEventListener('click', () => {
    updateFontSize(-2);
    renderMeme();
  });

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-line-btn').addEventListener('click', () => {
      addLine(gCanvas);
      renderMeme();
    });
  });
  

  // Add stickers
  document.querySelectorAll('.sticker-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stickerId = +btn.dataset.stickerId;
      addSticker(stickerId);
      renderMeme();
    });
  });

  // Save the meme
  document.getElementById('save-btn').addEventListener('click', () => {
    saveMeme();
    alert('Meme saved!');
  });

  // Download the meme
  document.getElementById('download-btn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'my-meme.png';
    link.href = gCanvas.toDataURL();
    link.click();
  });

  // Canvas drag-and-drop events
  setupDragAndDrop();
}

// Drag-and-drop functionality
function setupDragAndDrop() {
  gCanvas.addEventListener('mousedown', event => {
    const { offsetX, offsetY } = event;
    const lineIdx = gMeme.lines.findIndex(line =>
      isInsideLine(offsetX, offsetY, line)
    );
    if (lineIdx !== -1) setDragging(true, lineIdx);

    const stickerIdx = gMeme.stickers.findIndex(sticker =>
      isInsideSticker(offsetX, offsetY, sticker)
    );
    if (stickerIdx !== -1) setDragging(true, stickerIdx, 'sticker');
  });

  gCanvas.addEventListener('mousemove', event => {
    const { movementX, movementY } = event;
    gMeme.lines.forEach((line, idx) => {
      if (line.isDragging) updateDragPosition(movementX, movementY, idx);
    });
    gMeme.stickers.forEach((sticker, idx) => {
      if (sticker.isDragging) updateDragPosition(movementX, movementY, idx, 'sticker');
    });
    renderMeme();
  });

  gCanvas.addEventListener('mouseup', () => {
    gMeme.lines.forEach((line, idx) => setDragging(false, idx));
    gMeme.stickers.forEach((sticker, idx) => setDragging(false, idx, 'sticker'));
  });
}

function isInsideLine(x, y, line) {
  const textWidth = gCtx.measureText(line.txt).width;
  const textHeight = line.size;
  return (
    x > line.x - textWidth / 2 &&
    x < line.x + textWidth / 2 &&
    y > line.y - textHeight / 2 &&
    y < line.y + textHeight / 2
  );
}

function isInsideSticker(x, y, sticker) {
  return (
    x > sticker.x - sticker.size / 2 &&
    x < sticker.x + sticker.size / 2 &&
    y > sticker.y - sticker.size / 2 &&
    y < sticker.y + sticker.size / 2
  );
}

