# Generated by Django 3.0.8 on 2020-07-19 03:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0003_person_middle_name"),
    ]

    operations = [
        migrations.AlterField(
            model_name="translation",
            name="publications",
            field=models.ManyToManyField(blank=True, to="translations.Volume"),
        ),
    ]
