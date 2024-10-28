---
title: Diving into RDF Querying with Our Custom DSL 
description: Haskell + Happy + Compilers + Alex
category: Compilers
recommended: true
---

\> **https://github.com/dmh1g19/DSQL-for-RDF-documents** 

## Introduction
Have you ever found yourself staring at RDF data and wishing you had a magic tool to query it with ease? Well, that’s exactly what we set out to build! Meet our custom domain-specific language (DSL), designed just for querying RDF files in turtle format. Using this DSL feels like giving orders in plain English—just the right dose of simplicity and power for handling those triples of `<subject> <predicate> <object>`.

## The Vision
The idea behind our DSL was to simplify querying RDF. Most query languages are either too complex or don’t really "speak RDF." So, we thought, *Let’s create something focused solely on RDF, with keywords and functions that are exactly what we need—no more, no less!* We wrote it in Haskell (yes, we’re nerds), using Alex for tokenizing and Happy for parsing.

## A Peek at the Language Design
The language is pretty much a streamlined version of SQL, tailored specifically for RDF triples. We decided that only integers would be allowed as literals to keep things neat and efficient. Instead of building in complex types, we let the program structure handle the heavy lifting. The result? A language that’s both lightweight and surprisingly powerful.

### Some Handy Functions:
Here’s a quick rundown of the main functions that make the magic happen:

- **IMPORT**: This brings in a turtle file for us to query. Just say `IMPORT filename.txt`.
- **AS**: Assigns a reference name to imported data for easier querying.
- **INTO**: Sets up the output file where results go.
- **GET**: Retrieves specific parts of the triple structure (like subject, predicate, object).
- **WHERE**: Adds filters to fine-tune the query.
- **EXPORT**: Saves the final results to an output file.

Example:
```plaintext
IMPORT data.txt AS d
GET [subj, pred, obj] WHERE d[subj, pred, obj] INTO results.txt
```
# A Look at Program Semantics

We used Big Step semantics in the interpreter, parsing the program bottom-up. Each line builds toward the final result, with values stored in a super-efficient environment that’s checked at every step. We even implemented a mini CEK machine (Context, Environment, and Kontinuation) to ensure every query ran smoothly, following our syntax rules.

# Global Scope for Easy Access

In our DSL, variables are globally accessible. No need to keep track of scopes—just load a file with IMPORT, and it’s good to go until the end. This made testing simpler and added a nice level of convenience when dealing with large datasets.

# Type Checking and Error Handling

One thing we kept simple was the error checking. The language throws an error if it can’t interpret your query properly, but other than that, it’s all straightforward. We left out complex error handling this time around (improvements for v2!), but the basic checks help keep your queries from going totally off the rails.

# Challenges and Room for Growth

While building this, we found a few areas to improve. Union operations and handling negative numbers are still on our wishlist, and we realized that a little extra flexibility would go a long way in future versions. But for now, our DSL makes querying RDF files a breeze—and it’s only going to get better!