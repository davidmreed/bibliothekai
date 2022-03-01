FROM node:17-alpine3.14 AS node-build
COPY package.json /
RUN npm install
COPY . /app
WORKDIR /app
RUN npm run build


FROM python:3.9-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements requirements
RUN python -m pip install --upgrade pip && pip install -r requirements/requirements.txt

RUN addgroup --system app && adduser --system app --ingroup app

ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

RUN chown -R app:app $APP_HOME
USER app

COPY --from=node-build /app/dist ${APP_HOME}/translations/static

COPY backend $APP_HOME
RUN python manage.py collectstatic
EXPOSE 8000
ENTRYPOINT ["/home/app/web/entrypoint.sh"]

