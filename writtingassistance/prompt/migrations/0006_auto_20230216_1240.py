# Generated by Django 3.2.16 on 2023-02-16 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prompt', '0005_auto_20230214_1125'),
    ]

    operations = [
        migrations.AlterField(
            model_name='prompt',
            name='backImage',
            field=models.CharField(blank=True, default='logo.png', max_length=2000, null=True),
        ),
        migrations.AlterField(
            model_name='prompt',
            name='frontImage',
            field=models.CharField(blank=True, default='logo.png', max_length=2000, null=True),
        ),
    ]