# Generated by Django 3.0.8 on 2020-10-10 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0017_link_resource_type"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="publishedreview",
            name="author",
        ),
        migrations.RemoveField(
            model_name="publishedreview",
            name="url",
        ),
        migrations.AddField(
            model_name="publishedreview",
            name="location",
            field=models.CharField(default="Unknown", max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="publishedreview",
            name="persons",
            field=models.ManyToManyField(to="translations.Person"),
        ),
        migrations.AddField(
            model_name="publishedreview",
            name="title",
            field=models.CharField(default="Unknown", max_length=255),
            preserve_default=False,
        ),
    ]
