---
title: "UIAppearance"
date: 2016-07-19T16:50:03-04:00
categories: ios-dev ui
layout: layout:BlogLayout
---

I feel like I'm missing something about Apple's UIAppearance. I've google'd around and such, and still haven't found out a solution. So here's my question: How do I make UIAppearance only affect views that I can fully control?

Let me try to motivate this question a little bit. If I say [something like this](https://github.com/danramteke/uiappearance-question/blob/master/UIAppearanceQuestion/AppDelegate.swift#L29):

    UINavigationBar.appearance().barTintColor = UIColor.blackColor()

Then every navigation bar in my app will be black. This is powerful way to consolidate the color scheme of my app. And it will look like this screen shot:

[![Sample app showing hard to read button in an alert]({{site.baseurl}}/images/uiappearance/sample-app-main-screen.png)](https://raw.githubusercontent.com/danramteke/uiappearance-question/master/screenshots/sample-app-main-screen.png)

However, every navigation bar in my app will be black. Even navigation bars that I don't control, like those used by the `UIImagePickerController`. Which would be fine, but typically only a few parts of system level views are controllable.

This situation becomes more apparent with `tintColor`. If I say [something like this](https://github.com/danramteke/uiappearance-question/blob/master/UIAppearanceQuestion/AppDelegate.swift#L28):

    window.tintColor = UIColor.yellowColor()

This will give a yellow color to the `UIBarButtonItem`s on my navigation bars. Which is great. However, if I later create an alert and display it, [like this](https://github.com/danramteke/uiappearance-question/blob/master/UIAppearanceQuestion/ViewController.swift#L39-L41):

    let alert = UIAlertController(title: "Alert!", message: "An Alert Message!", preferredStyle: .Alert)
    alert.addAction(UIAlertAction(title: "OK!", style: .Default, handler: { action in }))
    self.presentViewController(alert, animated: true, completion: nil)

Then the alert uses the `tintColor` as the color of the button, making the "OK" button hard to read! I definitely don't want that! Here's a screenshot showing the hard to read button:

[![Sample app showing hard to read button in an alert]({{site.baseurl}}/images/uiappearance/sample-app-alert.png)](https://raw.githubusercontent.com/danramteke/uiappearance-question/master/screenshots/sample-app-alert.png)

Perhaps someone might ask, can't I use UIAppearance to change the background color of the alert? I looked at the view hierarchy (screenshot below), and the only unique views are private classes. I cannot reference them in code in order to change their appearance properties. (`_UIAlertControllerShadowedScrollView` is one of the unique private classes in this alert.)

[![View hierarchy of an alert]({{site.baseurl}}/images/uiappearance/view-hierarchy.png)](https://raw.githubusercontent.com/danramteke/uiappearance-question/master/screenshots/view-hierarchy.png)

The full code for the sample project is available at <https://github.com/danramteke/uiappearance-question>

## Solutions

I haven't found a way to restrict UIAppearance's reach. Except to not use it. In my projects for my clients and in my own projects I have removed UIAppearance usage. I have instead an alternative approach:

    extension UINavigationBar {
      func applyAppearance() {
        self.barTintColor = UIColor.blackColor()
      }
    }

This is a little bit more legwork, I need to call `navController.navigationBar.applyAppearance()` every time I create a new `UINavigationController`. But in return, I have easy to read alerts.
