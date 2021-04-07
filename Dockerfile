FROM node:15.13.0-alpine3.12 AS node-build
COPY package.json /
RUN npm install
COPY . /app
WORKDIR /app
RUN npm run build


FROM python:3.8-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app
COPY --from=node-build /app/dist ./translations/static
COPY /requirements.txt .
RUN python -m pip install --upgrade pip && pip install -r requirements.txt
ENTRYPOINT ["/app/entrypoint.sh"]