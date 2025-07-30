"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { Language, useTranslation } from "@/lib/i18n"

interface StudentCandidate {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  social_security_number: string
  previous_education_program: string
  previous_education_institution: string
  applications: Array<{
    id: string
    status: string
    rank_position: number
    study_programs: {
      name: string
    },
    enrollment_deadlines: {
      name: string
    } 
  }>
}

interface StudentManagementProps {
  language: Language
}

export function StudentManagement({language}: StudentManagementProps) {
  const { t } = useTranslation(language)
  const [students, setStudents] = useState<StudentCandidate[]>([])
  const [filteredStudents, setFilteredStudents] = useState<StudentCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(
        (student) =>
          student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.social_security_number.includes(searchTerm),
      )
      setFilteredStudents(filtered)
    } else {
      setFilteredStudents(students)
    }
  }, [searchTerm, students])

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("student_candidates")
        .select(`
          *,
          applications (
            id,
            status,
            rank_position,
            study_programs (name),
            enrollment_deadlines(name)
          )
        `)
        .order("first_name")

      if (error) throw error
      setStudents(data || [])
      setFilteredStudents(data || [])
    } catch (error) {
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

  if (loading) {
    return <div className="flex justify-center py-8">{t.common.loading}</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.studentManagement.title}</h2>
        <p className="text-gray-600">{t.studentManagement.subtitle}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t.studentManagement.searchStudents}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="text-sm text-gray-600">
        {t.common.view} {filteredStudents.length} {t.studentManagement.studentsCount}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.studentManagement.studentCandidates}</CardTitle>
          <CardDescription>{t.studentManagement.allStudents}</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              {searchTerm ? t.studentManagement.noStudentsSearch : t.studentManagement.noStudents}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-gray-600">{student.email}</p>
                      <p className="text-sm text-gray-500">{student.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">{t.studentManagement.ssn}</h4>
                      <p>{student.social_security_number}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">{t.studentManagement.previousEducation}</h4>
                      <p>{student.previous_education_program}</p>
                      <p className="text-sm text-gray-600">{student.previous_education_institution}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-2">{t.nav.applications}</h4>
                    {student.applications.length === 0 ? (
                      <p className="text-sm text-gray-500">{t.studentManagement.noApplications}</p>
                    ) : (
                      <div className="space-y-2">
                        {student.applications.map((application) => (
                          <div
                            key={application.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <div>
                              <span className="font-medium">{application.study_programs?.name}</span>
                              {application.rank_position && (
                                <span className="ml-2 text-sm text-gray-600">
                                  {t.studentManagement.rank} #{application.rank_position} {application.enrollment_deadlines?.name ? `(${application.enrollment_deadlines.name})` : ""} 
                                </span>
                              )}
                            </div>
                            <Badge variant={getStatusBadgeVariant(application.status)}>
                              {application.status === "pending"
                                ? t.applicationStatus.pending
                                : application.status === "accepted"
                                  ? t.applicationStatus.accepted
                                  : t.applicationStatus.rejected}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}