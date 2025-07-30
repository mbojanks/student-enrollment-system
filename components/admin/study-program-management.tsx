"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Language, useTranslation } from "@/lib/i18n"

interface StudyProgram {
  id: string
  name: string
  education_level: string
  institution_id: string
  accreditation_valid_until: string
  enrollment_school_year: string
  institutions?: {
    name: string
  }
}

interface Institution {
  id: string
  name: string
}

interface StudyProgramManagementProps {
  language: Language
}

export function StudyProgramManagement({ language }:StudyProgramManagementProps) {
  const { t } = useTranslation(language)
  const [programs, setPrograms] = useState<StudyProgram[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<StudyProgram | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    education_level: "",
    institution_id: "",
    accreditation_valid_until: "",
    enrollment_school_year: "",
  })
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [programsResult, institutionsResult] = await Promise.all([
        supabase
          .from("study_programs")
          .select(`
            *,
            institutions (name)
          `)
          .order("name"),
        supabase.from("institutions").select("id, name").order("name"),
      ])

      if (programsResult.error) throw programsResult.error
      if (institutionsResult.error) throw institutionsResult.error

      setPrograms(programsResult.data || [])
      setInstitutions(institutionsResult.data || [])
    } catch (error) {
      setError(t.messages.failedToFetch)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (editingProgram) {
        const { error } = await supabase.from("study_programs").update(formData).eq("id", editingProgram.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("study_programs").insert([formData])
        if (error) throw error
      }

      setDialogOpen(false)
      setEditingProgram(null)
      setFormData({
        name: "",
        education_level: "",
        institution_id: "",
        accreditation_valid_until: "",
        enrollment_school_year: "",
      })
      fetchData()
    } catch (error) {
      setError(t.messages.failedToSave)
    }
  }

  const handleEdit = (program: StudyProgram) => {
    setEditingProgram(program)
    setFormData({
      name: program.name,
      education_level: program.education_level,
      institution_id: program.institution_id,
      accreditation_valid_until: program.accreditation_valid_until,
      enrollment_school_year: program.enrollment_school_year,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm(t.programs.deleteConfirm)) {
      try {
        const { error } = await supabase.from("study_programs").delete().eq("id", id)
        if (error) throw error
        fetchData()
      } catch (error) {
        setError(t.messages.failedToDelete)
      }
    }
  }

  const resetForm = () => {
    setEditingProgram(null)
    setFormData({
      name: "",
      education_level: "",
      institution_id: "",
      accreditation_valid_until: "",
      enrollment_school_year: "",
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
          <h2 className="text-2xl font-bold">{t.programs.title}</h2>
          <p className="text-gray-600">{t.programs.subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              {t.programs.addProgram}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProgram ? t.programs.editProgram : t.programs.addProgram}</DialogTitle>
              <DialogDescription>{editingProgram ? t.programs.editProgram : t.programs.addProgram}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.programs.programName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education_level">{t.programs.educationLevel}</Label>
                <Select
                  value={formData.education_level}
                  onValueChange={(value) => setFormData({ ...formData, education_level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.programs.educationLevel} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelor">{t.programs.bachelor}</SelectItem>
                    <SelectItem value="master">{t.programs.master}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">{t.programs.institution}</Label>
                <Select
                  value={formData.institution_id}
                  onValueChange={(value) => setFormData({ ...formData, institution_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t.programs.institution} />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((institution) => (
                      <SelectItem key={institution.id} value={institution.id}>
                        {institution.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accreditation_valid_until">{t.programs.accreditationValidUntil}</Label>
                <Input
                  id="accreditation_valid_until"
                  type="date"
                  value={formData.accreditation_valid_until}
                  onChange={(e) => setFormData({ ...formData, accreditation_valid_until: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="enrollment_school_year">{t.programs.enrollmentSchoolYear}</Label>
                <Input
                  id="enrollment_school_year"
                  value={formData.enrollment_school_year}
                  onChange={(e) => setFormData({ ...formData, enrollment_school_year: e.target.value })}
                  placeholder="2024/2025"
                  required
                />
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
                <Button type="submit">{editingProgram ? t.common.update : t.common.create}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.programs.programsList}</CardTitle>
          <CardDescription>{t.programs.allPrograms}</CardDescription>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <p className="text-center py-8 text-gray-500">{t.programs.noPrograms}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.name}</TableHead>
                  <TableHead>{t.programs.level}</TableHead>
                  <TableHead>{t.programs.institution}</TableHead>
                  <TableHead>{t.programs.accreditationUntil}</TableHead>
                  <TableHead>{t.programs.schoolYear}</TableHead>
                  <TableHead>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {programs.map((program) => (
                  <TableRow key={program.id}>
                    <TableCell className="font-medium">{program.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {program.education_level === "bachelor" ? t.educationLevels.bachelor : t.educationLevels.master}
                      </Badge>
                    </TableCell>
                    <TableCell>{program.institutions?.name || t.programs.unknownInstitution}</TableCell>
                    <TableCell>{new Date(program.accreditation_valid_until).toLocaleDateString()}</TableCell>
                    <TableCell>{program.enrollment_school_year}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(program.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
