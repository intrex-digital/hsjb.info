from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import CustomUser

from .models import Category, Post, Tag


class BlogApiTests(APITestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(
            email="admin@hsjb.info",
            password="adminpassword",
            is_staff=True,
        )
        self.published_post = Post.objects.create(
            title="Published post",
            content="Published body",
            status=Post.Status.PUBLISHED,
        )
        self.draft_post = Post.objects.create(title="Draft post", content="Draft body")

    def test_public_post_list_contains_published_posts_only(self):
        response = self.client.get(reverse("post-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [post["slug"] for post in response.data["results"]],
            [self.published_post.slug],
        )

    def test_public_post_detail_does_not_expose_draft(self):
        response = self.client.get(reverse("post-detail", kwargs={"slug": self.draft_post.slug}))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_admin_can_list_drafts(self):
        self.client.force_authenticate(user=self.admin)

        response = self.client.get(reverse("post-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_public_cannot_create_post(self):
        response = self.client.post(
            reverse("post-list"),
            {"title": "Public attempt", "content": "Not allowed"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_create_post_with_taxonomy_and_generated_slug(self):
        self.client.force_authenticate(user=self.admin)
        category = Category.objects.create(name="Systems Design")
        tag = Tag.objects.create(name="Django REST Framework")

        response = self.client.post(
            reverse("post-list"),
            {
                "title": "Building Reliable APIs",
                "content": "Markdown **content**",
                "status": Post.Status.PUBLISHED,
                "category_ids": [category.pk],
                "tag_ids": [tag.pk],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        created_post = Post.objects.get(pk=response.data["id"])
        self.assertEqual(created_post.slug, "building-reliable-apis")
        self.assertIsNotNone(created_post.published_at)
        self.assertEqual(list(created_post.categories.all()), [category])
        self.assertEqual(list(created_post.tags.all()), [tag])
        self.assertEqual(response.data["categories"][0]["slug"], category.slug)
        self.assertEqual(response.data["tags"][0]["slug"], tag.slug)

    def test_public_taxonomy_hides_entries_used_only_by_drafts(self):
        published_category = Category.objects.create(name="Public Category")
        draft_category = Category.objects.create(name="Draft Category")
        published_tag = Tag.objects.create(name="Public Tag")
        draft_tag = Tag.objects.create(name="Draft Tag")
        self.published_post.categories.add(published_category)
        self.published_post.tags.add(published_tag)
        self.draft_post.categories.add(draft_category)
        self.draft_post.tags.add(draft_tag)

        category_response = self.client.get(reverse("category-list"))
        tag_response = self.client.get(reverse("tag-list"))

        self.assertEqual(category_response.status_code, status.HTTP_200_OK)
        self.assertEqual(tag_response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["slug"] for item in category_response.data["results"]],
            [published_category.slug],
        )
        self.assertEqual(
            [item["slug"] for item in tag_response.data["results"]],
            [published_tag.slug],
        )
