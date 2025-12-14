NODE=bun run
ELEVENTY=$(NODE) eleventy

serve:
	$(ELEVENTY) --serve
