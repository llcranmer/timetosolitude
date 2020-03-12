---
title: How to Use Anchore Inline Docker Image Scan
date: 2020-03-04
description: Check Docker images for CVE's
tags: ['cloud', 'Docker', 'security']
---

### Introduction

Anchore is a tool that scans Docker images for common vulnerabilities and not so common vulnerabilities if you purchase the paid version. However, the free version is useful and should still be used on your team to avoid common vulnerabilities.

Thankfully, the Anchore team is kind enough to have created an entire shell script to both install the Anchore Database locally and run the Anchore CLI all in one line.

PART I
------

### Set-up

The only prerequisite is to have Docker installed and a Docker image to scan.

So, pull the latest Python-based Django image by running the following command.

```cli 
>$ Docker pull django:latest
latest: Pulling from library/django
75a822cd7888: Pull complete
e4665cede9d1: Pull complete
202a45aa091c: Pull complete
7799136eb561: Pull complete
7a7f9ca3fd40: Pull complete
412f2d081014: Pull complete
Digest: sha256:5bfd3f442952463f5bc97188b7f43cfcd6c2f631a017ee2a6fca3cb8992501e8
Status: Downloaded newer image for django:latest
Docker.io/library/django:latest
```

PART II
-------

### Scanning a Local Docker Image with Anchore

Now, to scan the image, it is as simple as running the below command.

