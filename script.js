document.addEventListener('DOMContentLoaded',()=>{
  // Bootstrap handles navbar toggling; close collapse on link click for better UX
  const navCollapse = document.getElementById('main-nav');
  if(navCollapse){
    document.querySelectorAll('#main-nav .nav-link').forEach(a=>a.addEventListener('click',()=>{
      if(navCollapse.classList.contains('show')){
        navCollapse.classList.remove('show');
        const toggler = document.querySelector('.navbar-toggler');
        if(toggler) toggler.setAttribute('aria-expanded','false');
      }
    }));
  }

  // Create equipment modal
  const equipmentModal = document.createElement('div');
  equipmentModal.className = 'equipment-modal';
  equipmentModal.innerHTML = `
    <div class="equipment-modal-content">
      <button class="equipment-modal-close" aria-label="Schließen">×</button>
      <div class="equipment-modal-body">
        <div class="equipment-images">
          <img class="equipment-modal-img" src="" alt="">
          <button class="equipment-nav equipment-prev" aria-label="Vorheriges Bild">❮</button>
          <button class="equipment-nav equipment-next" aria-label="Nächstes Bild">❯</button>
          <div class="equipment-dots"></div>
        </div>
        <div class="equipment-info">
          <h2 class="equipment-title"></h2>
          <p class="equipment-description"></p>
          <div class="equipment-details"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(equipmentModal);

  const modalCloseBtn = equipmentModal.querySelector('.equipment-modal-close');
  const modalImg = equipmentModal.querySelector('.equipment-modal-img');
  const prevBtn = equipmentModal.querySelector('.equipment-prev');
  const nextBtn = equipmentModal.querySelector('.equipment-next');
  const dotsContainer = equipmentModal.querySelector('.equipment-dots');
  const titleEl = equipmentModal.querySelector('.equipment-title');
  const descEl = equipmentModal.querySelector('.equipment-description');
  const detailsEl = equipmentModal.querySelector('.equipment-details');

  let currentModalImages = [];
  let currentImageIndex = 0;

  function openEquipmentModal(item) {
    currentModalImages = item.images || [item.image];
    currentImageIndex = 0;
    
    titleEl.textContent = item.name;
    // description may contain HTML (e.g. <br>), render as HTML
    descEl.innerHTML = item.description;
    
    // Build details
    detailsEl.innerHTML = '';
    if(item.category) {
      const cat = document.createElement('p');
      cat.className = 'equipment-category';
      cat.textContent = '📂 ' + item.category;
      detailsEl.appendChild(cat);
    }
    
    if(item.tech && Object.keys(item.tech).length > 0) {
      const tech = document.createElement('div');
      tech.className = 'equipment-tech';
      Object.entries(item.tech).forEach(([key, val]) => {
        const line = document.createElement('p');
        line.textContent = key + ': ' + val;
        tech.appendChild(line);
      });
      detailsEl.appendChild(tech);
    }
    
    if(item.availability) {
      const avail = document.createElement('p');
      avail.className = 'equipment-availability';
      avail.textContent = '✓ ' + item.availability;
      detailsEl.appendChild(avail);
    }
    
    // Update image gallery
    updateModalImage();
    updateModalDots();
    
    equipmentModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateModalImage() {
    modalImg.src = currentModalImages[currentImageIndex];
  }

  function updateModalDots() {
    dotsContainer.innerHTML = '';
    currentModalImages.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'equipment-dot' + (idx === currentImageIndex ? ' active' : '');
      dot.addEventListener('click', () => {
        currentImageIndex = idx;
        updateModalImage();
        updateModalDots();
      });
      dotsContainer.appendChild(dot);
    });
  }

  function closeEquipmentModal() {
    equipmentModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeEquipmentModal);
  equipmentModal.addEventListener('click', (e) => {
    if(e.target === equipmentModal) closeEquipmentModal();
  });

  prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + currentModalImages.length) % currentModalImages.length;
    updateModalImage();
    updateModalDots();
  });

  nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
    updateModalImage();
    updateModalDots();
  });

  // load material data
  fetch('data/material.json').then(r=>r.json()).then(data=>{
    const container = document.getElementById('material-list');
    if(!container) return;
    container.className = 'grid';
    container.innerHTML = '';
    data.items.forEach(it=>{
      const card = document.createElement('article');
      card.className='card card-equipment';
      card.style.cursor = 'pointer';
      
      const img = document.createElement('img');
      img.className='card-img';
      img.alt = it.name;
      img.src = it.image || (it.images && it.images[0]) || 'assets/placeholder.svg';
      card.appendChild(img);
      
      const body = document.createElement('div'); 
      body.className='card-body';
      
      const title = document.createElement('h3'); 
      title.className='card-title'; 
      title.textContent = it.name; 
      body.appendChild(title);
      
      card.appendChild(body);
      
      // Click to open modal
      card.addEventListener('click', () => {
        openEquipmentModal(it);
      });
      
      container.appendChild(card);
    });
  }).catch(err=>{
    console.warn('Materialdaten konnten nicht geladen werden',err);
    const container = document.getElementById('material-list');
    if(container) container.innerHTML = '<p class="muted">Materialdaten momentan nicht verfügbar.</p>';
  });

  // gallery carousel + lightbox + dynamic loading from assets/gallery.json
  let currentGalleryIndex = 0;
  let galleryImages = [];

  fetch('assets/gallery.json').then(r=>r.json()).then(data=>{
    const grid = document.getElementById('gallery-grid') || document.querySelector('.gallery-grid');
    if(!grid) return;
    grid.className = 'gallery-carousel';
    grid.innerHTML = '';
    
    if(Array.isArray(data.images) && data.images.length){
      galleryImages = data.images;
      
      // Create carousel container
      const carousel = document.createElement('div');
      carousel.className = 'carousel-container';
      
      // Image display
      const imgDisplay = document.createElement('img');
      imgDisplay.className = 'carousel-image';
      imgDisplay.src = galleryImages[0];
      imgDisplay.alt = 'Einsatzfoto 1';
      carousel.appendChild(imgDisplay);
      
      // Navigation buttons
      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-btn carousel-prev';
      prevBtn.textContent = '❮';
      prevBtn.setAttribute('aria-label', 'Vorheriges Bild');
      carousel.appendChild(prevBtn);
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-btn carousel-next';
      nextBtn.textContent = '❯';
      nextBtn.setAttribute('aria-label', 'Nächstes Bild');
      carousel.appendChild(nextBtn);
      
      // Dots
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'carousel-dots';
      galleryImages.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
          currentGalleryIndex = idx;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      });
      carousel.appendChild(dotsContainer);
      
      grid.appendChild(carousel);
      
      function updateCarousel() {
        imgDisplay.src = galleryImages[currentGalleryIndex];
        imgDisplay.alt = 'Einsatzfoto ' + (currentGalleryIndex + 1);
        
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentGalleryIndex);
        });
      }
      
      prevBtn.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        updateCarousel();
      });
      
      nextBtn.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateCarousel();
      });
      
      // Click image to open lightbox
      imgDisplay.addEventListener('click', () => {
        lightbox.classList.add('open');
        lbImg.src = galleryImages[currentGalleryIndex];
        document.body.style.overflow = 'hidden';
      });
      
    } else {
      grid.innerHTML = '<p class="muted">Keine Bilder vorhanden.</p>';
    }
  }).catch(err=>{
    console.warn('Galerie konnte nicht geladen werden',err);
    const grid = document.getElementById('gallery-grid') || document.querySelector('.gallery-grid');
    if(grid) grid.innerHTML = '<p class="muted">Galerie nicht verfügbar.</p>';
  });

  // Lightbox for detailed view
  const lightbox = document.createElement('div');
  lightbox.className='lightbox';
  lightbox.innerHTML = '<button class="close" aria-label="Schließen">×</button><button class="lightbox-nav lightbox-prev" aria-label="Vorheriges Bild">❮</button><img src="" alt=""><button class="lightbox-nav lightbox-next" aria-label="Nächstes Bild">❯</button>';
  document.body.appendChild(lightbox);
  const lbImg = lightbox.querySelector('img');
  const lbClose = lightbox.querySelector('.close');

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  const lbPrev = lightbox.querySelector('.lightbox-prev');
  const lbNext = lightbox.querySelector('.lightbox-next');
  
  lbPrev.addEventListener('click',(e)=>{
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    lbImg.src = galleryImages[currentGalleryIndex];
  });
  
  lbNext.addEventListener('click',(e)=>{
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    lbImg.src = galleryImages[currentGalleryIndex];
  });
  
  lbClose.addEventListener('click',()=>closeLightbox());
  lightbox.addEventListener('click',(e)=>{ if(e.target===lightbox) closeLightbox(); });

  // keyboard accessibility
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      if(equipmentModal.classList.contains('open')) closeEquipmentModal();
      if(lightbox.classList.contains('open')) closeLightbox();
      if(navCollapse && navCollapse.classList.contains('show')){
        navCollapse.classList.remove('show');
        const toggler = document.querySelector('.navbar-toggler');
        if(toggler) toggler.setAttribute('aria-expanded','false');
      }
    }
    if(equipmentModal.classList.contains('open') && currentModalImages.length > 1){
      if(e.key === 'ArrowRight'){
        e.preventDefault();
        currentImageIndex = (currentImageIndex + 1) % currentModalImages.length;
        updateModalImage();
        updateModalDots();
      } else if(e.key === 'ArrowLeft'){
        e.preventDefault();
        currentImageIndex = (currentImageIndex - 1 + currentModalImages.length) % currentModalImages.length;
        updateModalImage();
        updateModalDots();
      }
    }
    if(lightbox.classList.contains('open') && galleryImages.length > 1){
      if(e.key === 'ArrowRight'){
        e.preventDefault();
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        lbImg.src = galleryImages[currentGalleryIndex];
      } else if(e.key === 'ArrowLeft'){
        e.preventDefault();
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        lbImg.src = galleryImages[currentGalleryIndex];
      }
    }
  });

  // header style on scroll
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll',()=>{
    if(window.scrollY>8) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  });
});
