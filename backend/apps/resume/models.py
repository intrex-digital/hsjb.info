from django.db import models

class BaseResumeItem(models.Model):
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ["-start_date", "order"]


class Education(BaseResumeItem):
    degree = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)

    class Meta(BaseResumeItem.Meta):
        verbose_name_plural = "Education"

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Training(BaseResumeItem):
    title = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    location = models.CharField(max_length=255, blank=True)

    class Meta(BaseResumeItem.Meta):
        verbose_name_plural = "Training"

    def __str__(self):
        return f"{self.title} at {self.institution}"


class Certification(models.Model):
    name = models.CharField(max_length=255)
    issuer = models.CharField(max_length=255)
    issue_date = models.DateField(null=True, blank=True)
    expiration_date = models.DateField(null=True, blank=True)
    credential_id = models.CharField(max_length=100, blank=True)
    credential_url = models.URLField(max_length=500, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-issue_date", "order"]

    def __str__(self):
        return f"{self.name} by {self.issuer}"


class IndustrialProject(BaseResumeItem):
    title = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True)
    link = models.URLField(max_length=500, blank=True)
    
    # Optional image for detail view
    image_url = models.URLField(max_length=500, blank=True)
    technologies = models.CharField(max_length=500, blank=True, help_text="Comma separated list")

    def __str__(self):
        return self.title


class TrainingProject(BaseResumeItem):
    title = models.CharField(max_length=255)
    role = models.CharField(max_length=255)
    institution = models.CharField(max_length=255, blank=True)
    link = models.URLField(max_length=500, blank=True)
    
    technologies = models.CharField(max_length=500, blank=True, help_text="Comma separated list")

    def __str__(self):
        return self.title
