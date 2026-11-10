# OG WebWorks: image prompts

> **Palette (v2, from the logo):** navy #030820, cyan #12D6F8, azure #0A95FC, blue #1D6DFF, ice #A1C1FA. In the prompts below, read "lime" as cyan and "violet" as electric blue. The existing images were recoloured from lime/violet with `scripts/recolor-images.py`.

11 image slots. Each one shows a labelled placeholder on the site until its file is added.

## Workflow
1. Generate each image with the prompt below. Use the **Base style** and **Negative prompt** every time, so the set matches.
2. Save the best result into `images-src/` with the **exact file name** shown (e.g. `pillar-build.png`).
3. Run `npm run images`. Each image is cropped to its slot's size and compressed to WebP (`og` becomes JPEG) in `public/images/`.
4. Commit `public/images/*` and push. The next build picks the images up automatically.

**Tips**
- Generate at the largest size your tool offers, in the aspect ratio listed. The script crops the rest.
- Make 4 variations per prompt and pick the one with **no garbled text** on screens. AI tools invent fake letters, so ask for "abstract blocks, no readable text".
- Check hands and fingers in any image that shows people.

## Which tool, and licensing
| Tool | Strength | Commercial use |
|---|---|---|
| **Midjourney v7** | Most cinematic, best for 3D renders and moody scenes | Paid plan required (a larger plan if your company earns over $1M/yr) |
| **ChatGPT (GPT image) / DALL·E** | Follows detailed instructions well, good with layouts | Allowed under OpenAI terms |
| **Adobe Firefly** | Trained on licensed stock, the "safest" for commercial use | Allowed; IP indemnity is offered on enterprise plans |
| **Ideogram / Flux / Leonardo** | Good alternatives; Ideogram handles text best | Check each plan's terms |

**Honesty rule:** don't present AI-generated people as your real team or clients. The studio prompts avoid identifiable faces. For a team section, use real photos.

---

