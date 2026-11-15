"""Render an original liquid-chrome sculpture with Blender's CPU Cycles renderer.

blender -b -t 2 --python scripts/render-coastal-chrome.py -- /path/to/render.png
The transparent render is optimized into responsive WebP assets for WorldScene.
"""
import bpy
import math
import sys
from pathlib import Path
from mathutils import Vector

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 8
scene.render.threads_mode = 'FIXED'
scene.render.threads = 2
scene.render.resolution_x = 1200
scene.render.resolution_y = 960
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'AgX'


def material(name, color, metal=0, roughness=.25, transmission=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Transmission Weight'].default_value = transmission
    bsdf.inputs['IOR'].default_value = 1.46
    return mat

chrome = material('Coastal silver', (.72, .83, .92), metal=1, roughness=.14)
rose = material('Rose quartz glass', (.76, .22, .39), roughness=.14, transmission=.68)
blue = material('Jacket-blue glass', (.08, .30, .64), roughness=.13, transmission=.65)
ivory = material('Warm porcelain', (.89, .82, .70), roughness=.26)
peach = material('Peach ceramic', (.75, .37, .28), roughness=.24)

# A coastal panorama supplies the colored reflection environment only. It is
# invisible to the camera, so the sculpture sits over the live section scenery.
world = bpy.data.worlds.new('Coastal daylight')
scene.world = world
world.use_nodes = True
nodes = world.node_tree.nodes
bg = nodes.get('Background')
env = nodes.new('ShaderNodeTexEnvironment')
env.image = bpy.data.images.load(str(Path(__file__).resolve().parents[1] / 'public/scene/environments/marina.webp'))
world.node_tree.links.new(env.outputs['Color'], bg.inputs['Color'])
bg.inputs['Strength'].default_value = .65


def finish(obj, mat, bevel=0):
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Soft crafted edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 4
        obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    return obj


# Broad asymmetric steps ground the suspended sculpture without a boxed frame.
for radius, depth, z, mat in [(2.12, .22, .16, peach), (1.94, .17, .34, ivory), (1.56, .12, .48, ivory)]:
    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=radius, depth=depth, location=(0, 0, z))
    obj = bpy.context.object
    obj.scale.y = .77
    finish(obj, mat, .07)

# A continuous trefoil has real interlocking reflections, rather than painted
# gradients on a sphere. The curve is deterministic and reproducible.
curve = bpy.data.curves.new('Liquid trefoil', 'CURVE')
curve.dimensions = '3D'
curve.resolution_u = 2
curve.bevel_depth = .19
curve.bevel_resolution = 6
spline = curve.splines.new('POLY')
spline.points.add(383)
for i, point in enumerate(spline.points):
    t = i * 2 * math.pi / 384
    radius = 1.08 + .36 * math.cos(3 * t)
    point.co = (radius * math.cos(2 * t), .48 * math.sin(3 * t), 2.15 + radius * math.sin(2 * t), 1)
spline.use_cyclic_u = True
sculpture = bpy.data.objects.new('Liquid chrome knot', curve)
bpy.context.collection.objects.link(sculpture)
sculpture.rotation_euler.z = math.radians(-16)
curve.materials.append(chrome)

for location, scale, mat in [((-1.50, -.20, 1.22), (.35, .35, .54), blue), ((1.57, .10, 2.24), (.31, .31, .46), rose), ((.97, -.89, .77), (.26, .26, .26), chrome), ((-1.04, -.82, .77), (.18, .18, .18), chrome)]:
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=32, location=location)
    obj = bpy.context.object
    obj.scale = scale
    finish(obj, mat)

# A restrained fine orbit supplies a second material and a sense of direction.
bpy.ops.mesh.primitive_torus_add(major_radius=1.85, minor_radius=.022, major_segments=128, minor_segments=12, location=(0, 0, 1.90), rotation=(math.radians(17), math.radians(-18), 0))
finish(bpy.context.object, peach)


def light(name, location, energy, color, size, target=(0, 0, 1.4)):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy = energy
    data.shape = 'DISK'
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat('-Z', 'Y').to_euler()

light('Ivory softbox', (0, -4, 7), 950, (1, .91, .80), 5)
light('Jacket-blue rim', (-5, 1, 3.5), 750, (.36, .64, 1), 4)
light('Rose edge', (4, 2, 4), 1050, (1, .42, .61), 3)

camera_data = bpy.data.cameras.new('Camera')
camera = bpy.data.objects.new('Camera', camera_data)
bpy.context.collection.objects.link(camera)
camera.location = (5, -10, 6.0)
camera.rotation_euler = (Vector((0, 0, 1.65)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
camera_data.type = 'ORTHO'
camera_data.ortho_scale = 6.5
scene.camera = camera
output = Path(sys.argv[sys.argv.index('--') + 1])
output.parent.mkdir(parents=True, exist_ok=True)
scene.render.filepath = str(output.resolve())
bpy.ops.wm.save_as_mainfile(filepath=str(output.with_suffix('.blend').resolve()))
bpy.ops.render.render(write_still=True)
