from .settings import *
import os

DEBUG = True

# Development-specific apps
INSTALLED_APPS += [
    "debug_toolbar",
]

# Add debug toolbar middleware at the beginning for development
MIDDLEWARE.insert(0, "debug_toolbar.middleware.DebugToolbarMiddleware")

# Debug toolbar configuration
INTERNAL_IPS = [
    "127.0.0.1",
    "localhost",
]

# Development email backend - Use console backend for local development
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# Allow verbose error pages
DEBUG_PROPAGATE_EXCEPTIONS = True

# Speed up password hashing in development/testing (don't use this in production!)
# Any time the factory creates a user with a password,
# it will be hashed using MD5, which is much faster than the default PBKDF2.
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# Don't use Sentry in development unless explicitly configured
if not os.environ.get("SENTRY_DSN"):
    import sentry_sdk

    sentry_sdk.init(dsn="")  # Disable Sentry


# File storage
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}
