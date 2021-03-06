
build: components index.js tree.css node.js mixin.js
	@component build --dev -o test/example/ -n index

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

blanket:
	@mocha -R html-cov --require blanket > coverage.html

test:
	@mocha -R spec

test/example/react.js:
	@curl -L -o test/example/react.js http://fb.me/react-0.5.1.js

example: test/example/react.js build
	@xdg-open test/example/index.html

gh-pages: test/example/react.js build
	rm -rf web
	cp -r test/example web
	git co gh-pages
	mv web/* ./
	rm -rf web

.PHONY: clean test
