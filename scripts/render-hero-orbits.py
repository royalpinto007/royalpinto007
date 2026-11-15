"""Render original separated orbital layers for the coastal portrait scene.

blender -b -t 2 --python scripts/render-hero-orbits.py -- /path/to/output
Only these original physical objects are rendered. The portrait is never loaded.
"""
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 24
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.render.threads_mode = 'FIXED'
scene.render.threads = 2
scene.render.resolution_x = 960
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.view_settings.view_transform = 'AgX'


def material(name, color, metal=0, roughness=.2, transmission=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metal
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Transmission Weight'].default_value = transmission
    bsdf.inputs['IOR'].default_value = 1.46
    return mat


chrome = material('Sky silver', (.78, .85, .92), 1, .12)
rose = material('Rose reflective glass', (.75, .23, .43), .35, .14, .35)
blue = material('Jacket blue crystal', (.08, .32, .72), .35, .12, .4)
gold = material('Peach anodized metal', (.95, .55, .28), .8, .22)
world = bpy.data.worlds.new('Original coastal reflections')
scene.world = world
world.use_nodes = True
env = world.node_tree.nodes.new('ShaderNodeTexEnvironment')
env.image = bpy.data.images.load(str(Path(__file__).resolve().parents[1] / 'public/scene/environments/marina.webp'))
world.node_tree.links.new(env.outputs['Color'], world.node_tree.nodes.get('Background').inputs['Color'])
world.node_tree.nodes.get('Background').inputs['Strength'].default_value = .8

layers = {'outer': [], 'inner': []}


def finish(obj, mat, layer, bevel=0):
    obj.data.materials.append(mat)
    if bevel:
        mod = obj.modifiers.new('Polished edge', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
        obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    for face in obj.data.polygons:
        face.use_smooth = True
    layers[layer].append(obj)
    return obj


# An open, asymmetric sculptural orbit, not a portrait frame or interface ring.
def ribbon(name, radius, start, end, width, depth, rotation, mat, layer):
    vertices, faces = [], []
    segments = 128
    for i in range(segments + 1):
        angle = start + (end - start) * i / segments
        for r, y in [(radius-width/2, -depth/2), (radius+width/2, -depth/2), (radius+width/2, depth/2), (radius-width/2, depth/2)]:
            vertices.append((r*math.cos(angle), y, r*math.sin(angle)))
    for i in range(segments):
        for j in range(4):
            faces.append((i*4+j, i*4+(j+1)%4, (i+1)*4+(j+1)%4, (i+1)*4+j))
    faces.extend([(3, 2, 1, 0), tuple(segments*4+j for j in range(4))])
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(vertices, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.rotation_euler = tuple(math.radians(x) for x in rotation)
    return finish(obj, mat, layer, .045)


ribbon('Silver sweep', 2.15, -.35, 5.05, .27, .22, (18, -22, -19), chrome, 'outer')
ribbon('Thin peach orbit', 2.55, .35, 4.7, .045, .06, (-24, 30, 24), gold, 'outer')
ribbon('Rose inner arc', 1.87, -.5, 3.75, .24, .30, (-15, 28, -28), rose, 'inner')
ribbon('Blue crystal arc', 2.28, 2.35, 5.25, .18, .30, (21, -28, 22), blue, 'inner')

for location, scale, mat, layer in [((-1.95, -.6, 1.42), (.26, .26, .26), chrome, 'outer'), ((1.98, -.42, -.9), (.36, .27, .42), blue, 'inner'), ((.72, -.7, 2.28), (.20, .20, .20), gold, 'inner'), ((-1.8, -.65, -1.45), (.26, .20, .32), rose, 'inner')]:
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=3, radius=1, location=location)
    obj = bpy.context.object
    obj.scale = scale
    finish(obj, mat, layer)

for name, location, energy, color, size in [('Soft daylight', (0, -5, 6), 1050, (1, .92, .84), 5), ('Azure edge', (-5, 0, 2), 850, (.35, .65, 1), 4), ('Rose softbox', (4, -2, 1), 1000, (1, .4, .62), 3)]:
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.color, data.size = energy, color, size
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (-obj.location).to_track_quat('-Z', 'Y').to_euler()

data = bpy.data.cameras.new('Portrait orbit camera')
camera = bpy.data.objects.new('Portrait orbit camera', data)
bpy.context.collection.objects.link(camera)
camera.location = (2.3, -11, 1.9)
camera.rotation_euler = (-camera.location).to_track_quat('-Z', 'Y').to_euler()
data.type, data.ortho_scale = 'ORTHO', 6.3
scene.camera = camera
out = Path(sys.argv[sys.argv.index('--') + 1]).resolve()
out.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(out / 'hero-orbits.blend'))
for layer in layers:
    for key, objects in layers.items():
        for obj in objects:
            obj.hide_render = key != layer
    scene.render.filepath = str(out / f'hero-orbit-{layer}.png')
    bpy.ops.render.render(write_still=True)
