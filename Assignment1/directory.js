const fs = require('fs');
const path = require('path');

function getDirectorySize(directoryPath) {
  return fs.readdirSync(directoryPath).reduce((totalSize, item) => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);
    return totalSize + (stats.isDirectory() ? getDirectorySize(itemPath) : stats.size);
  }, 0);
}

function directoryToTree(rootDir, depth) {
  const stats = fs.statSync(rootDir);

  const node = {
    name: path.basename(rootDir),
    path: rootDir,
    type: stats.isDirectory() ? 'dir' : 'file',
    size: stats.isDirectory() ? getDirectorySize(rootDir) : stats.size,
  };

  if (stats.isDirectory() && depth > 0) {
    node.children = fs.readdirSync(rootDir).map(child => {
      const childPath = path.join(rootDir, child);
      return directoryToTree(childPath, depth - 1);
    });
  }

  return node;
}

// Test case example
console.log(JSON.stringify(directoryToTree('dummy_dir', 5), null, 2));
