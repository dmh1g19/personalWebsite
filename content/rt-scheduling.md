---
title: Real-time system scheduling overview
description: Exploring scheduling algorithms for real time systems!
recommended: true
---

# Tasks, timelines and processes

One of the first stepping stones in the design of real time systems is scheduling!

In this post I will discuss my research and experiments in the world of scheduling, I will go through the main algorithms, terminology and showcasing some implementations and results!

# Visual representation
<br>

<img src="/img/timeline.png" alt="self portrait" width="600" height=auto>

Above is a diagram of a 'hyper-frame', a hyper-frame is a fixed, repeating period in which all the tasks of a real-time system must be executed. We can populate this hyperframe with 'tasks', tasks have a set of temporal parameters.

# Types of tasks
Tasks need 'processors', a processor can be a CPU, network, disk or critical section. These are general parameters, they may change based on the type of task. 

### Periodic
Repeated tasks, hard dealines, time driven
### Aperiodic
One shot, soft deadline, event driven
### Sporadic
Event driven, hard deadline

# Temporal parameters
i = The current task

Task (T_i): A sequential piece of code performing some action

Release time of a task (r_i): The time instant the task becomes ready to execute.

Deadline of a task (d_i): The time instant by which the task must complete execution.

Execution Time (e_i): Time to complete a task (alone and has all resources).

# Task Specific Functional Parameters

<h2>Criticality</h2>
Priority of a task.

<h2>Preemptivity</h2>
Can the task be interrupted?


<br>
<br>
<br>

# Task states
<br>

<img src="/img/task-states.png" alt="self portrait" width="600" height=auto>
<br>
<br>

# Scheduling

Now that we have looked at some terminology, hyper-frames and tasks; lets go ahead and start looking at scheduling.

# Two kinds of algorithms
1. A scheduler or scheduling algorithm, which generates a schedule
at runtime/offline.

2. A feasibility analysis algorithm, which checks if timing constraints
are met.

<img src="/img/schedule-algo.png" alt="self portrait" width="600" height=auto>

Set S of n tasks

set P of p processors

Set R of r resources

We find an assignment of P and R to S that produces a feasible schedule under a set of constraints.

# Types of scheduling
## Static
offline or clock drive
## Dynamic
online or priority driven (static or dynamic priority)

<img src="/img/static-example.png" alt="self portrait" width="600" height=auto>

Here is an example of two possible static schedules of 3 tasks s.t:

T_1 = (4,1)

T_2 = (6,1)

T_3 = (12,2)

# Scheduling aperiodic tasks (irregular tasks)

We've looked at scheduling periodic tasks, lets look at aperiodic tasks now. A common way in dealing with aperiodic tasks is to use *slack stealing*.

Aperiodic task only execute when the sporadic task queue is
empty.

Follow a FIFO order.

# Slack stealing
<br>

<img src="/img/a-periodic.png" alt="self portrait" width="600" height=auto>

A hyper-frame with periodic tasks, notice the free gaps available for aperiodic tasks.

<img src="/img/b-aperiodic.png" alt="self portrait" width="600" height=auto>

A hyper-frame with aperiodic tasks, lets add the aperiodic taks to the periodic hyper-frame.

<img src="/img/c-periodic-and-aperiodic-simple.png" alt="self portrait" width="600" height=auto>

This is a naive way of doing it, it works but is not efficient.

<img src="/img/d-aperiodic-and-periodic-stack-stealing.png" alt="self portrait" width="600" height=auto>

This uses *slack stealing* by using free spaces, notice how the aperiodic task finishes sooner.

# Scheduling sporadic tasks

Sporadic tasks have a hard dead line and appear are arbitrary times.
 
When one of these tasks arrives, the system must first perform an acceptance test to make sure it can be completed by its deadline, if not then the system has failed.

Follow a EDF (earliest deadline first) order.

<img src="/img/tasks-diagram.png" alt="self portrait" width="600" height=auto>
<br>
<br>