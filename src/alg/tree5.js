


function left_rotate(T, x) {
    const y = x.right
    x.right = y.left
    if (y.left !== null) {
        y.left.p = x
    }

    y.p = x.p
    if (x.p === null) {
        T.root = y
    } else if (x.p.left === x) {
        x.p.left = y
    } else {
        x.p.right = y
    }

    y.left= x
    x.p = y
}

function right_rotate(T, x) {
    const y = x.left
    x.left =  y.right
    
    if (y.right !== null) {
        y.right.p = x
    }

    y.p = x.p
    if (x.p === null) {
        T.root = y
    } else if (x.p.left === x) {
        x.p.left = y
    } else {
        x.p.right = y
    }

    y.right = x
    x.p = y
}

function tree_min(x) {
    while(x.left !== null) {
        x = x.left
    }
    return x
}

function tree_max(x) {
    while(x.right !== null) {
        x = x.right
    }
    return x
}


function tree_successor(x) {
    if (x.right !== null) {
        return tree_min(x.right)
    }

    let y = x.p
    while(y !== null && x === y.right)  {
        x = y
        y = y.p
    }

    return y
}


function tree_successor(x) {
    if (x.right !== null) {
        return tree_min(x.right)
    }

    let y = x.p
    while(y !== null && x !== y.right) {
        x = y
        y = y.p
    }

    return y
}

function tree_predecessor(x) {
    if (x.left !== null) {
        return tree_max(x.left)
    }

    let y = x.p
    while(y !== null && x === y.left) {
        x =  y
        y = y.p
    }

    return y
}




function rb_insert(T, z) {
    
}

function rb_insert_fix(T, z) {
    // z 本来就是红色
    while (z.p.color === RED) {

    }
    T.root.color = BLACK
}


function right_rotate(T, x) {

}

function left_rotate(T, x) {

    const y = x.right
    x.right = y.left
    if (y.left !== null) {
        y.left.p = x.right
    }

    y.p = x.p
    if (x.p === null) {
        T.root = y
    } else if (x.p.left === x) {
        x.p.left = y
    } else {
        x.p.right =  y
    }

    y.left = x
    x.p = y
}

function rb_delete(T, z) {


    if (z.left === null) {
        transplant(T, z.right)
    } else if (z.right === null) {
        transplant(T, z.left)
    } else {
        const y = tree_successor(z)
        if (y.p !== z) {
            transplant(T, y, y.right)
            y.right = z.right
            y.right.p = y
        }
        transplant(T, z, y)
        y.left = z.left
        y.left.p = y
    }
}



