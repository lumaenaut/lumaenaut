package main

/**
 * Two Sum solution using a hash map (Go map) for O(n) time complexity.
 * 
 * Strategy:
 * - Use a map to store numbers we've encountered
 * - For each number, check if its complement is already in the map
 * - If found, return both indices
 * - Otherwise, store current number with its index
 * 
 * Time Complexity: O(n) - single pass through the slice
 * Space Complexity: O(n) - map stores up to n elements
 * 
 * @param nums Slice of integers
 * @param target Target sum
 * @return Slice containing indices of the two numbers that sum to target
 */
func twoSum(nums []int, target int) []int {
    // Create a map to store numbers we've seen
    // map[int]int where key is the number, value is its index
    seen := make(map[int]int)
    
    // Iterate through the slice with index and value
    for i, num := range nums {
        // Calculate what number we need to reach the target
        complement := target - num
        
        // Check if complement exists in our map
        // The second return value (ok) tells us if the key exists
        if idx, ok := seen[complement]; ok {
            // Found the pair! Return [index of complement, current index]
            return []int{idx, i}
        }
        
        // Store current number with its index for future lookups
        // Important: store AFTER checking to avoid using the same element twice
        seen[num] = i
    }
    
    // Problem guarantees a solution exists
    return []int{}
}