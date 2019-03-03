import * as Soup from 'Soup'
import {Request} from 'Request'
import {ResponseImpl, Response} from 'Response'
const Route = require('Route')

/** 
 * Joy!!!  
 * 
 * A Hapi style plugin wrapper and router for Soup.Server
 */
export class Server {
    srv: Soup.Server
    info: any
    routes: any[]
    engines: any
    plugins: any[]
    constructor() {
        this.info = {}
        this.routes = []
        this.plugins = []
        this.engines = {}
    }
    /**
     * Set connection options
     * @param options 
     */
    connection(options:any) {
        for (let key in options) 
            this.info[key] = options[key]
    }
    /**
     * Define Route
     * @param options 
     */
    route(options:any): Server {
        if (Array.isArray(options)) {
            for (let i in options) {
                this.route(options[i])
            }
            return
        }

        options.pattern = new Route(options.path)
        this.routes.push(options)
        return this
    }
    /**
     * abstract method
     * @param options 
     */
    views(options:any) {}
    /**
     * Register plugin
     * @param plugin 
     * @param next 
     */
    register(plugin:any, next:Function) {
        if (!Array.isArray(plugin)) plugin = [plugin]
        for (let i in plugin) {
            this.plugins.push(plugin[i])
            plugin[i].register.register(this, plugin[i].options)
        }
        next(false)
    }
    /**
     * Extend a server component from plugin
     * @param type 
     * @param property 
     * @param method 
     */
    decorate(type: string, property: string, method: Function) {
        switch(type) {
            case 'server':  Server.prototype[property] = method; return
            case 'request': Request.prototype[property] = method; return
            case 'reply':   ResponseImpl.prototype[property] = method; return
        }
    }

    /**
     * Start serving
     * @param next 
     */
    start() {
        this.srv = new Soup.Server()        
        this.srv.add_handler(null, (srv, msg, path, query, client) => {
            const request = new Request(srv, msg, path, query, client)
            for (let i in this.routes) {
                const route = this.routes[i]
                if (request.match(route)) {
                    const reply = new Response(request)
                    route.handler.call(this, request, reply)
                    return
                }
            }
        }, null, null)
        return !this.srv.listen_all(this.info.port, 0)
    }
}
