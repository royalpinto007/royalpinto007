"""Export the original render's .blend as a lightweight interactive model.

blender -b /path/to/liquid-chrome.blend -t 2 --python scripts/export-coastal-sculpture.py -- public/scene/coastal-sculpture.glb
Generate the .blend with render-coastal-chrome.py first. No camera/light/HDR is shipped.
"""
from pathlib import Path
import sys
import bpy

bpy.ops.object.select_all(action='DESELECT')
for obj in list(bpy.context.scene.objects):
    if obj.type not in {'MESH', 'CURVE'}:
        continue
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    if obj.type == 'CURVE':
        obj.data.bevel_resolution = 3
        bpy.ops.object.convert(target='MESH')
    for modifier in list(obj.modifiers):
        if modifier.type == 'BEVEL':
            modifier.segments = 2
    modifier = obj.modifiers.new('Interactive geometry budget', 'DECIMATE')
    modifier.ratio = .45
output = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
output.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=str(output), export_format='GLB', use_selection=True,
                          export_apply=True, export_cameras=False, export_lights=False, export_yup=True)
print('Exported original sculpture:', output.stat().st_size, 'bytes')
