---
title: Introducing DRAutolayout
date: 2013-07-22T20:18:12-04:00
published: true
layout: layout:BlogLayout
---

# Introducing DRAutolayout

Autolayout in iOS enables responsive design. It's more enjoyable than computing frames by hand; however, it's a bit wordy when writing views in code. And a lot of the autolayout api look the similar. I've been using some helper code to encapsulate some of the calls. I published them in a Cocoa pod. Here is a tour of the features of this Cocoa pod.

There are two categories that I made. The first is a category on `NSLayoutConstraint` for making raw `NSLayoutConstraint`s. The second is a category on `UIView` for adding subviews and layout to a view.

## `NSLayoutConstraint (DRAutolayout)`

The design philosophy is to provide all possible `NSLayoutConstraint` constraints, but use method names instead of constants to select the different ones.

For example, instead of writing out `[view addConstraint:[NSLayoutConstraint constraintWithItem:view1 attribute:NSLayoutAttributeCenterX relatedBy:NSLayoutRelationEqual toItem:view2 attribute:NSLayoutAttributeCenterX multiplier:1.0 constant:0.0]]` in native parlance in order to constrain view1's center to view2's center, I write `[view addConstraint:[NSLayoutConstraint centerX:view1 toCenterX:view2]]`, which is easier for me to read.

Further, I made helper methods to constrain view tops to view tops and view rights to view rights. `[NSLayoutConstraint top:view1 toTop:view2 multiplier:1.0 constant:0]` and `[NSLayoutConstraint right:view1 toRight:view2 multiplier:1.0 constant:0]`, respectively. To make subviews cling to the top, sides, and button of the superview. Of course, there is `left:toLeft:multiplier:constant:` also.

I also found it useful to constrain lefts to rights when placing views next to each other with some spacing between. `[NSLayoutConstraint left:self.topBar toRight:self.menuButton multiplier:1.0 constant:10]`.

You can leave off the `multiplier` and `constant` arguments. So `[NSLayoutConstraint right:view1 toRight:view2 multiplier:1.0 constant:0]` and `[NSLayoutConstraint right:view1 toRight:view2]` are equivalent.

## `UIView (DRAutoLayout)`

The second category is on UIView and is useful for making a simple flow layout down the middle of the screen, placing related objects to the right and left. The demo app uses this category. I recommend placing all subviews to a UIScrollView.

Remember to both `placeAtTop:` and `placeAtBottom:` in relation to the `UIScrollView`! This tells autolayout where the top and bottom of the content is for the `UIScrollView`. If you don't do this, and you can set the contentSize of the `UIScrollView` manually, the `UIScrollView` might not scroll as expected.

Then after calling addSubview with all your subviews, you can arrange them by calling `[scrollView place:view2 below:view1 distance:20]` and `[scrollView place:view2 below:view1 distance:20]`. Then `[scrollView horizontallyCenterSubviews:@[view1, view2]]` to align them all in the center.

To place something to the left or right of something in the center, use the `place:leftOf:distance` method: `[scrollView place:leftView leftOf:centerView distance:40]`. The same works to place something to the right: `[scrollView place:rightView rightOf:centerView distance:40]`.

## Conclusion

I hope you find these autolayout helper methods useful. I really like autolayout. And I like these helper methods because they increase the clarity of the code while reducing the amount of code to read.

Checkout out the project at [https://github.com/danramteke/DRAutolayout](https://github.com/danramteke/DRAutolayout) or add `pod 'DRAutolayout'` to your Podfile.

## No Longer Maintained

This package is no longer maintained.
