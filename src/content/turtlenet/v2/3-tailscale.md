---
title: 'TurtleNet 3: Tailscale and Private Networking'
datePublished: 2023-04-09
pageSlug: '3-tailscale'
cover: '/img/turtlenet/og-image.png'
order: 3
---

Before we can properly offer services on our VMs, we'll need to make sure they are accessible over the Internet!

However, simply exposing the entire server to the Internet (via portforwarding or otherwise) is extremely dangerous, since it allows anyone from anywhere in the world to connect to your private services, like the Proxmox console. Even with proper security measures and strong passwords, it's impossible to guarantee that malicious actors won't be able to find an exploit and steal your private information!

As a solution, let's be careful to separate network access to **public services,** which anyone can interact with, and **private services**, which only you and authorized users can access.

In this section, we'll set up our private network.

## Connecting to the Internet

I assume that if you're reading this guide, you already have a home internet setup. Let's dig in a bit to understand what's actually going on behind the scenes!

### Internet Service Providers (ISPs)

Unless you own an IP block (and if so, you probably already know everything in this guide anyways...) you likely pay an external provider like AT&T or Xfinity for access to the Internet. Your ISP is responsible for the physical infrastructure connecting you to to the public Internet.

![tiers of internet networks](/img/turtlenet/isp-tiers.png)
(source: [Wikipedia](https://en.wikipedia.org/wiki/Tier_1_network))

Your ISP has peering connections with other higher-tier ISP's around the world, so they broker cross-network communications on your behalf. All you see on your end is that you send them a request (like "connect me to `google.com`"), and they'll figure out how to find Google's servers for you. The rules are [quite a bit more complicated than that](https://people.eecs.berkeley.edu/~sylvia/cs268-2019/papers/gao-rexford.pdf) (you can do research on BGP and Gao-Rexford Rules if you're curious), so it's nice that you don't have to think about it that hard.

### Your Router

When you first set up your internet, most modern ISP's will assign a technician to activate your connection for you. Sometimes, they'll also come in-person to do some wiring work. The end result is that you'll have a live Ethernet connection to the outside world somewhere in your house.

You'll then commonly plug a _router_ into that Ethernet port, which acts as a small computer that creates a private network for you. The router often also hosts a WiFi network, and has a built-in switch, to enable many devices to connect all at once. They come in all shapes and sizes, most frequently in some form like the one below:

![a stock photo of a router](/img/turtlenet/tplink-router.png)

Notably, there are now **two parallel "IP spaces" that your devices address to!**

On your personal computer, you can see your private network by typing in the command `ifconfig | grep -w inet` into your terminal (or, `ipconfig` on Windows). You should see a localhost like `127.0.0.1`, followed by your private network IP, usually starting with `192.168`, `10.0`, or `100.`.

![ifconfig showing two private networks](/img/turtlenet/ifconfig-1.png)

Then, if you go to [whatismyipaddress.com](https://whatismyipaddress.com/) or a similar website, you can see your _public IP address_. Notably, your public IP address should be the same across different devices on your same network.

### Networking Switches

If you run out of ports on your router to plug things into, you'll probably want to buy a switch. They look something like this:

![tplink switch](/img/turtlenet/tplink-switch.png)

Typically, switches will allow you to plug in arbitrary Ethernet connections between your various devices. As long as any one of the connections is attached to your main router/ISP, the rest of the attached devices will also have network access.

You'll see the prefix "managed" or "unmanaged" thrown around online. An unmanaged switch isn't configurable (and needs a separate computer/router), whereas a managed switch provides additional options for traffic routing and address assignment. You'll likely be fine with an unmanaged switch for nearly all homelabbing applications, but given that a managed switch isn't that much more expensive, I'd recommend picking one up to tinker with for fun.

### Mesh Networking

If you happen to have a large area you need your network to cover (or just want your wifi connection to be extremely good), you can consider setting up a mesh network, which allows you to attach multiple routers and access points to the same private network.

If you're looking for a starting point, many other homelabbers like using [Ubiquiti](https://ui.com/wifi) for their mesh networking.

## Introducing Tailscale

Without any further configuration, everything is private by default: in order to access the Proxmox web console, you'll need to be on the same network as your server at all times. It's also hard to access VMs from other devices, since they're networked internally within Proxmox itself.

Let's first build up our private access, such that you and others can access server resources even when you're not physically next to the server.

As I explained in Part 1, there are many alternatives to Tailscale that achieve similar things through slightly different protocols, like ZeroTier or Teleport. You are welcome to choose what works best for your use case, but for now I'll use Tailscale as an example of how a private networking setup might look like.

### How does Tailscale actually work?

Tailscale essentially creates a virtual, software-defined network that you can add devices to. Regardless of what physical networks or locations those devices are in, they'll all be connected to the same Tailscale network, allowing them to access one another as if they were in a local access network (LAN) setup.

The technical details of how this is possible without portforwarding is beyond the scope of this guide, but you're welcome to read the [documentation](https://tailscale.com/docs/concepts) and explore [UDP hole punching](https://en.wikipedia.org/wiki/UDP_hole_punching) to learn more and confirm that it's secure for your use cases.

## Tailscale Setup

First, you'll need a Tailscale account, which you can make on the website [here](https://tailscale.com/).

Once you have an account, you can create a network. The setup dialogues should walk you through this process, then suggest you to add your first device.

### Joining the Tailscale Network from an external device

As a warm-up to VM configuration, let's see how the joining process looks like using an external computer or phone.

First, download the correct ZeroTier distribution for your device [here](https://tailscale.com/download). Then, you should be able to authenticate as yourself via a browser prompt and select a hostname to identify your device.

Your device will automatically be registered, connected to the network, and assigned an IP address. For example, on my Mac, it looks something like this:
![tailscale-1](/img/turtlenet/tailscale-1.png)

Now, when you type in your `ifconfig | grep -w inet` command again, you should see three lines instead of two! The last one should be your Tailscale IP.

![ifconfig](/img/turtlenet/ifconfig-2.png)

### Joining the Tailscale Network from your VM

Now, let's do the same thing from with your VM!

The process is pretty similar, only we don't have a GUI anymore. Instead, you can do the following (taken from the [official Linux install guide](https://tailscale.com/docs/install/linux)):

1. Open the Proxmox web console, and navigate to the live console instance for your VM.
2. Run the command `curl -fsSL https://tailscale.com/install.sh | sh` to install the Tailscale command line interface.
3. Run the command `sudo tailscale up`, and follow the instructions to authenticate.
4. The terminal should now signal that the join was successful. You can verify this with `ifconfig`, or with `tailscale status`.
5. You can also verify that Tailscale is working as intended by pinging your VM's hostname from your laptop (since they're now both on the same Tailscale network)! For example, I can type in `ping dino` from my VM if my laptop's host is named `dino`.

### Joining the Tailscale Network from Proxmox

Doing this is exactly the same process as joining Tailscale from your VM, except now you should go through the steps in the _Proxmox shell_ rather than your VM's console. After you assign your Proxmox instance to a domain name, you should now be able to access your Proxmox console using `https://node.domain.tld:8006` in your web browser. For example, my server is named `turtle` and my domain is `bencuan.me`, so I could type `https://turtle.bencuan.me:8006`.

## Domain Configuration

Now that ZeroTier has been configured on both your VM and your regular device, let's make it easier to access!

In Part 2, you should have acquired a domain. If you did not do this and opted to have a local domain instead, skip to "Local Resolution".

Your domain provider should have an option to set DNS records in their web console. If they don't, or you don't trust your provider, you can also link an external provider like Cloudflare, then continue with this process.

In your DNS configuration, let's add a new record corresponding to your VM.

1. Create a new A record. (You can also create an AAAA record if you prefer to use IPv6).
2. For the name, use your VM's hostname (ex. `arabia`).
3. For the IP, enter the ZeroTier IP corresponding to your VM (found in the ZeroTier web console).
4. If using Cloudflare or a similar service, disable the option to proxy the record.
5. Save the new record, and wait a couple minutes for it to propagate.

Now, you should be able to reach your domain using your new record! As an example, I have a VM named `arabia` and my domain is [`bencuan.me`](http://bencuan.me). Thus, if I type in the command `ping` [`arabia.bencuan.me`](http://arabia.bencuan.me) on my laptop, I should be able to reach it and get the following output:

```bash
❯ ping sweden.bencuan.me

Pinging arabia.bencuan.me [172.24.220.210] with 32 bytes of data:
Reply from 172.24.220.210: bytes=32 time=26ms TTL=64
Reply from 172.24.220.210: bytes=32 time=29ms TTL=64
Reply from 172.24.220.210: bytes=32 time=32ms TTL=64
Reply from 172.24.220.210: bytes=32 time=23ms TTL=64

Ping statistics for 172.24.220.210:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),
Approximate round trip times in milli-seconds:
    Minimum = 23ms, Maximum = 32ms, Average = 27ms
```

If you tried to ping [`arabia.bencuan.me`](http://arabia.bencuan.me) right now though, it will most likely result in a timeout since you haven't been added to my ZeroTier network!

### Local Resolution

If you didn't acquire a public domain, you'll still have to use your IP addresses to access your VM's. We'll see how we can set up a custom DNS server to get around this in a future step.

### SSH

Depending on your distribution, SSH may or may not be enabled by default in your VM. If it is, you should now be able to run `ssh vmname.domain.tld` (replacing with your actual VM name and domain, of course) and connect to your VM from your other devices.

If this is not the case, you may need to install it and/or enable it manually. This is how to do so for Ubuntu/Debian-based systems (look up how to do it on your OS of choice if this does not apply):

1. Run `sudo apt install ssh`
2. Run `sudo systemctl enable ssh.service --now`

To save time for future logins, you can set up public key authentication so that you don't have to type in your password every time you SSH into your VM. (This is only available for Linux-based VM's.)

1. On your personal device, run `ssh-keygen` if you haven't done so before.
2. Run `ssh-copy-id <username@vm.domain.tld>` , replacing the part in brackets with your actual VM user and address.
3. Type in your VM's user password once.

### Remote Desktop

If you're using Windows or another OS with a graphical interface, you can access the GUI through Proxmox's default console view. However, you might have noticed that this console can be extremely laggy or unresponsive at times.

If you will need to access your VM graphically for things like gaming or video editing, you should set up some sort of remote desktop service.

- For Windows and Mac VM's, I highly recommend [Parsec](https://parsec.app/)\- it's given the best latency/responsiveness out of all the remote desktop applications I've tried so far.
- For easiest access to Windows VM's, you can alternatively use the built-in [Windows Remote Desktop](https://support.microsoft.com/en-us/windows/how-to-use-remote-desktop-5fe128d5-8fb1-7a23-3b8a-41e636865e8c). A client is automatically installed on all Windows devices, so you don't need to install any additional software to access it. (Note that a Windows Pro VM is required.)
- For Linux VM's, you can use the [VNC](https://en.wikipedia.org/wiki/Virtual_Network_Computing) protocol. There are many clients for this: see [here](https://www.google.com/search?client=firefox-b-1-d&q=vnc+setup+linux) for a guide on how to configure VNC.

## Summary

If you've gotten this far, you should now be able to access your VM from anywhere, but only on your personal devices! This will allow you to access server resources such as the Proxmox console even if you're not connected to the same network as your server.

Next, we'll take advantage of our private ZeroTier network to set up a reverse proxy to access internal services in a convenient manner.
