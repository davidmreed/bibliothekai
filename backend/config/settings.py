import os

import dj_database_url
import sentry_sdk

if sentry_dsn := os.environ.get("SENTRY_DSN"):
    sentry_sdk.init(
    dsn=sentry_dsn,
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "DJANGO_SECRET_KEY",
)


ALLOWED_HOSTS = [
    "bibliothekai.ktema.org",
    "127.0.0.1",
    "localhost",
    "bibliothekai-production.up.railway.app",
]

CSRF_TRUSTED_ORIGINS = [
    "https://*.bibliothekai-production.up.railway.app",
    "https://*.bibliothekai.ktema.org",
]

AUTH_USER_MODEL = "users.User"

# Application definition

INSTALLED_APPS = [
    "translations.apps.TranslationsConfig",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "users",
    "anymail",
    "rest_framework",
    "manifest_loader",
    "generic_relations",
    "graphene_django",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "wsgi.application"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.BasicAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ]
}

MANIFEST_LOADER = {
    "output_dir": "translations/static",  # where webpack outputs to, if not set, will search in STATICFILES_DIRS for the manifest.
    "manifest_file": "manifest.json",  # name of your manifest file
    "cache": True,  # recommended True for production, requires a server restart to pick up new values from the manifest.
}

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
DATABASES = {}
DATABASES["default"] = dj_database_url.config(default="sqlite:///db.sqlite3", conn_max_age=600)

# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "America/Denver"

USE_I18N = True

USE_L10N = True

USE_TZ = True

SITE_ID = 1

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static")

LOGIN_REDIRECT_URL = "/"

ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
ACCOUNT_EMAIL_VERIFICATION_BY_CODE_ENABLED = False
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_USER_MODEL_USERNAME_FIELD = "display_name"
ACCOUNT_USER_MODEL_EMAIL_FIELD = "email"

ACCOUNT_CONFIRM_EMAIL_ON_GET = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_SIGNUP_FORM_CLASS = "users.forms.SignupForm"
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_USER_DISPLAY = lambda u: u.display_name  # noqa: E731

DEFAULT_FROM_EMAIL = "bibliothekai@ktema.org"
SERVER_EMAIL = "bibliothekai@ktema.org"

GRAPHENE = {"SCHEMA": "translations.graphql.schema"}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