```cli
> $ curl -s https://ci-tools.anchore.io/inline\_scan-v0.6.0 | bash -s -- -r django:latest

Pulling Docker.io/anchore/inline-scan:v0.6.0
v0.6.0: Pulling from anchore/inline-scan
c8d67acdb2ff: Pulling fs layer
79d11c1a86c4: Pulling fs layer
29e401ba63ed: Pulling fs layer
80ebc2cb4bb5: Pulling fs layer
cc792e3974ef: Pulling fs layer
ab823a13986c: Pulling fs layer
2804f93eb9d5: Pulling fs layer
5f2abe590f8b: Pulling fs layer
f75fc16c556e: Pulling fs layer
b76fb0e96d28: Pulling fs layer
88f36ce1e581: Pulling fs layer
e0d96f1cdcf6: Pulling fs layer
9c15e755f25a: Pulling fs layer
99f9e30d756f: Pulling fs layer
e0467da0b2f4: Pulling fs layer
29f72f52071b: Pulling fs layer
f47649d81f49: Pulling fs layer
80ebc2cb4bb5: Waiting
cc792e3974ef: Waiting
ab823a13986c: Waiting
2804f93eb9d5: Waiting
5f2abe590f8b: Waiting
f75fc16c556e: Waiting
b76fb0e96d28: Waiting
88f36ce1e581: Waiting
e0d96f1cdcf6: Waiting
9c15e755f25a: Waiting
99f9e30d756f: Waiting
e0467da0b2f4: Waiting
29f72f52071b: Waiting
f47649d81f49: Waiting
79d11c1a86c4: Download complete
80ebc2cb4bb5: Verifying Checksum
80ebc2cb4bb5: Download complete
cc792e3974ef: Verifying Checksum
cc792e3974ef: Download complete
ab823a13986c: Download complete
2804f93eb9d5: Download complete
29e401ba63ed: Verifying Checksum
29e401ba63ed: Download complete
f75fc16c556e: Verifying Checksum
f75fc16c556e: Download complete
b76fb0e96d28: Verifying Checksum
b76fb0e96d28: Download complete
88f36ce1e581: Verifying Checksum
88f36ce1e581: Download complete
5f2abe590f8b: Verifying Checksum
5f2abe590f8b: Download complete
c8d67acdb2ff: Verifying Checksum
c8d67acdb2ff: Download complete
99f9e30d756f: Verifying Checksum
99f9e30d756f: Download complete
e0467da0b2f4: Verifying Checksum
e0467da0b2f4: Download complete
29f72f52071b: Verifying Checksum
29f72f52071b: Download complete
e0d96f1cdcf6: Verifying Checksum
e0d96f1cdcf6: Download complete
f47649d81f49: Verifying Checksum
f47649d81f49: Download complete
c8d67acdb2ff: Pull complete
79d11c1a86c4: Pull complete
29e401ba63ed: Pull complete
80ebc2cb4bb5: Pull complete
cc792e3974ef: Pull complete
ab823a13986c: Pull complete
2804f93eb9d5: Pull complete
5f2abe590f8b: Pull complete
f75fc16c556e: Pull complete
b76fb0e96d28: Pull complete
88f36ce1e581: Pull complete
e0d96f1cdcf6: Pull complete
9c15e755f25a: Verifying Checksum
9c15e755f25a: Download complete
9c15e755f25a: Pull complete
99f9e30d756f: Pull complete
e0467da0b2f4: Pull complete
29f72f52071b: Pull complete
f47649d81f49: Pull complete
Digest: sha256:13276a0fdc98cc40b70814c2d83c8c6400e9da2939c6256bc221ada40f9f8a28
Status: Downloaded newer image for anchore/inline-scan:v0.6.0
Docker.io/anchore/inline-scan:v0.6.0
Starting Anchore Engine
Starting Postgresql... Postgresql started successfully!
Starting the Docker registry... Docker registry started successfully!
Waiting for Anchore Engine to be available.

 Status: not\_ready...

Anchore Engine is available!


Preparing django:latest for analysis

Getting image source signatures
Copying blob sha256:b6ca02dfe5e62c58dacb1dec16eb42ed35761c15562485f9da9364bb7c90b9b3
 122.93 MB / 122.93 MB 8s
Copying blob sha256:40cc5c729ee12cbf17805f72beb035b2356a9e0a4ec7926a258355fa3713c0dd
 7.65 MB / 7.65 MB 0s
Copying blob sha256:f72299e7fd5a1ae319466b83cadd42abe15661fd2cf9afa92f49cdd7a534df51
 62.12 MB / 62.12 MB 3s
Copying blob sha256:4bd3b46a8734dd8cb6f7fee98cb9c9084a9ce4dd0242c9f7659b0f2c660f5692
 5.00 KB / 5.00 KB 0s
Copying blob sha256:6d0632e611f48587e00a3c093d4afddcbc637995122666b65e08a637ef1603a6
 198.79 MB / 198.79 MB 23s
Copying blob sha256:e6d982acf7bfa32b3d8187f4e3a680726c5b11fcf49571f92582289198948309
 39.89 MB / 39.89 MB 2s
Copying config sha256:eb40dcf64078249a33f68fdd8d80624cb81b524c24f50b95fff5c2b40bdc3fdc
 6.12 KB / 6.12 KB 0s
Writing manifest to image destination
Storing signatures

Image archive loaded into Anchore Engine using tag -- django:latest
Waiting for analysis to complete...

 Status: not\_analyzed.
 Status: analyzing..................
 Status: analyzed

Analysis completed!

Successfully generated anchore-reports/django\_latest-content-os.json.
Successfully generated anchore-reports/django\_latest-content-python.json.
Successfully generated anchore-reports/django\_latest-content-java.json.
Successfully generated anchore-reports/django\_latest-content-files.json.
Successfully generated anchore-reports/django\_latest-vuln.json.
Successfully generated anchore-reports/django\_latest-details.json.
Successfully generated anchore-reports/django\_latest-policy.json.

 Policy Evaluation - django:latest
-----------------------------------------------------------

Image Digest: sha256:84312a8bc641a87981190cc25bbe0e24276e6ef54f8c7fb6b47f83f996514e3b
Full Tag: localhost:5000/django:latest
Image ID: eb40dcf64078249a33f68fdd8d80624cb81b524c24f50b95fff5c2b40bdc3fdc
Status: fail
Last Eval: 2020-03-09T15:05:29Z
Policy ID: 2c53a13c-1765-11e8-82ef-23527761d060
Final Action: stop
Final Action Reason: policy\_evaluation

Gate Trigger Detail Status
Dockerfile instruction Dockerfile directive 'HEALTHCHECK' not found, matching condition 'not\_exists' check warn
vulnerabilities package MEDIUM Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2017-12794 - https://nvd.nist.gov/vuln/detail/CVE-2017-12794) warn
vulnerabilities package MEDIUM Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2017-7233 - https://nvd.nist.gov/vuln/detail/CVE-2017-7233) warn
vulnerabilities package MEDIUM Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2017-7234 - https://nvd.nist.gov/vuln/detail/CVE-2017-7234) warn
vulnerabilities package CRITICAL Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2019-19844 - https://nvd.nist.gov/vuln/detail/CVE-2019-19844) stop

Copying scan reports from 14508-inline-anchore-engine to /c/Users/deguiacr/anchore-reports/

Cleaning up Docker container: 14508-inline-anchore-engine
```

