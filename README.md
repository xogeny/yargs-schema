# What is this all about?

I often work with data defined in terms of a JSON Schema. So I'm quite
comfortable with the syntax of JSON Schema. When using tools like `yargs`, I
often have in mind a JSON Schema for the data I want to get back out. It is
also possible to generate JSON Schema in a couple different ways. So I thought
it would be interesting to use JSON Schema itself as a way of defining
arguments. So I wrote this relatively simple function that brings together
`ajv` for schema validation and `yargs-parser` for actually extracting data from
command line arguments. It turns out, it worked really nicely and the APIs for
both tools made this really easy. The whole thing is, admittedly, a little
trivial so I wasn't sure it was worth making an `npm` package out of this.
However, since I imagine I'll be using this across at least a couple of projects
it seems convenient to make it a package so I can easily incorporate it into
projects. Furthermore, it may expand in scope in the future and if I were
copying and pasting this code around to different projects, it could become a
real maintenance nightmare.

## Why not just...

One thing I have also played around with is walking a JSON schema and
formulating the appropriate calls to `yargs` to impose the constraints imposed
by the JSON schema on the arguments. This approach is very cool because it
would provide things like `--help` functionality to the command line that would
list all possible arguments. However, a completely implementation of this would
be a lot of work and I don't even know how `yargs` would handle things like
`oneOf`, etc. So it seems much simpler to just parse the arguments using the
`yargs-parser` and then check them against a schema vs. trying to explain to
`yargs` all the possible values in a "`yargs` native" kind of way since I'm not
sure `yargs` could really express everything I'd come across. But I agree it
would be cool.
