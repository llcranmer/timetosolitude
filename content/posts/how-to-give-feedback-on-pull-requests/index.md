---
title: How to Give Feedback on Pull Requests
date: 2020-03-19
description: A few thoughts about giving feedback on pull requests
tags: ['software', 'engineer', 'tips']
---


## Intro

I have reviewed hundreds of pull requests during my first year of software engineering, and most of them have been for code and documentation. I have learned from feedback from other team members (or lack of response) what works and what does not. So here is how I go about providing feedback.


## How to give feedback on PR's related to code changes

In general analyzing code, changes are more manageable because one easy way to see if the proposed changes get the +1 is if the system does not break.

### Tests

If the repository has automated testing run with each commit, then it is easy to see if the tests pass or fail. If they fail, then it suffices to leave a comment saying, "Please fix the failing test." and request changes before giving an in-depth review. 

If the tests pass then, I ask myself the questions below while reviewing the code, and if there are no tests, then I'll still ask the questions below and ask for at least a test or two.

### Questions I use when reviewing code 

#### 1.) Does it consider edge cases?
An edge case is an uncommon situation that the proposed code changes might encounter. However, it is not always feasible to test or consider every edge case while writing code. 

Still, it is vital to state the *intended behavior of the program/function(s)* and *expected results*, in other words, a design document, so that a reviewer can narrower their scope of things to consider.

##### <span style="color:red">Request Changes</span>
I request changes pull-requests that **only** consider the *happy path*. The happy path is the scenario where the code only works when it gets the exact input or invoked in a particular order—implying that the code changes are brittle and may cause breaks when giving different information or invocation order. 


#### 2.) Does it use known harmful patterns in software engineering?
Software engineering is a young field with respect to other engineering fields; some do not even consider it engineering, and as such, it does not have any set in stone rules to follow when writing code. 

However, the three things that most engineers might agree upon is the runtime, memory utilization, and redundancy. Runtime and memory utilization affect performance at scale, which, if not optimized, will waste money. In contrast, redundancy affects maintainability of code, which can make it harder for others to understand the system. 

##### <span style="color:red">Request Changes</span>
1.) **Runtime** If nested for loops can be changed to be one for loop or no loop at all:
```python
def someFuncHeader():
 for ... :
 for ... :
 for ... :
```

2.) **Memory** If using hand-implemented data structures rather than data structures implemented by the maintainers of the programming language:
```python
def myHandImplementedReverseStringFunc(s):
 str = "" 
 for i in s: 
 str = i + str
 return str
```
vs 

```python 
from collections import deque 
def ReverseStringUsingCollections(s):
 d = deque(s)
 return reversed(d) 
```

3.) **Redundancy** If the same chunks of code repeated several times throughout the program, then request a function be made with the code chunks and called multiple times.

### <span style="color:red">I Always request changes for the following:</span>

- Does not follow the repository's contributing guidelines
- Does not follow the naming/style conventions of the repository
- Breaks other pieces of the codebase
- The requester has secrets included in pull request
- The requester has executables in pull request
- The requester has their IDE settings file included in pull request

## How to give feedback on PR's related to documentation

I think providing feedback on documentation is more complicated than providing feedback on code changes because by its nature documentation is opinionated. In general, I try to follow the best writing practices for English and focus on that first.

### General Writing

1.) Spelling mistakes
2.) Grammar mistakes like sentence fragments and run-on sentences.
3.) Abbreviations before first use. e.g., GHE before writing GitHub Enterprise (GHE) 

### Target audience
I try to think about who will be reading the documentation and what their experience is with the code. 

### Documentation Structure
I like to see that the author uses headers consistently and not sporadically.

### An opinionated way of using headers 

```markdown 
# h1: Title of post 

## h2: Big idea one 

### h3: Sub idea of the big idea one

#### h4: Example of sub idea of the big idea one

## h2: Big idea two

### h3: Sub idea of big idea two

#### h4: Example of sub idea of big idea two
```


## Conclusion

By following the above advice, it can kick-start your pull-requesting career as a newly minted software engineer joining a team. However, keep in mind that it varies by group. So use the advice as a general starting point because, in software, almost nothing is set in stone. 