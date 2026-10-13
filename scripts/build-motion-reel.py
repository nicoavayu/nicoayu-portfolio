#!/usr/bin/env python3
"""Build the homepage motion reel from the best moments of the motion graphics projects.

Edit SHOTS below and run:

    python3 scripts/build-motion-reel.py

Each shot is (project id, client label, source video under public/, start second, length in frames at 30 fps,
layout). Every shot should be moving from its first to its last frame: cut in when an animation starts and
cut out before it settles or before the source's own transition begins.

Requires ffmpeg. Writes:
  public/videos/reel/motion-reel-1080.mp4   desktop loop
  public/videos/reel/motion-reel-720.mp4    mobile loop
  public/images/reel-poster.jpg             first frame shown while the video loads
  src/data/showreel.json                    cue points the hero uses to label each shot
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / 'public'
FPS = 30
WIDTH, HEIGHT = 1920, 1080

MG = 'videos/motion graphics/'
PREMIER_LEAGUE = MG + 'pre_game_-_premier_league_-_espn (1080p).mp4'
LIGUE_1 = MG + 'PREGAME LIGUE1.mp4'
FOX = MG + 'fox_sports_-_videollamada_grafica_test_2019 (1080p).mp4'
GOV_BA = MG + 'seguridad_vial_y_género_-_2021 (1080p).mp4'
BOA = MG + 'boa_-_kinetic_type_explainer_video_2021_- (1080p).mp4'
REBECCA = MG + 'rebecca_contenidos_-_animation_logo (1080p).mp4'
ESET = MG + 'eset_-_video_corp._2014 (1080p).mp4'
ORKOS = MG + 'Orkos_Invgate_Screen_1080.mp4'
ORKOS_LOOP = MG + 'orkos_invgate_loop.mp4'
ASMA_ZERO = MG + 'asma_zero_-_final_test (1080p).mp4'
FIT = MG + 'reel_fit_shoes_-_2020 (1080p).mp4'
BARUKAS = 'videos/social media/barukas_-_ad (1080p).mp4'
APIMA = MG + 'apima_-_logo_test (1080p).mp4'

FULL = 'full'
# Vertical (9:16) source repeated side by side so it fills the frame without stretching
TRIPTYCH = 'triptych'

# (project id, client, source video, start second, frames at 30 fps, layout)
SHOTS = [
    ('m3', 'ESPN', PREMIER_LEAGUE, 0.00, 36, FULL),                  # title card builds
    ('m19', 'Orkos / InvGate', ORKOS_LOOP, 37.25, 50, FULL),         # file flies past camera
    ('m2', 'Fox Sports', FOX, 8.74, 60, FULL),                       # crane down into the 3D studio
    ('m9', 'Rebecca', REBECCA, 4.60, 52, FULL),                      # glitch into the logo
    ('m6', 'Gobierno de Buenos Aires', GOV_BA, 22.93, 26, FULL),     # car with speed lines
    ('m6', 'Gobierno de Buenos Aires', GOV_BA, 25.30, 34, FULL),     # glare, flash and crash
    ('m18', 'Orkos / InvGate', ORKOS, 0.00, 60, FULL),               # "¿Ya usas Invgate?" until it lands
    ('m8', 'ESET', ESET, 63.10, 60, FULL),                           # planet builds up
    ('m11', 'Asma Zero', ASMA_ZERO, 5.93, 32, FULL),                 # logo builds
    ('m11', 'Asma Zero', ASMA_ZERO, 30.25, 48, FULL),                # app screens scrolling
    ('m1', 'Fit', FIT, 20.80, 73, FULL),                             # product trails, walk, split screen
    ('m5', 'Barukas', BARUKAS, 1.00, 66, TRIPTYCH),                  # bag flies, nuts fall, logo builds
    ('m19', 'Orkos / InvGate', ORKOS_LOOP, 41.85, 46, FULL),         # sphere, check and node orbit
    ('m12', 'BOA', BOA, 94.10, 29, FULL),                            # block transition into "10 years"
    ('m15', 'APIMA', APIMA, 2.15, 46, FULL),                         # logo drawing itself
    ('m7', 'ESPN', LIGUE_1, 36.55, 21, FULL),                        # Ligue 1 wipe into the match card
]

TRIPTYCH_GAP = 6  # black separator width in pixels at 1080p

OUTPUTS = [
    ('videos/reel/motion-reel-1080.mp4', 1920, 25),
    ('videos/reel/motion-reel-720.mp4', 1280, 27),
]
POSTER = 'images/reel-poster.jpg'
POSTER_AT = 0.9


def shot_filter(index, frames, layout, width):
    base = f'[{index}:v]fps={FPS},trim=end_frame={frames},setpts=PTS-STARTPTS'
    if layout == TRIPTYCH:
        panel = (WIDTH - 2 * TRIPTYCH_GAP) // 3
        panel_height = round(panel * 16 / 9)
        return (
            f'{base},scale={panel}:{panel_height},setsar=1,crop={panel}:{HEIGHT},split=3[p{index}a][p{index}b][p{index}c];'
            f'[p{index}a]pad={panel + TRIPTYCH_GAP}:{HEIGHT}:0:0:black[q{index}a];'
            f'[p{index}b]pad={panel + TRIPTYCH_GAP}:{HEIGHT}:0:0:black[q{index}b];'
            f'[q{index}a][q{index}b][p{index}c]hstack=3,scale={width}:-2:flags=lanczos,setsar=1,format=yuv420p[v{index}]'
        )
    return (
        f'{base},scale={WIDTH}:{HEIGHT}:force_original_aspect_ratio=increase,crop={WIDTH}:{HEIGHT},'
        f'scale={width}:-2:flags=lanczos,setsar=1,format=yuv420p[v{index}]'
    )


def render(output, width, crf):
    args = ['ffmpeg', '-v', 'error', '-y']
    for _, _, source, start, _, _ in SHOTS:
        args += ['-ss', f'{start:.3f}', '-i', str(PUBLIC / source)]

    chains = [shot_filter(index, frames, layout, width) for index, (_, _, _, _, frames, layout) in enumerate(SHOTS)]
    chains.append(''.join(f'[v{index}]' for index in range(len(SHOTS))) + f'concat=n={len(SHOTS)}:v=1:a=0[out]')

    args += [
        '-filter_complex', ';'.join(chains), '-map', '[out]', '-an', '-r', str(FPS),
        '-c:v', 'libx264', '-preset', 'slow', '-crf', str(crf), '-profile:v', 'high',
        '-pix_fmt', 'yuv420p', '-g', '60', '-movflags', '+faststart',
        str(PUBLIC / output),
    ]
    subprocess.run(args, check=True)


def main():
    (PUBLIC / 'videos/reel').mkdir(parents=True, exist_ok=True)
    for output, width, crf in OUTPUTS:
        render(output, width, crf)

    subprocess.run([
        'ffmpeg', '-v', 'error', '-y', '-ss', str(POSTER_AT), '-i', str(PUBLIC / OUTPUTS[0][0]),
        '-frames:v', '1', '-vf', 'scale=1280:-2', '-q:v', '3', str(PUBLIC / POSTER),
    ], check=True)

    cues, elapsed = [], 0
    for project_id, client, _, _, frames, _ in SHOTS:
        cues.append({'id': project_id, 'client': client, 'at': round(elapsed / FPS, 3)})
        elapsed += frames

    showreel = {
        'sources': {'desktop': '/' + OUTPUTS[0][0], 'mobile': '/' + OUTPUTS[1][0]},
        'poster': '/' + POSTER,
        'duration': round(elapsed / FPS, 3),
        'cues': cues,
    }
    (ROOT / 'src/data/showreel.json').write_text(json.dumps(showreel, indent=2) + '\n')
    print(f'Built {len(SHOTS)} shots, {elapsed} frames ({elapsed / FPS:.2f}s)')


if __name__ == '__main__':
    main()
