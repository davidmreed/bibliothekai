FROM node:15.13.0-alpine3.12 AS node-build
COPY package.json /
RUN npm install
COPY . /app
WORKDIR /app
RUN npm run build


FROM python:3.9-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN addgroup --system app && adduser --system app --ingroup app

ENV HOME=/home/app
ENV APP_HOME=/home/app/web
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY --from=node-build /app/dist ${APP_HOME}/translations/static
COPY requirements.txt ${APP_HOME}
RUN python -m pip install --upgrade pip && pip install -r requirements.txt
COPY . $APP_HOME

RUN chown -R app:app $APP_HOME
USER app
EXPOSE 8000

RUN python manage.py collectstatic

ENTRYPOINT ["/home/app/web/entrypoint.sh"]