import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from apps.portfolio.models import Profile, Skill, SkillCategory, Service
from apps.resume.models import Education, Training, Certification, IndustrialProject, TrainingProject
from apps.blog.models import Post, Category, Tag
from apps.users.models import CustomUser

def run_seed():
    # 1. Create a superuser
    if not CustomUser.objects.filter(email="admin@hsjb.info").exists():
        CustomUser.objects.create_superuser("admin@hsjb.info", "adminpassword")

    # 2. Add profile
    profile = Profile.get_solo()
    profile.name = "John Doe"
    profile.headline = "Full-Stack Developer & Technical Trainer"
    profile.short_bio = "I am a software engineer and technical trainer with over a decade of experience across the stack. I specialize in React, Django, and cloud architecture. I enjoy building robust applications and teaching others how to do the same."
    profile.about_text = """I've always believed that building great software requires more than just clean code—it's about understanding the problem space, designing scalable solutions, and effectively communicating technical concepts to the team.

With a strong foundation in modern backend architectures and an eye for front-end craft, I help organizations navigate their digital transformations. When I'm not deploying microservices, I spend my time mentoring the next generation of engineers through immersive technical training programs.

My approach combines theoretical rigor with practical, hands-on experience, bridging the gap between \"how it works\" and \"how we build it in production.\""""
    profile.email = "hello@johndoe.com"
    profile.github_url = "https://github.com/"
    profile.linkedin_url = "https://linkedin.com/"
    profile.save()

    # 3. Add Skill Categories and Skills
    if not SkillCategory.objects.exists():
        frontend = SkillCategory.objects.create(name="Frontend", order=1)
        backend = SkillCategory.objects.create(name="Backend", order=2)
        devops = SkillCategory.objects.create(name="Cloud & DevOps", order=3)
        training = SkillCategory.objects.create(name="Core Competencies", order=4)

        Skill.objects.create(category=frontend, name="React / Next.js", proficiency=95)
        Skill.objects.create(category=frontend, name="TypeScript", proficiency=90)
        Skill.objects.create(category=frontend, name="Tailwind CSS", proficiency=90)

        Skill.objects.create(category=backend, name="Python / Django / DRF", proficiency=95)
        Skill.objects.create(category=backend, name="Node.js", proficiency=85)
        Skill.objects.create(category=backend, name="PostgreSQL & Redis", proficiency=85)

        Skill.objects.create(category=devops, name="Docker & Kubernetes", proficiency=80)
        Skill.objects.create(category=devops, name="Cloudflare Workers / D1 / R2", proficiency=85)
        Skill.objects.create(category=devops, name="AWS Solutions Architecture", proficiency=75)

        Skill.objects.create(category=training, name="Technical Mentorship", proficiency=90)
        Skill.objects.create(category=training, name="System Design", proficiency=85)

    # 4. Resume Data
    if not Education.objects.exists():
        Education.objects.create(
            degree="B.Sc. Computer Science",
            institution="Tech University",
            start_date="2010-09-01",
            end_date="2014-05-01",
            is_current=False
        )

    if not Training.objects.exists():
        Training.objects.create(
            title="Advanced Systems Design",
            institution="Cloud Academy",
            start_date="2022-01-01",
            end_date="2022-03-01",
            is_current=False
        )

    if not Certification.objects.exists():
        Certification.objects.create(
            name="AWS Certified Solutions Architect",
            issuer="Amazon Web Services",
            issue_date="2023-08-01",
        )

    if not IndustrialProject.objects.exists():
        IndustrialProject.objects.create(
            title="Enterprise E-commerce Platform",
            role="Lead Backend Engineer",
            company="Globex Corp",
            start_date="2021-02-01",
            end_date="2023-11-01",
            is_current=False,
            description="Led the transition from a legacy monolithic architecture to a decoupled microservices platform using Django, Postgres, and Redis. Improved query response times by 40% and established a CI/CD pipeline reducing deployment times by half.",
            technologies="Python, Django, Postgres, Redis, Docker"
        )
        IndustrialProject.objects.create(
            title="Real-time Financial Dashboard",
            role="Full Stack Architect",
            company="FinTech Startups Inc.",
            start_date="2024-01-01",
            is_current=True,
            description="Architecting and building a real-time analytics dashboard rendering high-frequency financial data. Implemented a websocket-based streaming architecture allowing sub-50ms latency updates to the frontend.",
            technologies="React, Next.js, Django Channels, WebSockets"
        )

    if not TrainingProject.objects.exists():
        TrainingProject.objects.create(
            title="React & TypeScript Bootcamp",
            role="Lead Technical Instructor",
            institution="Enterprise Academy",
            start_date="2023-01-01",
            description="Delivered a 2-week intensive training for 30 enterprise developers transitioning from legacy stacks to modern React paradigms.",
            technologies="React, TypeScript, Testing Library"
        )

    # 5. Services
    if not Service.objects.exists():
        Service.objects.create(
            title="Full-Stack Development",
            description="End-to-end custom web application development tailored to your specific business requirements, from architecture planning to production deployment.",
            price_range="Contact for quote"
        )
        Service.objects.create(
            title="Technical Consulting",
            description="Expert guidance on system architecture, database design, and code quality reviews to help you scale confidently.",
            price_range="Hourly or Project basis"
        )
        Service.objects.create(
            title="Corporate Training",
            description="Immersive, hands-on technical workshops designed to upskill your engineering teams in modern frameworks and architectural patterns.",
            price_range="Depends on team size"
        )

    # 6. Blog Posts
    if not Post.objects.exists():
        cat1 = Category.objects.create(name="Architecture")
        cat2 = Category.objects.create(name="Frontend")
        tag1 = Tag.objects.create(name="Django")
        tag2 = Tag.objects.create(name="Cloudflare")
        tag3 = Tag.objects.create(name="Next.js")

        p1 = Post.objects.create(
            title="Why I chose Next.js and Django for my 2024 Stack",
            excerpt="A deep dive into separating frontend concerns from the backend, and why this hybrid approach delivers the best of both worlds.",
            content="""Using a dedicated backend framework like Django alongside a powerful frontend metaframework like Next.js might seem like overkill to some. However, as applications grow, the separation of concerns becomes increasingly vital.

In this post, we'll explore:
- The benefits of a typed, component-driven UI
- The immense value of Django's battle-tested ORM and admin interface
- Exploring the JWT authentication flow securely

### The Power of Separation

By decoupling...""",
            status="published"
        )
        p1.categories.add(cat1)
        p1.tags.add(tag1, tag3)

        p2 = Post.objects.create(
            title="Mastering Cloudflare R2 for Media Storage",
            excerpt="How to handle media storage efficiently without egress fees, ensuring fast media delivery across global networks.",
            content="""Cloudflare R2 is changing the landscape of object storage. With zero egress fees and an S3-compatible API, it offers a compelling alternative to incumbent providers.

```python
import boto3

# Example boto3 configuration for R2
s3_client = boto3.client(
    "s3",
    endpoint_url="https://<account_id>.r2.cloudflarestorage.com",
    aws_access_key_id="...",
    aws_secret_access_key="...",
    region_name="auto",
)
```

Integrating this with Django's storage backends can drastically reduce infrastructure costs for media-heavy applications.""",
            status="published"
        )
        p2.categories.add(cat1)
        p2.tags.add(tag2)

    print("Seed data successfully injected!")

if __name__ == "__main__":
    run_seed()
