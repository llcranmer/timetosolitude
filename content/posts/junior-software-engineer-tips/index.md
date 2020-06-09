---
title: What I learned from working in the industry for one year
date: 2020-03-11
description: Some things I've learned to do
tags: ['software engineering']
---

### Introduction

I've learned to do the following as a junior software engineer during my first year in industry.

**TL;DR**
- Write a design document
- Document as much as possible
- Test-Driven Development but not 100% test coverage
- Log as much as possible 

### 1.) I learned to start with a design document

A design document is a way of showing viewers of your software what the intended behavior is. I like to use [Draw.io](https://draw.io) an open-source online piece of software that allows you to save the drawing to your local machine. So, what I like to do is layout the program's intended logic is with all the possible decision paths, which has helped to find edge cases and write tests. 

### 2.) I learned to document in several different places and formats 

At first, I only documented with comments and code, which I quickly found was not enough because of readers of my code were from many different backgrounds and were not always DevOps engineers like me. 

I create the following for each new feature:
- [Screen recordings](https://support.zoom.us/hc/en-us/articles/201362473-Local-Recording) showing how to use the feature 
- [Windows Steps Recorder](https://support.microsoft.com/en-us/help/22878/windows-10-record-steps)
- Markdown files aka 'README.md's' with generous amounts of code snippets 
- Wiki's 
- OneNote
- Tests

### 3.) I learned to use Test-Driven Development for faster bug-fixes and also for documentation 

Test-Driven Development is the idea of writing tests first before writing out the code. I've found that drawing out the logic of the program with Draw.io helps to come up with the tests. 

There have been several times that other developers have found a bug with my feature and been able to submit fixes quickly because of the tests helping them to see what the intended behavior is of the program(s).

The same has happened to me while needing to put out a patch for a bug affecting production.

But, something that is important is to keep in mind *why* you're testings things otherwise, it can become all too easy to become consumed with test coverage percentage and not on purpose, which could lead to confusing tests. 


### 4.) I learned to keep a log of all the work I do

A log of work is great for several reasons. First, it serves to quantify what you are doing daily, and secondly, it helps to focus on what needs to get done. So, what I've done is set up a simple markdown log like so:

```yaml
# folder layout 
/log
 /year
 /month
 month.md
```

#### How each day is formatted

### dd/year

##### AM

- [ ] meeting
- [ ] feature
    - [ ] something that the feature needs 
    - [ ] infrastructure for the feature

##### PM

- [ ] foo 
    - [ ] bar
    - [ ] boop
- [ ] Open Ticket

Logging has been helpful in keeping with everything, especially the little things that like replying to that one e-mail or rotating that one secret for that one thing. 


### Conclusion 

I hope incorporating a few of the above into your work routine can help you with your daily tasks whatever they may be. 