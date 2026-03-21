# 1. Two Sum

[LeetCode 1 — Two Sum](https://leetcode.com/problems/two-sum/)

Given an integer array `nums` and an integer `target`, return **indices** `i` and `j` such that `nums[i] + nums[j] == target`. Each input has exactly one solution; you may not use the same element twice.

## Approach

Solutions here use a single pass with a **hash map** (dictionary / unordered map): for each index `i`, check whether `target - nums[i]` was seen before; if yes, return the stored index and `i`. Otherwise store `nums[i] → i`.

- **Time:** O(n)  
- **Space:** O(n) for the map  

Each `solution.*` file is commented and self-contained. Pick the language you need and copy the class/function into LeetCode’s editor (filename on disk is always `solution` plus the language extension).

## Files

| File | Language |
|------|----------|
| `solution.py` | Python 3 |
| `solution.js` | JavaScript |
| `solution.cpp` | C++ |
| `solution.go` | Go |
| `solution.kt` | Kotlin |
| `solution.swift` | Swift |
