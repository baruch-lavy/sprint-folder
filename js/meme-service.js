// Data Models
export const gImgs = [
    { id: 1, url: 'assets/img/2.jpg', keywords: ['funny', 'animal'] },
    { id: 2, url: 'assets/img/003.jpg', keywords: ['funny', 'men'] },
    { id: 3, url: 'assets/img/004.jpg', keywords: ['cartoon', 'funny'] },
    { id: 4, url: 'assets/img/5.jpg', keywords: ['funny, animal'] },
    { id: 5, url: 'assets/img/005.jpg', keywords: ['funny, animal'] },
    { id: 6, url: 'assets/img/006.jpg', keywords: ['funny, animal'] },
    { id: 7, url: 'assets/img/8.jpg', keywords: ['funny, animal'] },
    { id: 8, url: 'assets/img/9.jpg', keywords: ['funny, animal'] },
    { id: 9, url: 'assets/img/12.jpg', keywords: ['funny, animal'] },
    { id: 10, url: 'assets/img/19.jpg', keywords: ['funny, animal'] },
    { id: 11, url: 'assets/img/Ancient-Aliens.jpg', keywords: ['funny, animal'] },
    { id: 12, url: 'assets/img/drevil.jpg', keywords: ['funny, animal'] },
    { id: 13, url: 'assets/img/img2.jpg', keywords: ['funny, animal'] },
    { id: 14, url: 'assets/img/img4.jpg', keywords: ['funny, animal'] },
    { id: 15, url: 'assets/img/img5.jpg', keywords: ['funny, animal'] },
    { id: 16, url: 'assets/img/img6.jpg', keywords: ['funny, animal'] },
    { id: 17, url: 'assets/img/img11.jpg', keywords: ['funny, animal'] },
    { id: 18, url: 'assets/img/img12.jpg', keywords: ['funny, animal'] },
    { id: 19, url: 'assets/img/leo.jpg', keywords: ['funny, animal'] },
    { id: 20, url: 'assets/img/meme1.jpg', keywords: ['funny, animal'] },
    { id: 21, url: 'assets/img/One-Dose-NotSimply.jpg', keywords: ['funny, animal'] },
    { id: 22, url: 'assets/img/Oprah-You-Get-A.jpg', keywords: ['funny, animal'] },
    { id: 23, url: 'assets/img/patrick.jpg', keywords: ['funny, animal'] },
    { id: 24, url: 'assets/img/putin.jpg', keywords: ['funny, animal'] },
    { id: 25, url: 'assets/img/X-Everywhere.jpg', keywords: ['funny, animal'] },
]

const gStickers = [
    { id: 1, url: 'assets/stickers/sticker1.png' },
    { id: 2, url: 'assets/stickers/sticker2.png' },
    { id: 3, url: 'assets/stickers/sticker3.png' },
]

export let gMeme = {
    selectedImgId: null,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'Your text here',
            size: 40,
            align: 'center',
            color: 'white',
            stroke: 'black',
            x: 250,
            y: 50,
            isDragging: false,
        },
    ],
    stickers: [],
}

// LOCAL STORAGE KEYS
const STORAGE_KEY_SAVED_MEMES = 'savedMemes'
let paintLayer = null; // Offscreen canvas for painting

// --- FUNCTIONS --- //

function resetPaintLayer() {
    if (paintLayer) {
        const paintCtx = paintLayer.getContext('2d');
        paintCtx.clearRect(0, 0, paintLayer.width, paintLayer.height);
    }
}

// Set the selected image for the meme
function setImg(imgId) {
    gMeme.selectedImgId = imgId;
    resetPaintLayer(); // Clear painting strokes
    resetMeme();
}

// Reset the meme to a default state
function resetMeme() {
    gMeme.lines = [
        {
            txt: 'Your text here',
            size: 40,
            align: 'center',
            color: 'white',
            stroke: 'black',
            x: 250,
            y: 50,
            isDragging: false,
        },
    ]
    gMeme.stickers = []
    gMeme.selectedLineIdx = 0
}

