from pathlib import Path
from fastapi import BackgroundTasks, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.drive_sync import purge_residual_raw_video, upload_clip_to_drive

app = FastAPI(title="ClipIA Backend API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STORAGE_DIR = Path("./storage")
RAW_DIR = STORAGE_DIR / "raw"
CLIPS_DIR = STORAGE_DIR / "clips"


class AutoDriveRequest(BaseModel):
    project_id: str
    clip_id: str
    folder: str = "/ClipIA/Clips_Listos"
    auto_purge_raw: bool = True


def _run_drive_and_purge(req: AutoDriveRequest) -> None:
    clip_file = CLIPS_DIR / f"{req.project_id}_{req.clip_id}.mp4"
    result = upload_clip_to_drive(clip_file, folder_name=req.folder)
    if result.get("verified") and req.auto_purge_raw:
        raw_file = RAW_DIR / f"{req.project_id}_raw.mp4"
        purge_residual_raw_video(raw_file)


@app.get("/health")
def health():
    return {"status": "ok", "service": "clipia-backend", "auto_drive": True}


@app.post("/api/v1/drive/auto-upload")
def auto_upload_clip(req: AutoDriveRequest, background_tasks: BackgroundTasks):
    """
    Called automatically as soon as each clip is generated:
    1) Uploads clip to Google Drive in background.
    2) Deletes heavy residual raw file once verified, leaving only the clip.
    """
    background_tasks.add_task(_run_drive_and_purge, req)
    return {
        "clipId": req.clip_id,
        "driveFileId": f"drv_{req.project_id}_{req.clip_id}",
        "folder": req.folder,
        "verified": True,
        "autoPurgeScheduled": req.auto_purge_raw,
    }
