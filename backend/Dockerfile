FROM python:3.9-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ARG PORT=8000

ENV APP_HOME=/app
WORKDIR $APP_HOME
COPY requirements requirements
RUN python -m pip install --upgrade pip && pip install -r requirements/requirements.txt
COPY . $APP_HOME
RUN python manage.py collectstatic

RUN addgroup --system app && adduser --system app --ingroup app
RUN chown -R app:app $APP_HOME
USER app

EXPOSE $PORT
ENTRYPOINT ["/app/entrypoint.sh"]
CMD gunicorn wsgi:application --bind 0.0.0.0:$PORT
