NODE=bun run
ELEVENTY=$(NODE) eleventy

all: build

deps:
	bun install

build: deps
	$(ELEVENTY)

serve: deps
	$(ELEVENTY) --serve

.PHONY: cv.pdf
cv.pdf: build
	typst compile --root _site _site/cv/cv.typ $@
