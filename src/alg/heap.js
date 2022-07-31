


function heap_increate_key(heap, i, key) {
    if (key < heap[i]) {
        return 'error'
    }

    heap[i] = key
    let idx = i
    while (idx > 0) {
        const parent = (idx - 1 ) >>> 1
        if (heap[i] > heap[parent]) {
            const t = heap[i]
            heap[i] = heap[parent]
            heap[parent] = t
            idx = parent
        } else {
            return ;
        }
    }
}