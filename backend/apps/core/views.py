import boto3
import uuid
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework import serializers, status


class PresignedUrlSerializer(serializers.Serializer):
    filename = serializers.CharField(max_length=255)
    content_type = serializers.CharField(max_length=100)


class PresignedUploadView(APIView):
    """
    Generate a presigned URL for direct client-to-R2 uploads.
    Only accessible by admin users.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = PresignedUrlSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        filename = serializer.validated_data["filename"]
        content_type = serializer.validated_data["content_type"]
        
        # Generate a unique path to avoid collisions
        unique_id = uuid.uuid4().hex[:8]
        # Store in a media/uploads prefix
        object_key = f"media/uploads/{unique_id}-{filename}"

        s3_client = boto3.client(
            "s3",
            endpoint_url=settings.CLOUDFLARE_R2_ENDPOINT_URL,
            aws_access_key_id=settings.CLOUDFLARE_R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            region_name="auto",
        )

        try:
            # Generate the presigned POST url
            presigned_data = s3_client.generate_presigned_post(
                Bucket=settings.CLOUDFLARE_R2_BUCKET_NAME,
                Key=object_key,
                Fields={"Content-Type": content_type},
                Conditions=[
                    {"Content-Type": content_type},
                    ["content-length-range", 0, 10 * 1024 * 1024],  # 10MB limit
                ],
                ExpiresIn=3600,
            )
        except Exception as e:
            return Response(
                {"error": "Failed to generate presigned URL.", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        public_base = settings.CLOUDFLARE_R2_PUBLIC_URL.rstrip("/")
        public_url = f"{public_base}/{object_key}"

        return Response(
            {
                "presigned_data": presigned_data,
                "public_url": public_url,
                "object_key": object_key,
            },
            status=status.HTTP_200_OK,
        )
