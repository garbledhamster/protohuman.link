// Google Analytics (Global Site Tag) initialization
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-GNDF6DYYCN');

// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app-check.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDamjUdLVEBIyjt-mTX1l7NytJDLwPP71U",
  authDomain: "protohuman-link.firebaseapp.com",
  projectId: "protohuman-link",
  storageBucket: "protohuman-link.firebasestorage.app",
  messagingSenderId: "388132169241",
  appId: "1:388132169241:web:eee03fcbe48e5535afec88",
  measurementId: "G-GNDF6DYYCN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Initialize App Check with reCAPTCHA v3
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Levv7QqAAAAAKLZSWTtrLSdhvh1O02FqmkkXdMZ"),
  isTokenAutoRefreshEnabled: true
});

// DOM elements
const mindList = document.getElementById('mindList');
const bodyList = document.getElementById('bodyList');
const spiritList = document.getElementById('spiritList');
const lifeList = document.getElementById('lifeList');
const searchInput = document.getElementById('searchInput');

// We'll store all protocols in an object
let allProtocols = {
  mind: {},
  body: {},
  spirit: {},
  life: {}
};

// Category keys to match Firestore collections
const categories = ["mind", "body", "spirit", "life"];

// Load protocols from Firestore
async function loadProtocols() {
  for (const cat of categories) {
    const snapshot = await getDocs(collection(db, cat));
    snapshot.forEach(doc => {
      // doc.id (e.g. "mental_reset") -> doc.data() has fields (title, description, sources, etc.)
      allProtocols[cat][doc.id] = doc.data();
    });
  }
  // Render everything once loaded
  renderLists(allProtocols);
}

// Render each category in its UL
function renderLists(protocols) {
  renderCategory(protocols.mind, mindList);
  renderCategory(protocols.body, bodyList);
  renderCategory(protocols.spirit, spiritList);
  renderCategory(protocols.life, lifeList);
}

// Helper to render a category
function renderCategory(categoryObj, ulElement) {
  if (!categoryObj) return;
  ulElement.innerHTML = '';
  Object.keys(categoryObj).forEach(protocolKey => {
    const protocol = categoryObj[protocolKey];

    // Create list item
    const li = document.createElement('li');
    li.textContent = protocol.title || protocolKey;

    // Hover card
    const hoverCard = document.createElement('div');
    hoverCard.classList.add('hover-card');

    // Title
    const hoverTitle = document.createElement('h3');
    hoverTitle.textContent = protocol.title || protocolKey;
    hoverCard.appendChild(hoverTitle);

    // Description
    if (protocol.description) {
      const hoverDesc = document.createElement('p');
      hoverDesc.textContent = protocol.description;
      hoverCard.appendChild(hoverDesc);
    }

    // HowTo
    if (protocol.HowTo) {
      const hoverHowTo = document.createElement('p');
      hoverHowTo.textContent = `HowTo: ${protocol.HowTo}`;
      hoverCard.appendChild(hoverHowTo);
    }

    // Sources
    if (protocol.sources) {
      const hoverSources = document.createElement('p');
      if (typeof protocol.sources === 'string') {
        hoverSources.innerHTML = `Sources: <a href="${protocol.sources}" target="_blank">${protocol.sources}</a>`;
      } else if (Array.isArray(protocol.sources)) {
        hoverSources.innerHTML =
          'Sources: ' +
          protocol.sources
            .map(src => `<a href="${src}" target="_blank">${src}</a>`)
            .join(', ');
      }
      hoverCard.appendChild(hoverSources);
    }

    li.appendChild(hoverCard);
    ulElement.appendChild(li);
  });
}

// Simple search
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();

  categories.forEach(cat => {
    const ulElement = document.getElementById(cat + 'List');
    ulElement.innerHTML = '';

    Object.keys(allProtocols[cat]).forEach(protocolKey => {
      const protocol = allProtocols[cat][protocolKey];
      // Combine relevant fields into a single string for searching
      const combinedText = (
        (protocol.title || '') +
        (protocol.description || '') +
        (protocol.HowTo || '')
      ).toLowerCase();

      // If it matches or query is empty, display
      if (combinedText.includes(query) || query === '') {
        const li = document.createElement('li');
        li.textContent = protocol.title || protocolKey;

        const hoverCard = document.createElement('div');
        hoverCard.classList.add('hover-card');

        // Title
        const hoverTitle = document.createElement('h3');
        hoverTitle.textContent = protocol.title || protocolKey;
        hoverCard.appendChild(hoverTitle);

        // Description
        if (protocol.description) {
          const hoverDesc = document.createElement('p');
          hoverDesc.textContent = protocol.description;
          hoverCard.appendChild(hoverDesc);
        }

        // HowTo
        if (protocol.HowTo) {
          const hoverHowTo = document.createElement('p');
          hoverHowTo.textContent = `HowTo: ${protocol.HowTo}`;
          hoverCard.appendChild(hoverHowTo);
        }

        // Sources
        if (protocol.sources) {
          const hoverSources = document.createElement('p');
          if (typeof protocol.sources === 'string') {
            hoverSources.innerHTML = `Sources: <a href="${protocol.sources}" target="_blank">${protocol.sources}</a>`;
          } else if (Array.isArray(protocol.sources)) {
            hoverSources.innerHTML =
              'Sources: ' +
              protocol.sources
                .map(src => `<a href="${src}" target="_blank">${src}</a>`)
                .join(', ');
          }
          hoverCard.appendChild(hoverSources);
        }

        li.appendChild(hoverCard);
        ulElement.appendChild(li);
      }
    });
  });
});

// On page load, fetch and display protocols
window.addEventListener('DOMContentLoaded', loadProtocols);
