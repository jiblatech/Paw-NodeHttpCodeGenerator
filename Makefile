identifier=io.andrian.PawExtensions.NodeHttpCodeGenerator
extensions_dir=$(HOME)/Library/Containers/com.luckymarmot.Paw/Data/Library/Application Support/com.luckymarmot.Paw/Extensions/

.PHONY: install archive

node_modules:
	npm install 
 
NodeHttpCodeGenerator.js: NodeHttpCodeGenerator.ts node_modules
	tsc

install: NodeHttpCodeGenerator.js
	mkdir -p "$(extensions_dir)$(identifier)/"
	cp README.md NodeHttpCodeGenerator.js LICENSE "$(extensions_dir)$(identifier)/"

archive:
	rm -Rf ./build/ 
	mkdir -p "./build/$(identifier)"
	cp README.md NodeHttpCodeGenerator.js LICENSE "./build/$(identifier)"
	cd ./build/; zip -r nodejsGenerator.zip "$(identifier)/"
