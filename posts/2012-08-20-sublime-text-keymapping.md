---
title: Sublime Text 2 Keymapping
---
Made some keymappings in Sublime Text 2.

Open the keymap files by going to "Sublime Text 2" > "Preferences" > "Key Bindings - User"

This is what my key bindings file looks like:

<script src="https://gist.github.com/3658683.js?file=Default (OSX).sublime-keymap"> </script>
    
I opened up the Sublime Text 2 packages directories in Sublime Text 2, and search for the commands I wanted to add key bindings to. The names aren't always obvious. 

It turns out that the first two of these commands are from the context menu (reachable by right clicking). The context menu is described in ~/Library/Application Support/Sublime Text 2/Packages/Default/Context.sublime-menu. I copy/pasted the commands from Context.sublime-menu to the keybindings file and added key binds.

The reindent command is found in the command palette (bound to super+p by default). The commands in there are found in ~/Library/Application Support/Sublime Text 2/Packages/Default/Default.sublime-commands
