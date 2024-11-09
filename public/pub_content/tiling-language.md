---
title: Tiling Toolkit - Our Journey into Building a Language for Tiling Magic 
description: Haskell + Happy + Compilers + Alex
category: Compilers
recommended: true
---

\> **https://github.com/dmh1g19/Tiling-Language** 

# Introduction
Ever wanted to dive into the world of tiles and create designs effortlessly? Well, that’s exactly what we did with our **Tiling Toolkit** project! Our team created a quirky little programming language specifically for manipulating tiles, giving users the power to build, rotate, reflect, and scale tiles just by writing a few commands. With this language, every tile layout is just a piece of code away!

# Why a Tiling Language?
Tiles are everywhere—from your bathroom floor to video game levels! But traditional programming languages aren’t built for “tiling logic.” So, we thought, *Why not make one that is?* We wanted a simple way to play around with tiles: combine them, flip them, and turn them into awesome patterns. And, boy, did we have fun figuring it all out!

# The Nitty Gritty Syntax
While we wanted our language to be super functional, we also wanted it to feel straightforward. Here’s a peek at how our syntax keeps things neat and tidy:

- **Types**: Variables can be either `Int` (for numbers) or `Base` (our tile object).
- **Operations**: Need to rotate a tile? Reflect it? Chop off a section? We’ve got commands for that!
- **Control Structures**: Our `if-then-else` and `repeat` loops make tiling logic a breeze.

Here are some cool things you can do with just a few lines:

```plaintext
import <fileName> as <var> // Pull in a saved tile
rotate <baseVar> by 90 CW   // Rotate a tile 90 degrees clockwise
reflect <baseVar> on row 2  // Reflect on row 2
```
# Our Type System (a.k.a. The Rules)
With great power comes great responsibility, so we added a type system to make sure things didn’t get too crazy. Everything’s checked at compile time, meaning you can’t accidentally break your own tiling masterpiece. If you try something out of bounds, like mismatched types or undefined variables, our language nudges you back on track.

# Handling Errors like Pros
One of our biggest challenges (and laughs!) was making error messages. We wanted the language to tell you why something went wrong—whether it was a rotation fail or a mystery variable. With a ton of testing, we built error checks right into the interpreter. Now it’s like having a friend tell you, “Hey, you missed a spot!”

# The “How It Works” Part
We went for a classic approach, inspired by popular languages like Python and Java. The interpreter processes commands in a depth-first style (fancy way of saying it reads code from top to bottom). Each operation or statement becomes a “node” in a tree, which our interpreter reads one at a time—easy peasy!

# Cool Flow Control
Nothing beats having loops and conditions for control! We added if-then-else and repeat loops so you can decide exactly how each tile transformation should play out. Plus, we made sure every statement ends with a semicolon to keep things neat.

# Fun Extras
Comments: You can add notes in your code with //. Perfect for jotting down ideas or, honestly, just talking to yourself.
Syntactic Sugar: We threw in some shortcuts (-&, +&, -*, +*) to make transformations even easier—like stacking or repeating tiles in any direction you want!
Reflecting Back
Creating this language was a blast. We got to blend our love for puzzles and code, and now anyone can whip up intricate tiling designs with minimal effort. If you’re curious about how programming languages work or just want to experiment with tile patterns, this toolkit is for you!

# Inductively defined typing semantics

For those of you inclined (or brave enough) here are the typing semantics of the language!

<img src="/img/ttt.png" alt="tmp chip" width="600">
<br></br>

# Examples

Here are some examples of the language in use!

<img src="/img/pattern1.png" alt="" width="300">
<img src="/img/pattern2.png" alt="" width="285">
<img src="/img/pattern3.png" alt="" width="330">
<img src="/img/pattern4.png" alt="" width="300">
<img src="/img/pattern5.png" alt="" width="300">
<img src="/img/pattern6.png" alt="" width="320">
<img src="/img/pattern7.png" alt="" width="400">
<img src="/img/pattern8.png" alt="" width="300">
<img src="/img/pattern9.png" alt="" width="300">
<img src="/img/pattern10.png" alt="" width="275">