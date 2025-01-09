import {
  gImgs,
  gMeme,
  addLine,
  setLineFont,
  deleteLine,
  switchLine,
  setLineTxt,
  updateFontSize,
  setLineColor,
  addSticker,
  saveMeme,
  setDragging,
  updateDragPosition,
}
  from './meme-service.js'

console.log(gMeme)

let gCanvas, gCtx;
let paintLayer = null // Offscreen canvas for painting


// Initialize the editor
document.addEventListener('DOMContentLoaded', () => {

  const selectedImgId = localStorage.getItem('selectedImgId');
  if (selectedImgId) {
    gMeme.selectedImgId = +selectedImgId; // Convert to number if necessary
    console.log('Loaded selectedImgId from localStorage:', gMeme.selectedImgId);
    renderMeme();
  } else {
    console.error('No selected image ID found in localStorage!');
  }

  gCanvas = document.getElementById('meme-canvas');
  gCtx = gCanvas.getContext('2d');

  gCanvas.width = 500; // Default width
  gCanvas.height = 500; // Default height

  renderMeme(); // Initial rendering
  setupEventListeners(); // Setup button and canvas events
});

function renderMeme() {
  const savedMeme = localStorage.getItem('selectedMeme');

  if (savedMeme) {
      const img = new Image();
      img.src = savedMeme;
      img.onload = () => {
          gCanvas.width = img.width;
          gCanvas.height = img.height;

          // Initialize paint layer if not already done
          if (!paintLayer) {
              paintLayer = document.createElement('canvas');
              paintLayer.width = gCanvas.width;
              paintLayer.height = gCanvas.height;
          }

          // Draw the image
          gCtx.drawImage(img, 0, 0, img.width, img.height);

          // Draw the paint layer
          const paintCtx = paintLayer.getContext('2d');
          gCtx.drawImage(paintLayer, 0, 0);

          renderTextLines();
          renderStickers();
      };
      img.onerror = () => console.error('Failed to load saved meme from localStorage');
      return;
  }

  const img = new Image();
  const selectedImg = gImgs.find(img => img.id === gMeme.selectedImgId);

  if (!selectedImg) {
      console.error('Selected image not found!');
      return;
  }

  img.src = selectedImg.url;

  img.onload = () => {
      gCanvas.width = img.width;
      gCanvas.height = img.height;

      // Initialize paint layer if not already done
      if (!paintLayer) {
          paintLayer = document.createElement('canvas');
          paintLayer.width = gCanvas.width;
          paintLayer.height = gCanvas.height;
      }

      // Draw the image
      gCtx.drawImage(img, 0, 0, img.width, img.height);

      // Draw the paint layer
      const paintCtx = paintLayer.getContext('2d');
      gCtx.drawImage(paintLayer, 0, 0);

      renderTextLines();
      renderStickers();
  };
  img.onerror = () => console.error('Failed to load selected image:', selectedImg.url);
}



// Resize the canvas to match the image dimensions

function resizeCanvasToImage(img) {
  const canvasRatio = gCanvas.width / gCanvas.height;
  const imageRatio = img.width / img.height;

  if (imageRatio > canvasRatio) {
    // Image is wider than canvas
    gCanvas.height = gCanvas.width / imageRatio;
  } else {
    // Image is taller than canvas
    gCanvas.width = gCanvas.height * imageRatio;
  }
}

// Draw an image on the canvas with cover style

