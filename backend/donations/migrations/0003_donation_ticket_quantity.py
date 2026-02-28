from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("donations", "0002_campaign_featured_video_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="donation",
            name="ticket_quantity",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
