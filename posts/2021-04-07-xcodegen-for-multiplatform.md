---
layout: post
title: "Xcodegen for Multiplatform Xcode projects"
date: 2021-04-07T16:55:03-05:00
categories: xcodegen swift ios macos
published: true
---

# Xcodegen for Multiplatform Xcode projects

Here's how I use [Xcodegen](https://github.com/yonaskolb/XcodeGen) for a new project that targets MacOS and iOS.

# Project 

Here is my `project.yml`:

```
name: Example
options:
  deploymentTarget:
    iOS: "14.0"
    macOS: "11.0"
schemes:
  Example-iOS:
    build:
      targets:
        Example-iOS: all
  Example-macOS:
    build:
      targets:
        Example-macOS: all
targets:
  Example-macOS:
    type: application
    platform: macOS
    sources: 
      - path: macOS
      - path: Shared
    settings:
      DEVELOPMENT_TEAM: 1234567890
      CODE_SIGN_STYLE: Automatic
      ORGANIZATIONNAME: "Example Organization"
      PRODUCT_BUNDLE_IDENTIFIER: com.Example.app
      VERSIONING_SYSTEM: apple-generic
      SWIFT_VERSION: 5.3
      CURRENT_PROJECT_VERSION: ${APP_BUILD_NUMBER}
    entitlements: 
      path: macOS/macOS.entitlements
      properties:
        com.apple.security.app-sandbox: true
        com.apple.security.files.user-selected.read-only: true
    info:
      path: macOS/Info.plist
      properties:
        CFBundleVersion: ${APP_BUILD_NUMBER}
        CFBundleShortVersionString: ${APP_BUILD_VERSION}
        CFBundleDevelopmentRegion: $(DEVELOPMENT_LANGUAGE)
        CFBundleName: $(PRODUCT_NAME)
        CFBundleDisplayName: Example
        CFBundleIconFile: ""
        CFBundleIdentifier: $(PRODUCT_BUNDLE_IDENTIFIER)
        CFBundleInfoDictionaryVersion: "6.0"
        CFBundlePackageType: $(PRODUCT_BUNDLE_PACKAGE_TYPE)
        LSMinimumSystemVersion: $(MACOSX_DEPLOYMENT_TARGET)
  Example-iOS:
    type: application
    platform: iOS
    sources: 
      - path: iOS
      - path: Shared
    settings:
      DEVELOPMENT_TEAM: 1234567890
      CODE_SIGN_STYLE: Automatic
      ORGANIZATIONNAME: "Example Organization"
      PRODUCT_BUNDLE_IDENTIFIER: com.Example.app
      TARGETED_DEVICE_FAMILY: 1,2
      VERSIONING_SYSTEM: apple-generic
      SWIFT_VERSION: 5.3
      CURRENT_PROJECT_VERSION: ${APP_BUILD_NUMBER}
    entitlements: 
      path: iOS/iOS.entitlements
    info:
      path: iOS/Info.plist
      properties:
        CFBundleVersion: ${APP_BUILD_NUMBER}
        CFBundleShortVersionString: ${APP_BUILD_VERSION}
        CFBundleDevelopmentRegion: $(DEVELOPMENT_LANGUAGE)
        CFBundleDisplayName: Example
        ITSAppUsesNonExemptEncryption: false
        LSRequiresIPhoneOS: true
        UIApplicationSceneManifest:
          UIApplicationSupportsMultipleScenes: true
        UIApplicationSupportsIndirectInputEvents: true
        UILaunchScreen: {}
        NSAppTransportSecurity:
          NSAllowsLocalNetworking: true
        UIRequiredDeviceCapabilities: [armv7]
        UISupportedInterfaceOrientations:
          - UIInterfaceOrientationPortrait
        UISupportedInterfaceOrientations~ipad:
          - UIInterfaceOrientationPortrait
          - UIInterfaceOrientationPortraitUpsideDown
          - UIInterfaceOrientationLandscapeLeft
          - UIInterfaceOrientationLandscapeRight
```

This defines two targets, one for macOS and one for iOS, just like Xcode's multiplatform template.

## Bootstrap

I don't call `xcodegen` directly. The `project.yml` references two variables for the build number and the marketing version, and those are stored in two files named `build-number` which contains the current build number (for example: `1`) and `build-version` which contains the current marketing version (for example: `1.0.0`). 

To make sure those values are available to `xcodegen`, I create a `bootstrap.sh` script that looks like this:

```
rm -fr *.xcodeproj

export APP_BUILD_NUMBER=$(cat build-number)
export APP_BUILD_VERSION=$(cat build-version)

xcodegen generate -s project.yml
```

So when I need to regenerate the xcode project, I run `./bootstrap.sh` from the project's root directory.



