---
title: "Autolayout in Code"
categories: ios-dev ui
layout: layout:BlogLayout
---

# Autolayout in Code

When you write your views in code and use autolayout, you need to turn off the autoresizing resizing masks, like this: `myView.translatesAutoresizingMaskIntoConstraints = false`. And you'll be doing this for every view you add to your view hierarchy.

To make this easier to type, I made an extension on `UIView` to turn off the autoresizing masks,
{% highlight swift %}
extension UIView {
func autolayout() -> Self {
self.translatesAutoresizingMaskIntoConstraints = false
return self
}
}
{% endhighlight %}

And I named the function `autolayout` because in a sense, you're turning _on_ autolayout with this call.

## Example usage:

Here's an example usage from version 1.1 of [Underway](http://danramteke.com/underway):
{% highlight swift %}
lazy var label: UILabel = {
let label = UILabel().autolayout()
label.text = "Currently, there are no real time updates for this stop."
label.numberOfLines = 0
label.lineBreakMode = .ByWordWrapping
label.textAlignment = .Center
return label
}()
{% endhighlight %}
You may say, that doesn't save that much, and autocomplete makes it easy enough to type! That's also a valid view.

Hope you liked this.
