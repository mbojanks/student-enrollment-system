"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation, type Language } from "@/lib/i18n"

interface LoginFormProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

export function LoginForm({ language, onLanguageChange }: LoginFormProps) {
  const { t } = useTranslation(language)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickLogin = async (role: string) => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const testEmails = {
        admin: "admin@university.edu",
        service: "service@university.edu",
        student: "student@university.edu",
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: testEmails[role as keyof typeof testEmails],
        password: `${role}123`,
      })

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError(t.auth.userDoesNotExist)
        } else {
          throw error
        }
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const createTestUser = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Create admin user
      const { data: adminData, error: adminError } = await supabase.auth.signUp({
        email: "admin@university.edu",
        password: "admin123",
      })

      if (adminError && !adminError.message.includes("already registered")) {
        throw adminError
      }

      // Create service user
      const { data: serviceData, error: serviceError } = await supabase.auth.signUp({
        email: "service@university.edu",
        password: "service123",
      })

      if (serviceError && !serviceError.message.includes("already registered")) {
        throw serviceError
      }

      // Create student user
      const { data: studentData, error: studentError } = await supabase.auth.signUp({
        email: "student@university.edu",
        password: "student123",
      })

      if (studentError && !studentError.message.includes("already registered")) {
        throw studentError
      }

      // Try to login as admin after creation
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: "admin@university.edu",
        password: "admin123",
      })

      if (loginError) throw loginError

      setSuccess(t.auth.createUserSuccess)
      setEmail("admin@university.edu")
      setPassword("admin123")
    } catch (error: any) {
      setError(`${t.messages.profileCreationError}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t.auth.signIn}</CardTitle>
            <CardDescription className="text-center">{t.auth.loginCredentials}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t.auth.email}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t.auth.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t.common.loading : t.auth.signIn}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">{t.auth.quickTestLogin}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleQuickLogin("admin")}
                  disabled={loading}
                >
                  {t.auth.loginAsAdmin}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleQuickLogin("service")}
                  disabled={loading}
                >
                  {t.auth.loginAsService}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleQuickLogin("student")}
                  disabled={loading}
                >
                  {t.auth.loginAsStudent}
                </Button>
              </div>

              <div className="text-center">
                <Button variant="link" onClick={createTestUser} disabled={loading} className="text-sm">
                  {t.auth.createTestUser}
                </Button>
              </div>

              <div className="text-xs text-center text-muted-foreground">{t.auth.useCreateButton}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
