---
title: "Automating Your Upload to Testflight in 4 Easy Steps"
date: 2019-10-15T00:50:03-04:00
categories: ios-dev automation
published: true
layout: layout:BlogLayout
---

# Automating Your Upload to Testflight in 4 Easy Steps

## Motivation

I was working on a project for a client where I was wrapping their website into a `WKWebView` in order to provide native BlueTooth access.
I of course wanted to automate uploading to the App Store, and typically I would just use Fastlane, but this client
doesn't have iOS devs, and they most likely have no interest in keeping Fastlane's gem up to date, and very likely have no interest in keeping
Ruby up to date since they weren't using Ruby for anything else.

And personally, my projects don't have Ruby backends either now that I've moved to Server-side Swift. So I don't want to deal with Ruby if possible, either.

So I looked into how to automatically upload to TestFlight without Fastlane, and it was much easier than I expected. It was embarrassingly easier than I expected. It's 4 commands.

## It's only four commands

The four steps are:

1. Update build number
2. Archive project
3. Export the archive
4. Upload the exported `.ipa`

There's a little bit of housekeeping around that: making a temporary directory to store the build artifacts. I chose `.build` here, but of course you can choose whatever you like.

## The script: appstore.sh

```
#!/bin/bash

if [ -z $APP_LOADER_USERNAME ]; then
  echo "need app loader username stored in \$APP_LOADER_USERNAME"
  exit 1
fi

if [ -z $APP_LOADER_PASSWORD ]; then
  echo "need app loader password stored in \$APP_LOADER_PASSWORD\nGenerate an app-specific password at appleid.apple.com"
  exit 1
fi

function version_bump {
  xcrun agvtool next-version -all
}

function archive_project {
  xcodebuild -project ExampleApp.xcodeproj -scheme ExampleApp \
    -sdk iphoneos archive -archivePath ./.build/ExampleApp.xcarchive  \
    -allowProvisioningUpdates -allowProvisioningDeviceRegistration
}

function export_archive {
  xcodebuild -exportArchive -archivePath ./.build/ExampleApp.xcarchive \
    -exportOptionsPlist appstore-export-options.plist \
    -exportPath ./.build \
    -allowProvisioningUpdates -allowProvisioningDeviceRegistration
}

function upload {
  echo "=== uploading ExampleApp to App Store ===" && \
  xcrun altool --upload-app -t ios \
    -f ./.build/ExampleApp.ipa \
    -u $APP_LOADER_USERNAME -p $APP_LOADER_PASSWORD && \
  echo "Uploaded ExampleApp build $(xcrun agvtool what-version -terse) of version $(xcrun agvtool what-marketing-version -terse1)"
}

mkdir -p ./.build && \
version_bump && \
archive_project && \
export_archive && \
upload
```

You'll also need a file with the export options. In the script above, it's called `appstore-export-options.plist`. And you can stick it wherever.
In this example, it's in the root directory of the project.
The file looks like this:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>XXXXXXXXXX</string>
    <key>generateAppStoreInformation</key>
    <true/>
    <key>uploadBitcode</key>
    <true/>
    <key>uploadSymbols</key>
    <true/>
</dict>
</plist>
```

## Personalize the script

1. Change `ExampleApp.xcodeproj` to whatever you're using. If you're using a workspace, then pass along `-workspace ExampleWorkspace.xcworkspace` to the archive command.
1. Change the `ExampleApp` scheme name to whatever you're using.
1. Change the team ID in the `appstore-export-options.plist`
1. The username and password for uploading to the App Store are store in environment variables: `$APP_LOADER_USERNAME` and `$APP_LOADER_PASSWORD`.
   Be sure to set them in your environment before running the script, however you store them. They are used by the app loader tool to upload the `.ipa` to Apple.
   The script checks that username and password environment variables are set
   at the beginning of the script so that the whole build succeeds just to find that the username and password are missing.

## Additional notes

### agvtool

If you want to use `agvtool` to update your build numbers, then you'll need to enable it in your project settings.
[Here is a lengthy guide](https://medium.com/xcblog/agvtool-automating-ios-build-and-version-numbers-454cab6f1bbe) to agvtool and how to
enable it on your project. I recommend using `agvtool` since it comes with Xcode, there's no additional dependencies.

### codesign

The first time you run this script, you may get a password prompt saying something like "codesign would like to access some keys in your keychain."
I always hit "Always allow" so that it doesn't bug me any more.

## And that's it

Now you have a short script that builds and uploads your app to the App Store. You don't have to worry about Ruby or Ruby Gems anymore.
And since bash is already on every Mac, and Xcode is already needed for iOS development, there's no additional dependencies to download for development, or during CI/CD build.

## Please Note

I learned a lot of this stuff from [this article](https://medium.com/xcblog/xcodebuild-deploy-ios-app-from-command-line-c6defff0d8b8)
back when I was first researching how to do this for my client. That article hasn't been updated in a while, and so I can't just send people directly to that article.
That's why I wrote this one.
