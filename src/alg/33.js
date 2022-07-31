


/**
 * 
 * 
 * 解题思路：
 * 当数组被逆转为两段有序的数组时，使用二分法需要判断 m 所在位置的左边还是右边是有序的，通过判断 target 是否在
 * 有序的区间，只需要对比 target 和有序区间的左右两端，既可以判断 target 是否在有序区间中。
 * 
 */
var search = function (nums, target) {

    let l = 0, r = nums.length - 1

    while (l <= r) {
        let m = Math.floor((l + r) / 2)
        if (nums[m] === target) return m

        if (nums[l] <= nums[m]) {
            // m-l 为有序
            if (target >= nums[l] && target < nums[m]) {
                r = m - 1
            } else {
                l = m + 1
            }
        } else {
            // m + 1 - r 为有序
            if (target > nums[m] && target <= nums[r]) {
                l = m + 1
            } else {
                r = m - 1
            }
        }
    }

    return -1
};



const ret = search([5,1,3], 5)
// const ret = search([3, 1], 5)
console.log(ret)