import { Hero } from "@/components/home/hero"
import { About } from "@/components/home/about"
import { Skills } from "@/components/home/skills"
import { Resume } from "@/components/home/resume"
import { Services } from "@/components/home/services"
import { BlogSection } from "@/components/home/blog"
import {
  Profile,
  SkillCategory,
  Education,
  Training,
  Certification,
  IndustrialProject,
  TrainingProject,
  Service,
  BlogPost,
  BlogCategory,
  PaginatedResponse,
} from "@/services/api.types"

// Fetch function for Profile
async function getProfile(): Promise<Profile> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  try {
    const res = await fetch(`${baseUrl}/portfolio/profile/`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error("Failed to fetch profile")
    return res.json()
  } catch (error) {
    console.error("Profile fetch error:", error)
    return {
      name: "Your Name",
      headline: "Full Stack Developer",
      short_bio: "Welcome to my portfolio.",
      hero_image_url: "",
      about_text: "",
      about_image_url: "",
      email: "",
      github_url: "",
      linkedin_url: "",
      twitter_url: "",
      resume_url: "",
      updated_at: new Date().toISOString(),
    }
  }
}

// Fetch function for Skill Categories
async function getSkillCategories(): Promise<SkillCategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  try {
    const res = await fetch(`${baseUrl}/portfolio/skill-categories/`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error("Failed to fetch skill categories")
    return res.json()
  } catch (error) {
    console.error("Skill categories fetch error:", error)
    return []
  }
}

// Fetch function for Resume Data
async function getResumeData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  const opts = { next: { revalidate: 60 } }
  try {
    const [edu, train, certs, indProj, trainProj] = await Promise.all([
      fetch(`${baseUrl}/resume/education/`, opts).then((res) => (res.ok ? res.json() : [])),
      fetch(`${baseUrl}/resume/training/`, opts).then((res) => (res.ok ? res.json() : [])),
      fetch(`${baseUrl}/resume/certifications/`, opts).then((res) => (res.ok ? res.json() : [])),
      fetch(`${baseUrl}/resume/industrial-projects/`, opts).then((res) => (res.ok ? res.json() : [])),
      fetch(`${baseUrl}/resume/training-projects/`, opts).then((res) => (res.ok ? res.json() : [])),
    ])
    return {
      education: edu as Education[],
      training: train as Training[],
      certifications: certs as Certification[],
      industrialProjects: indProj as IndustrialProject[],
      trainingProjects: trainProj as TrainingProject[],
    }
  } catch (error) {
    console.error("Resume data fetch error:", error)
    return { education: [], training: [], certifications: [], industrialProjects: [], trainingProjects: [] }
  }
}

// Fetch function for Services
async function getServices(): Promise<Service[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  try {
    const res = await fetch(`${baseUrl}/portfolio/services/`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error("Failed to fetch services")
    return res.json()
  } catch (error) {
    console.error("Services fetch error:", error)
    return []
  }
}

// Fetch function for Blog Posts
async function getBlogPostsData(): Promise<PaginatedResponse<BlogPost>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  try {
    const res = await fetch(`${baseUrl}/posts/?page=1&page_size=6`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error("Failed to fetch blog posts")
    return res.json()
  } catch (error) {
    console.error("Blog posts fetch error:", error)
    return { status: "ok", count: 0, next: null, previous: null, results: [] }
  }
}

// Fetch function for Blog Categories
async function getBlogCategories(): Promise<BlogCategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  try {
    const res = await fetch(`${baseUrl}/categories/`, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error("Failed to fetch blog categories")
    const data = await res.json()
    return data.results || []
  } catch (error) {
    console.error("Blog categories fetch error:", error)
    return []
  }
}

export default async function Home() {
  const [profile, skillCategories, resumeData, services, blogPostsData, blogCategories] =
    await Promise.all([
      getProfile(),
      getSkillCategories(),
      getResumeData(),
      getServices(),
      getBlogPostsData(),
      getBlogCategories(),
    ])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills categories={skillCategories} />
        <Resume data={resumeData} />
        <Services items={services.filter((s) => s.is_active)} profileEmail={profile.email} />
        <BlogSection
          initialPosts={blogPostsData.results}
          categories={blogCategories}
          totalCount={blogPostsData.count ?? blogPostsData.results.length}
          pageSize={6}
        />
        {/* Additional sections (Contact, Chat) will go here */}
      </main>
    </div>
  )
}

