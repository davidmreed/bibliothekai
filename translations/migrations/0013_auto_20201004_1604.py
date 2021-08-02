# Generated by Django 3.0.8 on 2020-10-04 22:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0012_auto_20200929_2100"),
    ]

    operations = [
        migrations.AddField(
            model_name="person",
            name="description",
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name="feature",
            name="feature",
            field=models.CharField(
                choices=[
                    ("ED", "Edited by"),
                    ("IN", "Introduction by"),
                    ("CM", "Commentary by"),
                    ("TR", "Translation by"),
                ],
                max_length=2,
            ),
        ),
    ]