## Base style (paste at the start or end of every prompt)
> Premium tech-agency visual, cinematic and moody. Deep midnight-navy environment (#030820 to #0C1A4A). Accent lighting in bright cyan (#12D6F8) and electric blue (#1D6DFF), with soft ice-blue highlights (#A1C1FA). Soft volumetric light, subtle film grain, shallow depth of field, crisp detail, clean composition with generous negative space. Modern, confident, original.

## Negative prompt (paste into "negative" / "--no", or end with "Avoid: …")
> text, words, letters, numbers, typography, captions, logos, brand names, watermarks, signatures, UI labels, garbled writing, blurry, low resolution, oversaturated, cartoonish, clip-art, stock-photo clichés (handshakes, thumbs up, people pointing at screens), distorted hands, extra fingers, faces looking at camera

**Midjourney suffix:** `--ar <ratio> --style raw --v 7 --s 150 --no text, letters, logos, watermark`

---

## 1. `pillar-build`: Services card "Original." (Build)
**Size:** 1600×900 · **Ratio:** 16:9 (`--ar 16:9`)
> A three-quarter, slightly top-down photograph of a minimalist designer's desk at night. In the centre, an open silver laptop shows an abstract website layout made only of clean blocks, rounded image placeholders and a glowing lime button shape (no readable text). Beside it: a dotted sketchbook with hand-drawn wireframe boxes and arrows, a black fine-liner pen, a stylus, and three paper colour swatch cards in lime, violet and coral. The laptop screen is the main light source, casting lime and violet light across the matte dark desk. 35mm lens, f/2, shallow depth of field, the laptop in sharp focus. Keep the top 30% of the frame darker and calmer. [Base style]

## 2. `pillar-grow`: Services card "Digital." (Grow)
**Size:** 1600×900 · **Ratio:** 16:9
> Abstract 3D render of growth. Six rising bars made of frosted glass and brushed dark metal stand on a glossy black reflective floor, increasing in height from left to right. The two tallest bars glow electric lime from inside; the rest are translucent violet. A smooth luminous lime trend line arcs over the bars and ends in a bright glowing node, with a soft light flare. Small floating spheres drift like data points. Volumetric fog, rim lighting, Cinema 4D / Octane look, ultra clean. Low camera angle looking slightly up for a heroic feel. [Base style]

## 3. `pillar-fix`: Services card "Solutions!" (Fix)
**Size:** 1600×900 · **Ratio:** 16:9
> Moody close-up photograph of a developer's setup in a dark room. In the foreground, a low-profile dark mechanical keyboard with soft violet underglow. Behind it, a monitor shows heavily blurred, out-of-focus lines of colourful code: abstract horizontal strokes, completely unreadable. One highlighted line in the middle transitions from coral red on the left to bright lime green on the right, suggesting an error being fixed. A small round status light on the desk glows lime green. Bokeh highlights, cinematic contrast, calm feeling of control. 50mm, f/1.8. [Base style]

## 4. `studio-main`: Studio section, large image
**Size:** 1600×900 · **Ratio:** 16:9 (`--ar 16:9`)
> Wide interior photograph of a small, modern digital design studio at dusk. Polished concrete wall, warm oak desks, two large monitors showing colourful abstract website designs (blurred, no readable text), an open laptop, a pinboard with printed colour palettes in lime, violet and coral, a few green plants, a designer chair. A floor-to-ceiling window shows soft out-of-focus city lights at blue hour. Thin LED strips cast lime and violet accent light along a shelf. No people, or one person seen from behind and out of focus. Editorial architecture-magazine style, 24mm lens, balanced and inviting. [Base style]

## 5. `studio-detail`: Studio section, small overlapping image
**Size:** 1000×1000 · **Ratio:** 1:1 (`--ar 1:1`)
> Overhead close-up photograph of two hands sketching website wireframes with a black fine-liner in a dotted notebook. Visible on the desk: the edge of a laptop glowing violet, three colour swatch cards (lime, violet, coral), a ceramic coffee cup, a ruler. Natural, realistic hands with correctly formed fingers, neutral sleeves, no jewellery, face not visible. Soft window light mixed with violet screen glow on a dark walnut desk. Shallow depth of field, tactile and human. [Base style]

## 6. `process`: Process section, image under the heading
**Size:** 1500×1000 · **Ratio:** 3:2 (`--ar 3:2`)
> Isometric 3D illustration of a website's journey, shown as five small floating platforms arranged diagonally from bottom-left to top-right and connected by a glowing lime path. Platform 1: a magnifying glass over a map (Discover). Platform 2: a design canvas with colour swatches and geometric shapes (Design). Platform 3: stacked code blocks with small gears (Build). Platform 4: a small rocket lifting off a launch pad with soft smoke (Launch). Platform 5: a rising bar chart with an upward arrow (Grow). Soft matte clay material, rounded edges, gentle shadows, on a dark ink-navy background with violet ambient light, lime path glow and small coral accents. Calm, premium, lots of breathing room, no text. [Base style]

## 7. `industry-ecommerce`: "Who we help" tile
**Size:** 1600×900 · **Ratio:** 16:9. **Keep the bottom third calm; the title sits over it.**
> Premium product-photography scene. A smartphone stands on a matte dark plinth, showing an abstract online-store page: a large product image block, a price pill shape and a glowing lime "buy" button shape (no readable text). Beside it, neatly stacked kraft-paper shipping boxes tied with twine and a small matte black shopping bag. Violet rim light from behind, lime glow from the phone screen, dark ink background fading to near-black at the bottom. Commercial look, 50mm, subject in the upper part of the frame. [Base style]

## 8. `industry-healthcare`: "Who we help" tile
**Size:** 1600×900 · **Ratio:** 16:9. **Keep the bottom third calm.**
> Calm, modern clinic reception at early evening. A light oak reception counter with a tablet on a stand showing an abstract appointment-booking calendar (coloured blocks, a lime "confirm" shape, no readable text). Soft sage-green walls and a plant behind, out of focus. Warm ceiling light mixed with subtle violet accent lighting so it matches a dark brand. Clean, trustworthy, reassuring. No people, or a receptionist far in the background and out of focus. The lower third fades into deep shadow. 35mm. [Base style]

## 9. `industry-professional`: "Who we help" tile
**Size:** 1600×900 · **Ratio:** 16:9. **Keep the bottom third calm.**
> Elegant consulting or law office desk at golden hour. Walnut desk, leather notebook, fountain pen, reading glasses and an open laptop showing an abstract, refined website with large heading blocks and a single lime button shape (no readable text). Blurred bookshelves and a window in the background. Warm sunlight mixed with a cool violet glow from the screen. Refined, trustworthy, editorial. The lower third falls into rich dark shadow. 50mm, f/2. [Base style]

## 10. `industry-saas`: "Who we help" tile
**Size:** 1600×900 · **Ratio:** 16:9. **Keep the bottom third calm.**
> Abstract 3D render of a software product. Several floating frosted-glass dashboard panels layered in depth: a line chart, a donut chart, toggle switches, plain circular avatar shapes, progress rings. They're linked by thin glowing lime lines and hover above a dark perspective grid floor, with a soft violet nebula glow behind. Crisp, futuristic, product-launch-keynote aesthetic. No readable text or numbers. [Base style]

## 11. `og`: social share image (WhatsApp, LinkedIn, X, Facebook previews)
**Size:** 1200×630 · **Ratio:** ~1.91:1 (`--ar 40:21`)
> Wide dark background for a social media share card. Ink-navy gradient with a faint perspective grid fading into the distance. On the right third, a floating open laptop rendered in glass and dark metal; its screen glows with an abstract website layout, surrounded by a soft lime and violet light bloom and a thin glowing upward trend line. Keep the **left 55% of the image empty and dark** for text. Clean, premium, cinematic. [Base style]

**Then add the text yourself** (Canva, Figma or Photoshop). AI tools still misspell words. In the empty left area add:
- "OG WebWorks" in white, bold geometric sans-serif (Space Grotesk), with "Works" in lime #C6F432
- "Original. Digital. Solutions!" below it in large type
- "ogwebworks.com" small, in grey #9AA0B4

Export as PNG, save as `images-src/og.png`, then run `npm run images`.
