export function buildTree(items) {
    const tree = {};
    items.forEach(item => {
        const path = 'path' in item ? item.path : item.templatePath || 'No Template';
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