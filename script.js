/*
 * Copyright © 2026 Siva Prabhakar (https://sivaprabhakar.in). All Rights Reserved.
 * Base Design: Copyright © 2026 Jaisal E. K. (https://jaisal.in). Base Design Reuse Rights Reserved.
 * Design completed and handed over to Siva Prabhakar on 27 February 2026. Provided as a finished project
 * for independent use and maintenance, without ongoing warranties or liabilities.
 */

document.addEventListener('DOMContentLoaded', () => {
    const tabTriggers = document.querySelectorAll('[data-tab]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const artTriggers = document.querySelectorAll('.art-btn');
    const currentYearSpan = document.getElementById('currentYear');
    const profileCompact = document.getElementById('home-trigger');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navDropdown = document.querySelector('.nav-dropdown');

    let galleriesPopulated = false;

    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('menu-open');
            const icon = mobileMenuBtn.querySelector('i');
            if (mainNav.classList.contains('menu-open')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });
    }

    const dropdownToggle = document.querySelector('.nav-dropdown > .nav-item');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                navDropdown.classList.toggle('open');
            }
        });
    }

    function switchTab(targetTabId) {
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.dropdown-item').forEach(item => item.classList.remove('active'));

        const activeTrigger = document.querySelector(`[data-tab="${targetTabId}"]`);
        if (activeTrigger) {
            activeTrigger.classList.add('active');
            const parentDropdown = activeTrigger.closest('.nav-dropdown');
            if (parentDropdown) {
                const parentNav = parentDropdown.querySelector('.nav-item');
                if (parentNav) parentNav.classList.add('active');
            }
        }

        tabPanels.forEach(panel => {
            if (panel.id === targetTabId) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        if (window.innerWidth <= 900 && mainNav) {
            mainNav.classList.remove('menu-open');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
            if (navDropdown) navDropdown.classList.remove('open');
        }

        if (!galleriesPopulated && (targetTabId === 'gallery' || targetTabId === 'photographs' || targetTabId === 'pencil_sketches')) {
            if (typeof galleryData !== 'undefined' && galleryData.artworks) {
                populateGalleries(galleryData.artworks);
                galleriesPopulated = true;
            }
        }
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    tabTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-tab');
            if (targetId) {
                switchTab(targetId);
            }
        });
    });

    artTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-trigger');
            if (targetId) {
                switchTab(targetId);
            }
        });
    });

    if (profileCompact) {
        profileCompact.addEventListener('click', (e) => {
            if (!e.target.closest('.social-links-grid')) {
                switchTab('overview');
            }
        });
    }

    function populateGalleries(artworks) {
        const containers = {
            gallery: document.getElementById('gallery-container'),
            photographs: document.getElementById('photographs-container'),
            pencil_sketches: document.getElementById('pencil-sketches-container')
        };

        const folderContainer = document.getElementById('folder-container');
        const galleryBackBtn = document.getElementById('gallery-back-btn');
        const galleryIntroText = document.getElementById('gallery-intro-text');
        const mainGalleryContainer = document.getElementById('gallery-container');

        if (!artworks || !Array.isArray(artworks)) return;

        const galleryFolders = {};
        const galleryLoose = [];

        artworks.forEach(art => {
            if (art.category === 'gallery') {
                if (art.folder) {
                    if (!galleryFolders[art.folder]) {
                        galleryFolders[art.folder] = [];
                    }
                    galleryFolders[art.folder].push(art);
                } else {
                    galleryLoose.push(art);
                }
            }
        });

        function createArtElement(art) {
            const artPiece = document.createElement('div');
            artPiece.className = 'art-piece';

            const img = document.createElement('img');
            img.className = 'art-placeholder';
            img.src = `assets/images/${art.category}/${art.filename}`;
            img.alt = art.title || 'Artwork';
            img.loading = 'lazy';
            img.decoding = 'async';

            artPiece.appendChild(img);

            const overlay = document.createElement('div');
            overlay.className = 'art-overlay';

            const titleSpan = document.createElement('span');
            titleSpan.className = 'art-title';
            titleSpan.textContent = art.title || '';
            
            const mediumSpan = document.createElement('span');
            mediumSpan.className = 'art-medium';
            mediumSpan.textContent = art.category.replace('_', ' ');

            overlay.appendChild(titleSpan);
            if(art.title) overlay.appendChild(mediumSpan);
            artPiece.appendChild(overlay);

            return artPiece;
        }

        artworks.forEach(art => {
            if (art.category !== 'gallery' && containers[art.category]) {
                containers[art.category].appendChild(createArtElement(art));
            }
        });

        function renderMainGallery() {
            mainGalleryContainer.innerHTML = '';
            
            Object.keys(galleryFolders).forEach(folderName => {
                const items = galleryFolders[folderName];
                const coverItem = items[0];

                const folderCard = document.createElement('div');
                folderCard.className = 'art-piece folder-card';
                
                const img = document.createElement('img');
                img.className = 'art-placeholder';
                img.src = `assets/images/gallery/${coverItem.filename}`;
                img.alt = folderName;
                img.loading = 'lazy';
                img.decoding = 'async';
                
                folderCard.appendChild(img);

                const overlay = document.createElement('div');
                overlay.className = 'art-overlay';

                const titleSpan = document.createElement('span');
                titleSpan.className = 'art-title';
                titleSpan.innerHTML = `<i class="ph ph-folder"></i> ${folderName}`;
                
                const countSpan = document.createElement('span');
                countSpan.className = 'art-count';
                countSpan.textContent = `${items.length} Items`;

                overlay.appendChild(titleSpan);
                overlay.appendChild(countSpan);
                folderCard.appendChild(overlay);

                folderCard.addEventListener('click', () => {
                    openFolder(folderName, items);
                });

                mainGalleryContainer.appendChild(folderCard);
            });

            galleryLoose.forEach(art => {
                mainGalleryContainer.appendChild(createArtElement(art));
            });
        }

        function openFolder(folderName, items) {
            mainGalleryContainer.style.display = 'none';
            folderContainer.style.display = 'block';
            folderContainer.innerHTML = '';
            galleryBackBtn.style.display = 'flex';
            galleryIntroText.textContent = `Browsing Album: ${folderName}`;

            items.forEach(art => {
                folderContainer.appendChild(createArtElement(art));
            });
        }

        if (galleryBackBtn) {
            galleryBackBtn.addEventListener('click', () => {
                folderContainer.style.display = 'none';
                mainGalleryContainer.style.display = 'block';
                galleryBackBtn.style.display = 'none';
                galleryIntroText.textContent = 'A curated collection of my general artistic pursuits.';
            });
        }

        renderMainGallery();
    }
});