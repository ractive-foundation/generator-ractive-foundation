# generator-ractive-foundation [![Build Status](https://secure.travis-ci.org/ivanwills/generator-ractive-foundation.png?branch=master)](https://travis-ci.org/ivanwills/generator-ractive-foundation)

## Getting Started

Install yeoman and the ractive-foundation generator:

```bash
npm install -g yo
npm install -g generator-ractive-foundation
```

### Starting a new ractive-foundation project

```bash
mkdir my-project
cd my-porject
yo ractive-foundation
```

This will initialize you new ractive-foundation project

### Creating a new component

```bash
yo ractive-foundation:component
```

This will ask you for you directory structure to store your components
(defaulting to src/components), and then it will ask for the name of your
component.

## Working on generator-ractive-foundation

If you want to contrubute / develop generator-ractive-foundation the following
can be helpful

```javascript
# globally install yeoman
npm install -g yo
git clone git@github.com:ractive-foundation/generator-ractive-foundation.git
cd generator-ractive-foundation
npm install
npm link
```

This will allow you to work on the generator-ractive-foundation code and see
your changes when ever you runt ```yo ractive-foundation```.
