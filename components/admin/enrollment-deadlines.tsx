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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Language, useTranslation } from "@/lib/i18n"

interface EnrollmentDeadline {
  id: string
  name: string
  deadline_date: string
  school_year: string
  committee_head_first_name: string
  committee_head_last_name: string
}

interface EnrollmentDeadlinesProps {
  language: Language
}

export function EnrollmentDeadlines({language}: EnrollmentDeadlinesProps) {
  const { t } = useTranslation(language)
  const [deadlines, setDeadlines] = useState<EnrollmentDeadline[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDeadline, setEditingDeadline] = useState<EnrollmentDeadline | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    deadline_date: "",
    school_year: "",
    committee_head_first_name: "",
    committee_head_last_name: "",
  })
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchDeadlines()
  }, [])

  const fetchDeadlines = async () => {
    try {
      const { data, error } = await supabase
        .from("enrollment_deadlines")
        .select("*")
        .order("deadline_date", { ascending: false })

      if (error) throw error
      setDeadlines(data || [])
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
      if (editingDeadline) {
        const { error } = await supabase.from("enrollment_deadlines").update(formData).eq("id", editingDeadline.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("enrollment_deadlines").insert([formData])
        if (error) throw error
      }

      setDialogOpen(false)
      setEditingDeadline(null)
      setFormData({
        name: "",
        deadline_date: "",
        school_year: "",
        committee_head_first_name: "",
        committee_head_last_name: "",
      })
      fetchDeadlines()
    } catch (error) {
      setError(t.messages.failedToSave)
    }
  }

  const handleEdit = (deadline: EnrollmentDeadline) => {
    setEditingDeadline(deadline)
    setFormData({
      name: deadline.name,
      deadline_date: deadline.deadline_date,
      school_year: deadline.school_year,
      committee_head_first_name: deadline.committee_head_first_name,
      committee_head_last_name: deadline.committee_head_last_name,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm(t.deadlines.deleteConfirm)) {
      try {
        const { error } = await supabase.from("enrollment_deadlines").delete().eq("id", id)
        if (error) throw error
        fetchDeadlines()
      } catch (error) {
        setError(t.messages.failedToDelete)
      }
    }
  }

  const resetForm = () => {
    setEditingDeadline(null)
    setFormData({
      name: "",
      deadline_date: "",
      school_year: "",
      committee_head_first_name: "",
      committee_head_last_name: "",
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
          <h2 className="text-2xl font-bold">{t.deadlines.title}</h2>
          <p className="text-gray-600">{t.deadlines.subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              {t.deadlines.addDeadline}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDeadline ? t.deadlines.editDeadline : t.deadlines.addDeadline}</DialogTitle>
              <DialogDescription>
                {editingDeadline ? t.deadlines.editDeadline : t.deadlines.addDeadline}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.deadlines.deadlineName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline_date">{t.deadlines.deadlineDate}</Label>
                <Input
                  id="deadline_date"
                  type="date"
                  value={formData.deadline_date}
                  onChange={(e) => setFormData({ ...formData, deadline_date: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_year">{t.programs.enrollmentSchoolYear}</Label>
                <Input
                  id="school_year"
                  value={formData.school_year}
                  onChange={(e) => setFormData({ ...formData, school_year: e.target.value })}
                  placeholder="2024/2025"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="committee_head_first_name">{t.deadlines.committeeHeadFirstName}</Label>
                  <Input
                    id="committee_head_first_name"
                    value={formData.committee_head_first_name}
                    onChange={(e) => setFormData({ ...formData, committee_head_first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="committee_head_last_name">{t.deadlines.committeeHeadLastName}</Label>
                  <Input
                    id="committee_head_last_name"
                    value={formData.committee_head_last_name}
                    onChange={(e) => setFormData({ ...formData, committee_head_last_name: e.target.value })}
                    required
                  />
                </div>
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
                <Button type="submit">{editingDeadline ? t.common.update : t.common.create}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.deadlines.deadlinesList}</CardTitle>
          <CardDescription>{t.deadlines.allDeadlines}</CardDescription>
        </CardHeader>
        <CardContent>
          {deadlines.length === 0 ? (
            <p className="text-center py-8 text-gray-500">{t.deadlines.noDeadlines}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.name}</TableHead>
                  <TableHead>{t.common.date}</TableHead>
                  <TableHead>{t.programs.schoolYear}</TableHead>
                  <TableHead>{t.deadlines.committeeHead}</TableHead>
                  <TableHead>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deadlines.map((deadline) => (
                  <TableRow key={deadline.id}>
                    <TableCell className="font-medium">{deadline.name}</TableCell>
                    <TableCell>{new Date(deadline.deadline_date).toLocaleDateString()}</TableCell>
                    <TableCell>{deadline.school_year}</TableCell>
                    <TableCell>
                      {deadline.committee_head_first_name} {deadline.committee_head_last_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(deadline)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(deadline.id)}>
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
