// ===========================
// ANILIST API INTEGRATION
// ===========================
const ANILIST_API = 'https://graphql.anilist.co';

// CONFIGURATION: 
const ANILIST_USERNAME = 'daazex';

// ===========================
const SPOTIFY_PLAYLISTS = [
    {
        name: 'Playlist 1 🎵',
        description: 'Great J-pop mix',
        embedUrl: 'https://open.spotify.com/embed/playlist/5CCDd7EeQW1A3dGWbELofD',
        playlistUrl: 'https://open.spotify.com/playlist/5CCDd7EeQW1A3dGWbELofD'
    },
    {
        name: 'Playlist 2 🎧',
        description: 'Chill beats and relaxing tunes',
        embedUrl: 'https://open.spotify.com/embed/playlist/5ZVUStK1f4AI5z9tdXnPYs',
        playlistUrl: 'https://open.spotify.com/playlist/5ZVUStK1f4AI5z9tdXnPYs'
    },
    {
        name: 'Playlist 3 ✨',
        description: 'Energy boost for productive days',
        embedUrl: 'https://open.spotify.com/embed/playlist/1wgVGVYpakNwYKnc0CVpNP',
        playlistUrl: 'https://open.spotify.com/playlist/1wgVGVYpakNwYKnc0CVpNP'
    },
    {
        name: 'Playlist 4 🌙',
        description: 'Late night moods and vibes',
        embedUrl: 'https://open.spotify.com/embed/playlist/3JmcJO8nK6vzfjNDG4CXow',
        playlistUrl: 'https://open.spotify.com/playlist/3JmcJO8nK6vzfjNDG4CXow'
    },
    {
        name: 'Playlist 5 💫',
        description: '',
        embedUrl: 'https://open.spotify.com/embed/playlist/55haYIJEd5kdvnaNfcL5VD',
        playlistUrl: 'https://open.spotify.com/playlist/55haYIJEd5kdvnaNfcL5VD'
    },
    {
        name: 'Playlist 6 🎸',
        description: '',
        embedUrl: 'https://open.spotify.com/embed/playlist/2eGpjWedcA5cw376BIqEnp',
        playlistUrl: 'https://open.spotify.com/playlist/2eGpjWedcA5cw376BIqEnp'
    },
    {
        name: 'Playlist 7 🎸',
        description: '',
        embedUrl: 'https://open.spotify.com/embed/playlist/02IxFOufJsmitQdIdZyKf7',
        playlistUrl: 'https://open.spotify.com/playlist/02IxFOufJsmitQdIdZyKf7'
    },
    {
        name: 'Playlist 8 🎸',
        description: '',
        embedUrl: 'https://open.spotify.com/embed/playlist/61MqIMSP0M8avHxgQADHjt',
        playlistUrl: 'https://open.spotify.com/playlist/61MqIMSP0M8avHxgQADHjt'
    }
    // 📝 TO ADD MORE PLAYLISTS: Copy the template below and paste it here
    // {
    //     name: 'Your Playlist Name',
    //     description: 'A brief description of your playlist',
    //     embedUrl: 'https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID',
    //     playlistUrl: 'https://open.spotify.com/playlist/YOUR_PLAYLIST_ID'
    // },
];

// ===========================
// SPOTIFY INITIALIZATION
// ===========================

// Render Spotify playlists on page load
window.addEventListener('DOMContentLoaded', () => {
    // Render playlists
    renderSpotifyPlaylists();
});

function renderSpotifyPlaylists() {
    const container = document.getElementById('spotify-playlists');
    if (!container) return;
    
    container.innerHTML = '';
    
    SPOTIFY_PLAYLISTS.forEach((playlist, index) => {
        const card = createPlaylistCard(playlist, index);
        container.appendChild(card);
        
        // ✨ NEW LINE: Tell the observer to watch this new card immediately
        if (typeof observer !== 'undefined') observer.observe(card);
    });
}

