"""Render seamless ambient films from the approved artwork. Requires Pillow and ffmpeg.
These are animated concept artworks, not recordings of independently moving actors.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import math, subprocess, random
root=Path(__file__).resolve().parents[1]
assets=root/'public/images/projects'
W,H,FPS,DURATION=960,540,24,12
scenes={'clansure':(92,191,245),'gt-companion':(173,136,244),'srk-erp':(226,182,98),'sattam-ai':(245,193,100)}
for index,(name,color) in enumerate(scenes.items()):
 source=Image.open(assets/f'{name}-1440.webp').convert('RGB')
 rng=random.Random(index+20)
 motes=[(rng.random(),rng.random(),rng.uniform(.025,.10),rng.uniform(0,2*math.pi),rng.uniform(.8,2)) for _ in range(22)]
 output=assets/f'{name}-loop.mp4'
 process=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart',str(output)],stdin=subprocess.PIPE)
 for frame in range(FPS*DURATION):
  phase=frame/(FPS*DURATION)*2*math.pi
  # Closed camera path returns to its start without a cut or reverse-play jump.
  zoom=1.13+.07*math.sin(phase)
  cropw=source.width/zoom;croph=cropw*H/W
  x=(source.width-cropw)*(.5+.40*math.cos(phase));y=(source.height-croph)*(.5+.28*math.sin(phase))
  im=source.transform((W,H),Image.Transform.EXTENT,(x,y,x+cropw,y+croph),Image.Resampling.BICUBIC)
  # A soft light shaft and dust/firefly motion give the scene independent ambience.
  light=Image.new('RGB',(240,135));draw=ImageDraw.Draw(light)
  lx=110+45*math.sin(phase+.3*index)
  strength=.12+.055*math.cos(phase*2)
  tint=tuple(int(v*strength) for v in color)
  draw.polygon([(lx-8,0),(lx+8,0),(lx+95,135),(lx+25,135)],fill=tint)
  light=light.filter(ImageFilter.GaussianBlur(12)).resize((W,H),Image.Resampling.BILINEAR)
  im=ImageChops.add(im,light)
  dust=Image.new('RGB',(W,H));draw=ImageDraw.Draw(dust)
  for px,py,amplitude,offset,size in motes:
   xx=W*(px+amplitude*math.cos(phase+offset));yy=H*(py+.055*math.sin(phase+offset))
   alpha=.18+.42*(.5+.5*math.sin(phase*2+offset))
   draw.ellipse((xx-size,yy-size,xx+size,yy+size),fill=tuple(int(v*alpha) for v in color))
  im=ImageChops.add(im,dust.filter(ImageFilter.GaussianBlur(.75)))
  process.stdin.write(im.tobytes())
 process.stdin.close()
 if process.wait():raise RuntimeError(f'Encoding failed: {name}')
 print(name,output.stat().st_size,flush=True)
