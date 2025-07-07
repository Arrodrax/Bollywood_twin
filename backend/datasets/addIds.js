const fs = require('fs');

const celebs = JSON.parse(fs.readFileSync('celebs-no-id.json', 'utf8'));

const celebsWithIds = celebs.map((celeb, index) => ({
  id: index + 1, // IDs starting from 1
  ...celeb
}));

fs.writeFileSync('celebs.json', JSON.stringify(celebsWithIds, null, 2));

console.log('IDs added and saved to celebs.json');
