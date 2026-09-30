import { Hero } from "@/components/home/hero"
import { About } from "@/components/home/about"
import { Skills } from "@/components/home/skills"
import { Profile, SkillCategory } from "@/services/api.types"

// Fetch function for Profile
async function getProfile(): Promise<Profile> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1"
  
  try {
    const res = await fetch(`${baseUrl}/portfolio/profile/`, {
      next: { revalidate: 60 },
    })
    
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
    const res = await fetch(`${baseUrl}/portfolio/skill-categories/`, {
      next: { revalidate: 60 },
    })
    
    if (!res.ok) throw new Error("Failed to fetch skill categories")
    return res.json()
  } catch (error) {
    console.error("Skill categories fetch error:", error)
    return []
  }
}

export default async function Home() {
  const profile = await getProfile()
  const skillCategories = await getSkillCategories()
  
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills categories={skillCategories} />
        {/* Additional sections (Projects) will go here */}
      </main>
    </div>
  )
}
