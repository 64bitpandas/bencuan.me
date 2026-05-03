---
title: 'TurtleNet: Behind the Scenes'
datePublished: 2026-05-02
pageSlug: 'behind-the-scenes'
order: 9.5
cover: '/img/turtlenet/og-image.png'
---

## Pre-history

![](/img/turtlenet/bts-20251223164331.png)

My experience with homelabs, like so many others, began with Minecraft.

In the beginning of high school, my friends and I really wanted to make a server of our own. We'd been using [Aternos](https://aternos.org/) through middle school, but it was fairly limited and unreliable, so I decided to turn my PC into one. It looked something like this:

![](/img/turtlenet/bts-20251223164502.png)

Unfortunately, my desktop was really underpowered. It was hobbling along on a $25 Intel Celeron CPU and crashed fairly often. "You should try linux!" seemed to be the prevailing advice on the various forums online. So I ended up installing [Elementary OS](https://elementary.io/) and falling into a very, very deep rabbit hole. Little did I know at the time, but this would eventually turn into my career today!

Throughout the rest of high school, I played around with my desktop setup a lot. It doubled as a server on-and-off, whenever there was a game-server-related need for it. Most of my earlier days messing with computer systems involved [[dotfiles]] and otherwise making my desktop interface prettier/more functional; the server aspect of it was mostly an afterthought.

My very first real "server" ran on an [Intel Celeron G1840](https://www.intel.com/content/www/us/en/products/sku/80800/intel-celeron-processor-g1840-2m-cache-2-80-ghz/specifications.html) and an NVIDIA GTX 650Ti graphics card, with 8GB of RAM and a 256GB Samsung SSD. It was kind of loud (and also in my bedroom), so it only ran when needed and I turned it off at night. If I was away and needed to mess with it, I triggered a [wake-on-LAN](https://en.wikipedia.org/wiki/Wake-on-LAN) signal routed through some clever and/or cursed port-forwarding (which only worked 50% of the time), and ran a Windows Remote Desktop connection into it.

## Season One

After I joined the the [Open Computing Facility](https://garden.bencuan.me/community/The-Open-Computing-Facility) and had the opportunity to mess with real rack-mount servers hosting real services that people actually used, I felt inspired to build a more respectable self-hosting setup of my own.

At the time I had just built a new computer (with a Ryxen 7 3700x, 64GB of RAM and a GTX 1080)-- but realized that:

1. I was rarely around to use it.
2. I often had a need for the compute power on-the-go (for school projects, extra cloud storage, etc.)

I made the decision to retire my computer as a desktop, wiped the drive, and installed Proxmox.

As of 2023, a ~year after starting the conversion, this is what my server architecture looked like:
![](/img/turtlenet/bts-20250604002125.png)

After [notes.bencuan.me](https://notes.bencuan.me) started taking off at the end of 2022 I realized that people would also really appreciate hearing about TurtleNet! So I decided to write some notes about it and published it on [Hashnode](https://hashnode.com/) (this version is now available as [TurtleNet V1](/turtlenet/v1)). TurtleNet was the second major piece of writing I've ever created; To this day I still run into folks who tell me how much it's helped them create their own homelabs 🥺

### aside: why is it called TurtleNet?

1. I like turtles.
2. I now name all of my physical machines after animals.
3. I made an extremely cringe [webtoon](https://www.webtoons.com/en/canvas/powershell/list?title_no=270344&page=2) as an unreasonably high-effort method of realizing that turtles have shells, and so does your computer.

## Season Two

After I finished writing the TurtleNet series [Eric](https://enumc.com/) and I joined forces to build a single, more powerful, colocated server to share compute resources. He had a lot of complimentary homelabbing knowledge and opinions to mine, and filled in a lot of the gaps for some of the more lacking aspects like networking and NAS implementations. This iteration eventually solidified into TurtleNet Season Two, with an architecture that is represented roughly by this updated diagram:

![](/img/turtlenet/turtlenet-arch-2026-04.png)

TurtleNet in its current form is a properly respectable homelab system: now with double the RAM, over 6x the raw storage, and an enterprise-grade networking system. We also migrated the gaming server to its own dedicated PC to spec it out more appropriately for the use case (i.e. emphasizing CPU/GPU resources over memory/disk).

The present iteration of the series focuses on the lessons we learned while building this new system and a few ways the standards have changed over the last three years since I wrote the original.

## Future Directions

Now that I maintain servers as a full-time job, it's pretty tough for me to find the time and energy outside of work to continue building out my personal homelab. As such, I don't anticipate any major updates to TurtleNet in the coming future (assuming things continue running with minimal effort as they have for the past year or so).

I'd like to write about real production servers at some point, now that I have experience running them at scale! Since there are already plenty of great resources about this topic online, I still need to let this thought stew a bit so I can find the missing pieces I'm most able to contribute to meaningfully. This will likely look like a more formal extension of my current [ML Systems Engineering Syllabus](https://garden.bencuan.me/ml-systems/ML-Systems-Engineering-Syllabus).
