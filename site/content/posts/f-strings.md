---
title: "The new f-strings in Python 3.6"
description: "Python 3.6 is out and provides formatted string literals."
pubDate: 2016-12-24
tags: ["Python", "Programming"]
---

![Christmas time](/img/f-strings-0.jpg)

Hurray! It's Christmas time - and Python 3.6 has been released!

One of the [many goodies](https://docs.python.org/3.6/whatsnew/3.6.html) packed into the new release are [formatted string literals](https://docs.python.org/3.6/reference/lexical_analysis.html#f-strings), or simply called "f-strings". In this blog post I'll explain why this is good news.

First, they are called f-strings because you need to prefix a string with the letter "f" in order to get an f-string, similar to how you create a raw string by prefixing it with "r", or you can use the prefixes "b" and "u" to designate byte strings and unicode strings. Note that the "u" prefix was only necessary in Python 2 ("Legacy Python"), since native strings are the default now in Python 3.

The letter "f" also indicates that these strings are used for formatting. Now Python already provides several ways for formatting strings, so you may wonder why the Python gods introduced yet another way, in blatant violation of the [Zen of Python](https://www.python.org/doc/humor/#the-zen-of-python), according to which there should be only one obvious way of doing things. In fact some people already complained about this. However, these people overlook that the Zen of Python also states that simple is better than complex and practicality beats purity - and yes, f-strings are really the most simple and practical way for formatting strings.

## Some examples

Look how easy it is:

```python
    >>> name = 'Fred'
    >>> age = 42
    >>> f'He said his name is {name} and he is {age} years old.'
    He said his name is Fred and he is 42 years old.
```

As you see, this works pretty much like the `.format()` method, however you can directly insert the names from the current scope in the format string. This is much simpler than the old way, and avoids duplication:

```python
    >>> name = 'Fred'
    >>> age = 42
    >>> 'He said his name is {name} and he is {age} years old.'.format(
    ...     name=name, age=age)
    He said his name is Fred and he is 42 years old.
```

Sure, you can omit the names inside the curly braces since Python 3.1, like this:

```python
    >>> name = 'Fred'
    >>> age = 42
    >>> 'He said his name is {} and he is {} years old.'.format(name, age)
    'He said his name is Fred and he is 42 years old.'
```

But still, this is longer and not as readable as the f-string notation.

And it gets even better than this, as f-strings also support any Python expressions inside the curly braces. You can also write triple-quoted f-strings that span multiple lines, like so:

```python
    >>> name = 'Fred'
    >>> seven = 7
    >>> f'''He said his name is {name.upper()}
    ...    and he is {6 * seven} years old.'''
    'He said his name is FRED\n    and he is 42 years old.'
```

Note that while you can create raw f-strings by using the prefix "fr", you cannot create binary f-strings with "fb" in Python 3.6 (maybe this will be added in a future Python version). Formatting with f-strings is one of the new features in Python 3 that will not be ported back to Python 2, therefore a "fu" prefix to designate unicode is not necessary and not supported.

## Comparison with template literals in JavaScript

When we look beyond our Python back yard over to the JavaScript folks, we see that they introduced a very similar feature called "template strings" or "template literals" as part of the [ECMAScript 2015](http://www.ecma-international.org/ecma-262/6.0/) standard. It's good to see the JavaScript and Python communities taking inspiration from each other. Instead of the prefix "f" and ordinary quotes, the JavaScript template strings are designated with reverse quotes ("backticks"), and they can span multi lines which ordinary JavaScript strings can't. Therefore template strings in JavaScript actually correspond to triple-quoted f-strings in Python. Another difference is that the interpolation syntax of template strings in JavaScript requires a dollar sign in front of the curly braces. Otherwise, they are pretty similar. So, in current JavaScript you can write this:

```javascript
    > name = 'Fred'
    > seven = 7
    > console.log(`He said his name is ${name.toUpperCase()}
        and he is ${6 * seven} years old`)
    He said his name is FRED
      and he is 42 years old
```

Note that backticks had been used as an alternative syntax for the `repr()` method in Python before, but have been removed from the language with Python 3, since the backtick character causes too many problems (e.g. it can be difficult to distinguish in some fonts or difficult to enter on some keyboards), and I think it's good that Python uses the "f"-prefix instead of another kind of quote. This makes it actually easier to switch between f-strings and ordinary strings. Another advantage of Python is that the concepts of a template string (prefix "f") and a multi-line string (triple quotes) are cleanly separated and can be used independently of each other. And I like that I don't have to enter that additional dollar sign.

What make things a bit more confusing is that JavaScript templates also have a syntax called "tagged templates" that looks like the prefix syntax of Python, but has a totally different semantics. The prefix ("tag") in JavaScript actually is the name of a function that is called with the template string and its substitutions as parameters. There is also a standard function called `String.raw` in JavaScript that can be used as a tag function. If you set `r = String.raw`, you can use raw strings in JavaScript like in Python with a similar syntax (though not exactly the same, since you still need backticks instead of quotes).

## Comparison with template strings in Python

Python also provides an older kind of [template strings](https://docs.python.org/3/library/string.html#template-strings) as part of the standard library. These template strings also use the syntax with the dollar sign and the curly braces like JavaScript does, but you can usually omit the curly braces, which you cannot do in JavaScript. You use them like this:

```python
    >>> from string import Template
    >>> t = Template('He said his name is $name and he is $age years old.')
    >>> t.substitute(name='Fred', age=42)
    'He said his name is Fred and he is 42 years old.'
```

## Performance considerations

You may be worried that the new way of formatting strings might be slower than the conventional ways. Particularly the old template strings look like they might be faster when used more than once with different values, since the template string must only be parsed when the `Template()` object is created and can then be reused. But it turns out the opposite is the case, and f-strings are really fast because they are pre-parsed as well and stored in efficient bytecode for faster execution.

To confirm this in practice, I ran a simple benchmark and found that using f-strings was distinctly faster than formatting with the "%" operator or simple string concatenation, twice as fast than the `.format()` method and even 20 times faster than formatting with `Template()`, which does not seem to be implemented very efficiently.

So you can also interpret the "f" in "f-strings" as "fast". It's good that Python still keeps the old ways for backward compatibility, but in new code you should definitely make use of these fantastic f-strings. Here is the code for the benchmark, if you want to test it yourself:

```python
import timeit

format = """
def format(name, age):
    return f'He said his name is {name} and he is {age} years old.'
""", """
def format(name, age):
    return 'He said his name is %s and he is %s years old.' % (name, age)
""", """
def format(name, age):
    return 'He said his name is ' + name + ' and he is ' + str(
        age) + ' years old.'
""",  """
def format(name, age):
    return 'He said his name is {} and he is {} years old.'.format(name, age)
""", """
from string import Template

template = Template('He said his name is $name and he is $age years old.')

def format(name, age):
    return template.substitute(name=name, age=age)
"""

test = """
def test():
    for name in ('Fred', 'Barney', 'Gary', 'Rock', 'Perry', 'Jackie'):
        for age in range (20, 200):
            format(name, age)
"""

for fmt in format:
    print(timeit.timeit('test()', fmt + test, number=10000))
```

Here is a diagram of the execution times of the various tested methods:

![Benchmark results](/img/f-strings-1.png)

As with all benchmarks, keep in mind that many factors play a role when formatting and this serves only as a rough guidance. Particularly, I noticed that when using "d" as a format specifier for the integer number, the prominence of the f-string execution time was largely diminished. Maybe there is still room for optimization here. But formatting with f-strings was still the fastest method.

## Support for f-strings in PyCharm

If you like the [PyCharm](https://www.jetbrains.com/pycharm/) IDE (I definitely do), you will be glad to hear that it fully supports Python 3.6 and f-strings. Code completion works with expressions embedded inside f-strings just like with ordinary expressions, and there is even a code intention that suggests to "convert to f-string literal". This means if you have an old Python program that still uses the `.format()` method, you can just press `Alt`+`Enter` and select that intention to convert everything to the new syntax. So you have no more excuses to not switch over.
