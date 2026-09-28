from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import math, os, subprocess, tempfile

# Deterministic 8-second landscape intro: POV hand press, Ubuntu boot, portfolio reveal.
W, H, FPS, SECONDS = 1280, 720, 24, 8
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REF = '/home/ubuntu/pavithran-intro-reference.png'
OUT = os.path.join(ROOT, 'frontend/public/videos/pov-portfolio-boot.mp4')
TMP = tempfile.mkdtemp(prefix='pov-frames-')
os.makedirs(os.path.dirname(OUT), exist_ok=True)

try:
    font_serif = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf', 34)
    font_small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
    font_tiny = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 11)
    font_mono = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 13)
    font_mono_big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 22)
except OSError:
    font_serif = font_small = font_tiny = font_mono = font_mono_big = ImageFont.load_default()

bg = Image.open(REF).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
# A broad monitor plane, kept perspective-stable throughout the clip.
mx0, my0, mx1, my1 = 408, 174, 1006, 516


def ease(t):
    t = max(0.0, min(1.0, t))
    return t*t*(3-2*t)


def rounded(draw, box, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_monitor(base, draw, screen, glow=0.0):
    # dark bezel and screen glass
    rounded(draw, (mx0-22, my0-22, mx1+22, my1+22), 18, (7, 12, 20), (75, 98, 121), 2)
    draw.rectangle((mx0, my0, mx1, my1), fill=(8, 13, 22))
    screen = screen.resize((mx1-mx0, my1-my0), Image.Resampling.LANCZOS)
    screen = ImageEnhance.Contrast(screen).enhance(1.03)
    screen = ImageEnhance.Brightness(screen).enhance(0.75 + glow*0.25)
    screen = screen.filter(ImageFilter.GaussianBlur(0.15))
    screen.putalpha(255)
    screen_rgb = screen.convert('RGB')
    frame = Image.new('RGB', screen_rgb.size, (0,0,0)); frame.paste(screen_rgb)
    # slight cyan glass reflection
    overlay = Image.new('RGBA', frame.size, (0,0,0,0)); od = ImageDraw.Draw(overlay)
    od.polygon([(0,0),(frame.width*0.30,0),(frame.width*0.10,frame.height),(0,frame.height)], fill=(155,220,255,18))
    frame = Image.alpha_composite(frame.convert('RGBA'), overlay).convert('RGB')
    base.paste(frame, (mx0, my0))
    if glow > 0:
        glow_layer = Image.new('RGBA', (W,H), (0,0,0,0)); gd = ImageDraw.Draw(glow_layer)
        gd.rounded_rectangle((mx0-20,my0-20,mx1+20,my1+20), radius=24, fill=(76,190,255,int(35*glow)))
        glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(30))
        # glow needs to sit behind screen, but the soft addition still reads as emitted light
        base.alpha_composite(glow_layer) if False else None


def ubuntu_boot(progress):
    im = Image.new('RGB', (mx1-mx0, my1-my0), (8, 13, 22)); d = ImageDraw.Draw(im)
    cx, cy = im.width//2, im.height//2 - 15
    # Ubuntu-inspired mark, deliberately no trademark text dependency
    d.ellipse((cx-26,cy-26,cx+26,cy+26), outline=(227,112,49), width=4)
    for a in (0, 120, 240):
        r = math.radians(a-90); x=cx+math.cos(r)*26; y=cy+math.sin(r)*26
        d.ellipse((x-5,y-5,x+5,y+5), fill=(244,155,81))
    d.text((cx, cy+45), 'ubuntu', anchor='ma', fill=(225,232,240), font=font_small)
    d.text((cx, cy+72), 'Starting Pavithran workspace…', anchor='ma', fill=(135,157,180), font=font_tiny)
    d.rounded_rectangle((cx-120, cy+100, cx+120, cy+106), 3, fill=(39,55,75))
    d.rounded_rectangle((cx-120, cy+100, cx-120+240*ease(progress), cy+106), 3, fill=(104,204,238))
    return im


