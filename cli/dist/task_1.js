const LAST_PREFIX = '└── ';
const INNER_PREFIX = '├── ';
function showTree(tree, prefix = '') {
    console.log(`${prefix}${tree.name}`);
    if (tree.items) {
        const itemsLength = tree.items.length;
        for (let i = 0; i < itemsLength; i++) {
            const newPrefix = getPrefix(prefix, itemsLength, i);
            showTree(tree.items[i], newPrefix);
        }
    }
}
function getPrefix(prefix, itemsLength, index) {
    const isLast = index === itemsLength - 1;
    return `${prefix}${isLast ? LAST_PREFIX : INNER_PREFIX}`;
}
const data = {
    name: 1,
    items: [
        {
            name: 2,
            items: [
                { name: 3 },
                { name: 4 }
            ]
        },
        {
            name: 5,
            items: [
                { name: 6 }
            ]
        }
    ]
};
showTree(data);
export {};
//# sourceMappingURL=task_1.js.map