PART III
--------

### Analysis of Results

In the bottom portion of the output from the scan, there are links to the common vulnerabilities and exposures webpages with the crucial pieces of information. 

The first one that stands out is the **CRITICAL** vulnerability, which is directly related to the version of python (3.4) and the Django package available within it.

By copying and pasting the URL to the vulnerability, you can see what the vulnerability is, and that is the ability to take over a user's account if the version of Django is between 1.11.27 and 3.0.1.

```yaml
 Gate Trigger Detail Status
 Dockerfile instruction Dockerfile directive 'HEALTHCHECK' not found, matching condition 'not\_exists' check warn
 vulnerabilities package MEDIUM Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2017-12794 - https://nvd.nist.gov/vuln/detail/CVE-2017-12794) warn
 vulnerabilities package MEDIUM Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2017-7233 - https://nvd.nist.gov/vuln/detail/CVE-2017-7233) warn
 vulnerabilities package MEDIUM Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2017-7234 - https://nvd.nist.gov/vuln/detail/CVE-2017-7234) warn
 vulnerabilities package CRITICAL Vulnerability found in non-os package type (python) - /usr/local/lib/python3.4/site-packages/Django (CVE-2019-19844 - https://nvd.nist.gov/vuln/detail/CVE-2019-19844) stop

```

PART IV
-------

### How to address the CVE's

The reason there are so many CVE's, to begin with, is that the Docker image **django:latest** is no longer maintained. Meaning, no one is updating the Docker image to address the CVE's. 

Also, In general, it is not good practice to use third-party images like **django:latest**, which aren't officially maintained by the Python foundation. 

With that in mind, the best way to address the CVE's is to use a Python foundation official Docker image and install Django during the build. 

Create the following Dockerfile in a folder named *test*
```
# test/Dockerfile
 # The first instruction is what image we want to base our container on
 FROM python:3.8.2-slim-buster
 
 ENV PYTHONUNBUFFERED 1
 
 # create a root directory for our project in the container
 RUN mkdir /wrk
 
 # Set the working directory to /music\_service
 WORKDIR /wrk
 
 # Copy the current directory contents into the container at /music\_service
 ADD . /wrk/
 
 # Install any needed packages specified in requirements.txt
 RUN pip install -r requirements.txt
```
and the following _requirements.txt_ in the same folder

```cli
# test/requirements.txt
 Django==3.0.4
```

Now build the Docker image and tag it as _django:test_

```cil
 >$ Docker build . -t django:test
```
and then run an Anchore Inline scan against it.

