const fs = require('fs');
const path = require('path');

function getDirectorySize(directoryPath) {
  // Retrieve the total size of the directory
  return fs.readdirSync(directoryPath).reduce((totalSize, item) => {
    const itemPath = path.join(directoryPath, item);
    const stats = fs.statSync(itemPath);
    return totalSize + (stats.isDirectory() ? getDirectorySize(itemPath) : stats.size);
  }, 0);
}

function directoryToTree(rootDir, depth) {
  // Get stats of root directory
  const stats = fs.statSync(rootDir);

  // Create a node for the root directory or file
  const node = {
    name: path.basename(rootDir),
    path: rootDir,
    type: stats.isDirectory() ? 'dir' : 'file',
    size: stats.isDirectory() ? getDirectorySize(rootDir) : stats.size,
  };

  // If it's a directory and depth is greater than 0, explore the children
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
