interface TreeNode {
  [key: string]: TreeNode | any;
}

export function buildTree(items: any[], pathKey = 'path'): TreeNode {
  return items.reduce<TreeNode>((tree, item) => {
    const path = pathKey in item ? item[pathKey] : item.templatePath || 'No Template';
    const parts = path.split('/');
    let currentLevel = tree;
    
    parts.forEach((part: string, index: number) => {
      if (!currentLevel[part]) {
        currentLevel[part] = index === parts.length - 1 ? item : {};
      }
      currentLevel = currentLevel[part];
    });
    
    return tree;
  }, {});
}