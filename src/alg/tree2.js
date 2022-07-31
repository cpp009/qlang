const { make_node, make_root, tree_insert } = require("./tree")

function tree_minimum(x) {
    if (x.left === null) {
        return x
    }
    return tree_minimum(x.left)
}

function tree_maximum(x) {
    if (x.right !== null) {
        return tree_maximum(x.right)
    } else {
        return x
    }
}


const root = make_root()

tree_insert(root, make_node(5))
tree_insert(root, make_node(4))
tree_insert(root, make_node(3))
tree_insert(root, make_node(2))
tree_insert(root, make_node(1))
tree_insert(root, make_node(6))

console.log(tree_minimum(root.root).val)
console.log(tree_maximum(root.root).val)
