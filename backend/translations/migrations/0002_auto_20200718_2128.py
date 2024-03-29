# Generated by Django 3.0.8 on 2020-07-19 03:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="person",
            name="sole_name",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name="translation",
            name="title",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name="person",
            name="first_name",
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name="person",
            name="last_name",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
