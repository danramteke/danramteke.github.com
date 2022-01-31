---
title: "Reordering UICollectionViews with Custom UICollectionView Layouts"
date: 2019-07-10T00:50:03-04:00
categories: ios-dev ui
layout: layout:BlogLayout
---

I was implenting drag-and-drop for re-ordering a `UICollectionView` with a custom `UICollectionViewLayout` subclass. And I ran into a gotcha.

In my layout's `func layoutAttributesForElements(in rect: CGRect)` method, I was referencing my underlying view model to get the number of items in each section. However, UIKit was giving me odd behaviors, including many `NSInternalInconsistencyException`'s.

Instead of relying on your internal data models, be sure to ask your `UICollectionViewLayout`'s `collectionView` how many items are in each section directly. Something like: `self.collectionView?.numberOfItems(inSection: section) ?? 0`. This was the easy solution to a lot of debugging.

This isn't well documented in the documentation about `UICollectionView` reordering, so I wanted to make a note.
