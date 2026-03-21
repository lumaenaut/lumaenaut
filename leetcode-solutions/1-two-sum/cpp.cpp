#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    /**
     * Two Sum solution using unordered_map (hash table) for O(n) time complexity.
     * 
     * Strategy:
     * - Use unordered_map to store numbers we've seen
     * - For each number, check if its complement exists in the map
     * - If found, return both indices
     * - Otherwise, store current number with its index
     * 
     * Time Complexity: O(n) - single pass through the array
     * Space Complexity: O(n) - hash map stores up to n elements
     * 
     * @param nums Vector of integers
     * @param target Target sum
     * @return Vector containing indices of the two numbers that sum to target
     */
    vector<int> twoSum(vector<int>& nums, int target) {
        // unordered_map provides O(1) average lookup time
        // Key: number value, Value: index in the array
        unordered_map<int, int> seen;
        
        // Iterate through the array with index
        for (int i = 0; i < nums.size(); i++) {
            int currentNum = nums[i];
            int complement = target - currentNum;
            
            // Check if complement exists in our map
            // find() returns iterator to element if found, else end()
            auto it = seen.find(complement);
            
            if (it != seen.end()) {
                // Found the pair!
                // it->second is the index of the complement
                return {it->second, i};
            }
            
            // Store current number with its index for future lookups
            seen[currentNum] = i;
        }
        
        // Problem guarantees a solution exists
        return {};
    }
};