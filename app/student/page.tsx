"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { StudentPortal } from "@/components/student/student-portal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Language, useTranslation } from "@/lib/i18n"

export default function StudentPage() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<Language>("sr")
  const { t, formatMessage } = useTranslation(language)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "sr" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle()

          if (error) {
            console.error("Error fetching profile:", error)
            router.push("/")
            return
          }

          if (profile?.role === "student") {
            setUser(user)
            setUserProfile(profile)
          } else {
            router.push("/")
          }
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Error in student page:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">{t.mainPage.studentPortal}</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {t.common.welcome}, {userProfile.first_name} {userProfile.last_name}
              </span>
              <Button onClick={handleSignOut} variant="outline">
                {t.common.signOut}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StudentPortal userProfile={userProfile} setLanguageUp={setLanguage} />
      </main>
    </div>
  )
}