function createPlaylistCard(playlist, index) {
    const card = document.createElement('div');
    card.className = 'playlist-card animate-on-scroll';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="playlist-embed-container">
            <iframe 
                src="${playlist.embedUrl}?utm_source=generator&theme=0" 
                allowfullscreen="" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
            ></iframe>
            <div class="playlist-overlay"></div>
        </div>
        <div class="playlist-info">
            <h3 class="playlist-name">${playlist.name}</h3>
            <p class="playlist-description">${playlist.description}</p>
            <a href="${playlist.playlistUrl}" target="_blank" class="playlist-link">
                Open in Spotify
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
                </svg>
            </a>
        </div>
    `;
    
    return card;
}

// ===========================
// ANILIST INITIALIZATION
// ===========================

// Auto-load AniList data on page load
window.addEventListener('DOMContentLoaded', () => {
    if (ANILIST_USERNAME && ANILIST_USERNAME !== 'your-anilist-here') {
        fetchAniListData(ANILIST_USERNAME);
    }
});

async function fetchAniListData(username) {
    const loadingDiv = document.getElementById('anilist-loading');
    
    // Show loading state
    loadingDiv.style.display = 'block';
    document.getElementById('user-stats').style.display = 'none';
    document.getElementById('favorites-section').style.display = 'none';
    
    try {
        // Fetch user data and statistics
        const userData = await fetchUserData(username);
        
        // Display user stats
        displayUserStats(userData);
        
        // Fetch and display favorites
        const favorites = await fetchFavorites(username);
        displayFavorites(favorites);
        
        loadingDiv.style.display = 'none';
        
    } catch (error) {
        console.error('Error fetching AniList data:', error);
        loadingDiv.style.display = 'none';
        console.log('Please update ANILIST_USERNAME in script.js with your AniList username');
    }
}

async function fetchUserData(username) {
    const query = `
    query ($username: String) {
        User(name: $username) {
            id
            name
            avatar {
                large
            }
            siteUrl
            statistics {
                anime {
                    count
                    episodesWatched
                    minutesWatched
                    meanScore
                }
            }
        }
    }
    `;
    
    const response = await fetch(ANILIST_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: { username: username }
        })
    });
    
    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
    return data.data.User;
}

async function fetchFavorites(username) {
    const query = `
    query ($username: String) {
        User(name: $username) {
            favourites {
                anime {
                    nodes {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            large
                            color
                        }
                        genres
                        averageScore
                        siteUrl
                    }
                }
            }
        }
    }
    `;
    
    const response = await fetch(ANILIST_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: query,
            variables: { username: username }
        })
    });
    
    const data = await response.json();
    if (data.errors) throw new Error(data.errors[0].message);
    return data.data.User.favourites.anime.nodes;
}

function displayUserStats(user) {
    const stats = user.statistics.anime;
    const daysWatched = Math.round(stats.minutesWatched / 60 / 24 * 10) / 10;
    
    document.getElementById('user-avatar').src = user.avatar.large;
    document.getElementById('user-display-name').textContent = user.name;
    document.getElementById('user-profile-link').href = user.siteUrl;
    
    // Animate counters
    animateValue('total-anime', 0, stats.count, 1500);
    animateValue('days-watched', 0, daysWatched, 1500);
    animateValue('episodes-watched', 0, stats.episodesWatched, 1500);
    animateValue('mean-score', 0, stats.meanScore, 1500);
    
    document.getElementById('user-stats').style.display = 'block';
}

function displayFavorites(favorites) {
    const container = document.getElementById('favorite-anime');
    container.innerHTML = '';
    
    if (favorites.length === 0) {
        document.getElementById('favorites-section').style.display = 'none';
        return;
    }
    
    // Display up to 6 favorites
    favorites.slice(0, 6).forEach(anime => {
        const card = createAnimeCard(anime);
        container.appendChild(card);
    });
    
    document.getElementById('favorites-section').style.display = 'block';
}

function createAnimeCard(anime) {
    const card = document.createElement('div');
    card.className = 'favorite-card anime-card';
    
    const title = anime.title.english || anime.title.romaji;
    const scoreClass = getScoreClass(anime.averageScore);
    
    card.innerHTML = `
        <div class="card-image anime-cover">
            <img src="${anime.coverImage.large}" alt="${title}">
            <div class="card-overlay"></div>
            ${anime.averageScore ? `<div class="anime-score ${scoreClass}">⭐ ${anime.averageScore}%</div>` : ''}
        </div>
        <div class="card-content anime-info">
            <h3 class="anime-title">${title}</h3>
            <div class="anime-genres">
                ${anime.genres.slice(0, 3).map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.open(anime.siteUrl, '_blank');
    });
    
    return card;
}

function getScoreClass(score) {
    if (score >= 75) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end % 1 === 0 ? end : end.toFixed(1);
            clearInterval(timer);
        } else {
            element.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
        }
    }, 16);
}

// ===========================
// SCROLL ANIMATION OBSERVER
// ===========================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
});

// ===========================
// SMOOTH SCROLL FOR LINKS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===========================
// PARALLAX EFFECT ON SCROLL
// ===========================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero image
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Parallax for decorations
            const decorations = document.querySelectorAll('.bg-decoration');
            decorations.forEach((decoration, index) => {
                const speed = 0.5 + (index * 0.1);
                decoration.style.transform = `translate(0, ${scrolled * speed}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// ===========================
// BUTTON RIPPLE EFFECT
// ===========================
const buttons = document.querySelectorAll('.btn, .social-button');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple styles dynamically
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================
// CARD TILT EFFECT ON HOVER
// ===========================
const cards = document.querySelectorAll('.favorite-card, .glass-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===========================
// LOADING ANIMATION
// ===========================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add a subtle entrance animation
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, index * 100);
    });
});

// ===========================
// ACCESSIBILITY ENHANCEMENTS
// ===========================
// Add keyboard navigation for cards
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.favorite-card, .social-button, .anime-card').forEach(element => {
        element.setAttribute('tabindex', '0');
        
        element.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                element.click();
            }
        });
    });
});

// Announce page sections for screen readers
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    if (!section.getAttribute('aria-label')) {
        const heading = section.querySelector('h2');
        if (heading) {
            section.setAttribute('aria-label', heading.textContent);
        }
    }
});

// ===========================
// CONSOLE 
// ===========================
console.log('%c✨ Welcome to my  website! ✨', 
    'color: #ff1744; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);');
console.log('%cBuilt with 💖 and lots of coffee!', 
    'color: #00e5ff; font-size: 14px;');
console.log('%cAniList Integration Active! 📺', 
    'color: #7c4dff; font-size: 12px;');

console.log('🎮 JavaScript with AniList integration loaded successfully!');
