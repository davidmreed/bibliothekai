set dotenv-load := true

[private]
default:
    @just --list

up: frontend rundb resetdb runserver

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
    uv run backend/manage.py shell \
      --command "from users.models import User; u = User.objects.get(pk=1); u.set_password('root'); u.display_name='Admin'; u.save()"
    uv run backend/manage.py shell \
      --command "from allauth.account.models import EmailAddress; EmailAddress.objects.create(user=User.objects.get(pk=1), email='admin@example.com', verified=True, primary=True)"
    uv run backend/manage.py loaddata backend/dump.json

# Export database to backup file
backup:
    pg_dump -U postgres -h $PGHOST_PROD -p $PGPORT_PROD -W -f backups/database-{{datetime("%F")}}.bak -F t railway

psql:
    psql -U postgres -h $PGHOST_PROD -p $PGPORT_PROD -t railway
