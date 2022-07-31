
function make_node(val) {
    return {
        val,
        left: null,
        right: null,
        p: null
    }
}

function make_root(root = null) {
    return {
        root
    }
}


function tree_insert(T, z) {
    let parent = null
    let cur = T.root
    while (cur !== null) {
        parent = cur
        cur = z.val < cur.val ? cur.left : cur.right
    }

    z.p = parent

    if (parent === null) {
        T.root = z
    } else if (z.val < parent.val) {
        parent.left = z
    } else {
        parent.right = z
    }
}

function tree_min(tree) {
    let cur = tree
    while (cur.left !== null) {
        cur = cur.left
    }
    return cur
}

function tree_max() {

}

function tree_delete1(T, z) {
    if (z.left === null) {
        transplant(T, z, z.right)
    } else if (z.right === null) {
        transplant(T, z, z.left)
    } else {
        // y.left is null
        const y = tree_min(z.right)
        if (y.p !== z) {
            // right of y is on the leftest leaf
            transplant(T, y, y.right)
            y.right = z.right
            z.right.p = y
        }
        transplant(T, z, y)
        y.left = z.left
        y.left.p = y
    }


}

function transplant(T, u, v) {
    if (u.p === null) {
        T.root = v
    } else if (u.p.left === u) {
        u.p.left = v
    } else {
        u.p.right = v
    }

    if (v !== null) {
        v.p = u.p
    }
}

function tree_delete(T, z) {
    if (z.left === null) {
        if (z.p === null) {
            T.root = z.right
        } else if (z.p.left === z) {
            z.p.left = z.right
        } else {
            z.p.right = z.right
        }
        if (z.right !== null) {
            z.right.p = z.p
        }
    } else if (z.right === null) {
        if (z.p === null) {
            T.root = z.left
        } else if (z.p.left === z) {
            z.p.left = z.left
        } else {
            z.p.right = z.left
        }

        if (z.left !== null) {
            z.left.p = z.p
        }
    } else {

        const minRight = tree_min(z.right)

        if (minRight.p !== z) {
            minRight.right = z.right
            minRight.right.p = minRight
        }

        if (z.p === null) {
            T.root = minRight
        } else if (z.p.left === z) {
            z.p.left = minRight
        } else {
            z.p.right = minRight
        }
        if (minRight !== null) {
            minRight.p = z.p
        }
        minRight.left = z.left
        minRight.left.p = minRight
    }
}

function tree_successor(x) {
    if (x.right !== null) {
        return tree_min(x.right)
    }
    const y = x.p
    while(y !== null && y.right === x) {
        x = y
        y = y.p
    }
    return y
}

function tree_predecesssor(x) {
    if (x.left !== null) {
        return tree_max(x.left)
    }
    const y = x.p
    while (y !== null && y.left === x) {
        x = y
        y = y.p
    }
    return y
}


module.exports = {
    make_node,
    tree_insert,
    make_root,
    tree_delete
}