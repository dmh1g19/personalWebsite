---
title: Dynamic scheduling visualization with Cheddar
description: Lets get a visual perspective and implement some code!
category: RT
recommended: true
---

# Scheduling algorithms

Welcome to this Scheduling Tutorial! I have talked about scheduling methods in the past, in this post we will be looking more in depth at some algorithms and implement one at the end!

I will be using 'cheddar' which is program for visualizing hyper frames:
*http://beru.univ-brest.fr/cheddar/*

# RMS vs EDF scheduling algorithms

Lets create a Monotonic (pre-emptive fixed priority scheduler) with the following tasks:

Task T1: Capacity = 2, Deadline = 4, Period = 4, Start Time = 0

Task T2: Capacity = 5, Deadline = 10, Period = 10, Start Time = 0

## RMS (Rate-monotonic scheduling)
<img src="/img/1_RMS.png" width="600" height="180">

RMS is an algorithm for managing the priority of static tasks, jobs with a shorter cycle duration are assigned a higher pirority, shortest duration jobs having the highest.

Using this method, T2 misses it's deadline at 11 and cannot execute fully in time. This is an example of how RMS does not work for the given the task paramters. Lets try EDF next.

## EDF (Earliest deadline first)
<img src="/img/1_EDF.png" width="600" height="160">

When using EDF we see this issue is fixed, both tasks are capable of executing given their constraints - the system containts the same amount of context switches and overall performance!


# EDF vs LLF scheduling algorithms

Given the following task:

Task T1: Capacity = 3, Deadline = 9, Period = 9, Start Time = 0

Task T2: Capacity = 4, Deadline = 8, Period = 8, Start Time = 0

Lets compare EDF with LLF.

## EDF (Earliest deadline first)
<img src="/img/2_EDF.png" width="600" height="160">

With EDF, no deadlines are missed but notice the difference in context switches.

## LLF (Least laxity first)
## Laxity = dealine - (current time + remaining processing time)

The task with the least laxity is given the highest priority for execution. This is a preeptive algorith which means a running task can be preempted (interrupted) by another task with a higher priority.

<img src="/img/2_LLF.png" width="600" height="160">

Least laxity first shows a great amount of task switching and introduces 18 preemptions. We can see from the diagram that this approach is quite computationally intensive.

# NAP vs PIP scheduling algorithms
## Lets introduce some resources for focus on resource access and management
We will use mutexes to appropriately manage access (mutex free methods are often used but are much more difficutl to implement and are used in a case by case basis). 


## No access control
<img src="/img/3_NAP.png" width="600" height="160">

## Priority inversion

From the diagram we can see a new timeline (resource S) indicating when a lock is gained (blue block) and released (red block). Due to incorrect resource control we can see that task 1 misses its deadline in its second period. This is because Task 1 is preempted by Task 2 - this is known as **priority inversion**. Task 2 is a lower priority task but holds the lock for the shared resource that a higher priority task (task 1) needs. We need a way to manage resource access so tasks are not waiting for accesses and being missed.

## Access control using PIP (Priority inheritance protocol)
<img src="/img/3_PIP.png" width="600" height="160">

The diagram above shows PIP introducing an extra context switch to successfully complete the execution of all tasks for their hyper period. The priority inversion has been prevented!

When a high-priority task is blocked because a lower-priority task holds a resource it needs, the lower-priority task "inherits" the higher priority of the blocking task. This temporary priority boost helps the lower-priority task to complete its use of the shared resource more quickly, thereby reducing the waiting time for the higher-priority task. Once the lower-priority task releases the resource, it reverts to its original priority.

# PIP deadlock condition and PCP

## Dead lock 
We must watchout for deadlocks when using PIP

## PIP deadlock
<img src="/img/4_PIP_dead.png" width="600" height="160">

Figure above showcases a deadlock bweteen two tasks are they both wait for the other to release a lock for a shared resource

## PCP

<img src="/img/4_PCP.png" width="600" height="160">

Lets use PCP to prevent the deadlock as per the above
