---
title: How to use Kubebench to Add Security to a Kops Provisioned Kubernetes Cluster 
date: 2020-03-02
description: Use Kubebench to help configure a secure Kubernetes cluster
tags: ['security']
---

Kops is a popular opensource tool that makes it easier to provision and deploy Kubernetes clusters in Cloud Service Providers. 

However, the default provisioning may not adhere to the best practices as outlined by Kube-bench for Security, and kops probably cannot achieve a one-size-fits-all security solution as each user's use of kops may vary. 

Yet, one should be aware of what default security choices kops makes on behalf of the user, which are generally well, thanks, kops team! 

More importantly, the user should know how to configure the Security to their needs. In this article, I'll show you how to run Kube-bench against a kops provisioned cluster and how to change the cluster spec to add additional Security to the provisioned k8s cluster.

### Table of Contents 

- [How to add security to a kops provisioned Kubernetes cluster in AWS](#how-to-add-security-to-a-kops-provisioned-kubernetes-cluster-in-aws)
 - [Table of Contents](#table-of-contents)
 - [Prerequisites](#prerequisites)
 - [Kube-bench](#kube-bench)
 - [Environment setup](#environment-setup)
 - [Master node check](#master-node-check)
 - [Worker node check](#worker-node-check)
 - [Workflow: How to address the security concerns](#workflow-how-to-address-the-security-concerns)
 - [Implementation: Addressing the security concerns by editing the cluster spec](#implementation-addressing-the-security-concerns-by-editing-the-cluster-spec)
 - [Addressing master node security concerns 1.1.5, 1.1.6, and 1.10-1.1.12](#addressing-master-node-security-concerns-115-116-and-110-1112)
 - [Addressing worker node security concerns 2.1.1, 2.1.3, and 2.1.5](#addressing-worker-node-security-concerns-211-213-and-215)


### Prerequisites

**It is essential to have a provisioned kops cluster in AWS**. If you do not, then [here](https://pattern-match.com/blog/2019/01/30/k8s-tutorial-part01-setup-on-aws/) is an article to help if you do not already have one.

Other tools:
- kubectl v1.14.0
- kops v1.11.0
- AWS CLI v1.16.119 

### Kube-bench 

[Kube-bench](https://github.com/aquasecurity/kube-bench) is an open-source tool built by the Aquasec team. It is a tool that automates the checklist of the [CIS benchmark](https://www.cisecurity.org/benchmark/kubernetes/) for Kubernetes. 

A group of security professionals made the CIS benchmark, people like Rory McCune, who have successfully hacked Kubernetes clusters and decided to share, for free, what people/organizations should do not to be hacked.

Rory has a few [concerns](https://github.com/kubernetes/kops/issues/6150#issuecomment-470012636) about the default settings on Kubernetes clusters provisioned by kops. Specifically, the Ensure `--insecure-bind-address argument is not set` and `--kubelet-https argument is set to true.`

Rory has also presented these concerns and many more in his security talk [A Hacker's Guide to Kubernetes and the Cloud](https://www.youtube.com/watch?v=dxKpCO2dAy8). 

For this tutorial, we are going to address the ones above that he mentioned so that we can get familiar with the process of customizing the default cluster spec that provisions your cluster(s).


#### Environment setup 

Export the bucket name so the **kops tool** can use it. 
```
$ export KOPS_STATE_STORE=s3://prefix-kubebench-demo-state-store
```



Set the Name variable.
```
export NAME=k8s-cluster.example.com
```


Get the config to see what k8s version has been installed 
```
$ kops get --name $NAME -o yaml > config_test.yaml
```


Check the Kubernetes version.
```
$ cat config_test.yaml
```



The Kubernetes version is essential when mounting the Kube-bench tool to check the configuration of the deployed Kubernetes cluster.

In general, try to match the `--version` with a `major.minor version` that is equal to or less than the Kubernetes version of your cluster.

So, mine was 1.11; therefore, I used the 1.11 version of Kube-bench. 

#### Master node check
To check the master node, run the following command in your terminal with the appropriate `--version 1.XX` to match your Kubernetes version.

```
$ kubectl run --rm -i -t kube-bench-master --image=aquasec/kube-bench:latest --restart=Never --overrides="{ \"apiVersion\": \"v1\", \"spec\": { \"hostPID\": true, \"nodeSelector\": { \"kubernetes.io/role\": \"master\" }, \"tolerations\": [ { \"key\": \"node-role.kubernetes.io/master\", \"operator\": \"Exists\", \"effect\": \"NoSchedule\" } ] } }" -- master --version 1.11
```


Output:
```
[INFO] 1 Master Node Security Configuration
[INFO] 1.1 API Server
[PASS] 1.1.1 Ensure that the --anonymous-auth argument is set to false (Scored)
[FAIL] 1.1.2 Ensure that the --basic-auth-file argument is not set (Scored)
[PASS] 1.1.3 Ensure that the --insecure-allow-any-token argument is not set (Scored)
[PASS] 1.1.4 Ensure that the --kubelet-https argument is set to true (Scored)
[FAIL] 1.1.5 Ensure that the --insecure-bind-address argument is not set (Scored)
[FAIL] 1.1.6 Ensure that the --insecure-port argument is set to 0 (Scored)
[PASS] 1.1.7 Ensure that the --secure-port argument is not set to 0 (Scored)
[FAIL] 1.1.8 Ensure that the --profiling argument is set to false (Scored)
[FAIL] 1.1.9 Ensure that the --repair-malformed-updates argument is set to false (Scored)
[PASS] 1.1.10 Ensure that the admission control plugin AlwaysAdmit is not set (Scored)
[FAIL] 1.1.11 Ensure that the admission control plugin AlwaysPullImages is set (Scored)
[FAIL] 1.1.12 Ensure that the admission control plugin DenyEscalatingExec is set (Scored)
[FAIL] 1.1.13 Ensure that the admission control plugin SecurityContextDeny is set (Scored)
[PASS] 1.1.14 Ensure that the admission control plugin NamespaceLifecycle is set (Scored)
... 

Remediations

1.4.1 Run the below command (based on the file location on your system) on the master node.
For example,
chmod 644 /etc/kubernetes/manifests/kube-apiserver.yaml
... 

== Summary ==
20 checks PASS
44 checks FAIL
24 checks WARN
0 checks INFO
pod "kube-bench-master" deleted
```

#### Worker node check
To check the worker node, run the following command in your terminal with the appropriate `--version 1.XX` to match your Kubernetes version.

```
kubectl run --rm -i -t kube-bench-node --image=aquasec/kube-bench:latest --restart=Never --overrides="{ \"apiVersion\": \"v1\", \"spec\": { \"hostPID\": true } }" -- node --version 1.11
```

Output
```
[INFO] 2 Worker Node Security Configuration
[INFO] 2.1 Kubelet
[FAIL] 2.1.1 Ensure that the --allow-privileged argument is set to false (Scored)
[PASS] 2.1.2 Ensure that the --anonymous-auth argument is set to false (Scored)
[FAIL] 2.1.3 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Scored)
[PASS] 2.1.4 Ensure that the --client-ca-file argument is set as appropriate (Scored)
[FAIL] 2.1.5 Ensure that the --read-only-port argument is set to 0 (Scored)
[FAIL] 2.1.6 Ensure that the --streaming-connection-idle-timeout argument is not set to 0 (Scored)
[FAIL] 2.1.7 Ensure that the --protect-kernel-defaults argument is set to true (Scored)
[PASS] 2.1.8 Ensure that the --make-iptables-util-chains argument is set to true (Scored)
[FAIL] 2.1.9 Ensure that the --hostname-override argument is not set (Scored)
[FAIL] 2.1.10 Ensure that the --event-qps argument is set to 0 (Scored)
[FAIL] 2.1.11 Ensure that the --tls-cert-file and --tls-private-key-file arguments are set as appropriate (Scored)
[PASS] 2.1.12 Ensure that the --cadvisor-port argument is set to 0 (Scored)
[FAIL] 2.1.13 Ensure that the --rotate-certificates argument is not set to false (Scored)
[FAIL] 2.1.14 Ensure that the RotateKubeletServerCertificate argument is set to true (Scored)
[WARN] 2.1.15 Ensure that the Kubelet only makes use of Strong Cryptographic Ciphers (Not Scored)
[INFO] 2.2 Configuration Files
[FAIL] 2.2.1 Ensure that the kubelet.conf file permissions are set to 644 or more restrictive (Scored)
[FAIL] 2.2.2 Ensure that the kubelet.conf file ownership is set to root:root (Scored)
[FAIL] 2.2.3 Ensure that the kubelet service file permissions are set to 644 or more restrictive (Scored)
[FAIL] 2.2.4 Ensure that the kubelet service file ownership is set to root:root (Scored)
[FAIL] 2.2.5 Ensure that the proxy kubeconfig file permissions are set to 644 or more restrictive (Scored)
[FAIL] 2.2.6 Ensure that the proxy kubeconfig file ownership is set to root:root (Scored)
[WARN] 2.2.7 Ensure that the certificate authorities file permissions are set to 644 or more restrictive (Scored)
[WARN] 2.2.8 Ensure that the client certificate authorities file ownership is set to root:root (Scored)
[FAIL] 2.2.9 Ensure that the kubelet configuration file ownership is set to root:root (Scored)
[FAIL] 2.2.10 Ensure that the kubelet configuration file has permissions set to 644 or more restrictive (Scored)
...
== Remediations ==
2.1.1 Edit the kubelet service file /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
on each worker node and set the below parameter in KUBELET_SYSTEM_PODS_ARGS variable.
--allow-privileged=false

...

== Summary ==
4 checks PASS
18 checks FAIL
3 checks WARN
0 checks INFO
pod "kube-bench-node" deleted

```

### How to address the security concerns 
As we can see from the Kube-bench report above the default version of kops does not provide the flags as mentioned above ([Ensure `--insecure-bind-address argument is not set` and `--kubelet-https argument is set to true` ](https://github.com/kubernetes/kops/issues/6150#issuecomment-470012636)) with the proper security defaults at this point.

I'm sure the team has sound reasons for not doing so as they have kept in mind some of the others and do set them to the secure default settings as outlined by the CIS benchmark. 

Thankfully, Kube-bench outputs the report with remediations, which may be confusing as it assumes you are not using anything else but kubectl to provision.

However, the remediations do point to the correct GO struct that kops uses to create the cluster via the cluster spec ('[INFO] 1.1 **API Server**'). 

So, to address the security concerns, it is necessary is to change the way that the cluster provisioned within the cluster spec file that kops uses, and that will require looking at the GO docs for kops. 

By checking the GO docs, there are specific fields in the [KubeAPIServerConfig](https://godoc.org/k8s.io/kops/pkg/apis/kops#KubeAPIServerConfig), that correspond to the output of the report--'[FAIL] 1.1.11 Ensure that the **admission control** plugin AlwaysPullImages is set', like the field `--AdmissionControl`.

**[WARNING]**
Important to note that there is a chance that there will **not** be a corresponding field in the kop's structure that is available for setting to address the Kube-bench security concerns. 

If this happens then, the best bet is to clone kops and add the desired field to the GO struct and then make a PR to the kops team like has been done [here](https://github.com/kubernetes/kops/pull/4799).

...

### Implementation: Addressing security concerns by editing the cluster spec.

Let's begin to change the cluster spec file to repair the security issues of the master node and the worker node. 

#### Addressing master node security concerns 1.1.5, 1.1.6, and 1.10-1.1.12

 It is necessary to add a key to access the nodes via SSH.

```
$./kops create secret sshpublickey admin -i ~/.ssh/id_rsa.pub --name k8s-cluster.example.com --state s3://kubebench-state-store
```


Now, set the default editor to your preference.
```
$ export EDITOR=vim
```


Thankfully, kops has an auto checker in place whenever you edit the cluster spec file.

```
$ kops edit cluster ${NAME}
```


Add a line, close and save the file, and if the added line is improper, then it will complain. 

So, repeat the process as you add the following lines below or add them all at once, it is up to you. 

```
// Additions to cluster spec file (do not copy this comment)
 kubeAPIServer:
 admissionControl:
 - Initializers
 - SecurityContextDeny
 - NamespaceLifecycle
 - AlwaysPullImages
 - DenyEscalatingExec
 insecureBindAddress: 0.0.0.0/0
 insecurePort: 1
```


#### Addressing worker node security concerns 2.1.1, 2.1.3, and 2.1.5
To address the worker node security concerns do the same and use the following section of the godocs for [kops](https://godoc.org/k8s.io/kops/pkg/apis/kops#KubeletConfigSpec) to address the kubelet concerns. 

So, look for the field that corresponds to the problem in the godocs and the [kubernetes documentation](https://kubernetes.io/docs/reference/access-authn-authz/authorization/) for the options. 

```
$ kops edit cluster ${NAME}
```


```
// Additions to cluster spec file (do not copy this comment)
 kubelet:
 anonymousAuth: false
 allowPrivileged: false 
 authorizationMode: RBAC
 ReadOnlyPort: 0 
```

Now, update the cluster for the changes to take effect.

```
$ kops update ${NAME} --yes
```

It will probably say you will need to do a rolling cluster update.

```
$ kops rolling-update ${NAME} --yes
```


Run kube-bench again.

Master Node Results after changing the cluster spec.
```
[INFO] 1 Master Node Security Configuration
[INFO] 1.1 API Server
[PASS] 1.1.1 Ensure that the --anonymous-auth argument is set to false (Scored)
[FAIL] 1.1.2 Ensure that the --basic-auth-file argument is not set (Scored)
[PASS] 1.1.3 Ensure that the --insecure-allow-any-token argument is not set (Scored)
[PASS] 1.1.4 Ensure that the --kubelet-https argument is set to true (Scored)
[PASS] 1.1.5 Ensure that the --insecure-bind-address argument is not set (Scored)
[PASS] 1.1.6 Ensure that the --insecure-port argument is set to 0 (Scored)
[PASS] 1.1.7 Ensure that the --secure-port argument is not set to 0 (Scored)
[FAIL] 1.1.8 Ensure that the --profiling argument is set to false (Scored)
[FAIL] 1.1.9 Ensure that the --repair-malformed-updates argument is set to false (Scored)
[PASS] 1.1.10 Ensure that the admission control plugin AlwaysAdmit is not set (Scored)
[PASS] 1.1.11 Ensure that the admission control plugin AlwaysPullImages is set (Scored)
[PASS] 1.1.12 Ensure that the admission control plugin DenyEscalatingExec is set (Scored)
[PASS] 1.1.13 Ensure that the admission control plugin SecurityContextDeny is set (Scored)
[PASS] 1.1.14 Ensure that the admission control plugin NamespaceLifecycle is set (Scored)
...

```

Results for the worker node.
```
[INFO] 2 Worker Node Security Configuration
[INFO] 2.1 Kubelet
[PASS] 2.1.1 Ensure that the --allow-privileged argument is set to false (Scored)
[PASS] 2.1.2 Ensure that the --anonymous-auth argument is set to false (Scored)
[PASS] 2.1.3 Ensure that the --authorization-mode argument is not set to AlwaysAllow (Scored)
[FAIL] 2.1.4 Ensure that the --client-ca-file argument is set as appropriate (Scored)
[PASS] 2.1.5 Ensure that the --read-only-port argument is set to 0 (Scored)
....
```

As we can see, we have successfully addressed some of the security concerns outlined by both a security professional and the CIS benchmark for kops default provisioned Kubernetes cluster.

However, your production environments may vary, and it may not be possible to address every concern; some might not be a concern for you. 

Hence, the best thing to do is to sit down and go through the report and seek to fix the ones that will add security value for your situation. 

