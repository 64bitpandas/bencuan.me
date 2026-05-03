---
title: 'TurtleNet 4: Reverse Proxying Your First Service'
datePublished: 2023-06-09
pageSlug: 'turtlenet-4-reverse-proxying-your-first-service'
cover: '/img/turtlenet/og-image.png'
order: 4
---

## Introduction

It's taken a little while, but we're finally ready to host our first service in a VM!

This section is very choose-your-own-adventure: I'll give an example of how to set up a service I run (Portainer), as well as the general framework I use to spin up new services. You should then be able to apply this framework to installing any other service of your choice!

If you're planning on running a lot of services on bare VM's, you basically have two options:

1. Make a VM for each service you're offering: this helps keep each service separated in the event of crashes or resource conflicts, but takes up a lot of additional compute resources. Managing a huge amount of VM's is also somewhat time consuming.
2. Run most/all of your services on a single VM: this saves lots of compute power, but you will run into conflicts rather frequently. For instance, if two of your services both use MySQL, they might overwrite each others' database entries if configured improperly!

It's evident that neither of these options are quite ideal. Luckily, there is a solution to this:

### Containerization!!

Essentially, containerization is the process of making very standard, mini-images within one operating system. These images are almost like VM's, but don't need dedicated disk space, memory, or processor cores like a VM does. In addition, due to how standard they are, you can install them on practically any device and they will still work in exactly the same way.

One of the most popular containerization management tools used in the software industry is Docker. Besides providing the containers, Docker also provides lots of other goodies like:

- A standard way of defining and sharing container images through Dockerfiles;
- Rudimentary virtual networking that allows each service to either be isolated or to communicate with one another;
- Reliability and crash recovery (containers can auto-restart on crash).

#### Aside: But what about Kubernetes :k8s:??

If you have heard of the mystical framework that is Kubernetes and want to use it to power your own server, go for it! I will warn you that it gets fairly involved, and is probably extremely overpowered for any hobbyist system- but that being said, part of the fun of homelabbing is playing around with things and learning how to use them!

