#!/usr/bin/env python3
"""Build the homepage motion reel from the best moments of the motion graphics projects.

Edit SHOTS below and run:

    python3 scripts/build-motion-reel.py

Each shot is a project id, client label, source video under public/, start second and length in frames at
30 fps (plus optional layout, speed and triptych center). Every shot should be moving from its first to its
last frame: cut in when an animation starts and cut out before it settles or before the source's own
transition begins.

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


def shot(project_id, client, source, start, frames, layout=FULL, speed=1.0, center_start=None):
    """One cut of the reel.

    speed > 1 plays the source faster (a speed ramp keeps a slow camera move from reading as static).
    For a triptych, center_start plays a different moment of the same source in the middle panel.
    """
    return {
        'project_id': project_id, 'client': client, 'source': source, 'start': start,
        'frames': frames, 'layout': layout, 'speed': speed, 'center_start': center_start,
    }


SHOTS = [
    shot('m3', 'ESPN', PREMIER_LEAGUE, 0.00, 36),                       # title card builds
    shot('m19', 'Orkos / InvGate', ORKOS_LOOP, 13.60, 88),              # document flies into the eye, arc fills
    # Fox is one continuous camera move, ramped so its slow drift never reads as a hold
    shot('m2', 'Fox Sports', FOX, 8.74, 51, speed=2.0),                 # crane down into the 3D studio
    shot('m2', 'Fox Sports', FOX, 12.15, 22),                           # logo forms on the phone
    shot('m2', 'Fox Sports', FOX, 12.88, 9, speed=9.5),                 # camera drift
    shot('m2', 'Fox Sports', FOX, 15.73, 19),                           # push in to "Videollamada Fox"
    shot('m9', 'Rebecca', REBECCA, 4.60, 52),                           # glitch into the logo
    shot('m6', 'Gobierno de Buenos Aires', GOV_BA, 22.93, 26),          # car with speed lines
    shot('m6', 'Gobierno de Buenos Aires', GOV_BA, 25.30, 34),          # glare, flash and crash
    shot('m18', 'Orkos / InvGate', ORKOS, 0.00, 60),                    # "¿Ya usas Invgate?" until it lands
    shot('m8', 'ESET', ESET, 63.10, 60),                                # planet builds up
    shot('m11', 'Asma Zero', ASMA_ZERO, 5.93, 45),                      # logo builds and settles
    shot('m11', 'Asma Zero', ASMA_ZERO, 30.25, 48),                     # app screens scrolling
    shot('m1', 'Fit', FIT, 20.80, 67),                                  # product trails, walk, split screen
    # Outer panels: the bag appears and turns; middle panel: "Lower in calories than any other nut"
    shot('m5', 'Barukas', BARUKAS, 0.00, 63, layout=TRIPTYCH, center_start=7.70),
    shot('m19', 'Orkos / InvGate', ORKOS_LOOP, 36.00, 75),              # files fly past the camera
    shot('m15', 'APIMA', APIMA, 2.15, 46),                              # logo drawing itself
]

TRIPTYCH_GAP = 6  # black separator width in pixels at 1080p

OUTPUTS = [
    ('videos/reel/motion-reel-1080.mp4', 1920, 25),
    ('videos/reel/motion-reel-720.mp4', 1280, 27),
]
POSTER = 'images/reel-poster.jpg'
POSTER_AT = 0.9


def timed(input_index, item):
    return (
        f"[{input_index}:v]setpts=(PTS-STARTPTS)/{item['speed']},fps={FPS},"
        f"trim=end_frame={item['frames']},setpts=PTS-STARTPTS"
    )


def shot_filter(index, inputs, item, width):
    finish = f'scale={width}:-2:flags=lanczos,setsar=1,format=yuv420p[v{index}]'
    if item['layout'] == TRIPTYCH:
        panel = (WIDTH - 2 * TRIPTYCH_GAP) // 3
        fit = f'scale={panel}:{round(panel * 16 / 9)},setsar=1,crop={panel}:{HEIGHT}'
        outer = f"{timed(inputs[0], item)},{fit}"
        if len(inputs) > 1:
            chains = [f'{outer},split=2[o{index}l][o{index}r]', f"{timed(inputs[1], item)},{fit}[o{index}c]"]
        else:
            chains = [f'{outer},split=3[o{index}l][o{index}c][o{index}r]']
        chains += [
            f'[o{index}l]pad={panel + TRIPTYCH_GAP}:{HEIGHT}:0:0:black[g{index}l]',
            f'[o{index}c]pad={panel + TRIPTYCH_GAP}:{HEIGHT}:0:0:black[g{index}c]',
            f'[g{index}l][g{index}c][o{index}r]hstack=3,{finish}',
        ]
        return ';'.join(chains)
    return (
        f"{timed(inputs[0], item)},scale={WIDTH}:{HEIGHT}:force_original_aspect_ratio=increase,"
        f'crop={WIDTH}:{HEIGHT},{finish}'
    )


def render(output, width, crf):
    args = ['ffmpeg', '-v', 'error', '-y']
    shot_inputs = []
    next_input = 0
    for item in SHOTS:
        starts = [item['start']] + ([item['center_start']] if item['center_start'] is not None else [])
        indexes = []
        for start in starts:
            args += ['-ss', f'{start:.3f}', '-i', str(PUBLIC / item['source'])]
            indexes.append(next_input)
            next_input += 1
        shot_inputs.append(indexes)

    chains = [shot_filter(index, shot_inputs[index], item, width) for index, item in enumerate(SHOTS)]
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
    for item in SHOTS:
        cues.append({'id': item['project_id'], 'client': item['client'], 'at': round(elapsed / FPS, 3)})
        elapsed += item['frames']

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
