# Generated by Django 5.0.6 on 2024-07-06 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0007_order_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='name',
            field=models.CharField(default='firstName lastName', max_length=200),
            preserve_default=False,
        ),
    ]
