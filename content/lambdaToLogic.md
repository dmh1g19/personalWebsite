---
title: Converting Lambda Calculus to Combinatory Logic	
description: Combanitory Logic and lambda calculus convertion in haskell
category: Compilers
recommended: true
---

# Lambda calculus vs Combinatory logic

Lambda calculus is a formal system for defining functions and applying them. Each function (or "lambda expression") consists of:
1. **Variables** (representing values),
2. **Application** (one function used on another), and
3. **Lambda Abstraction** (a function that says, "for this input, do something").

However, **combinatory logic** simplifies this system by removing the need for named variables. Instead, it defines operations only in terms of three combinators:
- `S`, `K`, and `I` are like simple building blocks that can represent any function or combination of functions without needing individual names for values or inputs.

# Basic Translation Rules

The goal is to write a function, `clTransform`, which transforms a given lambda expression into an equivalent combinatory logic expression using the specific translation rules provided. Here is a summary of the transformation process.

## Variables: 
If the expression is a variable, it directly translates to a corresponding combinator.

## Application: 
In lambda calculus (`e1 e2`) translates to an application in combinatory logic (`<e1> <e2>`).

## Lambda Abstractions (`λx -> e`):
1: If `x` does not occur freely in `e`, the abstraction is transformed into `K <e>`.<br></br>
2: If `λx -> x`, the result is `I`.<br></br>
3: For nested abstractions (like `λx -> λy -> e`), apply the rule recursively.<br></br>

# Special Cases for Lambda Abstractions

If `x` appears free in `e1` or `e2` within a lambda expression `λx -> e1 e2`, use the `S` combinator: The expression `λx -> e1 e2` becomes `S <λx -> e1> <λx -> e2>`.

# Expected Function and Types

The clTransform will implemented as: `clTransform :: LamExpr -> CLExpr`, using 

```haskell
  data CLExpr = S | K | I | CLVar Int | CLApp CLExpr CLExpr
```

where ```CLVar Int``` represents variables and ```CLApp``` represents application in combinatory logic.

For example, the lambda term ```λx -> λy -> y``` would translate to ```K I```, and ```λx -> λy -> y x``` would result in ```S (K (S I)) (S (K K) I)```.

The goal is to write this function so it systematically applies these rules, achieving an accurate combinatory logic representation of any given lambda calculus expression. Let me know if you’d like more details on specific examples or how to approach the code structure!

# The code

```haskell
data CLExpr = S | K  | I | CLVar Int | CLApp CLExpr CLExpr
              deriving (Show,Read,Eq)

-- Intermediary language - idea from stack overflow
data LamCLExpr = S' | K' | I' | LCLVar Int | LCLApp LamCLExpr LamCLExpr | LCLAbs Int LamCLExpr
              deriving (Show,Read,Eq) 

-- Injective functions mapping each element of the main language to the
-- temporary one, this is to allow for pattern matching Lambda functions which
-- are not part of the main language
fromLam :: LamExpr -> LamCLExpr
fromLam (LamVar n)     = LCLVar n
fromLam (LamAbs n e)   = LCLAbs n (fromLam e)
fromLam (LamApp e1 e2) = LCLApp (fromLam e1) (fromLam e2) 

fromCL :: CLExpr -> LamCLExpr
fromCL S             = S'
fromCL K             = K'
fromCL I             = I'
fromCL (CLVar n)     = LCLVar n
fromCL (CLApp e1 e2) = LCLApp (fromCL e1) (fromCL e2) 

-- Convert lambda expression to combinatory logic
eval :: LamCLExpr ->  CLExpr
eval S'                                                     = S
eval K'                                                     = K
eval I'                                                     = I
eval (LCLVar n)                                             = CLVar n
eval (LCLApp e1 e2)                                         = CLApp (eval e1) (eval e2) 
eval (LCLAbs n e)              | free n e == False          = CLApp (K) (eval e)
eval (LCLAbs n (LCLVar x))     | n == x                     = I
eval (LCLAbs x (LCLAbs y (e))) | (free x e)                 = eval (LCLAbs x (fromCL (eval (LCLAbs y e))))
eval (LCLAbs x (LCLApp e1 e2)) | (free x e1) || (free x e2) = CLApp (CLApp (S) (eval (LCLAbs x e1))) (eval (LCLAbs x e2))

-- Check for if a variable is bound or not
free :: Int -> LamCLExpr -> Bool
free x (LCLVar y)            = x == y
free x (LCLAbs y e) | x == y = False
free x (LCLAbs y e) | x /= y = free x e 
free x (LCLApp e1 e2)        = (free x e1) || (free x e2) 
free x S'                    = False
free x K'                    = False
free x I'                    = False

-- Print out the final result
clTransform :: LamExpr -> CLExpr
clTransform e = eval (fromLam e)

```