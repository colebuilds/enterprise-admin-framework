export function filterMenu(tree: any[], isDisabled = false) {
  tree.forEach((node) => {
    if (isDisabled) node.disabled = node.menuType !== 3;
    if (node.children && node.children.length > 0) {
      filterMenu(node.children, isDisabled);
    } else {
      delete node.children;
    }
  });
  return tree as any[];
}

export function flattenTree(tree: any[], result: any[] = []) {
  tree.forEach((node) => {
    const { children, ...rest } = node;
    result.push(rest);
    if (children && children.length > 0) {
      flattenTree(children, result);
    }
  });
  return result;
}

export function getTreeAll(list: any[], isMenu = false): any[] {
  const treeAll: any[] = [];
  const deep = (data: any[]) => {
    data.forEach((item) => {
      if (isMenu) {
        if (item.menuType !== 3) {
          treeAll.push(item.id);
        }
      } else {
        treeAll.push(item.id);
      }
      if (item.children && item.children.length > 0) {
        deep(item.children);
      }
    });
  };
  deep(list);
  return treeAll;
}
