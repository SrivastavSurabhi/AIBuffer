# Generated by Django 3.2.16 on 2023-02-13 08:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prompt', '0002_prompt_promptsubcategory'),
    ]

    operations = [
        migrations.AddField(
            model_name='prompt',
            name='category',
            field=models.CharField(blank=True, max_length=2000, null=True),
        ),
        migrations.AddField(
            model_name='prompt',
            name='image',
            field=models.FileField(default='static/images/logo.png', upload_to='static/images/prompts'),
        ),
    ]