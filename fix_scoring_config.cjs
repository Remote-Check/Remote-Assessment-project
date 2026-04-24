const fs = require('fs');
const filePath = 'client/src/data/scoring-config.json';
let content = fs.readFileSync(filePath, 'utf8');

// Replace targetWords with the correct ones
content = content.replace(
  /"targetWords": \["פנס", "חסידה", "ורד", "ירח", "אמת"\]/,
  '"targetWords": ["פנים", "קטיפה", "כנסייה", "חרצית", "אדום"]'
);

fs.writeFileSync(filePath, content);
