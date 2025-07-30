"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Calculator, Trash2, ClipboardEdit } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CriteriaScoreDialog } from "./criteria-score-dialog"
import { Language, useTranslation } from "@/lib/i18n"

interface ApplicationManagementProps {
  language?: Language
}

interface Application {
  id: string
  status: string
  total_points: number
  rank_position: number
  financing_type: string
  student_candidate_id: string
  study_program_id: string
  enrollment_deadline_id: string
  ranking_mode_id: string
  student_candidates: {
    first_name: string
    last_name: string
    email: string
  }
  study_programs: {
    name: string
    education_level: string
  }
  enrollment_deadlines: {
    name: string
    school_year: string
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
}

interface StudyProgram {
  id: string
  name: string
  education_level: string
}

interface EnrollmentDeadline {
  id: string
  name: string
  school_year: string
}

interface RankingMode {
  id: string
  name: string
}

interface RankingModeCriteria {
  ranking_criteria_id: string
  multiplication_factor: number
}

export function ApplicationManagement({ language }: ApplicationManagementProps) {
  const { t } = useTranslation(language)
  const [applications, setApplications] = useState<Application[]>([])
  const [students, setStudents] = useState<StudentCandidate[]>([])
  const [programs, setPrograms] = useState<StudyProgram[]>([])
  const [deadlines, setDeadlines] = useState<EnrollmentDeadline[]>([])
  const [rankingModes, setRankingModes] = useState<RankingMode[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    student_candidate_id: "",
    study_program_id: "",
    enrollment_deadline_id: "",
    ranking_mode_id: "",
  })
  const [error, setError] = useState("")
  const supabase = createClient()
  const [criteriaDialogOpen, setCriteriaDialogOpen] = useState(false)
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null)
  const [studyProgramFilter, setStudyProgramFilter] = useState("")
  const [enrollmentDeadlineFilter, setEnrollmentDeadlineFilter] = useState("")
  const [editingApplication, setEditingApplication] = useState<Application | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [applicationsResult, studentsResult, programsResult, deadlinesResult, rankingModesResult] =
        await Promise.all([
          supabase
            .from("applications")
            .select(`
            *,
            student_candidates (first_name, last_name, email),
            study_programs (name, education_level),
            enrollment_deadlines (name, school_year),
            ranking_modes (name)
          `)
            .order("created_at", { ascending: false }),
          supabase.from("student_candidates").select("id, first_name, last_name, email").order("first_name"),
          supabase.from("study_programs").select("id, name, education_level").order("name"),
          supabase
            .from("enrollment_deadlines")
            .select("id, name, school_year")
            .order("deadline_date", { ascending: false }),
          supabase.from("ranking_modes").select("id, name").order("name"),
        ])

      if (applicationsResult.error) throw applicationsResult.error
      if (studentsResult.error) throw studentsResult.error
      if (programsResult.error) throw programsResult.error
      if (deadlinesResult.error) throw deadlinesResult.error
      if (rankingModesResult.error) throw rankingModesResult.error

      setApplications(applicationsResult.data || [])
      setStudents(studentsResult.data || [])
      setPrograms(programsResult.data || [])
      setDeadlines(deadlinesResult.data || [])
      setRankingModes(rankingModesResult.data || [])
    } catch (error) {
      setError(t.messages.failedToFetch)
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter((app) => {
    const matchesProgram = !studyProgramFilter || studyProgramFilter === 'all' || app.study_programs?.name === studyProgramFilter
    const matchesDeadline = !enrollmentDeadlineFilter || enrollmentDeadlineFilter=== 'all' || app.enrollment_deadlines?.name === enrollmentDeadlineFilter
    return matchesProgram && matchesDeadline
  })

  const handleSubmit = async (e: React.FormEvent) => { // for + New Application
    e.preventDefault()
    setError("")

    try {
      if (editingApplication) {
        const { error } = await supabase.from("applications").update(formData).eq("id", editingApplication.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("applications").insert([formData])
        if (error) throw error
      }
      setDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      setError(t.messages.failedToSave)
    }
  }

  const calculateRanking = async () => {
    try {
      setError("")

      // Get all applications that need ranking calculation
      const { data: applicationsData, error: appsError } = await supabase
        .from("applications")
        .select(`
        id,
        study_program_id,
        ranking_mode_id,
        ranking_modes (id, name, ranking_mode_criteria (ranking_criteria_id, multiplication_factor)),
        enrollment_deadline_id,
        application_criteria_scores (
          ranking_criteria_id,
          score
        )
      `)
        .eq("status", "pending")

      if (appsError) throw appsError

      if (!applicationsData || applicationsData.length === 0) {
        setError(t.applicationManagement.noPendingApplications)
        return
      }

      // Group applications by study program and ranking mode
      const groupedApplications = applicationsData.reduce(
        (acc, app) => {
          // Validate UUIDs before using them
          if (!app.study_program_id || !app.enrollment_deadline_id) {
            console.warn("Skipping application with missing IDs:", app.id)
            return acc
          }

          // Ensure UUIDs are valid format (36 characters with dashes)
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
          if (!uuidRegex.test(app.study_program_id as string) || !uuidRegex.test(app.enrollment_deadline_id as string) || !app.ranking_mode_id) {
            console.warn("Skipping application with invalid UUID format:", app.id)
            return acc
          }

          const key = `${app.study_program_id}|${app.enrollment_deadline_id}`
          if (!acc[key]) acc[key] = []
          acc[key].push(app)
          return acc
        },
        {} as Record<string, typeof applicationsData>,
      )

      // Calculate rankings for each group
      for (const [groupKey, groupApps] of Object.entries(groupedApplications)) {
        const [studyProgramId, enrollmentDeadlineId] = groupKey.split("|")
        try {
          // Calculate total points for each application
          const applicationsWithPoints = groupApps.map((app) => {
            let totalPoints = 0

            // Get ranking mode criteria with multiplication factors
            const rankingModeId = app.ranking_mode_id
            const modeCriteria = app.ranking_modes?.ranking_mode_criteria as RankingModeCriteria[] || []
            /*const { data: modeCriteria, error: criteriaError } = await supabase
              .from("ranking_mode_criteria")
              .select(`
              ranking_criteria_id,
              multiplication_factor,
              ranking_criteria (min_value, max_value)
            `)
              .eq("ranking_mode_id", rankingModeId as string)

            if (criteriaError) {
              console.error("Error fetching criteria for mode:", rankingModeId, criteriaError)
              continue
            }

            if (!modeCriteria || modeCriteria.length === 0) {
              console.warn("No criteria configured for ranking mode:", rankingModeId)
              continue
            }*/

            // Calculate weighted score for each criteria
            modeCriteria.forEach((modeCriterion) => {
              const score =
                app.application_criteria_scores?.find(
                  (s) => s.ranking_criteria_id === modeCriterion.ranking_criteria_id,
                )?.score || 0

              // NOT Normalize score to 0-1 range based on criteria min/max values
              //const minValue = (modeCriterion.ranking_criteria)?.min_value || 0
              //const maxValue = modeCriterion.ranking_criteria?.max_value || 100

              //if (maxValue > minValue) {
                //const normalizedScore = (score - minValue) / (maxValue - minValue)
                // Apply multiplication factor
                const weightedScore = score * (modeCriterion.multiplication_factor as number)
                totalPoints += weightedScore
              //}
            })

            return {
              ...app,
              total_points: Math.round(totalPoints * 100) / 100, // Round to 2 decimal places
            }
          })

          // Sort by total points (descending) and assign ranks
          applicationsWithPoints.sort((a, b) => b.total_points - a.total_points)

          // Update applications with calculated points and ranks
          for (let i = 0; i < applicationsWithPoints.length; i++) {
            const app = applicationsWithPoints[i]
            try {
              await supabase
                .from("applications")
                .update({
                  total_points: app.total_points,
                  rank_position: i + 1,
                })
                .eq("id", app.id as Object)
            } catch (updateError) {
              console.error("Error updating application:", app.id, updateError)
            }
          }
        } catch (groupError) {
          console.error("Error processing group:", groupKey, groupError)
          continue
        }
      }

      // Refresh the applications list
      await fetchData()
      setError(t.applicationManagement.rankingCalculationSuccess)

      // Clear success message after 3 seconds
      setTimeout(() => setError(""), 3000)
    } catch (error) {
      console.error("Ranking calculation error:", error)
      setError(t.applicationManagement.rankingCalculationError)
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

  const handleAddCriteriaScores = (applicationId: string) => {
    setSelectedApplicationId(applicationId)
    setCriteriaDialogOpen(true)
  }

  const handleEdit = (application: Application) => {
    setEditingApplication(application)
    setFormData({
      student_candidate_id: application.student_candidate_id ?? null, // Keep existing student
      study_program_id: application.study_program_id ?? '', // Will be populated from application data
      enrollment_deadline_id: application.enrollment_deadline_id ?? '', // Will be populated from application data
      ranking_mode_id: application.ranking_mode_id ?? '', // Will be populated from application data
    })
    //console.log("Form data in Application Management:", application)
    setDialogOpen(true)
  }

  const handleDelete = async (applicationId: string) => {
    if (!confirm(t.applicationManagement.confirmDelete)) return

    try {
      const { error } = await supabase.from("applications").delete().eq("id", applicationId)

      if (error) throw error

      fetchData()
    } catch (error) {
      setError(t.messages.failedToDelete)
    }
  }

  const resetForm = () => {
    setEditingApplication(null)
    setFormData({
      student_candidate_id: "",
      study_program_id: "",
      enrollment_deadline_id: "",
      ranking_mode_id: "",
    })
    setError("")
  }

  if (loading) {
    return <div className="flex justify-center py-8">{t.common.loading}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t.applicationManagement.title}</h2>
          <p className="text-gray-600">{t.applicationManagement.subtitle}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={calculateRanking} variant="outline">
            <Calculator className="h-4 w-4 mr-2" />
            {t.applicationManagement.calculateRankings}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                {t.applicationManagement.newApplication}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingApplication ? t.applicationManagement.editApplication : t.applicationManagement.createNewApplication}</DialogTitle>
                <DialogDescription>{editingApplication ? t.applicationManagement.editApplicationDesc : t.applicationManagement.createApplicationDesc}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                  {editingApplication ?
                  (<div className="space-y-2">
                    <Label>{t.nav.students}</Label>
                    <div className="p-2 bg-gray-50 rounded">
                      {editingApplication?.student_candidates?.first_name} {editingApplication?.student_candidates?.last_name}{" "}
                      ({editingApplication?.student_candidates?.email})
                    </div>
                  </div>)
                : (<div className="space-y-2">
                  <Label htmlFor="student">{t.nav.students}</Label>
                  <Select
                    value={formData.student_candidate_id}
                    onValueChange={(value) => setFormData({ ...formData, student_candidate_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.applicationManagement.selectStudent} />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.first_name} {student.last_name} ({student.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>)}

                <div className="space-y-2">
                  <Label htmlFor="program">{t.nav.programs}</Label>
                  <Select
                    value={formData.study_program_id}
                    onValueChange={(value) => setFormData({ ...formData, study_program_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.applicationManagement.selectProgram} />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name} (
                          {program.education_level === "bachelor"
                            ? t.educationLevels.bachelor
                            : t.educationLevels.master}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">{t.nav.deadlines}</Label>
                  <Select
                    value={formData.enrollment_deadline_id}
                    onValueChange={(value) => setFormData({ ...formData, enrollment_deadline_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.applicationManagement.selectDeadline} />
                    </SelectTrigger>
                    <SelectContent>
                      {deadlines.map((deadline) => (
                        <SelectItem key={deadline.id} value={deadline.id}>
                          {deadline.name} ({deadline.school_year})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ranking_mode">{t.nav.rankingModes}</Label>
                  <Select
                    value={formData.ranking_mode_id}
                    onValueChange={(value) => setFormData({ ...formData, ranking_mode_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.applicationManagement.selectRankingMode} />
                    </SelectTrigger>
                    <SelectContent>
                      {rankingModes.map((mode) => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    {t.common.cancel}
                  </Button>
                  <Button type="submit">{ editingApplication ? t.common.update : t.common.create}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.applicationManagement.applicationsList}</CardTitle>
          <CardDescription>{t.applicationManagement.allApplications}</CardDescription>
        </CardHeader>
        <div className="mb-4 flex gap-4">
          <div className="flex-1 pl-6">
            <Label htmlFor="program-filter">{t.applicationManagement.filterByProgram}</Label>
            <Select value={studyProgramFilter} onValueChange={setStudyProgramFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.applicationManagement.allPrograms} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.applicationManagement.allPrograms}</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.name}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 pr-6">
            <Label htmlFor="deadline-filter">{t.applicationManagement.filterByDeadline}</Label>
            <Select value={enrollmentDeadlineFilter} onValueChange={setEnrollmentDeadlineFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.applicationManagement.allDeadlines} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.applicationManagement.allDeadlines}</SelectItem>
                {deadlines.map((deadline) => (
                  <SelectItem key={deadline.id} value={deadline.name}>
                    {deadline.name} ({deadline.school_year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center py-8 text-gray-500">{t.applicationManagement.noApplications}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.nav.students}</TableHead>
                  <TableHead>{t.nav.programs}</TableHead>
                  <TableHead>{t.nav.deadlines}</TableHead>
                  <TableHead>{t.nav.rankingModes}</TableHead>
                  <TableHead>{t.common.status}</TableHead>
                  <TableHead>{t.applicationManagement.points}</TableHead>
                  <TableHead>{t.studentManagement.rank}</TableHead>
                  <TableHead>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {application.student_candidates?.first_name} {application.student_candidates?.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{application.student_candidates?.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{application.study_programs?.name}</div>
                        <div className="text-sm text-gray-500 capitalize">
                          {application.study_programs?.education_level === "bachelor"
                            ? t.educationLevels.bachelor
                            : t.educationLevels.master}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{application.enrollment_deadlines?.name}</div>
                        <div className="text-sm text-gray-500">{application.enrollment_deadlines?.school_year}</div>
                      </div>
                    </TableCell>
                    <TableCell>{application.ranking_modes?.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(application.status)}>
                        {application.status === "pending"
                          ? t.applicationStatus.pending
                          : application.status === "accepted"
                            ? t.applicationStatus.accepted
                            : t.applicationStatus.rejected}
                      </Badge>
                    </TableCell>
                    <TableCell>{application.total_points || "-"}</TableCell>
                    <TableCell>{application.rank_position || "-"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddCriteriaScores(application.id)}
                          title={t.applicationManagement.addEditScores}
                        >
                          <ClipboardEdit className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(application)}
                          title={t.common.edit}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(application.id)}
                          title={t.common.delete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      {selectedApplicationId && (
        <CriteriaScoreDialog
          open={criteriaDialogOpen}
          onOpenChange={setCriteriaDialogOpen}
          applicationId={selectedApplicationId}
          onScoreAdded={fetchData}
        />
      )}
    </div>
  )
}