// Add a new text line to the meme
function addLine(gCanvas) {
    const newLine = {
        txt: 'New line',
        size: 40,
        align: 'center',
        color: 'white',
        stroke: 'black',
        x: gCanvas.width / 2, // Center horizontally
        y: (gMeme.lines.length + 1) * 50, // Stagger lines vertically
        isDragging: false,
    };
    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx = gMeme.lines.length - 1; // Select the new line
    console.log('Added new line:', newLine);
}

// Delete the currently selected text line
function deleteLine() {
    if (gMeme.lines.length === 0) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = Math.max(0, gMeme.selectedLineIdx - 1)
}

// Switch focus to the next text line
function switchLine() {
    console.log('Lines:', gMeme.lines);
    console.log('Selected Line Index Before Switch:', gMeme.selectedLineIdx);

    if (gMeme.lines.length === 0) return;
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length;
    console.log('Switched to line:', gMeme.selectedLineIdx, gMeme.lines[gMeme.selectedLineIdx]);
}

// Update the text of the currently selected line
function setLineTxt(txt) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        gMeme.lines[gMeme.selectedLineIdx].txt = txt
    }
}

function setLineFont(font) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        gMeme.lines[gMeme.selectedLineIdx].font = font; // Set the font
    }
}

// Update the font size of the selected line
function updateFontSize(change) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        gMeme.lines[gMeme.selectedLineIdx].size += change
    }
}

// Update the color of the selected line
function setLineColor(color) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        gMeme.lines[gMeme.selectedLineIdx].color = color;
    }
}

// Update the stroke color of the selected line
function setLineStroke(strokeColor) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        gMeme.lines[gMeme.selectedLineIdx].stroke = strokeColor
    }
}

// Add a sticker to the meme
function addSticker(stickerId, gCanvas) {
    const sticker = gStickers.find(sticker => sticker.id === stickerId)
    if (sticker) {
        gMeme.stickers.push({
            id: stickerId,
            url: sticker.url,
            x: gCanvas.width / 2,
            y: gCanvas.height / 2,
            size: 50,
            isDragging: false,
        })
    }
}

// Save the current meme to localStorage
function saveMeme(gCanvas) {
    const savedMemes = loadFromStorage(STORAGE_KEY_SAVED_MEMES) || [];
    const memeDataUrl = gCanvas.toDataURL(); // Save the meme as a base64 image
    savedMemes.push(memeDataUrl);
    saveToStorage(STORAGE_KEY_SAVED_MEMES, savedMemes);
    console.log('Meme saved successfully!');
}


// Get the saved memes from localStorage
function getSavedMemes() {
    return loadFromStorage(STORAGE_KEY_SAVED_MEMES) || []
}

// --- DRAGGING LOGIC --- //

// Set the dragging state of a line or sticker
function setDragging(isDragging, idx, type = 'line') {
    if (type === 'line') {
        gMeme.lines[idx].isDragging = isDragging;
    } else if (type === 'sticker') {
        gMeme.stickers[idx].isDragging = isDragging
    }
}

// Update the position of a dragging element
function updateDragPosition(dx, dy, idx, type = 'line') {
    if (type === 'line') {
        gMeme.lines[idx].x += dx
        gMeme.lines[idx].y += dy
    } else if (type === 'sticker') {
        gMeme.stickers[idx].x += dx
        gMeme.stickers[idx].y += dy
    }
}

// --- STORAGE HELPERS --- //

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}

// Exporting functions for use in other modules
export {
    setImg,
    resetMeme,
    addLine,
    deleteLine,
    switchLine,
    setLineTxt,
    setLineFont,
    updateFontSize,
    setLineColor,
    setLineStroke,
    addSticker,
    saveMeme,
    getSavedMemes,
    setDragging,
    updateDragPosition,
}
