---
title: "Python and the 36 Towers"
description: "How I solved the 36 towers puzzle with Python."
pubDate: 2016-12-27
tags: ["Python","Programming","Puzzles","Math"]
---

This year my brother's family sent us a puzzle in their Christmas package, mentioning that they already solved it and we should give it a try over the Christmas holidays, too. The puzzle is called "36 Cube" and looks like this:

![36 Cube](/img/python-36-towers-1.jpg)

The "36 Cube" consists of a board with a 6x6 grid of tower stubs and 36 towers in 6 different heights and colors which need to be stacked on the stubs so that they all have the same height, forming a cube like in the picture. Also, no two towers of the same color may appear in the same row or column - similar to a Sudoku puzzle.

The puzzle looked tricky already, but it turned out it was even trickier than I first thought.

So we started to casually play around with this puzzle while eating Christmas cookies and watching Christmas movies. I found it was pretty easy to place the first 20 to 24 towers properly, but then things started to get complicated as the colors collided. Soon I gave up and concentrated more on the Christmas cookies, while my wife - who is much more patient - managed to stack 33 pieces properly.

I already knew I would never have that patience, so I had to cheat and use Python to solve the puzzle the next morning. I hacked in all the heights of the tower stubs and wrote a simple recursive brute force algorithm, fully confident of having solved the puzzle in much shorter time than my wife. But the program terminated with no solution. I checked the heights, checked the algorithm, then double-checked it, but still nothing.

Something seemed to be rotten in the state of Denmark. So I had to cheat again and google the 36 Cube. Sure enough, there even was a whole Wikipedia article about the puzzle with the following spoiler: "Careful inspection of the pieces reveals that two of the pieces are special. These two pieces will fit on certain parts of the base differently from other pieces of the same height."

Indeed, when I examined the towers and stubs more carefully, I found that the yellow tower of height six and the orange tower of height five were special, and could be placed on two special stubs on which the ordinary towers could not be placed. A really mean, but clever idea that gives the puzzle an additional twist. I like such puzzles that cannot be solved in a straightforward manner, but by "thinking around the corner".

After adding these two exceptions to my Python program (listed at the bottom of this blog post), it found not only one, but even 96 solutions, and it didn't take even a second to list them all. Python to the rescue!

Maybe I should not have cheated, but looking it up in Wikipedia also revealed the quite interesting background story of this puzzle. Allegedly, it goes back to Catherine the Great in the golden age of the Russian empire.

![Catherine the Great](/img/python-36-towers-2.jpg)

Like today, the Russian leaders were obsessed with the military, and so Catherine one day had the crazy idea that she absolutely needed to arrange 36 of her officers from six different regiments with six different ranks in a 6x6 grid so that each row and column of the grid contained only one officer of each rank and regiment.

If you think of the towers in the 36 Cube as officers, the different colors representing different regiments, and the different heights representing different ranks, then you see how Catherine's puzzle is directly related to the 36 Cube. In fact, its inventor, Derrick Niederman,  got his inspiration from the 36 officers problem.

Back to Catherine, who also noticed that the puzzle was tricky. Different from certain political leaders today, she was still believing in the competency of experts, and so she asked one of them. That expert was none less than the famous Swiss mathematician Leonhard Euler, who, as luck would have it, was living in Petersburg at that time.

![Leonhard Euler](/img/python-36-towers-3.jpg)

So Euler started to search for a solution, but could not find one. Since he knew he was brilliant, he concluded that a solution could not exist, otherwise he would have found it. In fact, he found solutions for square grids with 3, 4, 5, 7, 8 and 9 rows. Such solutions are now called *Euler squares* in his honor. However, he couldn't come up with a 6x6 Euler square. Since Euler didn't have a computer and probably didn't want to waste too much time with it, he was not able to prove his conjecture that a solution does not exist. The first such proof was given in 1901 by the French amateur mathematician Gaston Tarry, and it was a really lengthy one that more or less systematically checked all possible combinations. I include his picture to pay homage to his diligent piece of work and all amateurs, even though he is not so famous:

![Gaston Tarry](/img/python-36-towers-4.jpg)

In 1984, the professional Canadian mathematician Douglas Stinson gave a much shorter proof without using a computer. Today, with a computer and some Python you can easily prove that the problem is not solvable even before breakfast.

Here is the small Python program I wrote to find the 96 solutions of the 36 Cube:

```python
#/usr/bin/python3

"""The 36 Tower Puzzle"""

# the colors of the tower
colors = 'red yellow blue green violet orange'.split()

# the heights of the stubs
# (stub of height 1 at upper left corner)
heights = '134520 250413 013254 541302 425031 302145'
heights = [list(map(int, row)) for row in heights.split()]

# possible positions of the towers
places = [[set() for height in range(6)] for color in range(6)]
for row in range(6):
    for column in range(6):
        for color in range(6):
            places[color][5 - heights[row][column]].add((row, column))

# this is the crucial trick: two towers are special
# if you comment out the following two lines, no solution is found
places[1][4].add((1, 2))
places[5][5].add((3, 2))

# list of all towers
towers = [(color, height) for color in range(6) for height in range(6)]

# the board
board = [[None] * 6 for row in range(6)]

# list for storing the solutions
solutions = []

def stringify():
    """convert the board to a readable string"""
    return '\n'.join('-'.join(colors[color]
        for color in board[row]) for row in range(6))

def solve(tower=0):
    """solve the puzzle recursively"""
    if tower == 36:
        solution = stringify()
        solutions.append(solution)
        print("\nSolution {}:".format(len(solutions)))
        print(solution)
        return
    color, height = towers[tower]
    for row, column in places[color][height]:
        if board[row][column] is None:
            for row2 in range(6):
                if board[row2][column] == color:
                    break
            else:
                for column2 in range(6):
                    if board[row][column2] == color:
                        break
                else:
                    board[row][column] = color
                    solve(tower + 1)
                    board[row][column] = None

print("Solving...")
solve()
print("\nReady.")
```
