# Generated by Django 3.1.4 on 2021-03-09 03:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0046_auto_20210308_2020"),
    ]

    operations = [
        migrations.AlterField(
            model_name="sourcetext",
            name="sample_passage_license_link",
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="sourcetext",
            name="sample_passage_source_link",
            field=models.URLField(blank=True, null=True),
        ),
    ]
