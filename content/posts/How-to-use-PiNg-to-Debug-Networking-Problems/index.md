---
title: How to use PiNg to Debug Networking Problems
cover: ./how-to-use-ping-to-debug-networking-problems.jpg
date: 2020-02-01
description: The Packet INternet Groper or PING is the first thing to try when you're having network problems
Tags: ['tool', 'networking', 'debugging']
---


## Can't visit to any webpages from your browser?

So you're at home and notice that the internet seems to be out whenever you try to connect to a website on your laptop and have already tried turning the wifi router on and off again all ready.

### Potential Causes

- Local network connection
- Internet Service Provider (ISP)
- Local router

## What to do?

Open a terminal or command prompt if you're on windows and use PiNg to check if **any** website is reachable, `www.google.com` is the typical choice.

```cli
timetosolitude % ping www.google.com

PING www.google.com (172.211.7.123): 56 data bytes
64 bytes from 172.211.7.123: icmp_seq=0 ttl=54 time=15.077 ms
64 bytes from 172.211.7.123: icmp_seq=1 ttl=54 time=18.043 ms
64 bytes from 172.211.7.123: icmp_seq=2 ttl=54 time=19.126 ms
64 bytes from 172.211.7.123: icmp_seq=3 ttl=54 time=19.583 ms
64 bytes from 172.211.7.123: icmp_seq=4 ttl=54 time=22.643 ms
64 bytes from 172.211.7.123: icmp_seq=5 ttl=54 time=17.083 ms
64 bytes from 172.211.7.123: icmp_seq=6 ttl=54 time=16.719 ms
64 bytes from 172.211.7.123: icmp_seq=7 ttl=54 time=22.164 ms
64 bytes from 172.211.7.123: icmp_seq=8 ttl=54 time=19.720 ms
64 bytes from 172.211.7.123: icmp_seq=9 ttl=54 time=18.478 ms
64 bytes from 172.211.7.123: icmp_seq=10 ttl=54 time=15.417 ms
64 bytes from 172.211.7.123: icmp_seq=11 ttl=54 time=16.624 ms
64 bytes from 172.211.7.123: icmp_seq=12 ttl=54 time=18.766 ms
--- www.google.com ping statistics ---
13 packets transmitted, 13 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 15.077/18.434/22.643/2.218 ms
```

If you didn't see something like above then chances are you received one of the following:

## <span style="color:red">Error Messages</span>  and Meaning

##### <span style="color:red">No reply</span> from www.google.com
- The destination routes are available but that there is a problem with the destination itself
    - The server(s) are down at the website you're trying to visit
        - Need to wait for them to be 'alive' again

##### <span style="color:red">www.google.com</span> is unreachable
- Indicates that your host doesn't know how to get to the destination so that means either that the routing information to reach another subnetwork is not available or that the device on the same network is down
    - Either the subnetwork is inaccessible due to IP restriction or the device on the network is down
        - To check if the device is down try using traceroute

##### <span style="color:red">ICMP host unreachable</span> from gateway
- Your host can transmit to the target address via a gateway but the gateway cannot forward the packet properly because a route or gateway is misconfigured at your ISP or geolocation
    - Call your ISP provider and ask them what the deal is

##### <span style="color:red">Request timed out</span>
- The reply took to long from the destination server
    - Probably a firewall blocking traffic from your IP address 
        - Meaning you don't have access to that site





