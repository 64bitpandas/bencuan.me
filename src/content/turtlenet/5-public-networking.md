---
title: "TurtleNet 5: Public Networking"
datePublished: 2023-06-10
pageSlug: "5-public-networking"
cover: "/img/turtlenet/5-public-networking-cover-27.png"
order: 5
---

## Introduction

At this point in the series, you should have a fully functioning set of services available at your command and some knowledge on how to extend this framework to host whatever you want! That's pretty much all you need for the most basic homelab setup.

For the rest of this series, I'll discuss a few *almost-but-not-quite-mandatory* steps to really build out your system and ensure its durability. Unlike the previous parts which were incremental, each of the following parts may be done independently, in any order, or not at all. For example, if you don't want to expose your setup to the public whatsoever but still want to set up a NAS and backup system, feel free to skip to the next part.

With that said, let's suppose you *do* want to host something and make it available to others, whether that would be a game server, chat service like Matrix, or some personal projects you're hosting. Simply exposing your home network to the Internet via port forwarding is definitely an option, but is ill-advised from a security standpoint (everyone will now know your IP address and can send attacks directly to you!).

## Setting up an Ingress

As an alternative to port-forwarding, let's take advantage of Zerotier alongside the millions of hours of engineering time cloud computing companies pour into hardening their security to set up an off-premise ingress. This has many benefits:

* Public Internet users will never directly connect to your homelab: all requests will be handled via the ingress.
    
* Cloud providers likely have much more robust network security and monitoring compared to your home network, so you can ensure nothing nefarious is happening without advanced security knowledge of your own.
    
* You can monitor your entire server from another device that's also always on- for instance, I run Uptime Kuma on my ingress to send an email whenever it detects that my server is down.
    
* Most cloud providers have a free tier that's more than enough to run a simple webserver/reverse proxy, so all of this can be done at no cost!
    

Of course, you should be the one to decide how you want to set up public access- there's nothing stopping you from doing something else, like hosting a VPN to share with friends, or just going ahead with portforwarding.

### Provider Options

If you want a free server, here's a list of some providers and what they offer:

* [Google Cloud E2-micro](https://cloud.google.com/free/docs/free-cloud-features#free-tier-usage-limits): 2 vCPUs, 1GB memory, 30GB storage
    
* [Oracle Cloud](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm): Choice between E2.Micro (1 vCPU, 1GB memory, 200GB storage) or ARM Ampere (4 vCPU, 24GB memory, 200GB storage) - more details [here](https://levelup.gitconnected.com/a-powerful-server-from-oracle-cloud-always-free-cbc73d9fbfee)
    
* Some more providers can be found in [this list](https://github.com/cloudcommunity/Cloud-Free-Tier-Comparison), which may not be always free
    

I personally use an Oracle Cloud E2.micro instance. If you also choose to do so, [here's a guide on how to expose port 80](https://stackoverflow.com/questions/54794217/opening-port-80-on-oracle-cloud-infrastructure-compute-node) (repeat for 443 as well).

### Software Setup

Regardless of the provider you choose, you're ultimately just getting another VM to play with, so your usual setup procedure will apply: install packages, join your ZeroTier network, and get stuff running. [Here's my setup script](https://github.com/64bitpandas/TurtleNetPublic/blob/main/setup/ubuntu-setup.sh) if you need some inspiration and are getting tired of copying the same commands over and over again for each VM!

Mainly, you'll want to have a reverse proxy up and running so you can redirect traffic directed towards your ingress into the rest of your network. Here's how it'll go:

1. Get a reverse proxy. While I use Traefik for my internal services, I went with Caddy for my external services since I only have a few proxied sites, and all of them are hosted on a server other than my ingress.
    
2. For each domain you're hosting, create a DNS record pointing to the **public IP** of your ingress (not your Zerotier IP)! You should be able to find this on the web dashboard for your provider.
    
3. Reverse proxy each domain to its desired route on ZeroTier. For example, [here's my Caddyfile](https://github.com/64bitpandas/TurtleNetPublic/blob/main/docker/caddy/data/Caddyfile) that maps domains to ports on my other server.
    

And that's pretty much it!

## Some Extra Stuff

### Load Balancing

If you're expecting a lot of traffic to your services, you can set up load balancing to serve more people at once! [Here's an example for Caddy.](https://caddy.community/t/v2-load-balancer-example-with-caddyfile/6903)

Load balancing takes requests and forwards them to *multiple* destinations, which are all probably hosting the same service! For example, if you have two servers each running a copy of your website under Round Robin balancing, your reverse proxy will alternate between forwarding requests to each of those two servers.

### A note on VPNs

Since you have ZeroTier, hosting a VPN is usually not necessary- you have full access to everything on your home network at all times already.

However, if friends or family need access to your internal network and you don't want to go through the hassle of setting up ZeroTier for them or proxying a public domain, it could be a good choice to set one up on your ingress.

Any self-hosted VPN solution should do; [OpenVPN](https://openvpn.net/) is the industry standard if you need some place to get started.

### A note on HTTPS

Both Caddy and Traefik automatically provision TLS certificates via LetsEncrypt as long as you follow the setup instructions accordingly ([Caddy](https://caddyserver.com/docs/automatic-https), [Traefik](https://doc.traefik.io/traefik/https/acme/)). Getting this set up is especially important for public services, both for usability (so your users don't get big red errors in their browsers) and security (so you aren't communicating everything through an insecure protocol) so don't skip out on it!

HTTPS should work even for internal domains not exposed to the network if you use the [DNS-01 ACME challenge](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge) which the Caddy/Traefik setups walk you through. This works because it involves putting a TXT record in your DNS records to prove you own the domain, without needing to ping your main server at all.
