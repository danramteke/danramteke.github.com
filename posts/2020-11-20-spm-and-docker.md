---
layout: post
title: "Docker Layers for Swift Package Manager"
date: 2020-11-21T16:55:03-05:00
categories: docker swift spm vapor
published: true
---

This post will show how to use Docker layers for Swift Package Manager projects. The sample project is on [GitHub](https://github.com/danramteke/spm-in-docker).

## Motivation

Consider this Dockerfile for a Swift project:

```
FROM swift:5.3.1-focal 
WORKDIR /build
ADD ./Package.* ./
ADD ./Sources ./Sources
RUN swift build -c release
ENV PORT 80
EXPOSE $PORT
CMD /app/Run serve --env production --hostname 0.0.0.0 -p $PORT
```

We would build it using `docker build -t hello-world .` and we would see the following output:

```
 => [internal] load .dockerignore                                                                                             0.0s
 => => transferring context: 103B                                                                                             0.0s
 => [internal] load build definition from Dockerfile                                                                          0.0s
 => => transferring dockerfile: 503B                                                                                          0.0s
 => [internal] load metadata for docker.io/library/swift:5.3.1-focal                                                          0.6s
 => [1/5] FROM docker.io/library/swift:5.3.1-focal@sha256:3fff4e7b806d04e1f8ef4d8f15eabcd8c9d8898f5333cc59aa3fc2f527ce96a9   36.3s
 => => resolve docker.io/library/swift:5.3.1-focal@sha256:3fff4e7b806d04e1f8ef4d8f15eabcd8c9d8898f5333cc59aa3fc2f527ce96a9    0.0s
 => => sha256:3fff4e7b806d04e1f8ef4d8f15eabcd8c9d8898f5333cc59aa3fc2f527ce96a9 320B / 320B                                    0.0s
 => => sha256:a0f91b147671afee61dec3eb0f6cedfd819732931a8e5dc706a79a65509f3b58 1.37kB / 1.37kB                                0.0s
 => => sha256:e07bbf2adda7980b0d48d09a34922356fc699409bf384c5532540a3e6739cb2c 7.13kB / 7.13kB                                0.0s
 => => sha256:6a5697faee43339ef8e33e3839060252392ad99325a48f7c9d7e93c22db4d4cf 28.56MB / 28.56MB                              2.8s
 => => sha256:ba13d3bc422b493440f97a8f148d245e1999cb616cb05876edc3ef29e79852f2 847B / 847B                                    0.2s
 => => sha256:a254829d9e55168306fd80a49e02eb015551facee9c444d9dce3b26d19238b82 162B / 162B                                    0.2s
 => => sha256:d800a558a8d3578248d40fccef72e826fe3b709469aa49c2f2975ab7ad7ddc98 93.61MB / 93.61MB                              7.2s
 => => sha256:ee5f2394c96e071384625f1080ece8feca75f4b7b0118570e82032ee2cc4b131 422.07MB / 422.07MB                           17.7s
 => => extracting sha256:6a5697faee43339ef8e33e3839060252392ad99325a48f7c9d7e93c22db4d4cf                                     1.9s
 => => extracting sha256:ba13d3bc422b493440f97a8f148d245e1999cb616cb05876edc3ef29e79852f2                                     0.0s
 => => extracting sha256:a254829d9e55168306fd80a49e02eb015551facee9c444d9dce3b26d19238b82                                     0.0s
 => => extracting sha256:d800a558a8d3578248d40fccef72e826fe3b709469aa49c2f2975ab7ad7ddc98                                     7.7s
 => => extracting sha256:ee5f2394c96e071384625f1080ece8feca75f4b7b0118570e82032ee2cc4b131                                    17.6s
 => [internal] load build context                                                                                             0.0s
 => => transferring context: 5.55kB                                                                                           0.0s
 => [2/5] WORKDIR /build                                                                                                      0.7s
 => [3/5] ADD ./Package.* ./                                                                                                  0.1s
 => [4/5] ADD ./Sources ./Sources                                                                                             0.0s
 => [5/5] RUN swift build -c release                                                                                        291.9s
 => exporting to image                                                                                                        3.5s
 => => exporting layers                                                                                                       3.4s
 => => writing image sha256:fda601b5aebba754ac82c1a5dc95f9ad0be6b7695340d3355a9bab26d6c70237                                  0.1s
 => => naming to docker.io/library/hello-world                                                                                0.0s 
```

We can see the project builds for over 300 seconds or 5 minutes.

When building this project, there's only one line that builds any Swift code: `RUN swift build -c release`. Therefore only one Docker layer cache exists. 
So anytime you change your code, in your own `Sources` directory, your third party dependencies rebuild your entire project without any cache.

Ideally, the third party dependencies would download and cache separately from your own code. For example the web framework [Vapor](https://github.com/vapor/vapor) has many dependencies, 
and compiling just the framework takes a long time.

## Solution

If we create a empty files in a directory structure that matches our `Sources` folder, we can build the project's dependencies. And docker will cache the built dependencies into a separate layer in our `Dockerfile`. This will speed up subsequent builds. 

And now our dockerfile could look like this:

```
FROM swift:5.3.1-focal
WORKDIR /build
ADD ./Package.* ./                                                   # A
RUN swift package resolve                                            # B
RUN mkdir -p Sources/App && touch Sources/App/empty.swift \
    && mkdir -p Sources/Run && touch Sources/Run/main.swift          # C
RUN swift build -c release                                           # D
ADD ./Sources ./Sources                                              # E
RUN swift build -c release                                           # F
ENV PORT 80
EXPOSE $PORT
CMD /app/Run serve --env production --hostname 0.0.0.0 -p $PORT
```

On line `# A`, we add the `Package.swift` and `Package.resolved` files as normal. On line `# B`, we resolve all the dependencies. 

If stop editing here, and we `swift build` now, we'll get an error about missing sources, since we haven't copied our `Sources` in yet. 
To solve this, we write line `# C` to create the needed directories and create empty files in them. Note that empty file the `Run` directory needs to be named `main.swift` since it's an executable target.

On line `# D`, we build all our dependencies.

On lines `# E` and `# F`, we add our sources and build then as normal.


Now when we run the docker build, the output of `docker build -t hello-world .` hasn't changed much, because nothing has been cached yet. However, the next time we build (after we make some small code changes - for example, change from "hello world" to "hello earth"),
 the output of `docker build -t hello-world .` looks like this:

```
[+] Building 4.8s (13/13) FINISHED                                                                                                                                
 => [internal] load build definition from Dockerfile                                                                            0.0s
 => => transferring dockerfile: 37B                                                                                             0.0s
 => [internal] load .dockerignore                                                                                               0.0s
 => => transferring context: 34B                                                                                                0.0s
 => [internal] load metadata for docker.io/library/swift:5.3.1-focal                                                            0.5s
 => [1/8] FROM docker.io/library/swift:5.3.1-focal@sha256:3fff4e7b806d04e1f8ef4d8f15eabcd8c9d8898f5333cc59aa3fc2f527ce96a9      0.0s
 => [internal] load build context                                                                                               0.0s
 => => transferring context: 461B                                                                                               0.0s
 => CACHED [2/8] WORKDIR /build                                                                                                 0.0s
 => CACHED [3/8] ADD ./Package.* ./                                                                                             0.0s
 => CACHED [4/8] RUN swift package resolve                                                                                      0.0s
 => CACHED [5/8] RUN mkdir -p Sources/App && touch Sources/App/empty.swift     && mkdir -p Sources/Deps && touch Sources/Deps/  0.0s
 => CACHED [6/8] RUN swift build -c release --target Deps                                                                       0.0s
 => [7/8] ADD ./Sources ./Sources                                                                                               0.1s
 => [8/8] RUN swift build -c release                                                                                            3.8s
 => exporting to image                                                                                                          0.3s 
 => => exporting layers                                                                                                         0.3s 
 => => writing image sha256:5960e06c78c5c2e247a42bff00c390ffcf75093e546228e8aa4cbd46ce37e5e1                                    0.0s 
 => => naming to docker.io/library/hello-world                                                                                  0.0s
```

We can see that it builds much quicker! Only a few seconds compared to the over 300 seconds before caching. 

Also, we can see the various layers marked as `CACHED`. Only our own project's code needs to be compiled, since the third party dependencies already are compiled and cached in the docker layer.

I hope this was helpful. Checkout the sample project on Github here https://github.com/danramteke/spm-in-docker



