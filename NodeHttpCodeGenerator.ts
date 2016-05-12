

declare function require(module: string) : any;

declare function registerCodeGenerator(callback : Object) : void;

declare interface Request {
    url: string; 
    method: string;
    headers: Object;
    body: any;
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
            this.port = match[3].length > 0 ? +match[3] : (()=> {
               if (this.schema == 'https') return 443;
               return 80; 
            })();
            this.path = match[4];
        }
    }  
}

class NodeHttpCodeGenerator {
    static title = "Node.js (require http/https)";
    static fileExtension = "js";
    static languageHighlighter = "js";
    static identifier = "io.andrian.PawExtensions.NodeHttpCodeGenerator";

    generate(context: any) {
        const request : Request = context.getCurrentRequest();
        const headers = request.headers;
        for (var key in headers) {
            headers[key] = headers[key].trim();
        }
        
        const parsedUrl = new ParsedURL(request.url);
      
        
        return `
(function(callback) {
    'use strict';
    
    const httpTransport = require('${parsedUrl.schema}');
    const responseEncoding = 'utf8';
    const httpOptions = {
        hostname: '${parsedUrl.host}',
        port: '${parsedUrl.port}',
        path: '${parsedUrl.path}',
        method: '${request.method}',
        headers: ${JSON.stringify(headers)}
    };

    const request = httpTransport.request(httpOptions, (res) => {
        let responseBufs = [];
        let responseStr = '';
        
        res.on('data', (chunk) => {
            if (Buffer.isBuffer(chunk)) {
                responseBufs.push(chunk);
            }
            else {
                responseStr = responseStr + chunk;            
            }
        });
        res.on('end', () => {
            responseStr = responseBufs.length > 0 ? 
                Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;
            
            callback(res.statusCode, res.headers, responseStr);
        });
    });

    request.write(${JSON.stringify(request.body)});
    request.end();

})((statusCode, headers, body) => { 
    console.log('STATUS:', statusCode);
    console.log('HEADERS:', JSON.stringify(headers));
    console.log('BODY:', body);
});
`;
    }
}

registerCodeGenerator(NodeHttpCodeGenerator);
