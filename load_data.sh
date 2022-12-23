docker exec -it bibliothekai_web_1 python manage.py flush --noinput
docker cp dump.json bibliothekai_web_1:/home/app/web
docker exec -it bibliothekai_web_1 python manage.py loaddata dump.json
