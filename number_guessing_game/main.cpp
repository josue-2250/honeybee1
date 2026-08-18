#include <iostream>
#include <cstdlib>
#include <ctime>

int main() {
    // Seed the random number generator with the current time
    // This ensures we get different random numbers each time the game is played
    std::srand(static_cast<unsigned int>(std::time(nullptr)));
    
    // Generate a random number between 1 and 100
    int target = std::rand() % 100 + 1;
    int guess = 0;
    int attempts = 0;
    
    std::cout << "========================================\n";
    std::cout << "   Welcome to the Number Guessing Game! \n";
    std::cout << "========================================\n\n";
    std::cout << "I have selected a random number between 1 and 100.\n";
    
    // Implement a loop to allow multiple attempts
    while (guess != target) {
        std::cout << "\nEnter your guess: ";
        
        // Handle invalid input (e.g., user types a letter instead of a number)
        if (!(std::cin >> guess)) {
            std::cout << "Invalid input. Please enter a valid number.\n";
            std::cin.clear(); // Clear the error flag on cin
            std::cin.ignore(10000, '\n'); // Discard the invalid input
            continue;
        }
        
        attempts++;
        
        // Provide feedback using conditional logic
        if (guess < target) {
            std::cout << "Too low! Try again.\n";
        } else if (guess > target) {
            std::cout << "Too high! Try again.\n";
        } else {
            std::cout << "\n🎉 Congratulations! You guessed the correct number!\n";
            std::cout << "It took you " << attempts << " attempts to win.\n";
        }
    }
    
    return 0;
}
