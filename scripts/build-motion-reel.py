#!/usr/bin/env python3
"""Build the homepage motion reel from the best moments of the motion graphics projects.

Edit SEGMENTS below (project id, video under public/, start second, duration) and run:

    python3 scripts/build-motion-reel.py

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

MG = 'videos/motion graphics/'
PREMIER_LEAGUE = MG + 'pre_game_-_premier_league_-_espn (1080p).mp4'
LIGUE_1 = MG + 'PREGAME LIGUE1.mp4'
FOX = MG + 'fox_sports_-_videollamada_grafica_test_2019 (1080p).mp4'
GOV_BA = MG + 'seguridad_vial_y_género_-_2021 (1080p).mp4'
BOA = MG + 'boa_-_kinetic_type_explainer_video_2021_- (1080p).mp4'
REBECCA = MG + 'rebecca_contenidos_-_animation_logo (1080p).mp4'
ESET = MG + 'eset_-_video_corp._2014 (1080p).mp4'
ORKOS = MG + 'Orkos_Invgate_Screen_1080.mp4'
ASMA_ZERO = MG + 'asma_zero_-_final_test (1080p).mp4'
FIT = MG + 'reel_fit_shoes_-_2020 (1080p).mp4'
BARUKAS = 'videos/social media/barukas_-_ad (1080p).mp4'
APIMA = MG + 'apima_-_logo_test (1080p).mp4'

# (project id, source video, start second, duration in seconds)
SEGMENTS = [
    ('m3', PREMIER_LEAGUE, 0.2, 2.4),
    ('m2', FOX, 0.3, 2.0),
    ('m18', ORKOS, 0.5, 2.0),
    ('m6', GOV_BA, 87.0, 2.0),
    ('m8', ESET, 22.0, 2.2),
    ('m9', REBECCA, 4.8, 2.0),
    ('m12', BOA, 26.0, 2.0),
    ('m2', FOX, 13.5, 2.0),
    ('m11', ASMA_ZERO, 5.5, 2.0),
    ('m6', GOV_BA, 128.6, 2.0),
    ('m3', PREMIER_LEAGUE, 15.5, 2.0),
    ('m1', FIT, 21.0, 2.2),
    ('m12', BOA, 94.5, 2.0),
    ('m6', GOV_BA, 403.5, 2.0),
    ('m5', BARUKAS, 2.0, 2.0),
    ('m8', ESET, 63.0, 2.0),
    ('m15', APIMA, 2.6, 2.0),
    ('m7', LIGUE_1, 37.2, 3.0),
]

OUTPUTS = [
    ('videos/reel/motion-reel-1080.mp4', 1920, 25),
    ('videos/reel/motion-reel-720.mp4', 1280, 27),
]
POSTER = 'images/reel-poster.jpg'
POSTER_AT = 1.4


def render(output, width, crf):
    args = ['ffmpeg', '-v', 'error', '-y']
    for _, source, start, duration in SEGMENTS:
        args += ['-ss', str(start), '-t', str(duration), '-i', str(PUBLIC / source)]

    chains = [
        f'[{index}:v]trim=duration={duration},setpts=PTS-STARTPTS,fps=30,'
        'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,'
        f'scale={width}:-2:flags=lanczos,setsar=1,format=yuv420p[v{index}]'
        for index, (_, _, _, duration) in enumerate(SEGMENTS)
    ]
    chains.append(''.join(f'[v{index}]' for index in range(len(SEGMENTS))) + f'concat=n={len(SEGMENTS)}:v=1:a=0[out]')

    args += [
        '-filter_complex', ';'.join(chains), '-map', '[out]', '-an',
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

    cues, elapsed = [], 0.0
    for project_id, _, _, duration in SEGMENTS:
        cues.append({'id': project_id, 'at': round(elapsed, 2)})
        elapsed += duration

    showreel = {
        'sources': {'desktop': '/' + OUTPUTS[0][0], 'mobile': '/' + OUTPUTS[1][0]},
        'poster': '/' + POSTER,
        'duration': round(elapsed, 2),
        'cues': cues,
    }
    (ROOT / 'src/data/showreel.json').write_text(json.dumps(showreel, indent=2) + '\n')
    print(f'Built {len(SEGMENTS)} shots, {elapsed:.1f}s')


if __name__ == '__main__':
    main()
