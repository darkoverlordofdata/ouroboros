//browserify --standalone bundle src/node.js -o src/browserified.js

declare module 'callable' {
    export function Callable(ctor, method?, args?)
    export function factory(ctor, method?)
}

declare class Route {
    constructor(path: string)
    match(path: string): any
    reverse(params: any): string
}
