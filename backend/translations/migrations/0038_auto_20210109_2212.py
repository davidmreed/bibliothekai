# Generated by Django 3.1.4 on 2021-01-10 05:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0037_auto_20210109_2209"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usersubmission",
            name="processed",
            field=models.BooleanField(default=False),
        ),
    ]
