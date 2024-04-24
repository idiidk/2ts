# 2ts

A CLI to generate TypeScript models based on JSON. Uses the amazing [json-ts](https://github.com/shakyShane/json-ts) package by shakyShane under the hood but expands on it to generate files and automatically resolves imports. Much love to the original package creator though, this wouldn't be possible otherwise <3.

## Installation
```
npm install -g @codebrouwers/2ts
```

## Usage

### argv.help

Outputs all possible options and their default values. options can be set with `--{name}` or `-{first letter}`, like `--name` or `-n`.

```bash
$ 2ts --help
2ts - by idiidk
  argv.name RootObject
  argv.prefix
  argv.kebab false
  argv.directory false
  argv.clip false
  argv.help true
```

### argv.name

The name of the file and the interface of the root object to be generated. Example:

```bash
$ 2ts --name MyRootObject <<< '{ "a": "b" }'
generating MyRootObject
  argv.name MyRootObject
  argv.prefix
  argv.kebab false
  argv.directory false
  argv.clip false
  argv.help false

+ RootObject.ts

$ cat MyRootObject.ts
export interface MyRootObject {
   a: string;
}
```

### argv.prefix

A prefix to use for all files and interfaces to be generated. Example:

```bash
$ 2ts --name MyRootObject --prefix Model <<< '{ "a": "b" }'
generating MyRootObject
  argv.name MyRootObject
  argv.prefix Model
  argv.kebab false
  argv.directory false
  argv.clip false
  argv.help false

+ ModelMyRootObject.ts

$ cat ModelMyRootObject.ts
export interface ModelMyRootObject {
    a: string;
}
```

### argv.kebab

Use kebab-case for the generated files but keep the original interface name. Example:

```bash
$ 2ts --name MyRootObject --prefix Model --kebab <<< '{ "a": "b" }'
generating MyRootObject
  argv.name MyRootObject
  argv.prefix Model
  argv.kebab true
  argv.directory false
  argv.clip false
  argv.help false

+ model-my-root-object.ts

$ cat model-my-root-object.ts
export interface ModelMyRootObject {
    a: string;
}
```

### argv.directory

Create a directory for all the files generated to be contained in. Example:

```bash
$ 2ts --name MyRootObject --prefix Model --kebab --directory <<< '{ "a": "b", "user": { "name": "test" } }'
generating MyRootObject
  argv.name MyRootObject
  argv.prefix Model
  argv.kebab true
  argv.directory true
  argv.clip false
  argv.help false

+ model-my-root-object.ts
+ model-user.ts

$ ls model-my-root-object/
model-my-root-object.ts  model-user.ts

$ cat model-my-root-object/model-user.ts
export interface ModelUser {
    name: string;
}
```

### argv.clip

Use the clipboard as input. Uses [clipboardy](https://www.npmjs.com/package/clipboardy), a cross-platform library to read the clipboard. No other functionality changes.
