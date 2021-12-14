# aoc-2021

Advent of Code 2021

## What is this?

I'm working through Advent of Code 2021 in Deno/Typescript. Why Deno? Well, it seemed neat, I like typescript, and learning
about a way of escaping package.json hell seems interesting. I wanted something with a good std lib too. In practice though, I'm doing most everything without a need to import anything... so in practice I'm just writing typescript.

## What should I expect reading these?

I do every problem roughly the same way: I do some manipulation of the input to get it into a sensible data structure, then I have a function each for parts 1 and 2. If part 2 is a natural extension of part 1 or part 1 can be generalized, I might have only one function.

I try to solve these for a happy medium along a number of axes:

1. Correctness... no wiggle room here, gotta get the stars.
2. Efficiency. I don't like to brute force these. If there is a trick, I try to get it.
3. Terseness, or functional style. I try to keep my solution terse and functional yet readable. I will dip into loops if it's a better fit.
4. Readability. I do my best not to code golf it.

Finally, once I get the solution I don't do a ton of refactoring. I clean up my code a bit but I leave my solution
as is. I do like to chat about these problems with friends, but I write my solution before I go reading.
