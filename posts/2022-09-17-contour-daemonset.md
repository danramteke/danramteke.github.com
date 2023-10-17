---
title: Kubernetes without Load Balancers with Contour
published: true
layout: layout:BlogLayout
date: 2022-09-17
---

# Kubernetes without Load Balancers with Contour

For small projects, when the cost of a load balancer can cost as much as a smaller node, a load balancer can feel like overkill. I would prefer to have another compute node instead! But I still want the other benefits of Kubernetes. This is the work around I've done on for [DigitalOcean (referral link)](https://www.digitalocean.com?refcode=cb0365f6b163)'s Kubernetes aka DOKS.

## Single node

Start with the raw Contour yaml available from their GitHub: [v1.22.1/…/contour.yaml](https://raw.githubusercontent.com/projectcontour/contour/v1.22.1/examples/render/contour.yaml) then search for a `Service` with `name: envoy`,

For the `Service`, change the `type` from `LoadBalancer` to `NodePort`.

If you only have one node, you're done! You can point your [DigitalOcean (referral link)](https://www.digitalocean.com?refcode=cb0365f6b163) `ReservedIP` to this node.

## More than one node

If you have more than one Node, I use a `nodeSelector` and a label to specify an "edge" node.

Find a `DaemonSet` with `name: envoy`, add a `nodeSelector` key to the `spec.template.spec` dictionary. It will be a sibling of the `containers` key. It could look like this:

```
spec:
  # …
  template:
    # …
    spec:
      nodeSelector:
        node-role: edge
      containers:
      # …
```

Then, looking at your cluster, find the `Node` you want to use as the edge node. And run something like this `kubectl label node $edgeNodeName node-role=edge --overwrite`

You can now point your [DigitalOcean (referral link)](https://www.digitalocean.com?refcode=cb0365f6b163) `ReservedIP` to this node.

## Apply

Now you can apply your modified `contour.yaml`! Now you have a nice Ingress controller with nice features. You can spend your budget on compute instead of a load balancer.

## Notes

This is a more brittle setup for sure. If [DigitalOcean (referral link)](https://www.digitalocean.com?refcode=cb0365f6b163) ever recreates your cluster for you, they will usually create a Load Balancer for you. Just remember to delete it.

Also, this setup can't really do in-place upgrades. So instead, when you need to upgrade your Kubernetes version, setup a second cluster with your apps, swap your ReservedIP to that cluster, then delete your old one.

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=cb0365f6b163)
