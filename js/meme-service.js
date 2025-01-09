// Data Models
export const gImgs = [
    { id: 1, url: 'assets/img/img5.jpg', keywords: ['funny', 'animal'] },
    { id: 2, url: 'assets/img/img2.jpg', keywords: ['funny', 'men'] },
    { id: 3, url: 'assets/img/img4.jpg', keywords: ['cartoon', 'funny'] },
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

// --- FUNCTIONS --- //

// Set the selected image for the meme
function setImg(imgId) {
    gMeme.selectedImgId = imgId
    resetMeme()
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
function addLine() {
    const newLine = {
        txt: 'New line',
        size: 40,
        align: 'center',
        color: 'white',
        stroke: 'black',
        x: gCanvas.width / 2,
        y: gCanvas.height / 2,
        isDragging: false,
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

// Delete the currently selected text line
function deleteLine() {
    if (gMeme.lines.length === 0) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = Math.max(0, gMeme.selectedLineIdx - 1)
}

// Switch focus to the next text line
function switchLine() {
    if (gMeme.lines.length === 0) return
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length
}

// Update the text of the currently selected line
function setLineTxt(txt) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        gMeme.lines[gMeme.selectedLineIdx].txt = txt
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
        gMeme.lines[gMeme.selectedLineIdx].color = color
    }
}

// Update the stroke color of the selected line
function setLineStroke(strokeColor) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        gMeme.lines[gMeme.selectedLineIdx].stroke = strokeColor
    }
}

// Add a sticker to the meme
function addSticker(stickerId) {
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
function saveMeme() {
    const savedMemes = loadFromStorage(STORAGE_KEY_SAVED_MEMES) || []
    const memeDataUrl = gCanvas.toDataURL() // Save the meme as a base64 image
    savedMemes.push(memeDataUrl)
    saveToStorage(STORAGE_KEY_SAVED_MEMES, savedMemes)
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
    updateFontSize,
    setLineColor,
    setLineStroke,
    addSticker,
    saveMeme,
    getSavedMemes,
    setDragging,
    updateDragPosition,
}