```cli
> $ curl -s https://ci-tools.anchore.io/inline\_scan-v0.6.0 | bash -s -- -r django:test

 Pulling Docker.io/anchore/inline-scan:v0.6.0
 v0.6.0: Pulling from anchore/inline-scan
 Digest: sha256:13276a0fdc98cc40b70814c2d83c8c6400e9da2939c6256bc221ada40f9f8a28
 Status: Image is up to date for anchore/inline-scan:v0.6.0
 Docker.io/anchore/inline-scan:v0.6.0
 Starting Anchore Engine
 Starting Postgresql... Postgresql started successfully!
 Starting Docker registry... Docker registry started successfully!
 Waiting for Anchore Engine to be available.
 
 Status: not\_ready..
 
 Anchore Engine is available!
 
 
 Preparing django:test for analysis
 
 Getting image source signatures
 Copying blob sha256:f2cb0ecef392f2a630fa1205b874ab2e2aedf96de04d0b8838e4e728e28142da
 69.12 MB / 69.12 MB 4s
 Copying blob sha256:bdc3a0723efad857856e4b39be542e4019b21be175fa125799b7f20ecba677ee
 6.98 MB / 6.98 MB 0s
 Copying blob sha256:64b4e3ecc0d6402f0f2125e49fad276e3556fbabcc04954965a64ce43b52a201
 105.46 MB / 105.46 MB 6s
 Copying blob sha256:df4dc71f749c287bddf0c42b813bd96a27dfdad6c3850c92d394883b795a1e24
 4.50 KB / 4.50 KB 0s
 Copying blob sha256:fe108eef54ea6e8c465bc1f6ddfbedde6cc41af69a930215ff381211983d5154
 7.63 MB / 7.63 MB 0s
 Copying blob sha256:83aa36b21c9979cbcb25082dc2a45b5f0c14a31bd8a4257718d67856f71a3380
 1.50 KB / 1.50 KB 0s
 Copying blob sha256:0290a4ca1adc8d3e32e05b51cc9bc0c3702692d27f760d620e463c4a69fc121b
 3.50 KB / 3.50 KB 0s
 Copying blob sha256:a2f0a3adf092287ca4dd477d3bc4cac7de5df62412da242e1437c5f8eba72de0
 42.01 MB / 42.01 MB 2s
 Copying config sha256:29ac1eb77b196e168ddd2a88f7ab21373819805219320ba34aa8b603aefa1713
 8.21 KB / 8.21 KB 0s
 Writing manifest to image destination
 Storing signatures
 
 Image archive loaded into Anchore Engine using tag -- django:test
 Waiting for analysis to complete...
 
 Status: not\_analyzed
 Status: analyzing..........
 Status: analyzed
 
 Analysis completed!
 
 Successfully generated anchore-reports/django\_test-content-os.json.
 Successfully generated anchore-reports/django\_test-content-python.json.
 Successfully generated anchore-reports/django\_test-content-files.json.
 Successfully generated anchore-reports/django\_test-vuln.json.
 Successfully generated anchore-reports/django\_test-details.json.
 Successfully generated anchore-reports/django\_test-policy.json.
 
 Policy Evaluation - django:test
 -----------------------------------------------------------
 
 Image Digest: sha256:84de5ca329d5963798aedf72e73673277a0f04ebf0daf81599941d18e6166dda
 Full Tag: localhost:5000/django:test
 Image ID: 29ac1eb77b196e168ddd2a88f7ab21373819805219320ba34aa8b603aefa1713
 Status: pass
 Last Eval: 2020-03-09T16:05:29Z
 Policy ID: 2c53a13c-1765-11e8-82ef-23527761d060
 Final Action: warn
 Final Action Reason: policy\_evaluation
 
 Gate Trigger Detail Status
 Dockerfile instruction Dockerfile directive 'HEALTHCHECK' not found, matching condition 'not\_exists' check warn
 
 Copying scan reports from 19436-inline-anchore-engine to /c/Users/deguiacr/anchore-reports/
 
 Cleaning up Docker container: 19436-inline-anchore-engine
```

### Conclusion

By using an official image from the Python Foundation on Docker Hub and adding Django to it is possible to avoid the common vulnerabilities pointed out by Anchore.

