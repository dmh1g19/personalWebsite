---
title: Pretty Printing a Lambda Expression with Scott Numerals
description: Pretty printing lambda expressions using scott numerals
category: Compilers
recommended: true
---

The goal is to write a **pretty printer** for lambda expressions. 

The function, `prettyPrint`, will take a lambda expression and convert it into a nicely formatted string that is easy to read. 

Additionally, if a lambda expression represents a natural number, the function should recognize this and print the number instead of the longer lambda term.

# Summary in Basic Terms

Lambda calculus expressions can sometimes look complex because they use many nested functions and variables. For example, the lambda encoding of the number `3` can be written as a long sequence of nested functions, but it’s easier to simply display `3`. The pretty printer for this challenge does two main things:

### Formatting
It converts the lambda expression into a readable format using symbols like `\` for lambda and `->` for function definitions.

### Number Recognition
If a lambda expression matches the pattern for a natural number, the pretty printer will recognize it and display the number directly instead of the underlying lambda structure.

# Pretty Printer Tasks

### Formatting Lambda Expressions

The pretty printer outputs a lambda expression in a way that’s easy to read and understand. For instance:
   - The expression `λx -> x` would be printed as `\x -> x`.
   - Nested expressions are formatted with parentheses as needed, minimizing extra brackets for readability.

### Detecting Scott Numerals 

Numbers can be represented as lambda expressions using a format called "Scott encoding." The challenge here is to identify if a lambda expression corresponds to a specific number, then replace the expression with the number:
   - For example, the Scott numeral for `2` (`λx -> λy -> y (y x)`) will be detected and printed simply as `2`.

# Expected Function and Types

The pretty print function is implemented as `prettyPrint :: LamExpr -> String`, where `LamExpr` is a lambda expression represented by the data type:

```haskell
  data LamExpr = LamApp LamExpr LamExpr | LamAbs Int LamExpr | LamVar Int
```

The function `prettyPrint` will output a clean, human-readable string for each expression.

# Example Translations

Identity Function (λx -> x): The pretty printer will output \x -> x.

Scott Numeral for 1: Instead of the full lambda encoding, it will print 1.

Nested Expression (λx -> x x): The pretty printer will output \x -> x x, keeping the formatting clear and minimal.

This function ultimately helps make lambda expressions more understandable by simplifying complex encodings into concise and readable strings.

# The code

```haskell
data LamExpr =  LamApp LamExpr LamExpr  |  LamAbs Int LamExpr  |  LamVar Int
                deriving (Eq, Show, Read)

-- Recursively check for nested Scot Numerals and return their integer
-- equivalent
scottEncode :: LamExpr -> Int -> Int
scottEncode (LamAbs x (LamAbs y (LamVar z))) n = n
scottEncode (LamAbs x (LamAbs y (LamApp (LamVar z) e))) n  = scottEncode e (n + 1)

-- All pretty printing is done here, each case is pattern matched starting with
-- recognizing numerals - app associates to the left and abstractions bodies associate to the right
-- minimal parenthesis are used so multiple patterns are used to print some abs
-- and apps with and wihtout aprenthesis depending on their nested level
prettyPrint :: LamExpr -> String
prettyPrint (LamAbs x (LamAbs y (LamApp (LamVar z) e))) | y == z    = show (scottEncode e 1)
prettyPrint (LamAbs x (LamAbs y (LamVar z))) | x == z               = show 0
prettyPrint (LamApp (LamAbs x (LamAbs y (LamApp (LamVar z) e))) e2) = show (scottEncode e 1)  ++ " " ++ (prettyPrint e2)
prettyPrint (LamApp (LamAbs x (LamAbs y (LamVar z))) e2)            = (show 0) ++ " " ++ (prettyPrint e2)
prettyPrint (LamApp (LamVar e1) e2)                                 = prettyPrint (LamVar e1) ++ " " ++ (prettyPrint e2)
prettyPrint (LamApp e1 e2)                                          = "(" ++ (prettyPrint e1) ++ ")" ++ " " ++ (prettyPrint e2)
prettyPrint (LamAbs n e)                                            = "\\x" ++ (show n) ++ " -> " ++ (prettyPrint e)
prettyPrint (LamVar x)                                              = "x" ++ (show x)
```