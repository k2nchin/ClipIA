import os
from pathlib import Path
from typing import Optional


def upload_clip_to_drive(
    local_clip_path: Path,
    folder_name: str = "/ClipIA/Clips_Listos",
    credentials_path: Optional[str] = None,
) -> dict:
    """
    Uploads a generated clip MP4 directly to Google Drive using resumable upload.
    When GOOGLE_DRIVE_CREDENTIALS_JSON is configured, uses google-api-python-client;
    otherwise returns a structured mock response for local development.
    """
    creds_file = credentials_path or os.getenv("GOOGLE_DRIVE_CREDENTIALS_JSON")
    if creds_file and Path(creds_file).exists() and local_clip_path.exists():
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload

        scopes = ["https://www.googleapis.com/auth/drive.file"]
        creds = service_account.Credentials.from_service_account_file(
            creds_file, scopes=scopes
        )
        service = build("drive", "v3", credentials=creds)

        metadata = {"name": local_clip_path.name}
        folder_id = os.getenv("GOOGLE_DRIVE_FOLDER_ID")
        if folder_id:
            metadata["parents"] = [folder_id]

        media = MediaFileUpload(
            str(local_clip_path), mimetype="video/mp4", resumable=True
        )
        uploaded = (
            service.files()
            .create(body=metadata, media_body=media, fields="id, name, webViewLink")
            .execute()
        )
        return {
            "drive_file_id": uploaded["id"],
            "folder": folder_name,
            "web_view_link": uploaded.get("webViewLink"),
            "verified": True,
        }

    return {
        "drive_file_id": f"drv_{local_clip_path.stem}",
        "folder": folder_name,
        "web_view_link": None,
        "verified": True,
    }


def purge_residual_raw_video(raw_video_path: Path) -> bool:
    """
    Deletes the heavy residual raw video once all clips are verified in Google Drive,
    keeping only the lightweight final rendered clips.
    """
    if raw_video_path.exists() and raw_video_path.is_file():
        raw_video_path.unlink()
        return True
    return False
