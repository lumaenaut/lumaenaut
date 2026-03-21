# 1. Two Sum

[LeetCode 1 — Two Sum](https://leetcode.com/problems/two-sum/)

Given an integer array `nums` and an integer `target`, return **indices** `i` and `j` such that `nums[i] + nums[j] == target`. Each input has exactly one solution; you may not use the same element twice.

## Approach

Solutions here use a single pass with a **hash map** (dictionary / unordered map): for each index `i`, check whether `target - nums[i]` was seen before; if yes, return the stored index and `i`. Otherwise store `nums[i] → i`.

- **Time:** O(n)  
- **Space:** O(n) for the map  

Each source file is commented and self-contained.

## Files

| File | Language |
|------|----------|
| `python.py` | Python 3 |
| `javascript.js` | JavaScript |
| `cpp.cpp` | C++ |
| `go.go` | Go |
| `kotlin.kt` | Kotlin |
| `swift.swift` | Swift |
