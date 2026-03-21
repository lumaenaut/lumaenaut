from typing import List

def twoSum(nums: List[int], target: int) -> List[int]:
    """
    Two Sum solution using a hash map (dictionary) for O(n) time complexity.
    
    Strategy:
    - Iterate through the array once
    - For each number, calculate its complement (target - current number)
    - If complement exists in our hash map, we found our pair
    - Otherwise, store current number with its index for future lookups
    
    Time Complexity: O(n) - single pass through the array
    Space Complexity: O(n) - hash map stores up to n elements in worst case
    """
    # Create an empty dictionary to store numbers we've seen
    # Key: the number value, Value: its index in the array
    seen = {}
    
    # enumerate gives us both index and value in each iteration
    for i, num in enumerate(nums):
        # Calculate what number we need to reach the target
        complement = target - num
        
        # Check if we've already seen the complement
        # Dictionary lookup is O(1) on average
        if complement in seen:
            # Found the pair! Return indices in any order
            # seen[complement] is the index of the complement we stored earlier
            return [seen[complement], i]
        
        # Haven't found a match yet, store current number for future checks
        # Important: store AFTER checking to avoid using the same element twice
        seen[num] = i
    
    # The problem guarantees a solution exists, so we never reach here
    return []