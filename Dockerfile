FROM node:22-alpine AS node-build
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN npm --prefix frontend install
COPY frontend ./frontend
RUN mkdir -p /app/backend/translations/static
RUN npm --prefix frontend run build


FROM ghcr.io/astral-sh/uv:python3.13-trixie

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV VIRTUAL_ENV=/.venv
ENV PATH="/.venv/bin:$PATH"

COPY pyproject.toml uv.lock .
RUN uv sync --frozen --no-dev

RUN addgroup --system app && adduser --system app --ingroup app

ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

RUN chown -R app:app $APP_HOME
USER app

COPY backend $APP_HOME
COPY --from=node-build /app/backend/translations/static ${APP_HOME}/translations/static
RUN python manage.py collectstatic
EXPOSE 8000
ENTRYPOINT ["/home/app/web/entrypoint.sh"]
CMD ["sh", "-c", "gunicorn wsgi:application --bind 0.0.0.0:${PORT}"]
