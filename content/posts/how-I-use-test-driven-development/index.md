---
title: How I use Test-Driven Development 
date: 2020-03-06
description: An introduction to test-driven development that works for me
tags: ['software engineering']
---


## How does Test-Driven Development Impact the Software I create?

I remember starting as an entry-level software engineer and hearing senior engineers on my team get into heated debates about Test-Driven Development (TDD). 

At the time, I was against it because it seemed like extra work. All I wanted was to finish **feature** of the week.

However, it all changed after my first feature went into production and caused me and other engineers hours of headaches. 

It was during a retrospective that a senior engineer on the team pointed out that it took so long to debug because there were no unit tests, only integration tests which are slower to run and even harder to reproduce. 

After nods from other senior engineers, it was agreed that I would go and add unit tests, which I did and now have had fewer bugs with the production code as well as increased turn around time for adding features. 

As a consequence, I began to use TDD for each new feature that I could. Because it helped lower my anxiety and gave me confidence that I didn't need to know everything since I had a foundation in place for the feature that enabled it to grow and adapt to *How it is being **used*** rather than *How I thought it was being **used***.

It also had the side effect of increasing my development velocity because the features became simpler rather than being overdesigned.

## The Cosmic Software Cyle of <span style="color:red">Red</span>, <span style="color:green">Green </span>, <span style="color:blue">Blue</span> 

I first began by reading [Test Driven Development](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530/ref=sr_1_1?keywords=tdd&qid=1584211861&sr=8-1) by Kent Beck, which some consider the foundation for the TDD movement, and introduces the idea of Red, Green, Blue.

The big idea of Red, Green, Blue development is that the cyclic flow of creating software is inverted.  Instead of adding one line at a time and pressing run/compiling to see that the code doesn't cause errors,  the point is to start with failing code via tests.

Rather than building a program that compiles/runs the question become *"What is this program suppose to do?"* and the answers are the results of the passing tests.

So, to better understand TDD, let's take a trivial case that exercises the development loop of a new simple feature called *hello visitor*, a function that prints "Hello visitor." when invoked.

### <span style="color:red">Red</span>

First, start by writing a failing test.

#### Test
```go
package main 
// hello_visitor_test.go
import (
 "testing"
 "fmt"
)

func TestHelloVisitor(t *testing.T) {
 have := HelloVisitor()
 want := "Hello nullPtr."
 if have != want {
 fmt.Sprintf("have = %s, want = %s", have, want)
 } 
}
```
##### Running test

```go
> go test hello_visitor_test.go -v 

> ./hello_visitor_test.go:9:10: undefined: HelloVisitor
FAIL command-line-arguments [build failed]
FAIL
```
### <span style="color:green">Green </span>

Now that the first half of the cycle is complete, it is now time to get the test to pass. So, the reason the test is not passing is given to us by the compiler: *undefined: HelloVisitor*, therefore our job is to define **HelloVisitor()**, which we do by creating a *hello_visitor.go* file with the following within it:

```go
package main 

// hello_visitor.go
func HelloVisitor() string {
 return "Hello nullPtr."
}
```
It is the bare minimal to get the test to pass; a hardcoded value. 

##### Running test

```go
> go test hello_visitor_test.go -v 
=== RUN TestHelloVisitor
--- PASS: TestHelloVisitor (0.00s)
PASS
ok _/go/src/debug 1.794s
```

In general, to get to green anything goes, which has helped me to get over the anxiety of needing a perfect piece of software. 

Instead, I create something that works, which gets me over my analysis paralysis because I know after I get it to green comes blue, the refining process.

### <span style="color:blue">Blue</span>

So, in the green part of the cycle, we knowingly committed the terrible act of *hard coding* a value, which in software engineering is considered blasphemy. 

Now, to remedy the act let's <span style="color:blue">Refactor </span>the code by asking ourselves what is the function suppose to do. 

At the moment, the function outputs "Hello" to only one hard-coded value, but visitors can have many names, so that tells us to think about how to make the function work for any visitor.

First, we ask ourselves, "What is a visitor?"

I assume as the creator of the function that it is for some website that wants to greet a user. 

Therefore, the user may be thought of as a structure with many data fields. 

```go
// thoughts
type Visitor struct {
 ...
}
```
Then, I ask myself, what is the bare minimum needed?

```go
// I think it's a name for now
type Visitor struct {
 Name string 
}

```

So let's add the struct and how we think the function should work.

```go
package main 

// hello_visitor.go
type Visitor struct {
 Name string
}

// HelloVisitor greets visitors to a website.
func HelloVisitor(v *Visitor) string {
 return fmt.Sprintf("Hello %s", v.Name)
}

```

##### Running test

```go
> go test -v
> hello_visitor_test.go:9:22: not enough arguments in call to HelloVisitor
 have ()
 want (*Visitor)
FAIL [build failed]
Error: Tests failed.
```

The compiler tells me that I have not updated my test to test the new function. 

I'll do so now.

```go 
package main

import (
 "testing"
 "fmt"
)

func TestHelloVisitor(t *testing.T) {
 v := &Visitor{Name: "nullPtr"}
 have := HelloVisitor(v)
 want := "Hello nullPtr."
 if have != want {
 fmt.Sprintf("have = %s, want = %s", have, want)
 }
}
```


##### Running test

> go test -v 
=== RUN TestHelloVisitor
--- PASS: TestHelloVisitor (0.00s)
PASS
ok code/go/src/debug 0.258s

I still use the Red and Green cycle while refactoring code during the Blue cycle; however, the intent has changed. Instead of only caring about getting the code to green my care has become *how to get the code to green and be generic?*


## Conclusion

As silly as the above example may seem, it has laid down the foundation for being able to create working code systematically. 

Rather than focusing on trying to create code that handles every possible situation, instead, the *Product Owners* can provide feedback on whether or not the assumption(s) are correct in the code. 

And better yet, I don't have to over-design my code. 

The Product Owners are like the compiler; they tell me how they want the code to behave, and I update my tests or create new ones if they want the code to do more. 