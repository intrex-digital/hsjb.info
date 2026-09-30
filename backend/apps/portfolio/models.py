from django.db import models

class Profile(models.Model):
    # We only want one profile ever, so we can enforce id=1
    name = models.CharField(max_length=100, default="Your Name")
    headline = models.CharField(max_length=255, default="Full Stack Developer")
    short_bio = models.TextField(blank=True)
    hero_image_url = models.URLField(max_length=500, blank=True)
    
    # About Section
    about_text = models.TextField(blank=True)
    about_image_url = models.URLField(max_length=500, blank=True)
    
    # Social / Contact
    email = models.EmailField(blank=True)
    github_url = models.URLField(max_length=500, blank=True)
    linkedin_url = models.URLField(max_length=500, blank=True)
    twitter_url = models.URLField(max_length=500, blank=True)
    resume_url = models.URLField(max_length=500, blank=True)
    
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.pk = 1 # Enforce singleton
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return f"Profile: {self.name}"

class SkillCategory(models.Model):
    name = models.CharField(max_length=50)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Skill Categories"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name

class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, related_name="skills", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    icon_url = models.URLField(max_length=500, blank=True)
    proficiency = models.PositiveIntegerField(default=100, help_text="0 to 100")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["category", "order", "name"]

    def __str__(self):
        return self.name

class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    icon_url = models.URLField(max_length=500, blank=True)
    price_range = models.CharField(max_length=100, blank=True, help_text="e.g. '$100 - $500' or 'Contact for pricing'")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "title"]

    def __str__(self):
        return self.title
