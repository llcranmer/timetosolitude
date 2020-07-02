---
title: Dependency injection with GOlang
date: 2020-03-29
description: An example of using Dependency injecting  with files in GOlang.
tags: ['software engineering']
---

# Intro 

Dependency injection is a form of testing that emphasizes testing of the expected behavior of the functions. Whereas, mocking or faking is concerned with testing the implementation of the code. Because it has the assumption that the thing being mocked accurately reflects the **real-world** use of the thing being mocked. 

However, no matter how close a mock gets the the actual thing it is suppose to represent it will never be that thing. Yet, mocking isn't evil and is a valid means of making progress when stuck on writing tests, and having some tests is better than having 0 tests. 

Typically, I'll lean on mocking during the first rough pass of the code, which happened in the following example of reading a file and getting the desired data.

## Problem := Read from a file and return a piece of data

Suppose we have a file called `user.json` containing a single user's information, and we want to get their age. Ordinarily, the first step might be to create a `user.json` file to work with or find a copy of a `user.json` file, and while it can get you through the first round of tests, it will most likely fail whenever it is time (1) Share the code and (2) execute the tests in a pipeline. So, in other words, it can be a waste of time, when it comes time to using the code in any meaningfulful way. 

To create meaninful tests the **data** can be passed directly into the function call. Rather than be introduced as another dependency in the codebase in the form of a `test/resources/user.json` file.

Furthermore, it allows the testing of the behavior of the function rather than whether or not the code can open files. 

Although it may seem like a small dependency, it can lead to problems in several ways. The first is whenever collaborating with another, and they download the code, but for whatever reason, do not download the `test/resources/user.json` file (maybe it was forgotten in the commit to the main branch). 

Or maybe there's a pipeline connected to the repo, and the test files were written with Windows ending and will cause problems in the Linux environment (typically, the continuous integration pipeline is Linux based), so the tests fail even though they work on your machine. 

The point is it introduces one more thing to manage and possibly to debug on top of getting work done. 

So rather than worry about the *dependencies* of the code, they are removed from within the function calls and are passed as arguments. That is all that dependency injection is. 

Yet, adopting the use of dependency injection in tests helps to isolate the responsibilities of a function and makes for better tests. Because what is better than actually having the data itself to be used in experiments rather than a mocked version of it?

### File data structure

The data structure
```json
{
    age: 34
}
```

### 1.) Define the struct

Knowing the form of the data a `User` struct in created to unmarshal the data into at a later point.

```golang
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"testing"
)

type User struct {
	Age int `json:"age"`
}
```

### 2.) Read the contents of the file

The first subtask from getting the user data from the json file is to get all the data from the
file.

#### TestGetFileData

As per normal start with the test first and here is where the use of Dependency Injection is shown. In `TestGetFileData()` the test data is passed directly to the function. Take that in, instead of dealing with a file on the local disk, the exact data structure is passed in. That's right no need to maintain test files, only **GO** code.

```golang
func TestGetFileData(t *testing.T) {
	t.Parallel()
	got, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
	s := fmt.Sprint(got)
	if s == "" {
		t.Errorf("Wanted %s got %s", got, s)
	}
}
```
#### GetFileData

GetFileData doesn't use the `os.Open()` function because the code should not care what OS environment it is in, nor how it handles file paths. It may seem unnecessary, but it drastically reduces the number of tests needed. 

For example, if os.Open was used, then it might become necessary to have a suite of tests that uses **Windows** pathing and a set that uses **Linux** pathing. And that means maintaining two sets of criteria that will be almost identical, with little to no gain. Instead, the file is read in as a stream of bytes, other functions can do whatever they want with the bytes.

```golang
func GetFileData(rdr io.Reader) ([]byte, error) {
	contents, err := ioutil.ReadAll(rdr)
	if err != nil {
		log.Fatalf("Error reading data %v", err)
	}
	return contents, nil
}
```

### 3.) Get the desired data from contents

Now, that it is reasonably sure that we have a function that can read data from any file type and on any OS, it is time to create the service that is responsible for getting only the exact piece of data desired.

#### TestGetAge

```golang
func TestGetAge(t *testing.T) {
	t.Parallel()
	data, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
	got := GetUserAge(data)
	want := 34
	if got != want {
		t.Errorf("Got %d want %d", got, want)
	}
}
```


#### GetUserAge

```golang
func GetUserAge(data []byte) int {
	u := &User{}
	err := json.Unmarshal(data, u)
	if err != nil {
		log.Fatalf("JSON unmarshal error %v", err)
	}
	return u.Age
```

### 4.) Altogether, and a small refactor.

In the GetUserAge function, there's a declaration of the `User` structure, which is not what the service is responsible for. So instead, it can be refactored to be removed from the function.

As shown in the final result below. Again the idea is only to have code related to precisely what the function is supposed to do; anything else can be removed and passed in as an argument. 

:link: [See it Live on Golang playground](https://play.golang.org/p/bV8bNxqm06W)

```golang
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"testing"
)

type User struct {
	Age int `json:"age"`
}

// Declare an empty User struct for testing
var u = &User{}

func TestGetAge(t *testing.T) {
	t.Parallel()
	data, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
	got := GetUserAge(data,u)
	want := 34
	if got != want {
		t.Errorf("Got %d want %d", got, want)
	}
}

func TestGetFileData(t *testing.T) {
	t.Parallel()
	got, _ := GetFileData(bytes.NewBufferString(`{"age": 34}`))
	s := fmt.Sprint(got)
	if s == "" {
		t.Errorf("Wanted %s got %s", got, s)
	}
}

// Pass in a pointer to the user
func GetUserAge(data []byte, u *User) int {
	err := json.Unmarshal(data, u)
	if err != nil {
		log.Fatalf("JSON unmarshal error %v", err)
	}
	return u.Age

}

func GetFileData(rdr io.Reader) ([]byte, error) {
	contents, err := ioutil.ReadAll(rdr)
	if err != nil {
		log.Fatalf("Error reading data %v", err)
	}
	return contents, nil
}
```

### Conclusion

Dependency Injection aides in writing code that is easier to test and encourages the isolation of responsibilities for functions. Give a try in your next project!
