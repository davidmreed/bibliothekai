# Generated by Django 3.0.8 on 2020-07-19 03:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0002_auto_20200718_2128"),
    ]

    operations = [
        migrations.AddField(
            model_name="person",
            name="middle_name",
            field=models.CharField(blank=True, max_length=255),
        ),
    ]