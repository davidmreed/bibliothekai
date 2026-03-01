"""
Production-specific settings.
"""

from .base import *  # noqa

# Security settings
DEBUG = False

# CSRF and Session Cookie Security
CSRF_COOKIE_SECURE = True
# Must be False for JavaScript to read it (some forms need this)
CSRF_COOKIE_HTTPONLY = False
# "Lax" allows top-level navigation, better for OAuth redirects
CSRF_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"

# Production static files storage with compression and hashing
STORAGES = {
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}
EMAIL_BACKEND = "anymail.backends.amazon_ses.EmailBackend"