I wrote an [interactive lab](https://decal.ocf.berkeley.edu/labs/10/) for getting started with Kubernetes if you'd like an intro and some additional resources.

## Docker Setup

### Installation

Docker can be installed by following the [official documentation](https://docs.docker.com/engine/install/). Note that we want to install _Docker Engine_ and not _Docker Desktop_ since we are only interacting with the command line. For example, [here are the Ubuntu installation instructions](https://docs.docker.com/engine/install/ubuntu/).

You may also need to install [Docker Compose](https://docs.docker.com/compose/install/linux/).

To verify that you have both successfully installed, run `docker --version` and `docker-compose --version`.

### Some notes on config management

There are multiple ways of managing and configuring services using Docker Compose. These include:

1. Making one `docker-compose.yml` and listing all of your services in it
2. Making one `docker-compose.yml` for each of your services
3. Creating and managing all configs via Portainer

Each of these options have their own benefits and drawbacks:

1. Starting/stopping your entire service deployment can be done with a single command, but having such a large config file can get unwieldy.
2. Separating each service means some redundant configuration and less convenient management, but is modular and it's easy to work on one service without affecting others.
3. Using Portainer is the most convenient and powerful method, but it's more difficult to share and back up configs.

For my own purposes, I chose Option 2 since I like the organizational aspect of having a folder for each service, and can have a Git repo with all my configs in it. You can see this in action by viewing some of my sample configs [here](https://github.com/64bitpandas/TurtleNetPublic/tree/main/docker).

### Some more setup

Before you begin, it's recommended to to give your user access to Docker commands so you don't have to prepend `sudo` before everything (replace `YOUR_USER` with your username):

```bash
sudo usermod -aG docker YOUR_USER && newgrp docker
```

Now, you should be able to run `docker ps` to list all running containers. If it's successful, you should see an empty list at the moment.

If you instead see something like `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?` then you'll need to start the Docker service:

```plaintext
sudo systemctl enable --now docker
```

## Your First Docker Compose File

Using Docker Compose, all services can be defined in a standard format: the [Compose file](https://docs.docker.com/compose/compose-file/03-compose-file/). To create one, simply make a file named `docker-compose.yml`.

Within this file, we'll mostly be working with the `services` element. For example, here is a simple config for getting Portainer up:

```yaml
version: '3'

services:
  portainer:
    image: portainer/portainer-ce
    container_name: portainer
    restart: unless-stopped
    ports:
	    - "9000:9000"
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./data:/data
```

Let's break this down:

- The first line after `services` is the ID of your service- you can name this whatever you want. You can list multiple services under `services` in the same file, but as discussed above I typically don't do this unless the services rely on each other.
- The `image` is the name of the container image that will be installed. You can look through a repository at [Docker Hub](https://hub.docker.com/), but this could also be the name of a custom image you have compiled locally (more on that later).
- The `restart` option specifies the behavior when the container or server goes down. `unless-stopped` is my personal default: the container will automatically restart itself unless it was manually brought down by a user.
- `ports` exposes ports from the container (right) to the system (left). **Remember the order host:container** (I always get it mixed up)- for example, `8080:80` will expose a service running in the container's port 80 to [`localhost:8080`](http://localhost:8080) on the server it's running on.
- `volumes` exposes files and folders in the container to the host. Again, the order is host:container. The `:ro` at the end specifies that those specific files are read-only.
  - Since I keep a folder handy for each service, I like to expose the service's data to the working directory using `./data:/data`. However, this is only one of many methods of using volumes: see the [official documentation on Volumes](https://docs.docker.com/storage/volumes/) for more info.
  - Every service will have a different set of directories/files to expose so make sure to check the documentation to see what you will need.

Once you've saved your Compose file, you can run the command `docker-compose up -d --force-recreate` to get it running in the background. It might take a minute to pull the image on the first run, but once it's done you should be able to run `docker ps` and see something like this:

```plaintext
CONTAINER ID   IMAGE                    COMMAND        CREATED         STATUS                 PORTS
79ad464d6e7e   portainer/portainer-ce  "/portainer"    6 months ago    Up 12 days             8000/tcp, :::9000->9000/tcp, 9443/tcp
```

Congrats, you now have a running service! If you set up networking from the [previous section](/turtlenet/3-zerotier), you should now be able to navigate to `yourserverdomain.tld:9000` (replacing with your server domain, of course) to access the Portainer dashboard.

## Traefik

We are left with one big problem: although accessing Portainer via `domain.tld:9000` is fine, imagine if you had tens of services- having to remember the port number for each service gets annoying very quickly. Wouldn't it be so much better if we could map it to something like `portainer.domain.tld`?

To solve this problem, we shall invoke the power of a **reverse proxy**!

Essentially, a reverse proxy creates a layer in between your services and the rest of the internet, translating user requests (`portainer.domain.tld`) into something your services can understand ([`localhost:9000`](http://localhost:9000)).

> Side node: The name "reverse proxy" begs the question: what makes it "reverse" of a regular proxy? This stems from the fact that reverse proxies are generally hosted closer to the services (as you'll see soon in our case, exactly the same server as our services) and manage incoming traffic. On the other hand, regular proxies are hosted with the users and manage outgoing traffic from a network.

There are lots of reverse proxy implementations:

- Nginx is industry standard and includes lots of additional features like a load balancer and integrated web server. Its power and flexibility also make it more difficult to configure and maintain, however.
- Apache 2 is another standard reverse proxy and web server implementation; with Nginx, they have been estimated to serve over half the internet. Choosing Apache over Nginx is mostly a personal/design/legacy decision, and for our purposes Apache has many of the same benefits and drawbacks as Nginx.
- Caddy is a more recent addition to the list, and has the simplest configuration I've seen so far. For example, the single line `reverse_proxy portainer.domain.tld {` [`localhost:9000`](http://localhost:9000) `}` in a Caddyfile will do exactly what we want it to! If you just want something that works, I highly recommend Caddy.
- Traefik is the implementation I will go over now. While more complex to set up compared to Caddy, it has a wider range of features and can automatically route Docker containers!

To get started, see [https://doc.traefik.io/traefik/getting-started/quick-start/](https://doc.traefik.io/traefik/getting-started/quick-start/). You can also just copy the Compose file below:

```yaml
version: '3'

services:
  traefik:
    # The official v2 Traefik docker image
    image: traefik:v2.7
    # Enables the web UI and tells Traefik to listen to docker
    command: --api.insecure=true --providers.docker
    ports:
      # The HTTP port
      - '80:80'
      # The HTTPS port
      - '443:443'
      # The Web UI (enabled by --api.insecure=true)
      - '8080:8080'
    volumes:
      # So that Traefik can listen to the Docker events
      - /var/run/docker.sock:/var/run/docker.sock
      # Config
      - /home/turtle/traefik/data/config.yml:/config.yml:ro
      - /home/turtle/traefik/data/traefik.yml:/traefik.yml:ro
      # SSL
      - /home/turtle/traefik/data/acme.json:/acme.json
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.traefik.entrypoints=http'
      - 'traefik.http.routers.traefik.rule=Host(`traefik.t.bencuan.me`)'
      - 'traefik.http.middlewares.traefik-https-redirect.redirectscheme.scheme=https'
      - 'traefik.http.middlewares.sslheader.headers.customrequestheaders.X-Forwarded-Proto=https'
      - 'traefik.http.routers.traefik.middlewares=traefik-https-redirect'
      - 'traefik.http.routers.traefik-secure.entrypoints=https'
      - 'traefik.http.routers.traefik-secure.rule=Host(`traefik.t.bencuan.me`)'
      - 'traefik.http.routers.traefik-secure.tls=true'
      - 'traefik.http.routers.traefik-secure.tls.certresolver=cloudflare'
      - 'traefik.http.routers.traefik-secure.tls.domains[0].main=t.bencuan.me'
      - 'traefik.http.routers.traefik-secure.tls.domains[0].sans=*.t.bencuan.me'
      - 'traefik.http.routers.traefik-secure.service=api@internal'

    restart: unless-stopped
    environment:
      ### TODO ###
      - CF_API_EMAIL=REDACTED
      - CF_DNS_API_TOKEN=REDACTED
    networks:
      - proxy
  whoami:
    # A container that exposes an API to show its IP address
    image: traefik/whoami
    labels:
      - 'traefik.http.routers.whoami.rule=Host(`whoami.t.bencuan.me`)'

networks:
  proxy:
    external: true
```

You should replace the following:

- Right now, I'm mapping all my services to various subdomains of [`t.bencuan.me`](http://t.bencuan.me). You have a different domain, so change all instances of this to your domain. Using a subdomain is preferred for internal services, so you can map your DNS record to your ZeroTier IP and have all of your services automatically route to your server.
- If you're using Cloudflare, generate an API token [here](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) and replace the `environment` section with the correct credentials.

Now, go back to your DNS provider and create a new record for your subdomain using the ZeroTier IP for your server. For example, here's mine:

![](/img/turtlenet/4-reverse-proxying-25.png)

Next, create a `data/` folder. Inside, create two files: `traefik.yml` and `config.yml`.

Inside `traefik.yml`, paste the following:

```yml
api:
  dashboard: true
  debug: true
entryPoints:
  http:
    address: ':80'
  https:
    address: ':443'
serversTransport:
  insecureSkipVerify: true
providers:
  docker:
    endpoint: 'unix:///var/run/docker.sock'
    exposedByDefault: false
  file:
    filename: /config.yml
certificatesResolvers:
  cloudflare:
    acme:
      email: YOUR_CLOUDFLARE_EMAIL
      storage: acme.json
      dnsChallenge:
        provider: cloudflare
        resolvers:
          - '1.1.1.1:53'
          - '1.0.0.1:53'
```

See the [official documentation](https://doc.traefik.io/traefik/https/acme/) for more details on `certificatesResolvers` if you don't use Cloudflare. This is necessary for automatically ensuring all of your sites are on HTTPS (otherwise your browser will yell at you a lot).

You can leave `config.yml` empty for now, but it'll be useful for routing to services not hosted on the same server. You can see mine [here](https://github.com/64bitpandas/TurtleNetPublic/blob/main/docker/traefik/data/config.yml) for an example.

Finally, you're ready to get Traefik up! Run `docker-compose up -d --force-recreate` once again, making sure that you're in the same folder as your new `docker-compose.yml`. You should now be able to navigate to the location you pointed the Traefik console to ([`traefik.t.bencuan.me`](http://traefik.t.bencuan.me) in my case).

If anything went wrong, you can run `docker-compose logs` to see what happened.

## More Services

Here's a handy Compose template for getting started with hosting future services:

```yml
version: "3"

services:
  SERVICE_NAME:
    image: IMG
    container_name: NAME
    environment:
      - variables here
    volumes:
      - volume info here
    ports:
	  - ports here
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.NAME.entrypoints=https"
      - "traefik.http.routers.NAME.rule=Host(`NAME.t.bencuan.me`)"
      - "traefik.http.routers.NAME.tls=true"
      - "traefik.http.routers.NAME.service=NAME-svc"
      - "traefik.http.services.NAME-svc.loadbalancer.server.port=PORT"
    networks:
      - proxy

networks:
  proxy:
    external: true
```

You'll probably need to create the `proxy` network (`docker network create proxy`) if you haven't already. Also note that the loadbalancer port is the _container_ port, not the host port it's mapped to.

For example, I can now modify our Portainer config to the following to get it running on [`portainer.t.bencuan.me`](http://portainer.t.bencuan.me):

```yml
version: '3'

services:
  portainer:
    image: portainer/portainer-ce
    container_name: portainer
    restart: unless-stopped
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /home/turtle/portainer/data:/data
    labels:
      - 'traefik.enable=true'
      - 'traefik.http.routers.portainer.entrypoints=http'
      - 'traefik.http.routers.portainer.rule=Host(`portainer.t.bencuan.me`)'
      - 'traefik.http.middlewares.portainer-https-redirect.redirectscheme.scheme=https'
      - 'traefik.http.routers.portainer.middlewares=portainer-https-redirect'
      - 'traefik.http.routers.portainer-secure.entrypoints=https'
      - 'traefik.http.routers.portainer-secure.rule=Host(`portainer.t.bencuan.me`)'
      - 'traefik.http.routers.portainer-secure.tls=true'
      - 'traefik.http.routers.portainer-secure.service=portainer'
      - 'traefik.http.services.portainer.loadbalancer.server.port=9000'
      - 'traefik.docker.network=proxy'
    networks:
      - proxy

networks:
  proxy:
    external: true
```

Most services you look up online will come with a provided sample Compose file; you can copy those over and add the necessary labels to get it hooked up to Traefik. You can also reference [my Compose files](https://github.com/64bitpandas/TurtleNetPublic/tree/main/docker) if you're thinking of running the same services. There are lots of other resources online as well like [this list](https://github.com/docker/awesome-compose).

### Happy hosting!!

![That cute Docker whale](https://4.bp.blogspot.com/-7kbrqnXfuLk/WqR6bZg882I/AAAAAAAAAkM/0vvnQrIZAwk9ijiTvfF8m5pWpBSJsKuFQCLcBGAs/s1600/Screen%2BShot%2B2018-03-10%2Bat%2B7.37.12%2BPM.png)
