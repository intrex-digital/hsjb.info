from rest_framework import serializers
from .models import Profile, Skill, SkillCategory

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = [
            "name",
            "headline",
            "short_bio",
            "hero_image_url",
            "about_text",
            "about_image_url",
            "email",
            "github_url",
            "linkedin_url",
            "twitter_url",
            "resume_url",
            "updated_at",
        ]
        read_only_fields = ["updated_at"]


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name", "icon_url", "proficiency", "order", "category"]


class SkillCategorySerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = SkillCategory
        fields = ["id", "name", "order", "skills"]
