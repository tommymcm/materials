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
cv.pdf: _site/cv/cv.tex build
	pdflatex --shell-escape $<
