# What is this all about?

I often work with data defined in terms of a JSON Schema. So I'm quite
comfortable with the syntax of JSON Schema. When using tools like `yargs`, I
often have in mind a JSON Schema for the data I want to get back out. It is
also possible to generate JSON Schema in a couple different ways. So I thought
it would be interesting to use JSON Schema itself as a way of defining
arguments.

## Two approaches

I had two potential approaches in mind when I did this. I started with one but
ultimately ended up implementing both.

### Parse then validate

So I wrote this relatively simple function called `validateArguments` that brings together
`ajv` for schema validation and the parser in `yargs` for actually extracting data from
command line arguments. It turns out, it worked really nicely and the APIs for
both tools made this really easy. The whole thing is, admittedly, a little
trivial so I wasn't sure it was worth making an `npm` package out of this.
However, since I imagine I'll be using this across at least a couple of projects
it seems convenient to make it a package so I can easily incorporate it into
projects. Furthermore, I added another approach as made it a more substantial package...

### Build argument parser from schema

One thing I have also played around with is walking a JSON schema and
formulating the appropriate calls to `yargs` to impose the constraints imposed
by the JSON schema on the arguments. This approach is very cool because it
would provide things like `--help` functionality to the command line that would
list all possible arguments. However, a completely implementation of this would
be a lot of work and I don't even know how `yargs` would handle things like
`oneOf`, etc. So as a compromise, I implemented a function that builds the
`yargs` argument parser for _non-nested_ types with simple property types
(_i.e.,_ `string`, `boolean` and `number`).

There is a caveat in this approach...`yargs` is a bit strange when it comes to
`number` types. If you say an option is a number and then you fail to provide a
number (_i.e.,_ if the string value for the argument cannot be parsed as a
number), then `yargs` simply returns `NaN` (I've even seen `null` as well?!?).
This is not what I would prefer and [it appears I'm not
alone](https://github.com/yargs/yargs/issues/1079#issuecomment-378721093). The
point is, this is a problem in `yargs`, not in my approach here.
