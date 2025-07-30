"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"
import { useTranslation, type Language } from "@/lib/i18n"

interface RankingCriteria {
  id: string
  name: string
  description: string
  min_value: number
  max_value: number
  created_at: string
}

interface RankingCriteriaProps {
  language: Language
}

export function RankingCriteria({ language }: RankingCriteriaProps) {
  const { t } = useTranslation(language)
  const [criteria, setCriteria] = useState<RankingCriteria[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCriteria, setEditingCriteria] = useState<RankingCriteria | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    min_value: 0,
    max_value: 100,
  })
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchCriteria()
  }, [])

  const fetchCriteria = async () => {
    try {
      const { data, error } = await supabase
        .from("ranking_criteria")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setCriteria(data || [])
    } catch (error) {
      setError(`${t.messages.failedToFetch} ${t.nav.criteria.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.min_value >= formData.max_value) {
      setError(t.criteria.minMaxError)
      return
    }

    try {
      if (editingCriteria) {
        const { error } = await supabase.from("ranking_criteria").update(formData).eq("id", editingCriteria.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("ranking_criteria").insert([formData])

        if (error) throw error
      }

      setDialogOpen(false)
      setEditingCriteria(null)
      setFormData({ name: "", description: "", min_value: 0, max_value: 100 })
      fetchCriteria()
    } catch (error) {
      setError(`${t.messages.failedToSave} ${t.nav.criteria.toLowerCase()}`)
    }
  }

  const handleEdit = (criteria: RankingCriteria) => {
    setEditingCriteria(criteria)
    setFormData({
      name: criteria.name,
      description: criteria.description,
      min_value: criteria.min_value,
      max_value: criteria.max_value,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.criteria.deleteConfirm)) return

    try {
      const { error } = await supabase.from("ranking_criteria").delete().eq("id", id)

      if (error) throw error
      fetchCriteria()
    } catch (error) {
      setError(`${t.messages.failedToDelete} ${t.nav.criteria.toLowerCase()}`)
    }
  }

  const resetForm = () => {
    setEditingCriteria(null)
    setFormData({ name: "", description: "", min_value: 0, max_value: 100 })
    setError("")
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        {t.common.loading} {t.nav.criteria.toLowerCase()}...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t.criteria.title}</h2>
          <p className="text-gray-600">{t.criteria.subtitle}</p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t.criteria.addCriteria}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCriteria ? t.criteria.editCriteria : t.criteria.addCriteria}</DialogTitle>
              <DialogDescription>{t.criteria.subtitle}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.criteria.criteriaName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.criteria.namePlaceholder}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.common.description}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.criteria.descriptionPlaceholder}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_value">{t.criteria.minValue}</Label>
                  <Input
                    id="min_value"
                    type="number"
                    step="0.01"
                    value={formData.min_value}
                    onChange={(e) => setFormData({ ...formData, min_value: Number.parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_value">{t.criteria.maxValue}</Label>
                  <Input
                    id="max_value"
                    type="number"
                    step="0.01"
                    value={formData.max_value}
                    onChange={(e) => setFormData({ ...formData, max_value: Number.parseFloat(e.target.value) || 100 })}
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
                <Button type="submit">{editingCriteria ? t.common.update : t.common.create}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.criteria.criteriaList}</CardTitle>
          <CardDescription>{t.criteria.allCriteria}</CardDescription>
        </CardHeader>
        <CardContent>
          {criteria.length === 0 ? (
            <p className="text-center py-8 text-gray-500">{t.criteria.noCriteria}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.name}</TableHead>
                  <TableHead>{t.common.description}</TableHead>
                  <TableHead>{t.criteria.valueRange}</TableHead>
                  <TableHead>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {criteria.map((criterion) => (
                  <TableRow key={criterion.id}>
                    <TableCell className="font-medium">{criterion.name}</TableCell>
                    <TableCell>{criterion.description}</TableCell>
                    <TableCell>
                      {criterion.min_value} - {criterion.max_value}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(criterion)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(criterion.id)}>
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
