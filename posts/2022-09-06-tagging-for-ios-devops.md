---
title: Tagging for iOS DevOps
published: true
layout: layout:BlogLayout
date: 2022-09-06
---

# Tagging for iOS DevOps

When you're ready to submit a build to TestFlight, I recommend tagging that commit in the style of `1.2.3-7`, where `1.2.3` is the marketing version shown on the App Store and `7` is the build number. This strategy allows us to easily reference what code went into which build.

If we take this approach, we can set up our CI/CD system to build our code and push to the App Store.

On [BitRise](https://bitrise.io), we can use the following code to interpret the tag as as a marketing version and build number. This code uses Bash regular expressions.

```
#!/usr/bin/env bash
set -e set -o pipefail set -x

echo "tag is: $BITRISE_GIT_TAG"
rx='([0-9]+\.[0-9]+\.[0-9]+)-([0-9]+)'
if [[ $BITRISE_GIT_TAG =~ $rx ]]; then
 echo "0: ${BASH_REMATCH[0]}"
 echo "1: ${BASH_REMATCH[1]}"
 echo "2: ${BASH_REMATCH[2]}"
else
 echo "No match!"
 exit 1
fi
envman add --key GIT_TAG_MARKETING_VERSION --value "${BASH_REMATCH[1]}"
envman add --key GIT_TAG_BUILD_NUMBER --value "${BASH_REMATCH[2]}"
```

If this script is run as a "build step", we use BitRise's `envman` to add the parsed information to our environment, so that our other build steps have easy access to this information.
