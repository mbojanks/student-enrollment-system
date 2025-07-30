"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { LoginForm } from "@/components/auth/login-form"
import { AdminSetup } from "@/components/setup/admin-setup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, FileText, BarChart3 } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation, type Language } from "@/lib/i18n"

export default function Home() {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSetup, setShowSetup] = useState(false)
  const [error, setError] = useState("")
  const [authInitialized, setAuthInitialized] = useState(false)
  const [language, setLanguage] = useState<Language>("sr")
  const { t, formatMessage } = useTranslation(language)
  const router = useRouter()

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "sr" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  useEffect(() => {
    console.log("Home component mounted")

    // Initialize auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email || "No user")

      try {
        if (event === "SIGNED_OUT") {
          // Handle sign out explicitly
          setUser(null)
          setUserProfile(null)
          setShowSetup(false)
          setError("")
          setAuthInitialized(true)
          setLoading(false)
          return
        }

        if (session?.user) {
          setUser(session.user)

          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .maybeSingle()

          if (profileError) {
            console.error("Error fetching profile:", profileError)
            setError(t.messages.failedToFetch + " профил")
          } else {
            console.log("Profile:", profile?.role || "No profile")
            setUserProfile(profile)
          }
        } else {
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Error in auth state change:", error)
        setError(t.messages.authError)
      } finally {
        setAuthInitialized(true)
        setLoading(false)
      }
    })

    // Get initial session with timeout
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...")

        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
          // Don't treat this as a fatal error, just continue without session
        }

        console.log("Initial session:", initialSession?.user?.email || "No session")

        if (initialSession?.user) {
          setUser(initialSession.user)

          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", initialSession.user.id)
            .maybeSingle()

          if (profileError) {
            console.error("Error fetching profile:", profileError)
          } else {
            console.log("Profile:", profile?.role || "No profile")
            setUserProfile(profile)
          }
        }
      } catch (error) {
        console.error("Error getting initial session:", error)
      } finally {
        setAuthInitialized(true)
        setLoading(false)
      }
    }

    getInitialSession()

    return () => {
      console.log("Cleaning up auth subscription")
      subscription.unsubscribe()
    }
  }, [t])

  // Handle role-based navigation
  useEffect(() => {
    if (user && userProfile && authInitialized && !loading) {
      console.log("Redirecting user with role:", userProfile.role)
      if (userProfile.role === "admin") {
        router.push("/admin")
      } else if (userProfile.role === "service") {
        router.push("/service")
      } else if (userProfile.role === "student") {
        router.push("/student")
      }
    }
  }, [user, userProfile, authInitialized, loading, router])

  const handleSignOut = async () => {
    console.log("Signing out...")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
      }
      // The auth state change listener will handle the rest
    } catch (error) {
      console.error("Unexpected sign out error:", error)
    }
  }

  if (loading || !authInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.messages.initializingApp}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>{t.common.error}</CardTitle>
            <CardDescription>{t.messages.somethingWentWrong}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                {t.messages.reloadPage}
              </Button>
              <Button onClick={() => setError("")} variant="outline" className="w-full">
                {t.messages.clearError}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-end mb-4">
            <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />
          </div>

          <div className="text-center mb-12">
            <GraduationCap className="mx-auto h-16 w-16 text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.mainPage.title}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{t.mainPage.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>{t.mainPage.adminDashboard}</CardTitle>
                <CardDescription>{t.mainPage.adminDescription}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>{t.mainPage.serviceInterface}</CardTitle>
                <CardDescription>{t.mainPage.serviceDescription}</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>{t.mainPage.studentPortal}</CardTitle>
                <CardDescription>{t.mainPage.studentPortalDescription}</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="max-w-md mx-auto">
            <LoginForm language={language} />
          </div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-2xl w-full mx-4">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-end mb-4">
                <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />
              </div>
              <CardTitle>{t.auth.profileSetupRequired}</CardTitle>
              <CardDescription>
                {language === "sr"
                  ? "Ваш налог треба да буде конфигурисан. Подесите ваш профил испод или контактирајте администратора."
                  : "Your account needs to be configured. Set up your profile below or contact an administrator."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showSetup ? (
                <AdminSetup user={user} onProfileCreated={(profile) => setUserProfile(profile)} language={language} />
              ) : (
                <div className="space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-gray-600">
                      <strong>{t.common.email}:</strong> {user.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      {language === "sr"
                        ? "Ако сте администратор, можете подесити ваш профил сада. У супротном, молимо контактирајте вашег системског администратора."
                        : "If you're an administrator, you can set up your profile now. Otherwise, please contact your system administrator."}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => setShowSetup(true)} className="flex-1">
                      {t.auth.setupProfile}
                    </Button>
                    <Button onClick={handleSignOut} variant="outline" className="flex-1 bg-transparent">
                      {t.common.signOut}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{formatMessage(t.messages.redirectingToDashboard, { role: userProfile.role })}</p>
      </div>
    </div>
  )
}
