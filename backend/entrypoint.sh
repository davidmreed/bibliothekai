#!/bin/sh

uv run manage.py migrate
exec "$@"
