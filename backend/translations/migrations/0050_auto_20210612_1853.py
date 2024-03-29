# Generated by Django 3.1.4 on 2021-06-13 00:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("translations", "0049_auto_20210529_2021"),
    ]

    operations = [
        migrations.RenameField(
            model_name="feature",
            old_name="kind",
            new_name="format",
        ),
        migrations.RenameField(
            model_name="sourcetext",
            old_name="kind",
            new_name="format",
        ),
        migrations.AlterField(
            model_name="feature",
            name="language",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="features",
                to="translations.language",
            ),
        ),
        migrations.AlterField(
            model_name="feature",
            name="source_text",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="features",
                to="translations.sourcetext",
            ),
        ),
        migrations.AlterField(
            model_name="publishedreview",
            name="persons",
            field=models.ManyToManyField(
                related_name="published_reviews", to="translations.Person"
            ),
        ),
        migrations.AlterField(
            model_name="publishedreview",
            name="volumes",
            field=models.ManyToManyField(
                related_name="published_reviews", to="translations.Volume"
            ),
        ),
        migrations.AlterField(
            model_name="review",
            name="volume",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="reviews",
                to="translations.volume",
            ),
        ),
        migrations.AlterField(
            model_name="sourcetext",
            name="author",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="source_texts",
                to="translations.person",
            ),
        ),
        migrations.AlterField(
            model_name="sourcetext",
            name="language",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="source_texts",
                to="translations.language",
            ),
        ),
        migrations.AlterField(
            model_name="volume",
            name="publisher",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="volumes",
                to="translations.publisher",
            ),
        ),
        migrations.AlterField(
            model_name="volume",
            name="series",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name="volumes",
                to="translations.series",
            ),
        ),
    ]
