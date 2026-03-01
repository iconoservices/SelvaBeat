import './style.css'

// Initial state with some sample movies
let movieDatabase = JSON.parse(localStorage.getItem('selvaflix_db')) || {
  trending: [
    { id: 1, title: 'Cocona Fugitiva', year: 2024, rating: '4.8', img: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=500', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ', status: 'healthy' },
    { id: 2, title: 'Selva de Cristal', year: 2023, rating: '4.5', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=500', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ', status: 'healthy' },
    { id: 3, title: 'El Despertar Tropical', year: 2024, rating: '4.9', img: 'https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&q=80&w=500', embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ', status: 'maintenance' },
  ],
  series: [],
  live: []
};

// Routing Logic
function handleRouting() {
  const hash = window.location.hash;
  const homeView = document.getElementById('home-view');
  const adminView = document.getElementById('admin-view');

  if (hash === '#admin') {
    homeView.style.display = 'none';
    adminView.style.display = 'block';
    renderInventory();
  } else {
    homeView.style.display = 'block';
    adminView.style.display = 'none';
    initApp(); // Re-render home with updated data
  }
}

// Render Movie Rows
function renderRow(title, data) {
  const container = document.getElementById('main-content');
  if (!data || data.length === 0) return;

  const rowHtml = `
    <section class="category-row">
      <div class="row-header">
        <h2 class="row-title">${title}</h2>
      </div>
      <div class="movie-list">
        ${data.map(item => `
          <div class="movie-card" data-id="${item.id}" data-embed="${item.embed || ''}">
            ${item.status === 'maintenance' ? '<div class="badge-maintenance">Mantenimiento</div>' : ''}
            <img src="${item.img}" alt="${item.title}" class="card-img" loading="lazy">
            <div class="card-info">
              <h3 class="card-title">${item.title}</h3>
              <p class="card-meta">${item.year || 'Estreno'} • ★ ${item.rating || '4.5'}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
  container.insertAdjacentHTML('beforeend', rowHtml);
}

// Admin: Render Inventory
function renderInventory() {
  const list = document.getElementById('inventory-list');
  const allMovies = [...movieDatabase.trending, ...movieDatabase.series, ...movieDatabase.live];

  list.innerHTML = allMovies.map(m => `
    <tr>
      <td>${m.title}</td>
      <td>
        <span style="color: ${m.status === 'healthy' ? '#2ECC71' : '#E74C3C'}">
          ${m.status === 'healthy' ? '● Activo' : '● Mantenimiento'}
        </span>
      </td>
      <td>
        <button class="action-btn btn-edit" onclick="window.editMovie(${m.id})">Editar</button>
        <button class="action-btn btn-delete" onclick="window.deleteMovie(${m.id})">Borrar</button>
      </td>
    </tr>
  `).join('');
}

// Public API for Admin Actions
window.deleteMovie = (id) => {
  movieDatabase.trending = movieDatabase.trending.filter(m => m.id !== id);
  localStorage.setItem('selvaflix_db', JSON.stringify(movieDatabase));
  renderInventory();
};

window.editMovie = (id) => {
  const movie = movieDatabase.trending.find(m => m.id === id);
  if (movie) {
    document.getElementById('m-title').value = movie.title;
    document.getElementById('m-img').value = movie.img;
    document.getElementById('m-embed').value = movie.embed;
    document.getElementById('m-meta').value = movie.year;
    // We could add an update mode here, for now it just fills the form
  }
};

// Player Logic
function openPlayer(embedUrl) {
  const modal = document.getElementById('player-modal');
  const iframe = document.getElementById('player-iframe');
  const loader = document.getElementById('player-loader');

  if (!embedUrl) {
    alert('Próximamente... estamos cosechando esta peli 🥥');
    return;
  }

  modal.style.display = 'flex';
  loader.style.opacity = '1';
  loader.style.display = 'flex';

  iframe.src = embedUrl;
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');

  iframe.onload = () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 800);
    }, 1500);
  };
}

function closePlayer() {
  const modal = document.getElementById('player-modal');
  const iframe = document.getElementById('player-iframe');
  modal.style.display = 'none';
  iframe.src = '';
}

// Bot Centinela: Simple Link Checker Simulation
async function checkLinks() {
  console.log('🤖 Bot Centinela iniciando escaneo...');
  movieDatabase.trending.forEach(m => {
    // Simulated check: if embed contains 'dQw4w9WgXcQ' (sample), it's healthy
    // In a real app, we would try a fetch or use a proxy
    if (!m.embed) m.status = 'maintenance';
  });
  localStorage.setItem('selvaflix_db', JSON.stringify(movieDatabase));
}

function initApp() {
  const container = document.getElementById('main-content');
  container.innerHTML = ''; // Clear previous

  renderRow('Recien Cosechadas', movieDatabase.trending);

  // Title fix
  document.getElementById('hero-title').style.display = 'block';
  document.getElementById('hero-title').innerText = "Cocona Fugitiva";
}

// Initial Setup
document.addEventListener('DOMContentLoaded', () => {
  handleRouting();
  window.addEventListener('hashchange', handleRouting);

  // Movie Form Submit
  document.getElementById('movie-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newMovie = {
      id: Date.now(),
      title: document.getElementById('m-title').value,
      img: document.getElementById('m-img').value,
      embed: document.getElementById('m-embed').value,
      year: document.getElementById('m-meta').value,
      status: 'healthy'
    };
    movieDatabase.trending.unshift(newMovie);
    localStorage.setItem('selvaflix_db', JSON.stringify(movieDatabase));
    e.target.reset();
    renderInventory();
    alert('¡Pelicula Guardada con éxito! 🌴🍿');
  });

  // Global Clicks
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.movie-card');
    if (card) openPlayer(card.getAttribute('data-embed'));

    if (e.target.id === 'close-player' || e.target.classList.contains('player-modal')) {
      closePlayer();
    }
  });

  // Run Bot Centinela every 10 mins (simulated)
  setInterval(checkLinks, 600000);
  checkLinks();
});
