# Generated by Django 3.0.8 on 2020-07-19 03:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Language",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="Person",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_name", models.CharField(max_length=255)),
                ("last_name", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="PersonRole",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[
                            ("ED", "Editor"),
                            ("AU", "Author"),
                            ("IN", "Introducer"),
                        ],
                        max_length=2,
                    ),
                ),
                (
                    "person",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="translations.Person",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Publisher",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name="SourceText",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("original_language_title", models.CharField(max_length=255)),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="translations.Person",
                    ),
                ),
                (
                    "language",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="translations.Language",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Volume",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("isbn", models.CharField(max_length=32)),
                (
                    "people",
                    models.ManyToManyField(
                        through="translations.PersonRole", to="translations.Person"
                    ),
                ),
                (
                    "publisher",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="translations.Publisher",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Translation",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("authors", models.ManyToManyField(to="translations.Person")),
                (
                    "language",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="translations.Language",
                    ),
                ),
                ("publications", models.ManyToManyField(to="translations.Volume")),
                (
                    "source_text",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="translations.SourceText",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Review",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("content", models.TextField()),
                (
                    "volume",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="translations.Volume",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="PublishedReview",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("url", models.URLField()),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        to="translations.Person",
                    ),
                ),
                (
                    "volume",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="translations.Volume",
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="personrole",
            name="volume",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="translations.Volume"
            ),
        ),
    ]
