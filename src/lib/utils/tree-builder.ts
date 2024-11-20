interface TreeNode {
  [key: string]: any;
}

export function buildTree(items: any[], pathKey = 'path'): TreeNode {
  const tree: TreeNode = {};
  
  items.forEach(item => {
    const path = pathKey in item ? item[pathKey] : item.templatePath || 'No Template';
    const parts = path.split('/');
    let currentLevel = tree;
    
    parts.forEach((part, index) => {
      if (!currentLevel[part]) {
        if (index === parts.length - 1) {
          currentLevel[part] = item;
        } else {
          currentLevel[part] = {};
        }
      }
      currentLevel = currentLevel[part];
    });
  });
  
  return tree;
}