### Ouroboros ###

Self Serving Browser

### dependencies

Clean install on eOS:

sudp apt install gjs
sudo apt install libwebkitgtk-3.0-dev
sudo apt install libgda-5.0-dev
sudo apt install libsoup-2.4-dev

### build

I use vscode. ctrl-b to build, f5 to run

or 'tsc' to build from command line
### install

this doesn't use the autogen style install recomended by gnome.
it's a typescript app, and has a custom install script.

```
git clone git@github.com:darkoverlordofdata/ouroboros.git
cd ouroboros
npm install
tsc 
./install
```

### testimonials

'this is like WebKat squared!' - Bosco