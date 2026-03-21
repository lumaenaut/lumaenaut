class Solution {
    /**
     * Two Sum solution using a HashMap for O(n) time complexity.
     * 
     * Strategy:
     * - Use HashMap to store numbers we've encountered
     * - For each number, check if its complement is already in the map
     * - If found, return both indices
     * - Otherwise, store current number with its index
     * 
     * Time Complexity: O(n) - single pass through the array
     * Space Complexity: O(n) - hash map stores up to n elements
     * 
     * @param nums Array of integers
     * @param target Target sum
     * @return IntArray containing indices of the two numbers that sum to target
     */
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // Create a HashMap to store numbers we've seen
        // Key: number value, Value: index in the array
        val seen = HashMap<Int, Int>()
        
        // Iterate through the array with index and value
        for ((index, num) in nums.withIndex()) {
            // Calculate what number we need to reach the target
            val complement = target - num
            
            // Check if complement exists in our map
            // get() returns the value if key exists, otherwise null
            seen[complement]?.let { complementIndex ->
                // Found the pair! Return indices as IntArray
                return intArrayOf(complementIndex, index)
            }
            
            // Store current number with its index for future lookups
            seen[num] = index
        }
        
        // Problem guarantees a solution exists
        return intArrayOf()
    }
    
    // Alternative using Kotlin's more functional style
    fun twoSumFunctional(nums: IntArray, target: Int): IntArray {
        val seen = mutableMapOf<Int, Int>()
        
        nums.forEachIndexed { index, num ->
            val complement = target - num
            seen[complement]?.let { complementIndex ->
                return intArrayOf(complementIndex, index)
            }
            seen[num] = index
        }
        
        return intArrayOf()
    }
}