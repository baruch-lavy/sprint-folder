import { setImg } from './meme-service.js'

const gImgs = [
  { id: 1, url: 'assets/img/img4.jpg', keywords: ['funny', 'animal'] },
  { id: 2, url: 'assets/img/img2.jpg', keywords: ['funny', 'men'] },
  { id: 3, url: 'assets/img5.jpg', keywords: ['cartoon', 'funny'] },
];

document.addEventListener('DOMContentLoaded', () => {
  renderGallery()
  setupSearch()
})

// Render the image gallery
function renderGallery(filter = '') {
  const grid = document.getElementById('image-grid')
  const filteredImgs = gImgs.filter(img =>
    img.keywords.some(keyword => keyword.includes(filter))
  )
  grid.innerHTML = filteredImgs
    .map(img => `<img src="${img.url}" onclick="selectImage(${img.id})">`)
    .join('')
}

// Handle search input for filtering images
function setupSearch() {
  document.getElementById('search-input').addEventListener('input', event => {
    renderGallery(event.target.value.toLowerCase())
  });
}

// Select an image and navigate to the editor
function selectImage(imgId) {
  setImg(imgId)
  window.location.href = 'editor.html'
}

// Attach `selectImage` to the global scope
// window.selectImage = selectImage

