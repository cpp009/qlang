


const RED = 1
const BLACK = 2


function left_rotate(T, x) {
    const y = x.right
    x.right = y.left
    if (x.right !== T.nil) {
        x.right.p = x
    }
    y.p = x.p
    if (x.p === T.nil) {
        T.root = y
    } else if (x.p.left === x) {
        x.p.left = y
    } else {
        x.p.right = y
    }
    y.left = x
    x.p = y
}

function right_rotate(T, x) {
    const y = x.left
    x.left = y.right
    if (y.right !== T.nil) {
        y.right.p = x
    }
    y.p = x.p
    if (x.p === T.nil) {
        T.root = y
    } else if (x.p.left === x) {
        x.p.left = y
    } else {
        x.p.right = y
    }
    y.right = x
    x.p = y
}


function rb_insert(T, z) {
    y = T.nil
    x = T.root

    while (x !== null) {
        y = x
        x = z.val < x.val ? z.left : y.val
    }

    z.p = y

    if (y === T.nil) {
        T.root = z
    } else if (z.val < y.val) {
        y.left = z
    } else {
        y.right = z
    }

    z.left = T.nil
    z.right = T.nil
    z.color = RED

    rb_insert_fixup(T, z)
}

function rb_insert_fixup(T, z) {
    while (z.p.color === RED) {
        if (z.p == z.p.p.left) {
            y = z.p.p.right
            if (y.color === RED) {
                z.p.color = BLACK
                y.color = BLACK
                z.p.p.color = RED
                z = z.p.p
            } else {
                if (z === z.p.right) {
                    z = z.p
                    left_rotate(T, z)
                }
                z.p.color = BLACK
                z.p.p.color = RED
                right_rotate(T, z.p.p)
            }
        } else {
            y = z.p.p.left
            if (y.color === RED) {
                z.p.color = BLACK
                y.color = BLACK
                z.p.p.color = RED
                z = z.p.p
            } else {
                if (z === z.p.left) {
                    z = z.p
                    right_rotate(T, z)
                }
                z.p.color =  BLACK
                z.p.p.color = RED
                left_rotate(T, z.p.p)

            }
        }
    }
    T.root.color = BLACK
}