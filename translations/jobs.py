from .models import Link

import requests


def remove_dead_links():
    to_delete = []
    for each_link in Link.objects.all():
        url = each_link.link
        try:
            if requests.head(url).status_code == 404:
                to_delete.append(each_link)
        except requests.exceptions.ConnectionError:
            pass

    for each_link in to_delete:
        each_link.delete()
