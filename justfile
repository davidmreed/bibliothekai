set dotenv-load

node-deps:
    npm install

python-deps:
    pip install --upgrade pip
    pip install -r backend/requirements/requirements_dev.txt -r backend/requirements/requirements.txt

deps: python-deps node-deps

frontend: node-deps
    npm run build
    cp -R dist/* backend/translations/static

rundb:
    docker compose up -d

migrate:
    cd backend && python manage.py migrate

makemigrations:
    cd backend && python manage.py makemigrations

runserver:
    cd backend && python manage.py runserver 0.0.0.0:$PORT

resetdb:
    python backend/manage.py reset_db --noinput
    python backend/manage.py migrate
    python backend/manage.py createsuperuser --username admin --email admin@example.com --noinput
    python backend/manage.py shell --command "from users.models import User; u = User.objects.get(pk=1); u.set_password('root'); u.save()"
    python backend/manage.py loaddata backend/dump.json

update-deps:
    pip-compile backend/requirements/requirements.in -o backend/requirements/requirements.txt
    pip-compile backend/requirements/requirements_dev.in -o backend/requirements/requirements_dev.txt
