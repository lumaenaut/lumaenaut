class Solution {
    /**
     * Two Sum solution using a Dictionary (hash map) for O(n) time complexity.
     * 
     * Strategy:
     * - Use Dictionary to store numbers we've encountered
     * - For each number, check if its complement is already in the dictionary
     * - If found, return both indices
     * - Otherwise, store current number with its index
     * 
     * Time Complexity: O(n) - single pass through the array
     * Space Complexity: O(n) - dictionary stores up to n elements
     * 
     * @param nums Array of integers
     * @param target Target sum
     * @return Array containing indices of the two numbers that sum to target
     */
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        // Create an empty dictionary to store numbers we've seen
        // [Int: Int] where key is the number, value is its index
        var seen = [Int: Int]()
        
        // Iterate through the array with index and value
        for (index, num) in nums.enumerated() {
            // Calculate what number we need to reach the target
            let complement = target - num
            
            // Check if complement exists in our dictionary
            // Dictionary lookup is O(1) on average
            if let complementIndex = seen[complement] {
                // Found the pair! Return indices in any order
                return [complementIndex, index]
            }
            
            // Store current number with its index for future lookups
            seen[num] = index
        }
        
        // Problem guarantees a solution exists
        return []
    }
    
    // Alternative implementation with early exit and guard statements
    func twoSumWithGuard(_ nums: [Int], _ target: Int) -> [Int] {
        var seen = [Int: Int]()
        
        for (index, num) in nums.enumerated() {
            let complement = target - num
            
            // Use guard to check if complement exists
            if let complementIndex = seen[complement] {
                return [complementIndex, index]
            }
            
            seen[num] = index
        }
        
        fatalError("No solution found - problem guarantees exactly one solution")
    }
}