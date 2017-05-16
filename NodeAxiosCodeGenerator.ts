declare function require(module: string): any;

declare function registerCodeGenerator(callback: Object): void;

declare interface Request {
    name: string;
    url: string;
    method: string;
    headers: Object;
    body: any;
    httpBasicAuth: Object;
    followRedirects: boolean,
    sendCookies: boolean,
    storeCookies: boolean,
    timeout: number
}

class ParsedURL {
    public schema = 'http';
    public host = 'localhost';
    public port = 80;
    public path = '/';

    constructor(url: string) {
        const regexp = /(https?):\/\/([^\/:]+):?(\d*)(\/?.*)/;
        const match = url.match(regexp);

        if (match) {
            this.schema = match[1];
            this.host = match[2];
            this.port = match[3].length > 0 ? +match[3] : (() => {
                if (this.schema == 'https') return 443;
                return 80;
            })();
            this.path = match[4];
        }
    }
}

class NodeAxiosCodeGenerator {
    static title = "Node.js (require Axios)";
    static fileExtension = "js";
    static languageHighlighter = "js";
    static identifier = "io.jiblatech.PawExtensions.NodeAxiosCodeGenerator";

    private multipleRequestNotice(request: Request[]) {
        if (request.length > 1) {
            return "// Warning: requests below are going to be executed in parallel\n\n"
        }
        return '';
    }

    public generate(context: any, requests: Request[], options) {
        if (!Array.isArray(requests)) {
            requests = [context.getCurrentRequest()];
        }
        return this.multipleRequestNotice(requests) + requests.map(this.generateRequest).join("\n");
    }


    private generateRequest(request: Request) {
        const headers = request.headers;
        for (let key in headers) {
            headers[key] = headers[key].trim();
        }

        const parsedUrl = new ParsedURL(request.url);

        return `
        
        async function request() {
        
            const axios = require('axios') 
        
            let response = await axios({
                method: '${request.method}',
                url: '${request.url}',
                headers: ${JSON.stringify(request.headers)},
                data: ${JSON.stringify(request.body)}
            })
            
            return response.data
        }
        `

        // `// request ${request.name}
// (function(callback) {
//     'use strict';
//
//     const httpTransport = require('${parsedUrl.schema}');
//     const responseEncoding = 'utf8';
//     const httpOptions = {
//         hostname: '${parsedUrl.host}',
//         port: '${parsedUrl.port}',
//         path: '${parsedUrl.path}',
//         method: '${request.method}',
//         headers: ${JSON.stringify(headers)}
//     };
//     httpOptions.headers['User-Agent'] = 'node ' + process.version;
//
// ${
//     (request.httpBasicAuth?   '    // Using Basic Auth ' + JSON.stringify(request.httpBasicAuth) + "\n" : '') +
//     (request.followRedirects? "    // Paw Follow Redirects option is not supported\n" : '') +
//     (request.storeCookies?    "    // Paw Store Cookies option is not supported\n" : '')
// }
//     const request = httpTransport.request(httpOptions, (res) => {
//         let responseBufs = [];
//         let responseStr = '';
//
//         res.on('data', (chunk) => {
//             if (Buffer.isBuffer(chunk)) {
//                 responseBufs.push(chunk);
//             }
//             else {
//                 responseStr = responseStr + chunk;
//             }
//         }).on('end', () => {
//             responseStr = responseBufs.length > 0 ?
//                 Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
//
//             callback(null, res.statusCode, res.headers, responseStr);
//         });
//
//     })
//     .setTimeout(${request.timeout})
//     .on('error', (error) => {
//         callback(error);
//     });
// ${
//     (request.body.length > 0) ? '    request.write(' + JSON.stringify(request.body) + ');' : ''
// }
//     request.end();
//
//
// })((error, statusCode, headers, body) => {
//     console.log('ERROR:', error);
//     console.log('STATUS:', statusCode);
//     console.log('HEADERS:', JSON.stringify(headers));
//     console.log('BODY:', body);
// });
// `
    }
}

registerCodeGenerator(NodeAxiosCodeGenerator)
