#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');

const USERSCRIPT_PATH = path.join(__dirname, '..', 'privacy-redirector.user.js');
const DATA_JSON_URL = 'https://raw.githubusercontent.com/libredirect/instances/main/data.json';

const FRONTEND_MAP = {
  anonymousOverflow: 'anonymousoverflow',
  biblioReads: 'biblioreads',
  binternet: 'binternet',
  breezeWiki: 'breezewiki',
  dumb: 'dumb',
  hyperpipe: 'hyperpipe',
  invidious: 'invidious',
  libMedium: 'libmedium',
  libremdb: 'libremdb',
  lingva: 'lingva',
  mozhi: 'mozhi',
  neuters: 'neuters',
  nitter: 'nitter',
  piped: 'piped',
  pixivFe: 'pixivfe',
  priviblur: 'priviblur',
  proxiTok: 'proxitok',
  proxigram: 'proxigram',
  quetre: 'quetre',
  redlib: 'libreddit',
  rimgo: 'rimgo',
  safetwitch: 'safetwitch',
  scribe: 'scribe',
  searx: 'searx',
  searxng: 'searxng',
  skunkyArt: 'skunkyart',
  tent: 'tent',
  teddit: 'teddit',
  wikiless: 'wikiless',
};

const REVERSE_MAP = {};
for (const [lrKey, prKey] of Object.entries(FRONTEND_MAP)) {
  REVERSE_MAP[prKey] = lrKey;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function cleanInstanceUrl(url) {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/+$/, '');
    return u.hostname + path;
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/+$/, '').split('/')[0];
  }
}

function serializeInstances(instances) {
  const keys = Object.keys(instances);
  const lines = ['const Instances = {'];

  for (const key of keys) {
    const value = instances[key];
    if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`  ${key}: [],`);
      } else {
        lines.push(`  ${key}: [`);
        for (const v of value) {
          lines.push(`    "${v}",`);
        }
        lines.push('  ],');
      }
    } else if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      lines.push(`  ${key}: {`);
      for (const [k, v] of entries) {
        lines.push(`    ${k}: "${v}",`);
      }
      lines.push('  },');
    }
  }

  lines.push('};');
  return lines.join('\n');
}

function findInstancesBlockEnd(text, startPos) {
  let depth = 1;
  let inString = false;
  let stringChar = null;

  for (let i = startPos; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (ch === '\\') { i++; continue; }
      if (ch === stringChar) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      continue;
    }
    if (ch === '{') { depth++; continue; }
    if (ch === '}') {
      depth--;
      if (depth === 0) {
        const rest = text.slice(i);
        const m = rest.match(/^}\s*;/);
        if (m) return i + m[0].length;
        return i + 1;
      }
    }
  }
  throw new Error('Could not find end of Instances block');
}

async function main() {
  console.log('Fetching libredirect instances data...');
  const libredirectData = await fetchJson(DATA_JSON_URL);
  console.log(`Fetched ${Object.keys(libredirectData).length} frontends`);

  const lrHostnames = {};
  for (const [key, networks] of Object.entries(libredirectData)) {
    if (networks.clearnet && networks.clearnet.length > 0) {
      lrHostnames[key] = networks.clearnet
        .map(url => cleanInstanceUrl(url))
        .filter(Boolean);
    }
  }

  global.window = {
    location: { hostname: 'NONE', hash: 'x', protocol: 'https:', search: '', pathname: '/' },
  };
  delete require.cache[require.resolve(USERSCRIPT_PATH)];
  const script = require(USERSCRIPT_PATH);
  const existingInstances = script.Instances;

  const newInstances = {};
  for (const prKey of Object.keys(existingInstances)) {
    const lrKey = REVERSE_MAP[prKey];
    if (lrKey && lrHostnames[lrKey] && lrHostnames[lrKey].length > 0) {
      newInstances[prKey] = lrHostnames[lrKey];
    } else {
      newInstances[prKey] = existingInstances[prKey];
    }
  }

  const scriptContent = fs.readFileSync(USERSCRIPT_PATH, 'utf8');
  const blockStartIdx = scriptContent.indexOf('const Instances = {');
  if (blockStartIdx === -1) throw new Error('Could not find Instances block start');

  const startOfContent = blockStartIdx + 'const Instances = {'.length;
  const instancesEnd = findInstancesBlockEnd(scriptContent, startOfContent);

  const newBlock = serializeInstances(newInstances);
  const updatedScript = scriptContent.slice(0, blockStartIdx) + newBlock + scriptContent.slice(instancesEnd);

  fs.writeFileSync(USERSCRIPT_PATH, updatedScript);
  console.log(`Updated Instances block in ${USERSCRIPT_PATH}`);

  const mappedUpdated = Object.keys(FRONTEND_MAP).filter(k => lrHostnames[k]).length;
  const total = Object.keys(newInstances).length;
  console.log(`Updated ${mappedUpdated} frontends from libredirect data`);
  console.log(`Preserved ${total - mappedUpdated} frontends (no libredirect equivalent)`);
  console.log(`Total: ${total} frontends`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
