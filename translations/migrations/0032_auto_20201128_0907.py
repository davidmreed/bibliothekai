# Generated by Django 3.0.8 on 2020-11-28 16:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0031_auto_20201128_0906"),
    ]

    operations = [
        migrations.AlterField(
            model_name="publishedreview",
            name="published_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
