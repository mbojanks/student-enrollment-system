"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Language, useTranslation } from "@/lib/i18n"

interface StudentCandidateFormProps {
  language: Language
}

export function StudentCandidateForm({ language }: StudentCandidateFormProps) {
  const { t } = useTranslation(language)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    social_security_number: "",
    father_first_name: "",
    father_last_name: "",
    mother_first_name: "",
    mother_last_name: "",
    phone: "",
    email: "",
    previous_education_program: "",
    previous_education_institution: "",
    previous_education_start_year: "",
    previous_education_end_year: "",
  })
  const supabase = createClient()

  const generateCredentials = () => {
    const username = `${formData.first_name.toLowerCase()}.${formData.last_name.toLowerCase()}${Math.floor(Math.random() * 1000)}`
    const password = Math.random().toString(36).slice(-8)
    return { username, password }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const { username, password } = generateCredentials()

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("user_profiles").insert([
          {
            user_id: authData.user.id,
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            role: "student",
          },
        ])

        if (profileError) throw profileError

        // Create student candidate record
        const { error: candidateError } = await supabase.from("student_candidates").insert([
          {
            user_id: authData.user.id,
            ...formData,
            previous_education_start_year: Number.parseInt(formData.previous_education_start_year),
            previous_education_end_year: Number.parseInt(formData.previous_education_end_year),
          },
        ])

        if (candidateError) throw candidateError

        setSuccess(
          `${t.studentRegistration.registrationSuccess} ${t.auth.email}: ${formData.email}, ${t.auth.password}: ${password}`,
        )
        setFormData({
          first_name: "",
          last_name: "",
          date_of_birth: "",
          social_security_number: "",
          father_first_name: "",
          father_last_name: "",
          mother_first_name: "",
          mother_last_name: "",
          phone: "",
          email: "",
          previous_education_program: "",
          previous_education_institution: "",
          previous_education_start_year: "",
          previous_education_end_year: "",
        })
      }
    } catch (error: any) {
      setError(error.message || t.messages.failedToSave)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.studentRegistration.title}</h2>
        <p className="text-gray-600">{t.studentRegistration.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.studentRegistration.studentInfo}</CardTitle>
          <CardDescription>{t.studentRegistration.studentInfoDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">{t.studentRegistration.dateOfBirth}</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_security_number">{t.studentRegistration.socialSecurityNumber}</Label>
                <Input
                  id="social_security_number"
                  value={formData.social_security_number}
                  onChange={(e) => setFormData({ ...formData, social_security_number: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="father_first_name">{t.studentRegistration.fatherFirstName}</Label>
                <Input
                  id="father_first_name"
                  value={formData.father_first_name}
                  onChange={(e) => setFormData({ ...formData, father_first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_last_name">{t.studentRegistration.fatherLastName}</Label>
                <Input
                  id="father_last_name"
                  value={formData.father_last_name}
                  onChange={(e) => setFormData({ ...formData, father_last_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mother_first_name">{t.studentRegistration.motherFirstName}</Label>
                <Input
                  id="mother_first_name"
                  value={formData.mother_first_name}
                  onChange={(e) => setFormData({ ...formData, mother_first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_last_name">{t.studentRegistration.motherLastName}</Label>
                <Input
                  id="mother_last_name"
                  value={formData.mother_last_name}
                  onChange={(e) => setFormData({ ...formData, mother_last_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t.studentRegistration.phoneNumber}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t.studentRegistration.emailAddress}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t.studentRegistration.previousEducationTitle}</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previous_education_program">{t.studentRegistration.programMajor}</Label>
                  <Input
                    id="previous_education_program"
                    value={formData.previous_education_program}
                    onChange={(e) => setFormData({ ...formData, previous_education_program: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previous_education_institution">{t.programs.institution}</Label>
                  <Input
                    id="previous_education_institution"
                    value={formData.previous_education_institution}
                    onChange={(e) => setFormData({ ...formData, previous_education_institution: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="previous_education_start_year">{t.studentRegistration.startYear}</Label>
                  <Input
                    id="previous_education_start_year"
                    type="number"
                    min="1900"
                    max="2030"
                    value={formData.previous_education_start_year}
                    onChange={(e) => setFormData({ ...formData, previous_education_start_year: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="previous_education_end_year">{t.studentRegistration.endYear}</Label>
                  <Input
                    id="previous_education_end_year"
                    type="number"
                    min="1900"
                    max="2030"
                    value={formData.previous_education_end_year}
                    onChange={(e) => setFormData({ ...formData, previous_education_end_year: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

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

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.studentRegistration.registerStudent}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
