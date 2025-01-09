import {gImgs, setImg } from './meme-service.js'


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
  setImg(imgId); 
  localStorage.setItem('selectedImgId', imgId); // Sets the selected image ID
  console.log('Navigating to editor with Image ID:', imgId); // Debug log
  window.location.href = 'editor.html'; // Redirect to editor
}


// Attach `selectImage` to the global scope
window.selectImage = selectImage

