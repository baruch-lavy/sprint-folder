import { getSavedMemes } from './meme-service.js'

document.addEventListener('DOMContentLoaded', () => {
  const savedMemes = getSavedMemes()
  renderSavedMemes(savedMemes)
});

function renderSavedMemes(memes) {
  const grid = document.getElementById('saved-memes-grid')
  grid.innerHTML = memes
    .map(meme => `<img src="${meme}" onclick="editSavedMeme('${meme}')">`)
    .join('')
}

function editSavedMeme(meme) {
  localStorage.setItem('selectedMeme', meme)
  window.location.href = 'editor.html'
}
 
  