#!/bin/bash

set -e

function cleanup {
    rm -f testrun-*
}

function grep_assert {
    
    if grep "$1" testrun-result.txt > /dev/null
    then 
        echo PASSED: $1 found in response 
    else 
        echo FAIL: $1 not found  
        cleanup
        exit 1
    fi 
}


make NodeHttpCodeGenerator.js
cd test
cat ../NodeHttpCodeGenerator.js call.js > testrun-generator.js
node testrun-generator.js > testrun-executor.js 
node testrun-executor.js > testrun-result.txt

grep_assert post-json-key "No JSON Body found"
grep_assert https://httpbin.org/post "Can't find httpbin URL" 
grep_assert "STATUS: 200" "Do not see STATUS: 200"
grep_assert "X-Header-Value" "No Header Value found" 
cleanup