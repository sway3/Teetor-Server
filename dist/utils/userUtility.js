"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasDuplicates = void 0;
const hasDuplicates = (arr1, arr2) => {
    const set = new Set(arr1);
    return arr2.some((item) => set.has(item));
};
exports.hasDuplicates = hasDuplicates;
