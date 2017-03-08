import * as Soup from 'Soup'
/**
 * Request Object
 * 
 * this wraps all the handler parameters
 */
export class Request {
    srv: Soup.Server
    msg: Soup.Message
    path: string
    query: any
    client: any
    constructor(srv: Soup.Server, msg: Soup.Message, path: string, query: any, client: any) {
        this.srv = srv
        this.msg = msg
        this.path = path
        this.query = query
        this.client = client
    }
    /**
     * True if the route matches this request path & method
     * @param route 
     */
    match(route):boolean {
        if (route.method !== this.msg['method']) return false
        if (route.path === '/*') return true
        if (route.path === this.path) return true
        if (route.pattern.match(this.path)) return true
        return false
    }
}
