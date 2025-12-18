NODE=bun run
ELEVENTY=$(NODE) eleventy

deps:
	bun install

serve:
	$(ELEVENTY) --serve
