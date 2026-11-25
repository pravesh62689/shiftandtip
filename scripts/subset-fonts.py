import os
import urllib.request
import subprocess

UNICODES = "U+0000-00FF,U+2013-2014,U+2018-201D,U+2022,U+2026,U+20AC,U+2192,U+00D7"
OUT_DIR = r"F:\shiftandtip\dist\assets\fonts"
TEMP_DIR = r"F:\shiftandtip\dist\assets\fonts\temp"
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(OUT_DIR, exist_ok=True)

FONTS = [
    {
        "name": "public-sans-var-latin.woff2",
        "url": "https://raw.githubusercontent.com/google/fonts/main/ofl/publicsans/PublicSans%5Bwght%5D.ttf",
        "temp_name": "PublicSans.ttf",
    },
    {
        "name": "source-serif-4-600-latin.woff2",
        "url": "https://raw.githubusercontent.com/adobe-fonts/source-serif/release/OTF/SourceSerif4-Semibold.otf",
        "temp_name": "SourceSerif4-Semibold.otf",
    },
    {
        "name": "ibm-plex-mono-500-latin.woff2",
        "url": "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-Medium.ttf",
        "temp_name": "IBMPlexMono-Medium.ttf",
    }
]

total_size = 0
for f in FONTS:
    temp_path = os.path.join(TEMP_DIR, f["temp_name"])
    out_path = os.path.join(OUT_DIR, f["name"])
    if not os.path.exists(temp_path):
        print(f"Downloading {f['temp_name']} from {f['url']}...")
        req = urllib.request.Request(f["url"], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as response, open(temp_path, "wb") as out_file:
            out_file.write(response.read())
    
    print(f"Subsetting {f['temp_name']} to {out_path}...")
    cmd = [
        "pyftsubset",
        temp_path,
        f"--unicodes={UNICODES}",
        "--flavor=woff2",
        f"--output-file={out_path}",
        "--no-hinting",
        "--desubroutinize",
        "--layout-features=kern,liga,calt,pnum,tnum"
    ]
    subprocess.run(cmd, check=True)
    size = os.path.getsize(out_path)
    print(f"Result: {f['name']} = {size} bytes ({size/1024:.2f} KB)")
    total_size += size

print(f"\n==========================================")
print(f"Total font size: {total_size} bytes ({total_size/1024:.2f} KB)")
if total_size <= 60 * 1024:
    print(f"SUCCESS: Total font size <= 60 KB ({total_size/1024:.2f} KB <= 60 KB)")
else:
    print(f"FAILURE: Total font size exceeds 60 KB ({total_size/1024:.2f} KB > 60 KB)")
print(f"==========================================")
