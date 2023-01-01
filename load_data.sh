docker exec -it bibliothekai_web_1 python manage.py flush --noinput
docker exec -it bibliothekai_web_1 python manage.py createsuperuser --username admin --email admin@example.com --noinput
docker exec -it bibliothekai_web_1 python manage.py shell --command "from users.models import User; u = User.objects.get(pk=1); u.set_password('root'); u.save()"
docker cp dump.json bibliothekai_web_1:/home/app/web
docker exec -it bibliothekai_web_1 python manage.py loaddata dump.json
