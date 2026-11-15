"""Render a low camera angle from the authored coastal sculpture scene.

blender -b /path/to/liquid-chrome.blend -t 2 --python scripts/render-coastal-film.py -- /path/to/film-sculpture.png
"""
import bpy
import sys
from pathlib import Path
from mathutils import Vector
scene = bpy.context.scene
scene.camera.location = (4, -11, 3.9)
scene.camera.rotation_euler = (Vector((0, 0, 1.6)) - scene.camera.location).to_track_quat('-Z', 'Y').to_euler()
scene.camera.data.ortho_scale = 5.8
scene.render.resolution_x = 1200
scene.render.resolution_y = 1000
scene.cycles.samples = 32
scene.render.filepath = str(Path(sys.argv[sys.argv.index('--') + 1]).resolve())
bpy.ops.render.render(write_still=True)
