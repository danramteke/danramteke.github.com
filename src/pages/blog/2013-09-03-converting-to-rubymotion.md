---
published: true
date: 2013-09-03T20:18:12-04:00
title: Converting from Objective-C to RubyMotion
layout: layout:BlogLayout
---

# Converting from Objective-C to RubyMotion

At Cyrus, we recently fielded a proposal to convert an existing app on the App Store from Objective-C to RubyMotion. I'll give some background to the project and client, describe what we did, and give some recommendations.

First, a little background on the proposal. The client already had a pure Objective-C app in the App Store. They already had a design firm and a consulting firm that they had a a good working relationship with. They were Rails developers, curious about how RubyMotion could benefit them.

Also, they were pushing new features constantly. The other firm writing new features while we were translating the app to RubyMotion seemed like a recipe for continual merge conflicts. We would have been happy to implement new features for them. Stopping development to translate the app to RubyMotion didn't seem like a good use of their time.

Here's what we did. We planned to vendor the Objective-C project, convert the application delegate to Ruby, and then pull over one controller at a time until we got everything in Ruby that would be likely to change. We planned to leave in Objective-C all the dropped-in third party libraries.

We started by vendoring the entire Objective-C project. And already hit some bumps in the road. Because the other dev shop used the `.pch` file (pre-compiled headers file) to require fewer `#import` statements in their files, we couldn't simply drop the entire project in a vendor sub-folder in our RubyMotion project. Further, the cocoapods wouldn't load for the vendored project. Because of all these missing dependencies, we had to take a different route.

Instead, we built the existing project as a static framework for iOS, remembering to properly export headers. This approach didn't require us tp fiddle with the `.pch` file, muck with pre-compiler directives, or do any other shenanigans with dependencies. This gave us a `.a` file that we put in the vendor directory of our RubyMotion project. (Although we found blog posts describing how to do so, we didn't bother making a `.a` file for both the simulator and the iPhone - we were spiking this out to try to get it to work.) Here is the line from our `Rakefile`

    app.vendor_project('vendor/libclientname-static', :static, :force_load => false,
        :products => ['libclientname-static.a'],
        :headers_dir => "include/libclientname-static")

After translating the application delegate, vendoring the appropriate included frameworks, and setting up the cocoapods, we had a stable foundation to build on. We were able to reference controllers in the storyboard, and instantiate views from the vendored `.a` file.

Through this prep work, we discovered that converting a project from Objective-C to RubyMotion is doable. It's even doable to translate one class at a time, iteratively, until the project feels right. The cost-to-benefit of stopping to translate an already existing app is very dependent on the environment the app is being developed in. When new features are important, not translating makes sense. If a team of Ruby developers is taking over an app, a translation makes more sense.
