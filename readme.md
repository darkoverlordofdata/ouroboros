### Ouroboros ###

Self Serving Browser

Gnome GJS with GTK from Typescript

### dependencies

tested with 

    tsc Version 3.3.3333
    gjs 1.52.5 
    both es5 & es6

    es5 - 100%
    es6 - callable-object not working in GJS. This is used by submodule Joy.

Clean install on eOS:

    npm
    tsc

    sudp apt install gjs
    sudo apt install libwebkitgtk-3.0-dev
    sudo apt install libgda-5.0-dev
    sudo apt install libsoup-2.4-dev

### build

I use vscode. ctrl-b to build, f5 to run

or 'tsc' to build from command line
### install

this doesn't use the autogen style install recomended by gnome.
instead, a custom install script installs to ~/.local

```
git clone git@github.com:darkoverlordofdata/ouroboros.git
cd ouroboros
npm install
tsc 
./install
```

### testimonials

'this is like WebKat squared!' - Bosco


### caveat

libwebkitgtk is an order of magnitude slower than chrome. Check out the embedded game at http://0.0.0.0:8088/shmupwarz/html using gtk, and in chrome. You'll see...