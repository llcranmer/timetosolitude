---
title: How to use Docker Bench Security for Container and Host Hardening
cover: ./how-to-use-Docker-bench-for-security.png
date: 2020-03-03
description: Docker bench is an open-source tool to help improve the security of Docker Daemon configuration and at the Host OS level.
tags: ['security']
---


Docker is the rage now in the field of containerization and, as a consequence, is a target for attack. 

Although Docker does have some security benefits out of the box upon installation enabled via the default settings, they may not be enough to prevent attacks. This article will focus on using [Docker Bench for Security](https://github.com/Docker/Docker-bench-security) to aid in tweaking the settings of Docker in line with the standard best practices of using Docker. 

Docker Bench for Security is a script by the Docker, Inc. company--the makers of Docker, that checks against dozens of best practices, including for security. There are two main ways to use Docker Bench for Security, first to see that the installation of Docker on the host operating system (OS) is following the best practices and second that containers running in the host are following the best practices. 

In this article, I will go over both of the common uses of Docker Bench for Security, starting with the configuration of Docker in a host OS.


## I. Using Docker Bench Security to configure Docker to best practices 

In this demo of Docker bench security, we are going to use the following website to avoid the set up of a server or virtual machine [Docker Playground](https://training.play-with-Docker.com/security-capabilities/). Because most likely, the host OS that has Docker installed is a Linux based OS, which is standard practice in the cloud, where your microservices probably live. It is popular due to the small OS size and security. Whereas the machine you are using to view this article is perhaps Windows OS based so we'll use the [Docker Playground](https://training.play-with-Docker.com/security-capabilities/) so that everyone can follow along. 

Let's start by signing in.

[Docker Playground](https://training.play-with-Docker.com/security-capabilities/)

Now that the terminal is active check which Linux version is installed:

`$ cat /etc/os-release` 

![cat_alpine](https://media.github.azc.ext.hp.com/user/7987/files/6e8ff300-4f01-11e9-9cc8-8ce95ab74bbf)

Great, precisely the host OS we wanted to test. 

Next use the following the command to run Docker-bench security in a container against the host,

 It may be best to stuff this command
 ```
Docker run -it --net host --pid host --userns host --cap-add audit_control \
 -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
 -v /var/lib:/var/lib \
 -v /var/run/Docker.sock:/var/run/Docker.sock \
 -v /usr/lib/systemd:/usr/lib/systemd \
 -v /etc:/etc --label Docker_bench_security \
 Docker/Docker-bench-security
```
All on one line, into a 'name_of_script.sh' file like this,
 
 `$ vim DockerBench.sh`

![Docker_bench_against_host](https://media.github.azc.ext.hp.com/user/7987/files/6fc12000-4f01-11e9-82a2-19decf19ac93)
 
 and then run it via `$bash name_of_script.sh` 
 

![bash_Dockerbench](https://media.github.azc.ext.hp.com/user/7987/files/6e8ff300-4f01-11e9-8fdd-d12e6a9f8d18)


 If the browser isn't letting you use copy and paste, which in my case, it did not. If you can copy and paste, then copy this chunk of code into the terminal and press enter.

The results should look like the following.

![audit_warning](https://media.github.azc.ext.hp.com/user/7987/files/6df75c80-4f01-11e9-89d1-29ff0b434f49)
![Docker_daemon](https://media.github.azc.ext.hp.com/user/7987/files/6fc12000-4f01-11e9-8b34-694e213ed7a8)
![Docker_daemon_configuration_file](https://media.github.azc.ext.hp.com/user/7987/files/7059b680-4f01-11e9-9164-3b4a2d6e7c98)
![container_image_and_build](https://media.github.azc.ext.hp.com/user/7987/files/6f288980-4f01-11e9-8cf0-55062048a036)

N.B., this may change in the future, if this Alpine playground is updated.

Let's address the **[WARN]** 1.5-1.7 and 1.11, which is triggered because the host OS does not have any auditing software installed to track kernel level processes.

![audit_warning](https://media.github.azc.ext.hp.com/user/7987/files/6df75c80-4f01-11e9-89d1-29ff0b434f49)

To address this, we are going to install an `audit.` `audit` is a Linux access monitoring and accounting subsystem that `logs` system operations at the kernel level. If you are familiar with the Ubuntu flavor of Linux, then it is the same as `auditd`. Both enable the auditing of Docker's files, directories, and sockets. 

Using Alpine's package manager, add it.

`$ apk add audit && apk update`

Now, it's time to add the `audit.rules`

`$ vim /etc/audit/audit.rules`

It will be a blank file, so go ahead and add the following. 

![audit_rules](https://media.github.azc.ext.hp.com/user/7987/files/6df75c80-4f01-11e9-8049-62bb2a6039f8)

-w := Tells Audit to watch the specified file or directory

-p wa := Tells Audit to log or write any changes to those files 

You can, of course, add more if you wish.

Next, let's add openrc to our playground to restart the system.

`$ apk add openrc --update`

Restart the system so that the audit is in place 

`$ rc audit restart`

Should do the trick. Don't worry if it says `service not found,` this is due to the nature of the environment. 
Run Docker-Bench again.

`$ bash DockerBash.sh` 

Now, we see that the addition of the auditing tool has handled those warning messages. 

![audit_pass](https://media.github.azc.ext.hp.com/user/7987/files/6df75c80-4f01-11e9-9d4e-c8e184a985dc)

Let's handle the next section of errors **[WARN]** 2.1, 2.4, 2.8, 2.11-.12, 2.14-.15, 2.17-.18

![Docker_daemon](https://media.github.azc.ext.hp.com/user/7987/files/6fc12000-4f01-11e9-8b34-694e213ed7a8)


Open the `daemon.json`

`$ vim /etc/Docker/daemon.json`

![Docker_daemon_before](https://media.github.azc.ext.hp.com/user/7987/files/7059b680-4f01-11e9-94c7-d01ccadad7b3)

Add the following to the file.
``` 
// daemon.json
 "icc": false,
 "userns-remap": "default",
 "log-driver": "syslog",
 "disable-legacy-registry": true,
 "live-restore": true,
 "userland-proxy": false,
 "no-new-privileges": true
```
Exit and save the file. 
Notice that each phrase addresses one of the **[WARN]** from the previous run of `DockerBench.sh`. 
The workflow is to Google or to look at the docs for each of the **[WARN]** messages, and then add the configuration. 

Set the log-driver to move the logs to a centralized 'syslog' server; this moves the records from Docker host and away from attackers who could alter them to hide tampering or delete them altogether.

 It is also possible to forward the logs by adding the following 
`"log-opts": { "syslog-address": "udp://198.54.100.33:452}` <-- not real.

Use your syslog server address.

Go ahead and restart Docker.

`$ rc Docker restart` 

Again, it may say `service not found`, 
but now run the `DockerBench.sh` script to see the changes.

`$ bash DockerBench.sh`

Now for the last easy to fix **[WARN]**.

To enable Content Trust. 

![container_image_and_build](https://media.github.azc.ext.hp.com/user/7987/files/6f288980-4f01-11e9-8cf0-55062048a036)

`$ export DOCKER_CONTENT_TRUST=1`

Run the `DockerBench.sh` script to see that the **[WARN]** is gone. 

![Docker_content_trust](https://media.github.azc.ext.hp.com/user/7987/files/6fc12000-4f01-11e9-98b7-8106c2125534)

#### CONCLUSION
By using Docker Bench for Security script, we have audited the security of the Docker Installation in this practice environment. Now, you should do the same for the host OS running your Docker containers. Notice, you do not need to achieve 100% because it may be impossible to or you have a good reason for why you do not have it configured that way. That's okay, handle what you can. 


## II. User Docker Bench Security for Container Hardening 

Now, let’s take a look at Container Hardening, which in the runtime of the Docker containers in the host OS.  To follow along with the next part, all have Docker CE installed on your machine. Your OS should work fine. Go ahead and open up your preferred terminal/command line of choice. For this demo, it will be git bash. 

Pull a verified published image from Docker Hub.

`$ Docker pull django:latest`

Run the image. 

`Docker container run --detach -ti --name django_test django:latest`

Check that it is running.

`Docker ps `

Now, run Docker Bench for Security.
```
$ winpty Docker run -it --net host --pid host --userns host --cap-add audit_control \
 -e DOCKER_CONTENT_TRUST=$DOCKER_CONTENT_TRUST \
 -v "//var/lib":/var/lib \
 -v "//var/run/Docker.sock":/var/run/Docker.sock \
 -v "//usr/lib/systemd":/usr/lib/systemd \
 -v "//etc":/etc --label Docker_bench_security \
 Docker/Docker-bench-security

``` 

Results, 

![container_hardening_before](https://media.github.azc.ext.hp.com/user/7987/files/6f288980-4f01-11e9-92bf-9ce7c28c5e66)

Let's stop the container and then address the issues.
First, get the container id.

`Docker ps`

`Docker stop ${your-container-id}`

From the results above, we see that many of the problems with our running container are from the way the running command is issued. 

Note each **[WARN]** is a flag to be set when issuing the command.

So, with that in mind, let's run the new Docker run command for our test container, after doing some Googling and checking of the Docker docs for the proper flags.

```
Docker container run --detach -ti -u 1000 --read-only -m 256mb --security-opt=no-new-privileges --security-opt apparmor=Docker-default --cpu-shares=500 --pids-limit=1 --restart on-failure:5 --name django_test_cont_2 django:latest 
```

Results,

![container_hardening_after](https://media.github.azc.ext.hp.com/user/7987/files/6e8ff300-4f01-11e9-842c-549102027f93)


 
 It is not often the case in production environments that `Docker container run ...` is issued like it is above. Most, likely there is the use of a `Docker-compose.yaml.` If that is the case, then rather than running one long `Docker container run` command, toggle the `flags`  in the `Docker-compose.yaml.` file. 
 
 Similar to this code snippet.


```
// Docker-compose.yaml
version: '3'
services:
 redis:
 image: redis:alpine
 deploy:
 resources:
 limits:
 cpus: '0.50'
 memory: 50M
 reservations:
 cpus: '0.25'
 memory: 20M
```

#### CONCLUSION 
Docker Bench for Security is a great security tool because it is free, made by the creators of Docker, and is maintained. 

To view the official benchmarks that the tests test against, then visit [Docker CIS Benchmark](https://www.google.com/search?client=firefox-b-1-d&q=CIS+Docker+bench+mark). 

The next step for using this tool in your workflow may be to add Docker Bench for Security as a part of your Jenkins pipeline. For inspiration, check out this article [Continous Security Integration with Jenkins and Docker Bench](https://sandrocirulli.net/continuous-security-with-jenkins-and-Docker-bench/).




