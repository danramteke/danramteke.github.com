---
layout: post
published: true
date: 2012-09-04T20:18:12-04:00
title: Git Branch in command -line
---

Here's a script to show the git branch in the command prompt. I color the git branch to quickly show thestate of the working directory. RED means there are unstaged changes. YELLOW means the working directory and index match. And GREEN means working directory is clean (nothing to commit).

This is known to work with git version 1.7.12. However, git version 1.7.6.4 doesn't properly support the `-b` flag with the `--porcelain` flags.



<script src="https://gist.github.com/danramteke/3658683.js?file=.bash_login"> </script>

RED, YELLOW, GREEN, and NO_COLOUR are color settings.



The function parse_git_branch parses the branch from the `git status -b --porcelain` command. I used `head` to take the first lineusing sed to run the regular expressions.


parse_git_status echo's RED or GREEN depending if the directory is clean or not. `git status --porcelain` is a minimalist git status that should be used for scripting. In the first line, I pass `stderr` to `stdin` so that I can grep it for "not a git repository."


The PS1 line sets the prompt. The \$(function_name) runs the function every time the prompt is accessed, which is what you want for a prompt. If it were merely $(function_name) or `function_name`, the function would be run only once.
