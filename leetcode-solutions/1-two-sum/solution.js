/**
 * Two Sum solution using a Map object for O(n) time complexity.
 * 
 * Strategy:
 * - Use a Map to store numbers we've encountered
 * - For each number, check if its complement is already in the Map
 * - If found, return both indices
 * - Otherwise, store current number with its index
 * 
 * Time Complexity: O(n) - single pass through the array
 * Space Complexity: O(n) - Map stores up to n elements
 * 
 * @param {number[]} nums - Array of integers
 * @param {number} target - Target sum
 * @return {number[]} - Indices of the two numbers that sum to target
 */
var twoSum = function(nums, target) {
  // Create a new Map to store numbers we've seen
  // Map is preferred over plain object for better performance with numeric keys
  const seen = new Map();
  
  // Traditional for loop gives us index directly
  for (let i = 0; i < nums.length; i++) {
      const currentNum = nums[i];
      const complement = target - currentNum;
      
      // Check if the complement exists in our Map
      // Map.has() is O(1) on average
      if (seen.has(complement)) {
          // Found the pair! Return [index of complement, current index]
          return [seen.get(complement), i];
      }
      
      // Store current number with its index for future lookups
      // Map.set() stores key-value pairs
      seen.set(currentNum, i);
  }
  
  // According to problem constraints, we always find a solution
  return [];
};

// Alternative using for...of with entries() for more modern syntax
var twoSumModern = function(nums, target) {
  const seen = new Map();
  
  // entries() gives us [index, value] pairs
  for (const [index, num] of nums.entries()) {
      const complement = target - num;
      
      if (seen.has(complement)) {
          return [seen.get(complement), index];
      }
      
      seen.set(num, index);
  }
  
  return [];
};