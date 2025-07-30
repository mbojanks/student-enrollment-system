"use client"

import type React from "react"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, User, Shield, Users } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"

interface AdminSetupProps {
  user: {
    id: string
    email: string
  }
  onProfileCreated: (profile: any) => void
  language: Language
}

export function AdminSetup({ user, onProfileCreated, language }: AdminSetupProps) {
  const { t } = useTranslation(language)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Create user profile
      const profileData = {
        user_id: user.id,
        email: user.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: formData.role,
      }

      console.log("Creating profile with data:", profileData)

      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .insert([profileData])
        .select()
        .single()

      if (profileError) {
        console.error("Profile creation error:", profileError)
        throw profileError
      }

      console.log("Profile created successfully:", profile)

      // If creating a student profile, also create student candidate record
      if (formData.role === "student") {
        const studentData = {
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: "2000-01-01",
          social_security_number: `SSN${Date.now()}`, // Generate unique SSN for demo
          father_first_name: language === "sr" ? "Отац" : "Father",
          father_last_name: language === "sr" ? "Презиме" : "Name",
          mother_first_name: language === "sr" ? "Мајка" : "Mother",
          mother_last_name: language === "sr" ? "Презиме" : "Name",
          phone: "+1-555-0000",
          email: user.email,
          previous_education_program: language === "sr" ? "Средња школа" : "High School",
          previous_education_institution: language === "sr" ? "Локална средња школа" : "Local High School",
          previous_education_start_year: 2016,
          previous_education_end_year: 2020,
        }

        console.log("Creating student candidate with data:", studentData)

        const { error: studentError } = await supabase.from("student_candidates").insert([studentData])

        if (studentError) {
          console.warn("Failed to create student candidate record:", studentError)
          // Don't throw error here as profile was created successfully
        }
      }

      onProfileCreated(profile)
    } catch (error: any) {
      console.error("Setup error:", error)
      setError(`${t.messages.profileCreationError}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = [
    {
      value: "admin",
      label: t.auth.administrator,
      description:
        language === "sr"
          ? "Пун приступ систему - управљање свим аспектима система за упис"
          : "Full system access - manage all aspects of the enrollment system",
      icon: Shield,
    },
    {
      value: "service",
      label: t.auth.serviceStaff,
      description:
        language === "sr"
          ? "Регистрација студената, управљање пријавама и генерисање извештаја"
          : "Register students, manage applications, and generate reports",
      icon: Users,
    },
    {
      value: "student",
      label: t.auth.student,
      description:
        language === "sr"
          ? "Преглед личних информација и статуса пријаве"
          : "View personal information and application status",
      icon: User,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{t.auth.createProfile}</h3>
        <p className="text-sm text-gray-600">
          {language === "sr"
            ? "Подесите ваш налог за приступ систему за упис"
            : "Set up your account to access the enrollment system"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">{t.auth.firstName}</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">{t.auth.lastName}</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">{t.auth.accountType}</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder={language === "sr" ? "Изаберите вашу улогу" : "Select your role"} />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4" />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {formData.role && (
            <p className="text-sm text-gray-600">
              {roleOptions.find((opt) => opt.value === formData.role)?.description}
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t.auth.createProfile}
        </Button>
      </form>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t.auth.quickSetupOptions}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData({
                    first_name: language === "sr" ? "Систем" : "System",
                    last_name: language === "sr" ? "Администратор" : "Administrator",
                    role: "admin",
                  })
                }
              >
                <Shield className="h-4 w-4 mr-2" />
                {t.auth.setAsAdmin}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData({
                    first_name: language === "sr" ? "Службеник" : "Service",
                    last_name: language === "sr" ? "Особље" : "Staff",
                    role: "service",
                  })
                }
              >
                <Users className="h-4 w-4 mr-2" />
                {t.auth.setAsService}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFormData({
                    first_name: language === "sr" ? "Марко" : "John",
                    last_name: language === "sr" ? "Петровић" : "Doe",
                    role: "student",
                  })
                }
              >
                <User className="h-4 w-4 mr-2" />
                {t.auth.setAsStudent}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