def ubuntu_desktop(progress):
    im = Image.new('RGB', (mx1-mx0, my1-my0), (24, 28, 43)); d = ImageDraw.Draw(im)
    # wallpaper mesh / orbit
    for r, a in [(240,24),(180,30),(120,36)]:
        d.ellipse((im.width//2-r, im.height//2-r, im.width//2+r, im.height//2+r), outline=(62,101,151,a))
    d.ellipse((im.width//2-45, im.height//2-45, im.width//2+45, im.height//2+45), fill=(39,87,130), outline=(139,218,241))
    d.text((im.width//2, im.height//2), 'PS', anchor='mm', fill=(231,242,248), font=font_mono_big)
    # topbar and dock
    d.rectangle((0,0,im.width,28), fill=(12,16,27)); d.text((12,14), 'Activities', anchor='lm', fill=(202,215,231), font=font_tiny)
    d.text((im.width//2,14), 'Pavithran S. · Workstation', anchor='mm', fill=(184,201,220), font=font_tiny)
    dock_w=180; d.rounded_rectangle((im.width//2-dock_w//2,im.height-46,im.width//2+dock_w//2,im.height-12), 10, fill=(11,16,27,230), outline=(105,146,181))
    for i, col in enumerate([(108,205,240),(156,131,235),(232,167,91),(97,225,179)]):
        x=im.width//2-dock_w//2+28+i*42; d.rounded_rectangle((x,im.height-38,x+20,im.height-18), 5, fill=col)
    return im


def portfolio_screen(progress):
    im = Image.new('RGB', (mx1-mx0, my1-my0), (7,13,22)); d=ImageDraw.Draw(im)
    # browser chrome
    d.rectangle((0,0,im.width,32), fill=(15,23,35)); d.ellipse((14,12,22,20),fill=(214,101,111));d.ellipse((29,12,37,20),fill=(233,187,97));d.ellipse((44,12,52,20),fill=(101,191,133))
    d.rounded_rectangle((80,7,im.width-20,25), 9, fill=(25,37,53));d.text((95,16),'pavithran26.vercel.app',anchor='lm',fill=(167,190,213),font=font_tiny)
    # portfolio UI
    d.rectangle((0,32,im.width,im.height), fill=(5,10,18)); d.ellipse((im.width-160,-50,im.width+110,210), fill=(27,60,88)); d.ellipse((-110,im.height-100,200,im.height+180), fill=(24,42,74))
    d.text((38,70),'PAVITHRAN S.',fill=(139,204,231),font=font_tiny)
    d.text((38,112),'Thoughtful interfaces.',fill=(240,244,247),font=font_serif)
    d.text((38,150),'Dependable systems.',fill=(240,244,247),font=font_serif)
    d.text((38,188),'A little intelligence in between.',fill=(184,216,233),font=font_small)
    d.line((38,236,im.width-38,236),fill=(72,103,131),width=1)
    d.text((38,267),'SELECTED WORK',fill=(142,190,213),font=font_tiny)
    cards=[('01','Clansure','Business systems'),('02','GT Companion','Applied AI'),('03','Sattam AI','Useful tools')]
    for i,(n,title,sub) in enumerate(cards):
        x=38+i*170; y=296
        d.rounded_rectangle((x,y,x+148,y+88),12,fill=(14,24,37),outline=(54,88,114),width=1)
        d.text((x+14,y+14),n,fill=(109,207,239),font=font_tiny); d.text((x+14,y+37),title,fill=(236,242,246),font=font_small); d.text((x+14,y+65),sub,fill=(148,169,189),font=font_tiny)
    d.text((38,im.height-32),'FROM INTERFACE TO INTELLIGENCE',fill=(120,143,167),font=font_tiny)
    if progress < 1:
        wipe=int(im.width*(1-progress)); d.rectangle((im.width-progress*im.width,32,im.width,im.height),fill=(5,10,18))
    return im

for idx in range(FPS*SECONDS):
    t=idx/FPS
    base=bg.copy()
    # cinematic exposure change as the monitor powers on
    exposure=0.62 if t<1.45 else min(1.0,0.62+0.38*ease((t-1.45)/1.0))
    base=ImageEnhance.Brightness(base).enhance(exposure)
    d=ImageDraw.Draw(base,'RGBA')
    # subtle first-person camera breathing / head movement
    drift=int(2*math.sin(t*1.7))
    if t<1.45:
        screen=Image.new('RGB',(mx1-mx0,my1-my0),(3,6,10))
        glow=0
    elif t<3.5:
        p=(t-1.45)/2.05; screen=ubuntu_boot(p); glow=min(1,p); 
    elif t<4.35:
        p=(t-3.5)/.85; screen=ubuntu_desktop(p); glow=1
    else:
        p=min(1,(t-4.35)/1.25); screen=portfolio_screen(p); glow=1
    # screen glow behind the monitor
    if glow:
        glow_layer=Image.new('RGBA',(W,H),(0,0,0,0)); gd=ImageDraw.Draw(glow_layer)
        gd.rounded_rectangle((mx0-25,my0-25,mx1+25,my1+25),radius=24,fill=(55,164,220,int(30*glow)))
        glow_layer=glow_layer.filter(ImageFilter.GaussianBlur(28)); base=Image.alpha_composite(base.convert('RGBA'),glow_layer).convert('RGB'); d=ImageDraw.Draw(base,'RGBA')
    draw_monitor(base,d,screen,glow)
    # monitor stand and desk edge
    d.rectangle((mx0+220,my1+22,mx1-220,my1+42),fill=(12,17,25,245)); d.polygon([(mx0+260,my1+42),(mx1-260,my1+42),(mx1-205,my1+75),(mx0+205,my1+75)],fill=(8,12,18,245))
    # POV hand/forearm enters, no person shown. Press at 1.2-2.25 sec.
    if 1.0 < t < 2.55:
        p=ease((t-1.0)/1.35); hx=890-170*p; hy=640-160*p
        # forearm and hand with soft shading
        d.polygon([(1120,720),(980,720),(hx+28,hy+24),(hx+8,hy+4),(hx+46,hy-22),(hx+78,hy-2),(hx+112,hy+45)],fill=(165,112,88,245))
        d.ellipse((hx-18,hy-22,hx+68,hy+30),fill=(190,137,106,250),outline=(232,177,140,190),width=2)
        # index finger reaching the lower-right power switch
        d.polygon([(hx+28,hy-5),(hx+95,hy-28),(hx+104,hy-10),(hx+44,hy+17)],fill=(202,150,118,250))
        if t>2.03:
            d.ellipse((mx1-42,my1-36,mx1-21,my1-15),fill=(111,220,241,240)); d.ellipse((mx1-37,my1-31,mx1-26,my1-20),fill=(220,255,255,255))
    # cinematic vignette
    vign=Image.new('RGBA',(W,H),(0,0,0,0)); vd=ImageDraw.Draw(vign)
    vd.rectangle((0,0,W,H),fill=(0,0,0,30)); base=Image.alpha_composite(base.convert('RGBA'),vign).convert('RGB')
    base.save(os.path.join(TMP,f'{idx:04d}.png'),quality=95)

subprocess.run(['ffmpeg','-y','-framerate',str(FPS),'-i',os.path.join(TMP,'%04d.png'),'-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',OUT],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
print(OUT)
