# Generated by Django 3.0.8 on 2020-11-28 16:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('translations', '0032_auto_20201128_0907'),
    ]

    operations = [
        migrations.RenameField(
            model_name='publishedreview',
            old_name='volume',
            new_name='volumes',
        ),
    ]