function drawImageCover(ctx, img, x, y, canvasWidth, canvasHeight) {
  const imageRatio = img.width / img.height;
  const canvasRatio = canvasWidth / canvasHeight;

  let drawWidth, drawHeight;
  let offsetX = 0, offsetY = 0;

  if (imageRatio > canvasRatio) {
    // Image is wider than canvas
    drawHeight = canvasHeight;
    drawWidth = img.width * (canvasHeight / img.height);
    offsetX = (canvasWidth - drawWidth) / 2; // Center horizontally
  } else {
    // Image is taller than canvas
    drawWidth = canvasWidth;
    drawHeight = img.height * (canvasWidth / img.width);
    offsetY = (canvasHeight - drawHeight) / 2; // Center vertically
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
}

// Render text lines on the canvas
function renderTextLines() {
  gMeme.lines.forEach((line, idx) => {
    const font = line.font || 'Impact';
    gCtx.font = `${line.size}px ${font}`;
    gCtx.textAlign = line.align || 'center';
    const x = gCanvas.width / 2; // Center horizontally
    const y = (line.y || gCanvas.height / 2) + line.size / 2; // Adjust for vertical centering

    // Draw stroke first for an outline effect
    gCtx.strokeStyle = line.stroke || 'black'; // Outline color
    gCtx.lineWidth = 4; // Stroke thickness
    gCtx.strokeText(line.txt, x, y);

    // Draw filled text over the stroke
    gCtx.fillStyle = line.color || 'white'; // Text fill color
    gCtx.fillText(line.txt, x, y);

    // Optional: Highlight active line (useful for debugging or editing)
    if (idx === gMeme.selectedLineIdx) {
      gCtx.strokeStyle = 'yellow';
      gCtx.lineWidth = 2;
      gCtx.strokeRect(x - 100, y - line.size, 200, line.size); // Example bounding box
    }
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

  let isPainting = false;

  document.getElementById('paint-toggle').addEventListener('click', () => {
    isPainting = !isPainting; // Toggle painting mode
    console.log('Painting mode:', isPainting ? 'ON' : 'OFF');
  });

  document.getElementById('brush-size').addEventListener('input', (event) => {
    gCtx.lineWidth = event.target.value;
    console.log('Brush size:', gCtx.lineWidth);
  });

  document.getElementById('paint-color').addEventListener('input', (event) => {
    gCtx.strokeStyle = event.target.value;
    console.log('Paint color:', gCtx.strokeStyle);
  });

  gCanvas.addEventListener('mousedown', (event) => {
    if (!isPainting) return;

    const { offsetX, offsetY } = event;
    const paintCtx = paintLayer.getContext('2d');
    paintCtx.beginPath();
    paintCtx.moveTo(offsetX, offsetY);

    gCanvas.isDrawing = true;
});

gCanvas.addEventListener('mousemove', (event) => {
    if (!isPainting || !gCanvas.isDrawing) return;

    const { offsetX, offsetY } = event;
    const paintCtx = paintLayer.getContext('2d');

    // Set paint styles
    paintCtx.lineCap = 'round';
    paintCtx.lineJoin = 'round';
    paintCtx.lineWidth = gCtx.lineWidth;
    paintCtx.strokeStyle = gCtx.strokeStyle;

    paintCtx.lineTo(offsetX, offsetY);
    paintCtx.stroke();
});

gCanvas.addEventListener('mouseup', () => {
    if (!isPainting) return;
    gCanvas.isDrawing = false;
});


  document.getElementById('text-color').addEventListener('input', (event) => {
    const selectedColor = event.target.value;
    setLineColor(selectedColor); // Update the line color
    renderMeme(); // Re-render the canvas
  });

  // // Add a new text line
  // document.getElementById('add-text').addEventListener('click', () => {
  //   addLine();
  //   renderMeme();
  // });

  // Switch to the next text line
  document.getElementById('switch-line').addEventListener('click', () => {
    switchLine();
    const currentColor = gMeme.lines[gMeme.selectedLineIdx]?.color || '#ffffff';
    document.getElementById('text-color').value = currentColor;
    renderMeme();
  });


  // Update text input for the selected line
  document.getElementById('text-input').addEventListener('input', event => {
    setLineTxt(event.target.value);
    renderMeme();
  });

  document.getElementById('font-select').addEventListener('change', event => {
    const selectedFont = event.target.value; // Get the selected font
    setLineFont(selectedFont); // Update the font in the data
    renderMeme(); // Re-render the meme to apply the font change
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

  document.getElementById('add-line-btn').addEventListener('click', () => {
    addLine(gCanvas); // No need to pass gCanvas if it's not used
    renderMeme();
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
    saveMeme(gCanvas);
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
