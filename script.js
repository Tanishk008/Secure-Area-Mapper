let isUserVerified = false;
let currentUsername = '';

const map = L.map('map', { zoomControl: false }).setView([26.8467, 80.9462], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  draw: {
    polygon: true,
    marker: false,
    polyline: false,
    circle: false,
    rectangle: false,
    circlemarker: false
  },
  edit: { featureGroup: drawnItems }
});

async function createSignature(hash, userKey) {
  const encoder = new TextEncoder();
  const data = encoder.encode(hash + userKey);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = '';
    this.signature = '';
  }

  async calculateHash() {
    const encoder = new TextEncoder();
    const input = encoder.encode(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', input);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
}

class Blockchain {
  constructor() {
    this.chain = [];
    this.totalArea = 0;
  }

  async initialize() {
    const genesisBlock = new Block(0, new Date().toISOString(), { msg: "Genesis Block" }, "0");
    genesisBlock.hash = await genesisBlock.calculateHash();
    this.chain.push(genesisBlock);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  async addBlock(block, userKey) {
    block.hash = await block.calculateHash();
    block.signature = await createSignature(block.hash, userKey);
    this.chain.push(block);
    if (block.data.area_km2) {
      this.totalArea += parseFloat(block.data.area_km2);
    }
    renderBlockchainUI(this.chain, this.totalArea);
  }
}

const areaChain = new Blockchain();
areaChain.initialize();

function renderBlockchainUI(chain, totalArea) {
  const container = document.getElementById("chain-content");
  container.innerHTML = '';
  chain.forEach(block => {
    const blockDiv = document.createElement('div');
    blockDiv.className = "block";
    blockDiv.innerHTML = `
      <strong>Block #${block.index}</strong><br/>
      👤 <b>User:</b> ${block.data.user || 'Anonymous'}<br/>
      ⏰ <b>Timestamp:</b> ${block.timestamp}<br/>
      🔗 <b>Prev Hash:</b> ${block.previousHash.slice(0, 15)}...<br/>
      🔐 <b>Hash:</b> ${block.hash.slice(0, 15)}...<br/>
      ✍️ <b>Signature:</b> ${block.signature.slice(0, 15)}...<br/>
      📏 <b>Area:</b> ${block.data.area_km2 ?? "-"} km²<br/>
    `;
    container.appendChild(blockDiv);
  });

  document.getElementById("total-area").innerText = `📏 Total Mapped Area: ${totalArea.toFixed(2)} km²`;
}

function getUserPrivateKey(username) {
  let storedKey = localStorage.getItem(`key_${username}`);
  if (!storedKey) {
    storedKey = Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem(`key_${username}`, storedKey);
  }
  return storedKey;
}

document.getElementById("submitBtn").addEventListener("click", () => {
  const name = document.getElementById("username").value.trim();
  if (!name) return;

  currentUsername = name;
  isUserVerified = true;

  const key = getUserPrivateKey(currentUsername);
  map.addControl(drawControl);
  document.getElementById("map").style.filter = "none";
  document.getElementById("map").style.pointerEvents = "auto";
});

document.getElementById("clearNameBtn").addEventListener("click", () => {
  document.getElementById("username").value = '';
  currentUsername = '';
  isUserVerified = false;
  drawnItems.clearLayers();
  document.getElementById("map").style.filter = "grayscale(1)";
  document.getElementById("map").style.pointerEvents = "none";
});

document.getElementById("zoomIn").addEventListener("click", () => map.zoomIn());
document.getElementById("zoomOut").addEventListener("click", () => map.zoomOut());

map.on(L.Draw.Event.CREATED, async function (event) {
  if (!isUserVerified) return;

  drawnItems.clearLayers();
  const layer = event.layer;
  drawnItems.addLayer(layer);

  const latlngs = layer.getLatLngs()[0].map(latlng => [latlng.lng, latlng.lat]);
  latlngs.push(latlngs[0]);
  const polygon = turf.polygon([latlngs]);

  const areaSqMeters = turf.area(polygon);
  const areaSqKm = (areaSqMeters / 1e6).toFixed(2);
  document.getElementById('area').innerText = 'Area: ' + areaSqKm + ' km²';

  const userKey = getUserPrivateKey(currentUsername);
  const data = {
    user: currentUsername,
    coordinates: latlngs,
    area_km2: areaSqKm
  };

  const index = areaChain.chain.length;
  const timestamp = new Date().toISOString();
  const previousHash = areaChain.getLatestBlock().hash;
  const newBlock = new Block(index, timestamp, data, previousHash);

  await areaChain.addBlock(newBlock, userKey);
});

// 📥 Download blockchain as JSON file
function downloadBlockchain() {
  const dataStr = JSON.stringify(areaChain.chain, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'blockchain_log.json';
  a.click();
}
