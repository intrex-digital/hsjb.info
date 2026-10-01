from django.db.models import Q
from rest_framework import viewsets

from apps.core.permissions import IsAdminOrReadOnly

from .models import Category, Post, Tag
from .serializers import CategorySerializer, PostSerializer, TagSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Post.objects.prefetch_related("categories", "tags")
        if not self.request.user.is_staff:
            queryset = queryset.filter(status=Post.Status.PUBLISHED)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search)
                | Q(excerpt__icontains=search)
                | Q(content__icontains=search)
            )

        category = self.request.query_params.get("category")
        if category:
            queryset = queryset.filter(categories__slug=category)

        tag = self.request.query_params.get("tag")
        if tag:
            queryset = queryset.filter(tags__slug=tag)

        return queryset.distinct()


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Category.objects.all()
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(posts__status=Post.Status.PUBLISHED).distinct()


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Tag.objects.all()
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(posts__status=Post.Status.PUBLISHED).distinct()

