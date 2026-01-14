---
layout: layouts/post.njk
title: Private Fork of Git Repo
date: 2026-01-14
published: true
desc: Different options for creating private forks of public git repositories.
tags:
  - posts
  - github
---

I find myself creating a private fork of public repositories rather frequently.
There are a variety of benefits to this over just create a public fork and working there, but that's not what this post is about.
I have found two solutions to this problem, which I will go over in this post.

## `git-private-fork`
  
The first solution works when making a private fork of any git repository:

```bash
# Clone the version control data of the public repository.
git clone --bare ${PUBLIC_REPO} ${PUBLIC_REPO_DIR}

# Enter the cloned directory
cd ${PUBLIC_REPO_DIR}

# Push an exact copy of the git repository.
git push --mirror ${PRIVATE_REPO}

# Leave the cloned directory
popd

# Clean up.
rm -rf ${PUBLIC_REPO_DIR}

git clone ${PRIVATE_REPO} ${PRIVATE_REPO_DIR}

if [ ! -z ${SET_UPSTREAM+x} ] ; then
    pushd ${PRIVATE_REPO_DIR}
    git remote add upstream ${PUBLIC_REPO}
    git remote set-url --push upstream DISABLE
    popd
fi
```

I will usually go ahead and set the public repo as my upstream too:
```bash
git remote add upstream ${PUBLIC_REPO}
git remote set-url --push upstream DISABLE
```

You can find this solution with some other little improvements at [github.com/tommymcm/git-tools/](https://github.com/tommymcm/git-tools/).
Feel free to open any issues/PRs there. 

## GitHub Import
There is one known issue though, which comes up when forking rather large repositories (like `llvm/llvm-project`).
For large repositories, you may hit single-push limits (2GiB on GitHub).
I have toyed around with making a general-purpose solution in `git-private-fork`, but I couldn't ever get one that handled all the edge cases (rate-limits, size-limits, granularity).

Instead of fixing that, I typically just fallback to importing the repository on GitHub.
Disclaimer, that I don't know of a solution for other hosts like gitlab or codeberg because I don't use them.
I'd assume they have a similar feature though.

To create your private fork by importing, go to [github.com/new/import](https://github.com/new/import).
It's self explanatory.

Disclaimer, this is a pretty slow process for large repositories.
However, it's the perfect thing to run while you go grab lunch, or write a blog post.

## Acknowledgments
I'd like to thank [0xjac](https://gist.github.com/0xjac) and [ConfoundingVariables](https://gist.github.com/ConfoundingVariables) on GitHub for providing the original solutions in a [Gist](https://gist.github.com/0xjac/85097472043b697ab57ba1b1c7530274) and the [comments](https://gist.github.com/0xjac/85097472043b697ab57ba1b1c7530274?permalink_comment_id=4717207#gistcomment-4717207).
