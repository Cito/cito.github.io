---
title: "Never Iterate a Changing Dict"
description: "When running a for loop over a Python dict, the dict must never be changed."
pubDate: 2017-01-07
tags: ["Python","Programming"]
---

Yesterday I noticed a bug in a Python program that only appeared when running it with the new Python 3.6.

![A slippery slope](/img/never-iterate-a-changing-dict.jpg)

It turned out that the program had been running a slippery slope all the time.

Essentially, the program tried to find for a given list of field names, like

```python
names = ['alpha', 'bravo', 'charlie', 'delta']
```

and a given format-string, like

```python
fmtstr = 'show only {alpha}, {bravo} and {charlie}'
```

which of the given field names were used in the string. The following code was used to examine this:

```python
    used_names = []
    d = dict.fromkeys(names)
    for k in d:
        del d[k]
        try:
            fmtstr.format(**d)
        except KeyError:
            used_names.append(k)
        d[k] = None

    print("Used names:", ', '.join(sorted(used_names)))
```

The code simply tries to format the string while successively omitting one of the given field names. If formatting fails with a KeyError, it knows that the field name is used.

When you run this code with Python versions before 3.6, it works as expected:

```text
Used names: alpha, bravo, charlie
```

However, when you try to run it with Python 3.6, it will print out something very strange:

```text
Used names: alpha, alpha, alpha, alpha, alpha, bravo, bravo, bravo, bravo
```

What's happening here? Can you spot the problem?

If you look carefully, you probably see it: Yes, this is another instance of the dreaded "changing a mutable object while iterating it" problem, that you surely have already experienced sometime or other when getting an error message like this:

```text
RuntimeError: dictionary changed size during iteration
```

In this case, however, the dictionary did not change its size. Actually it did not even change its keys between iterations. So you wouldn't think there could be a problem with this code, and in fact it worked fine until recently. But in Python 3.6 the dict type has been reimplemented to use a more compact representation. This implementation does not pardon iterating over a changing dictionary even if you try to restore removed keys immediately, since it uses insertion order with an additional level of indirection, which causes hiccups when iterating while keys are removed and re-inserted, thereby changing the order and internal pointers of the dict.

Note that this problem is not fixed by iterating `d.keys()` instead of `d`, since in Python 3, `d.keys()` returns a dynamic view of the keys in the dict which results in the same problem. Instead, iterate over `list(d)`. This will produce a list from the keys of the dictionary that will not change during iteration. Or you can also iterate over `sorted(d)` if a sorted order is important.

Just to make this clear: This is not a *bug* in Python 3.6. Iterating an object and changing it at the same time was always considered unsafe and bad style. The benefits of the new dict implementation are great enough to accept this kind of incompatibility. However, I wonder whether it would be possible and beneficial to safeguard the for loop with a check of the private version of the dict that has just been added in Python 3.6 as well (see [PEP509](https://www.python.org/dev/peps/pep-0509/)), and raise a RuntimeError if the version changes, similarly to how a change of the dictionary size is already detected and reported as an error. Then running programs like the one above would raise an error instead of failing in strange and nondeterministic ways.

To sum up the morale of this story: Never iterate a changing dictionary, even if you preserve its size and keys. Instead run the for loop over a copy of the keys or items of the dictionary.
