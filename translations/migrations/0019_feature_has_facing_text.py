# Generated by Django 3.0.8 on 2020-10-10 17:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('translations', '0018_auto_20201010_1043'),
    ]

    operations = [
        migrations.AddField(
            model_name='feature',
            name='has_facing_text',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]