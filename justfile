set dotenv-load

frontend:
    npm --prefix frontend run build

rundb:
    docker compose up -d

migrate:
    cd backend && uv run manage.py migrate

makemigrations:
    cd backend && uv run manage.py makemigrations

runserver:
    cd backend && uv run manage.py runserver 0.0.0.0:$PORT

shell:
    uv run backend/manage.py shell

resetdb:
    uv run backend/manage.py flush --noinput
    uv run backend/manage.py migrate
    uv run backend/manage.py createsuperuser --username admin --email admin@example.com --noinput
    uv run backend/manage.py shell --command "from users.models import User; u = User.objects.get(pk=1); u.set_password('root'); u.save()"
    uv run backend/manage.py loaddata backend/dump.json
