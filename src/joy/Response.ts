import * as Soup from 'Soup'
import {Request} from 'Request'
import * as callable from 'callable'

/** Joy!!! */


/**
 * Response Object Implementation
 * 
 * this wraps the output from the session
 */
export class ResponseImpl {
    request: Request
    constructor(request: Request) {
        this.request = request
    }
    /**
     * Default response behavior - send the string
     * @param text 
     */
    __call__(text: string) {
        this.request.msg.set_response("text/html", Soup.MemoryUse.COPY, text, text.length)
        this.request.msg.set_status(200)
    }
    redirect(url:string) {
        this.request.msg.set_redirect(302, url)
    }
    code(statusCode:string) {
        this.request.msg['status-code'] = statusCode
    }
}

/**
 * Callable proxy for the Response Implementation
 * 
 * const reply = new Response(request)
 * reply('hello world')
 * reply.file('index.html')
 * 
 */
export const Response = callable.factory(ResponseImpl)
