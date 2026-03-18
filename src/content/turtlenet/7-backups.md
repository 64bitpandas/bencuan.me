---
title: "TurtleNet 7: Backups"
datePublished: 2023-06-15
pageSlug: "turtlenet-7-backups"
cover: "/img/turtlenet/7-backups-cover-36.png"
order: 7
---

## Introduction

You should always keep backups of your important data in the case of catastrophic hardware loss or corruption! Think about this like a good insurance plan: when accidents inevitably happen, you want to be able to recover what you lost with as little hassle as possible.

### The 3-2-1 Rule

There's a well-known rule of thumb that sysadmins usually try to follow

![Source: MSP360](/img/turtlenet/7-backups-35.png)

(Source: MSP360)

As it stands now, let's evaluate how well our homelab stacks up to this rule:

* **3 copies:** This is probably somewhat satisfied if you have a NAS configured with anything more than RAID 0. However, there is only 1 copy of your VM boot data!
    
* **2 locations:** This needs some work.
    
* **1 off-site location:** Hmm... So, not great. In this section, we'll explore some ways we can approach our ideal backup solution, and compare solutions to see which ones will work for your use case.
    

## Git Backups

For small, important, non-sensitive files like configurations, documentation, and custom scripts, using a standard source control solution like Git is a great option to easily back things up to the cloud.

As an example, I keep two monolithic GitHub repositories: one for my [TurtleNet configs](https://github.com/64bitpandas/TurtleNetPublic), and one for my Obsidian vault (basically anything I have ever written in Markdown). Keeping configs on GitHub is especially convenient, since it can be easily pulled onto all VM's.

The main drawbacks of using GitHub or another cloud provider for Git are twofold:

1. Storage limitations: Git is not intended for use with large files (or a large quantity of files). Although Git LFM exists, providers like GitHub often charge you a decent amount for it. Additionally, storing binaries on Git is not ideal.
    
2. Security: You should never store secrets and passwords on any Git repo, even if it's private! This means that you have to be careful with what data you plan on storing in a repo.
    

## Software Solutions

### Syncthing

Syncthing is a peer-to-peer file sync application that allows you to share folders between multiple devices. I personally use Syncthing to ensure all my documents are available and up to date on my laptop, phone, and NAS.

Setting up Syncthing on a device with a GUI is very easy- simply download the latest version [here](https://syncthing.net/downloads/) and follow the [setup instructions](https://docs.syncthing.net/intro/getting-started.html) on each device!

Setting up Syncthing on a VM can be done in the same way as any Docker service. Here's a sample `docker-compose.yml`:

```yml
version: '3'

services:
 syncthing:
    image: linuxserver/syncthing
    container_name: syncthing
    environment:
      - PUID=1000
      - PGID=1000
    volumes:
      # - /syncthing_share_folder1:/data1
      # - /syncthing_share_folder2:/data2
    ports:
      - 8384:8384
      - 22000:22000
      - 21027:21027/udp
    restart: unless-stopped
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      ## HTTP Routers
      - "traefik.http.routers.syncthing-rtr.entrypoints=https"
      - "traefik.http.routers.syncthing-rtr.rule=Host(`sync.t.bencuan.me`)"
      - "traefik.http.routers.syncthing-rtr.tls=true"
      - "traefik.http.routers.syncthing-rtr.service=syncthing-svc"
      - "traefik.http.services.syncthing-svc.loadbalancer.server.port=8384"

networks:
  proxy:
    external: true
```

In order to get it to work properly, you'll need to add the folders you want to share as volumes. These can be named anything on both the host and container ends- just remember to add a folder using its location on the container and not the host.

The web UI is accessible via `server_ip:8384`.

### Duplicati

Duplicati is an open source, self-hosted backup service that can be configured to back up files to another device, your NAS, or even Google Drive.

Here's a sample docker-compose:

```yml
version: "3"
services:
  duplicati:
    image: lscr.io/linuxserver/duplicati:latest
    container_name: duplicati
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=America/Los_Angeles
      - CLI_ARGS= #optional
    volumes:
      - ./config:/config
      # More volumes here
    ports:
      - 8200:8200
    restart: unless-stopped
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.duplicati.entrypoints=http"
      - "traefik.http.routers.duplicati.rule=Host(`duplicati.t.bencuan.me`)"
      - "traefik.http.middlewares.duplicati-https-redirect.redirectscheme.scheme=https"
      - "traefik.http.routers.duplicati.middlewares=duplicati-https-redirect"
      - "traefik.http.routers.duplicati-secure.entrypoints=https"
      - "traefik.http.routers.duplicati-secure.rule=Host(`duplicati.t.bencuan.me`)"
      - "traefik.http.routers.duplicati-secure.tls=true"
      - "traefik.http.routers.duplicati-secure.service=duplicati"
      - "traefik.http.services.duplicati.loadbalancer.server.port=8200"
      - "traefik.docker.network=proxy"

networks:
  proxy:
    external: true
```

Like Syncthing, you'll need to add external folders from the host as volumes (remember, `host_folder:container_folder`). These can be named whatever you want.

### rsync/rclone

If you prefer to keep it CLI-only, rsync and rclone are simple and work great. I don't personally use them, but I'm sure you can find resources online like [this one](https://www.digitalocean.com/community/tutorials/how-to-use-rsync-to-sync-local-and-remote-directories) for your use case.

## Cloud Storage Providers

Unless you physically own multiple servers in multiple locations, cloud storage providers are probably the most convenient way to get off-premise backups of your data. There are plenty of providers, so choose the one that works best for you and your wallet! Here's some information about some alternatives I considered:

### Google Drive

Google Drive actually has [extremely reasonable pricing options](https://one.google.com/about/plans) which start around $5/TB/month. Plus, it's fairly straightforward to send your backups to your Drive via Duplicati or another software solution.

However, there are some drawbacks to consider:

* Google Drive has a hidden 750GB/day upload limit, so an initial backup could take a long time to fully complete.
    
* Upload/download speeds can be somewhat inconsistent- Drive is generally not intended for such heavy usage by a single user.
    
* Say what you want about Google, I personally wouldn't trust them with my sensitive data-- but as long as everything's sufficiently encrypted, it shouldn't be too much of a problem.
    

### [rsync.net](http://rsync.net)

[rsync.net](http://rsync.net) offers cost-effective, simple access to cloud storage. At $15/TB/month with no usage costs, it's definitely pricier than Google Drive but is faster, more secure, and more convenient (you can mount your network drive in the same way you can mount any other NAS).

They also offer a significant education discount upon request, so if you're a student this could be a good option.

### AWS Glacier

At around $1/TB/month, AWS Glacier Deep Archive is probably the cheapest cloud storage around-- that is, until you need to retrieve your data.

According to the [pricing chart](https://aws.amazon.com/s3/pricing), transferring data out of AWS from us-east-1 costs $0.09 per GB- which is a staggering $90/TB! But if you just need to back up a few TB of data and are willing to pay a (pretty reasonable) couple hundred bucks to recover your data in an absolute-emergency scenario, this could be a good solution to have extremely cheap off-premise storage.

### Friends and Family

If you know someone with a NAS, consider asking them to host your backups! You can even build and gift them a NAS in order to gain access to another server offsite. Make sure that you trust them with your personal data, though, since they'll have full hardware access to the drives.
