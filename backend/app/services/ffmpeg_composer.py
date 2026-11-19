"""
FFmpeg composition engine for ClipIA's signature Streamer Split 9:16 (1080x1920) layout:
- Top 38% (1080x730): heavily blurred ambient backdrop derived from the facecam colors
- Floating rounded-square facecam card (580x560) centered horizontally, overlapping the seam
- Bottom 62% (1080x1190): full-width main reaction / gameplay video
- Clean centered burned-in subtitles in the lower safe-zone
"""
from dataclasses import dataclass
from pathlib import Path
from typing import List, Optional


@dataclass
class CropBox:
    x: int
    y: int
    w: int
    h: int


def build_streamer_split_ffmpeg_cmd(
    input_video: Path,
    output_video: Path,
    facecam_box: CropBox,
    content_box: CropBox,
    subtitles_ass: Optional[Path] = None,
    start_sec: float = 0.0,
    duration_sec: Optional[float] = None,
) -> List[str]:
    """
    Returns an FFmpeg command list that produces a 1080x1920 30fps H.264/AAC MP4
    matching the Streamer Split (Blur Top + Rounded Facecam Card + Bottom Video) layout.
    """
    # 1. Crop facecam -> generate blurred 1080x730 top backdrop AND 580x560 rounded facecam card
    # 2. Crop main content -> scale/crop cleanly to 1080x1190 for the bottom 62%
    # 3. Stack top backdrop + bottom content -> 1080x1920
    # 4. Overlay rounded facecam card centered horizontally (x=(W-w)/2, y=195) so it slightly overlaps the seam
    filter_parts = [
        f"[0:v]crop={facecam_box.w}:{facecam_box.h}:{facecam_box.x}:{facecam_box.y},split=2[fc_bg][fc_fg]",
        "[fc_bg]scale=1080:730:force_original_aspect_ratio=increase,crop=1080:730,boxblur=36:4[top_blur]",
        "[fc_fg]scale=580:560:force_original_aspect_ratio=increase,crop=580:560,format=yuva420p,"
        "geq=lum='p(X,Y)':cb='p(X,Y)':cr='p(X,Y)':a='if(gt(abs(W/2-X),W/2-28)*gt(abs(H/2-Y),H/2-28),"
        "if(lte(hypot(28-(W/2-abs(W/2-X)),28-(H/2-abs(H/2-Y))),28),255,0),255)'[face_card]",
        f"[0:v]crop={content_box.w}:{content_box.h}:{content_box.x}:{content_box.y},"
        "scale=1080:1190:force_original_aspect_ratio=increase,crop=1080:1190[bottom_vid]",
        "[top_blur][bottom_vid]vstack=inputs=2[base_canvas]",
        "[base_canvas][face_card]overlay=(W-w)/2:195:shortest=1[composed]",
    ]

    final_label = "[composed]"
    if subtitles_ass is not None:
        escaped_ass = str(subtitles_ass).replace(":", "\\:")
        filter_parts.append(f"[composed]ass='{escaped_ass}'[outv]")
        final_label = "[outv]"

    cmd = ["ffmpeg", "-y"]
    if start_sec > 0:
        cmd += ["-ss", f"{start_sec:.2f}"]
    cmd += ["-i", str(input_video)]
    if duration_sec is not None:
        cmd += ["-t", f"{duration_sec:.2f}"]

    cmd += [
        "-filter_complex",
        ";".join(filter_parts),
        "-map",
        final_label,
        "-map",
        "0:a?",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-r",
        "30",
        "-pix_fmt",
        "yuv420p",
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-movflags",
        "+faststart",
        str(output_video),
    ]
    return cmd
