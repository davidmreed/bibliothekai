# Generated by Django 3.0.8 on 2020-10-05 03:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0014_auto_20201004_1816"),
    ]

    operations = [
        migrations.AlterField(
            model_name="feature",
            name="feature",
            field=models.CharField(
                choices=[
                    ("ED", "Edited"),
                    ("IN", "Introduction"),
                    ("CM", "Commentary"),
                    ("TR", "Translation"),
                    ("NT", "Notes"),
                ],
                max_length=2,
            ),
        ),
    ]
