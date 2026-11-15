# Home scene art

The built-in image-generation tool created the sunset environment. Royal's original illustrated portrait served only as the style and palette reference; the portrait itself remains unchanged. The environment is rendered separately from the original portrait, whose silhouette is clipped in CSS.

Production assets:

- `public/scene/sunset-coast.webp`
- `public/scene/sunset-coast-mobile.webp`

Final generation prompt:

> Use case: stylized-concept. Asset type: panoramic background environment for a personal software engineer portfolio hero, 16:9 landscape, no UI, no lettering. Use the attached portrait ONLY as an illustration style and color reference; do not reproduce or include the man. Create a cinematic coastal sunset world with luminous sky blue, muted violet, dusty pink clouds, warm peach sunlight and sparkling reflections. Composition: an open, spacious pale sky occupies the upper two thirds, with especially calm light-blue and peach negative space across the LEFT half for dark navy website typography. A glowing low sun on the RIGHT, a reflective ocean and a distant coastal skyline along the lower quarter; a few elegant palm silhouettes only at the far right edge. Painterly illustration with sophisticated natural atmospheric depth, premium cinematic game key-art lighting inspired by a sunlit Miami coast. Strong focal lighting and beautiful reflected glints, balanced color, no full-canvas neon saturation. Foreground should remain clear so a separate interactive portrait can float on the right. Not a photograph, not a website mockup. No people, cars, logos, typography, borders, or watermarks. The original portrait file will remain unchanged and be layered separately in code.

The original generated PNG stays outside the repository. The production WebP copies are approximately 141 KB and 48 KB. CSS supplies small water glints, lighting and slow camera drift; the generated raster is a still environment. A shared pause control and visibility/reduced-motion handling govern those effects. Pointer parallax moves the unchanged portrait as one layer; a lighting selector changes the environment treatment.

The original 460px portrait is still byte-identical. `public/scene/portrait-silhouette.svg` is a vector contour mask used in CSS to exclude the original sky. The refined contour follows the hair, cheek and neck, rounds small steps with quadratic curves, and applies a 0.65-source-pixel morphological inset to exclude edge antialiasing. The mask is checked at three times source size on ivory and vivid pink backgrounds. It contains no generated foreground pixels. An experimental generated cutout was rejected because it redrew facial details and is not shipped. The existing environment is reused across the reel and coastal theme; no additional raster scenery is downloaded for the rest of the site.

## Dusk coast across the portfolio

The portfolio uses one authored appearance with no theme toggle. Warm ivory text, coral highlights, deep violet scene surfaces and blue ocean lighting carry across Home, Projects, Contact and the shared shell. Royal's latest direction explicitly replaces the preceding pale coastal surfaces. The contribution calendar keeps its honest green scale on a locally neutral background.

Visual references: [Rockstar's GTA VI site](https://www.rockstargames.com/VI) for a coherent coastal world, and [Joseph Santamaria's portfolio case study](https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/) for continuity between composed scenes. These inform the art direction; no Rockstar artwork, fonts, scripts or game assets are shipped. The existing generated coast is reused, with no new raster payload.

Product illustrations use lit glass surfaces and a scroll-controlled light sweep in the existing GSAP lifecycle. Reduced-motion and no-JavaScript visitors keep complete static illustrations. The Remotion scenes, poster and navigation use the same palette.
