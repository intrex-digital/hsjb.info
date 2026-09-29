"""
Cloudflare R2 storage backend.

R2 is S3-compatible, so we use django-storages' S3Boto3Storage pointed
at the R2 endpoint.  Two backends are provided:

  R2MediaStorage    – public-readable media files (images, attachments)
  R2PrivateStorage  – presigned-URL-only private files (e.g. draft exports)

Usage in a model:
    from apps.core.storage import R2MediaStorage
    image = models.FileField(storage=R2MediaStorage(), upload_to="blog/")
"""

from __future__ import annotations

from django.conf import settings
from storages.backends.s3boto3 import S3Boto3Storage


class _R2Base(S3Boto3Storage):
    """Shared configuration for all R2 storage backends."""

    # Pull from settings so nothing is hard-coded here
    bucket_name: str = ""          # overridden per subclass
    endpoint_url: str = ""
    access_key: str = ""
    secret_key: str = ""
    region_name = "auto"           # R2 uses 'auto'
    signature_version = "s3v4"
    file_overwrite = False         # always use unique filenames
    default_acl = None             # R2 does not support legacy ACLs

    def __init__(self, **kwargs):
        kwargs.setdefault("bucket_name", settings.CLOUDFLARE_R2_BUCKET_NAME)
        kwargs.setdefault("endpoint_url", settings.CLOUDFLARE_R2_ENDPOINT_URL)
        kwargs.setdefault("access_key", settings.CLOUDFLARE_R2_ACCESS_KEY_ID)
        kwargs.setdefault("secret_key", settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY)
        super().__init__(**kwargs)


class R2MediaStorage(_R2Base):
    """
    Public media storage.

    Files are served via the R2 public bucket URL configured in
    settings.CLOUDFLARE_R2_PUBLIC_URL.  No presigned URLs needed.
    """

    location = "media"
    querystring_auth = False       # use public URL, not signed URLs

    def url(self, name: str) -> str:
        public_base = settings.CLOUDFLARE_R2_PUBLIC_URL.rstrip("/")
        return f"{public_base}/media/{name}"


class R2PrivateStorage(_R2Base):
    """
    Private storage — files accessed only via presigned URLs.
    """

    location = "private"
    querystring_auth = True
    querystring_expire = 3600      # 1-hour presigned URLs
