---
layout: layouts/post.njk
title: Running Out-of-Tree LLVM Passes at LTO
date: 2026-01-14
desc: How to run out-of-tree LLVM passes at LTO using clang
tags:
  - posts
  - llvm
  - clang
---

I had a long time trying to find the proper way to run LLVM pass plugins at LTO.
There were a lot of times where I found a solution and it turned out to be flimsy and break under some circumstances, or not fully support all the features I needed.
This post gives your my solution and concludes with some thoughts about _why_ this solution works.
If anyone knows that I am correct/wrong please confirm/correct me.
Otherwise, take the explanation with a grain of salt, I have not extensively tested it.

## My Solution
In the examples, I will use a hypothetical LLVM pass plugin where:
* `MyPlugin.so` is the shared object containing the LLVM pass plugin.
* `MyPass` is the name of a pass in the plugin (registered with the new pass manager).
* `--my-flag` is a compiler flag that is registered in the plugin.

A typical invocation of this pass using `opt` would look like:
```bash
opt -load-pass-plugin=MyPlugin.so \
    -passes='MyPass' \
    --my-flag \
    ...
```

So, if you want to run this pass under the linker, it would look a little different:
```bash
ld.lld --load-pass-plugin=MyPlugin.so \
       --lto-newpm-passes='MyPass' \
       -mllvm=-load=MyPlugin.so \
       -mllvm=--my-flag \
       ...
```
The above solution comes from an `lld` test: https://github.com/llvm/llvm-project/blob/main/lld/test/ELF/lto/ltopasses-extension.ll

So now, let's do the same thing for `clang` with LTO enabled:
```bash
clang -flto=full -fuse-ld=lld \
      -Wl,--load-pass-plugin=MyPlugin.so \
      -Wl,--lto-newpm-passes='MyPass' \
      -Wl,-mllvm=-load=MyPlugin.so \
      -Wl,-mllvm=--my-flag \
      ...
```

## My Understanding
The first `-load-pass-plugin=MyPlugin.so` loads your pass plugin with lld, which runs pipeline parsing on `--lto-newpm-passes='MyPass'` to construct the `llvm::PassBuilder`.
So, if you did not load your plugin, this would result in an error during parsing.

The second `-mllvm=-load=MyPlugin.so` is passed to the actual invocation of the LLVM optimizer, making your pass plugin available internally.
From my debugging, you only need this `-load` to populate your flags (e.g., `--my-flag`), the first `-load-pass-plugin` is sufficient to run your pass without flags.

I ran a couple of tests to back up these claims:

Omitting the first `-load-pass-plugin=MyPlugin.so`:
```bash
LLVM ERROR: unable to parse pass pipeline description 'MyPass': unknown pass name 'MyPass'
```

Omitting the second `-mllvm=-load=MyPlugin.so`:
```bash
ld.lld: error: --mllvm: ld.lld: Unknown command line argument '--my-flag'.
```


## Concluding Remarks
LLVM's new pass manager is very {un,under}documented, I will try to share my own experiences with it here when I learn something new.
If you similarly get something to work, it would be great if you could share it with the community!
I have found a surprising lack of community notes (blog posts, mailing lists, etc.) about the new pass manager, which is a little concerning.
There are a lot of "weird" LLVM use cases and a critical mass of documentation is one way we can get around individually debugging the same mechanism ad infinitum.
