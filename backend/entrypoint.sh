#!/bin/sh

uv run manage.py migrate
uv run gunicorn wsgi:application --bind 0.0.0.0:8000
