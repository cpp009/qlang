


function tree_delete(T, z) {
    if (z.left === null) {
        transplant(T, z, z.right)
    } else if (z.right === null) {
        transplant(T, z, z.left)
    } else {
        const y = tree_min(z.right)
        if (y.p  !== z) {
            transplant(T, y, y.right)
            y.right = z.right
            y.right.p = y
        }
        transplant(T, z, y)
        y.left = z.left
        y.left.p = y
    }
}


function tree_min(x) {
    if (x.left !== null) {
        x = x.left
    }
    return x
}


function tree_max(x) {
    if (x.right !== null) {
        x = x.right
    }
    return x
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

function tree_successor(x) {
    if (x.right !== null) {
        return tree_min(x.right)
    }

    let y = x.p
    while(y !== null && y.right === x) {
        x = y
        y = y.p
    }
    return y
}

function tree_()