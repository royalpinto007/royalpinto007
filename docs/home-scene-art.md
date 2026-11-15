# Home scene art

The built-in image-generation tool created the sunset environment. Royal's original illustrated portrait served only as the style and palette reference; the portrait itself remains unchanged. The environment is rendered separately from the original portrait, whose silhouette is clipped in CSS.

Production assets:

- `public/scene/sunset-coast.webp`
- `public/scene/sunset-coast-mobile.webp`

Final generation prompt:

> Use case: stylized-concept. Asset type: panoramic background environment for a personal software engineer portfolio hero, 16:9 landscape, no UI, no lettering. Use the attached portrait ONLY as an illustration style and color reference; do not reproduce or include the man. Create a cinematic coastal sunset world with luminous sky blue, muted violet, dusty pink clouds, warm peach sunlight and sparkling reflections. Composition: an open, spacious pale sky occupies the upper two thirds, with especially calm light-blue and peach negative space across the LEFT half for dark navy website typography. A glowing low sun on the RIGHT, a reflective ocean and a distant coastal skyline along the lower quarter; a few elegant palm silhouettes only at the far right edge. Painterly illustration with sophisticated natural atmospheric depth, premium cinematic game key-art lighting inspired by a sunlit Miami coast. Strong focal lighting and beautiful reflected glints, balanced color, no full-canvas neon saturation. Foreground should remain clear so a separate interactive portrait can float on the right. Not a photograph, not a website mockup. No people, cars, logos, typography, borders, or watermarks. The original portrait file will remain unchanged and be layered separately in code.

The original generated PNG stays outside the repository. The production WebP copies are approximately 141 KB and 48 KB. CSS supplies small water glints, lighting and slow camera drift; the generated raster is a still environment. A shared pause control and visibility/reduced-motion handling govern those effects. Pointer parallax moves the unchanged portrait as one layer; a lighting selector changes the environment treatment.
