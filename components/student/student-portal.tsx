"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, FileText, Trophy, Calendar } from "lucide-react"
import { Language, useTranslation } from "@/lib/i18n"
import { LanguageSelector } from "../language-selector"

interface StudentApplication {
  id: string
  status: string
  total_points: number
  rank_position: number
  financing_type: string
  created_at: string
  study_programs: {
    name: string
    education_level: string
  }
  enrollment_deadlines: {
    name: string
    school_year: string
    deadline_date: string
  }
  ranking_modes: {
    name: string
  }
}

interface StudentCandidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  previous_education_program: string
  previous_education_institution: string
  previous_education_start_year: number
  previous_education_end_year: number
}

interface StudentPortalProps {
  userProfile: {
    user_id: string
    first_name: string
    last_name: string
    email: string
  },
  setLanguageUp: (language: Language) => void
}

export function StudentPortal({ userProfile, setLanguageUp }: StudentPortalProps) {
  const [language, setLanguage] = useState<Language>("sr")
  const { t, formatMessage } = useTranslation(language)
  const [studentData, setStudentData] = useState<StudentCandidate | null>(null)
  const [applications, setApplications] = useState<StudentApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchStudentData()
  }, [userProfile.user_id])

  const fetchStudentData = async () => {
    try {
      const [studentResult, applicationsResult] = await Promise.all([
        supabase
          .from("student_candidates")
          .select("*")
          .eq("user_id", userProfile.user_id)
          .maybeSingle(), // Use maybeSingle() instead of single()
        supabase
          .from("applications")
          .select(`
          *,
          study_programs (name, education_level),
          enrollment_deadlines (name, school_year, deadline_date),
          ranking_modes (name)
        `)
          .eq("student_candidate_id", userProfile.user_id)
          .order("created_at", { ascending: false }),
      ])

      if (studentResult.error) {
        console.error("Error fetching student data:", studentResult.error)
      }
      if (applicationsResult.error) {
        console.error("Error fetching applications:", applicationsResult.error)
      }

      setStudentData(studentResult.data) // Will be null if no student record exists
      setApplications(applicationsResult.data || [])
    } catch (error) {
      console.error("Unexpected error:", error)
      setError(t.messages.failedToFetch)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const isEnrollmentActive = (deadlineDate: string) => {
    return new Date(deadlineDate) > new Date()
  }

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    setLanguageUp(newLanguage)
  }

  if (loading) {
    return <div className="flex justify-center py-8">{t.messages.loadingInfo}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t.roles.student.title}</h1>
        <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />
      </div>
      <div>
        <h2 className="text-2xl font-bold">
          {formatMessage(t.studentPortal.welcomeMessage, { name: userProfile.first_name })}
        </h2>
        <p className="text-gray-600">{t.studentPortal.subtitle}</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t.studentPortal.personalInformation}
          </CardTitle>
          <CardDescription>{t.studentPortal.personalInfoDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          {studentData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500">{t.studentPortal.fullName}</h4>
                <p>
                  {studentData.first_name} {studentData.last_name}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">{t.common.email}</h4>
                <p>{studentData.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">{t.common.phone}</h4>
                <p>{studentData.phone}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">{t.studentRegistration.dateOfBirth}</h4>
                <p>{new Date(studentData.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">{t.studentManagement.previousEducation}</h4>
                <p>{studentData.previous_education_program}</p>
                <p className="text-sm text-gray-600">{studentData.previous_education_institution}</p>
                <p className="text-sm text-gray-600">
                  {studentData.previous_education_start_year} - {studentData.previous_education_end_year}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">{t.studentPortal.noPersonalInfo}</p>
          )}
        </CardContent>
      </Card>

      {/* Applications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t.nav.myApplications}
          </CardTitle>
          <CardDescription>{t.studentPortal.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center py-8 text-gray-500">{t.applicationManagement.noApplications}</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{application.study_programs?.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {application.study_programs?.education_level === "bachelor"
                          ? t.educationLevels.bachelor
                          : t.educationLevels.master}{" "}
                        {t.studentPortal.studies}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status === "pending"
                        ? t.applicationStatus.pending
                        : application.status === "accepted"
                          ? t.applicationStatus.accepted
                          : t.applicationStatus.rejected}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-gray-500">{t.studentPortal.enrollmentPeriod}</h4>
                      <p>{application.enrollment_deadlines?.name}</p>
                      <p className="text-gray-600">{application.enrollment_deadlines?.school_year}</p>
                      {isEnrollmentActive(application.enrollment_deadlines?.deadline_date || "") && (
                        <Badge variant="outline" className="mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {t.studentPortal.active}
                        </Badge>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-500">{t.studentPortal.rankingMode}</h4>
                      <p>{application.ranking_modes?.name}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-500">{t.studentPortal.applicationDate}</h4>
                      <p>{new Date(application.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {application.total_points > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-900">{t.studentPortal.rankingInformation}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">{t.studentPortal.totalPoints}</span>
                          <span className="ml-2">{application.total_points}</span>
                        </div>
                        {application.rank_position && (
                          <div>
                            <span className="text-blue-700 font-medium">{t.studentPortal.rankPosition}</span>
                            <span className="ml-2">#{application.rank_position}</span>
                          </div>
                        )}
                        {application.financing_type && (
                          <div>
                            <span className="text-blue-700 font-medium">{t.studentPortal.financing}</span>
                            <span className="ml-2 capitalize">
                              {application.financing_type === "budget"
                                ? t.applicationStatus.budget
                                : t.applicationStatus.selfFinancing}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Notice */}
      <Card>
        <CardHeader>
          <CardTitle>{t.studentPortal.importantInformation}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            {t.studentPortal.importantInfoList.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
