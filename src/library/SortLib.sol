// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library SortLib {
    function sort(uint256[] memory data) internal {
        _quickSort(data, int256(0), int256(data.length - 1));
    }

    function _quickSort(uint256[] memory arr, int256 left, int256 right) internal {
        int256 i = left;
        int256 j = right;
        if (i == j) return;

        uint256 pivot = arr[uint256(left + (right - left) / 2)];

        while (i <= j) {
            while (arr[uint256(i)] < pivot) i++;
            while (pivot < arr[uint256(j)]) j--;
            if (i <= j) {
                (arr[uint256(i)], arr[uint256(j)]) = (arr[uint256(j)], arr[uint256(i)]);
                i++;
                j--;
            }
        }

        if (left < j) _quickSort(arr, left, j);
        if (i < right) _quickSort(arr, i, right);
    }
}

library SortLib5 {
    function sort(uint256[5] memory data) internal {
        _quickSort(data, int256(0), int256(data.length - 1));
    }

    function _quickSort(uint256[5] memory arr, int256 left, int256 right) internal {
        int256 i = left;
        int256 j = right;
        if (i == j) return;

        uint256 pivot = arr[uint256(left + (right - left) / 2)];

        while (i <= j) {
            while (arr[uint256(i)] < pivot) i++;
            while (pivot < arr[uint256(j)]) j--;
            if (i <= j) {
                (arr[uint256(i)], arr[uint256(j)]) = (arr[uint256(j)], arr[uint256(i)]);
                i++;
                j--;
            }
        }

        if (left < j) _quickSort(arr, left, j);
        if (i < right) _quickSort(arr, i, right);
    }
}
