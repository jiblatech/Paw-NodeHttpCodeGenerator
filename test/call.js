function registerCodeGenerator(GeneratorClass) {
    
    let obj = new GeneratorClass();
    let request = {"id":"4C259C7D-92AF-48B2-B9FC-56C84BE1B281","name":"My API","order":0,"url":"https://httpbin.org/post","urlParameters":{},"urlParametersNames":[],"method":"POST","headers":{"X-Header-Name":"X-Header-Value","Content-Type":"application/json; charset=utf-8"},"headersNames":["X-Header-Name","Content-Type"],"body":"{\"post-json-key\":\"post-json-value\"}","jsonBody":{"post-json-key":"post-json-value"},"timeout":0,"followRedirects":false,"redirectAuthorization":false,"redirectMethod":false,"sendCookies":true,"storeCookies":true};
    
    
    process.stdout.write(obj.generate(null, [request], null))
    
} 