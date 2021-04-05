FROM node/15.13-alpine AS node-build
RUN npm install && npm build


FROM python/3.9-alpine AS python-build

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt /
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r requirements.txt
COPY . /app
COPY --from=node-build /dist /app/translations/static
RUN python manage.py collectstatic


FROM python:3.9-alpine

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY --from=python-build /wheels /wheels
COPY --from=python-build requirements.txt .
RUN pip install --no-cache /wheels/* # flask, gunicorn, pycrypto
WORKDIR /app
COPY --from=python-build /app /app