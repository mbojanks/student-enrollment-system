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
import { Plus, Edit, Trash2, Settings } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"

interface RankingMode {
  id: string
  name: string
  description: string
  max_total_points: number
  created_at: string
}

interface RankingCriteria {
  id: string
  name: string
  description: string
  min_value: number
  max_value: number
}

interface RankingModeCriteria {
  ranking_criteria_id: string
  multiplication_factor: number
  ranking_criteria: RankingCriteria
}

interface RankingModesProps {
  language: Language
}

export function RankingModes({ language }: RankingModesProps) {
  const { t } = useTranslation(language)
  const [rankingModes, setRankingModes] = useState<RankingMode[]>([])
  const [rankingCriteria, setRankingCriteria] = useState<RankingCriteria[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [criteriaDialogOpen, setCriteriaDialogOpen] = useState(false)
  const [editingMode, setEditingMode] = useState<RankingMode | null>(null)
  const [selectedModeForCriteria, setSelectedModeForCriteria] = useState<string | null>(null)
  const [modeCriteria, setModeCriteria] = useState<RankingModeCriteria[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    max_total_points: 100,
  })
  const [criteriaFormData, setCriteriaFormData] = useState<{ [key: string]: number }>({})
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [modesResult, criteriaResult] = await Promise.all([
        supabase.from("ranking_modes").select("*").order("created_at", { ascending: false }),
        supabase.from("ranking_criteria").select("*").order("name"),
      ])

      if (modesResult.error) throw modesResult.error
      if (criteriaResult.error) throw criteriaResult.error

      setRankingModes(modesResult.data || [])
      setRankingCriteria(criteriaResult.data || [])
    } catch (error) {
      setError(t.messages.failedToFetch)
    } finally {
      setLoading(false)
    }
  }

  const fetchModeCriteria = async (modeId: string) => {
    try {
      const { data, error } = await supabase
        .from("ranking_mode_criteria")
        .select(`
          ranking_criteria_id,
          multiplication_factor,
          ranking_criteria (*)
        `)
        .eq("ranking_mode_id", modeId)

      if (error) throw error
      setModeCriteria(data || [])

      // Initialize form data for criteria
      const initialFormData: { [key: string]: number } = {}
      data?.forEach((item) => {
        initialFormData[item.ranking_criteria_id] = item.multiplication_factor
      })
      setCriteriaFormData(initialFormData)
    } catch (error) {
      setError(t.messages.failedToFetch)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (editingMode) {
        const { error } = await supabase.from("ranking_modes").update(formData).eq("id", editingMode.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("ranking_modes").insert([formData])

        if (error) throw error
      }

      setDialogOpen(false)
      setEditingMode(null)
      setFormData({ name: "", description: "", max_total_points: 100 })
      fetchData()
    } catch (error) {
      setError(t.messages.failedToSave)
    }
  }

  const handleCriteriaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!selectedModeForCriteria) return

    try {
      // Delete existing criteria for this mode
      await supabase.from("ranking_mode_criteria").delete().eq("ranking_mode_id", selectedModeForCriteria)

      // Insert new criteria
      const criteriaToInsert = Object.entries(criteriaFormData)
        .filter(([_, factor]) => factor > 0)
        .map(([criteriaId, factor]) => ({
          ranking_mode_id: selectedModeForCriteria,
          ranking_criteria_id: criteriaId,
          multiplication_factor: factor,
        }))

      if (criteriaToInsert.length > 0) {
        const { error } = await supabase.from("ranking_mode_criteria").insert(criteriaToInsert)

        if (error) throw error
      }

      setCriteriaDialogOpen(false)
      setSelectedModeForCriteria(null)
      setCriteriaFormData({})
    } catch (error) {
      setError(t.messages.failedToSave)
    }
  }

  const handleEdit = (mode: RankingMode) => {
    setEditingMode(mode)
    setFormData({
      name: mode.name,
      description: mode.description,
      max_total_points: mode.max_total_points,
    })
    setDialogOpen(true)
  }

  const handleEditCriteria = async (modeId: string) => {
    setSelectedModeForCriteria(modeId)
    await fetchModeCriteria(modeId)
    setCriteriaDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.rankingModes.deleteConfirm)) return

    try {
      const { error } = await supabase.from("ranking_modes").delete().eq("id", id)

      if (error) throw error
      fetchData()
    } catch (error) {
      setError(t.messages.failedToDelete)
    }
  }

  const resetForm = () => {
    setEditingMode(null)
    setFormData({ name: "", description: "", max_total_points: 100 })
    setError("")
  }

  if (loading) {
    return <div className="flex justify-center py-8">{t.common.loading}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t.rankingModes.title}</h2>
          <p className="text-gray-600">{t.rankingModes.subtitle}</p>
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
              {t.rankingModes.addMode}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMode ? t.rankingModes.editMode : t.rankingModes.addMode}</DialogTitle>
              <DialogDescription>{t.rankingModes.subtitle}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.rankingModes.modeName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t.common.description}</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_total_points">{t.rankingModes.maxTotalPoints}</Label>
                <Input
                  id="max_total_points"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.max_total_points}
                  onChange={(e) => setFormData({ ...formData, max_total_points: Number.parseFloat(e.target.value) })}
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
                <Button type="submit">{editingMode ? t.common.update : t.common.create}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Criteria Assignment Dialog */}
      <Dialog open={criteriaDialogOpen} onOpenChange={setCriteriaDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t.rankingModes.configureCriteria}</DialogTitle>
            <DialogDescription>{t.rankingModes.configureCriteriaDesc}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCriteriaSubmit} className="space-y-4">
            <div className="max-h-96 overflow-y-auto space-y-4">
              {rankingCriteria.map((criteria) => (
                <div key={criteria.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{criteria.name}</h4>
                    <p className="text-sm text-gray-600">{criteria.description}</p>
                    <p className="text-xs text-gray-500">
                      {t.criteria.valueRange}: {criteria.min_value} - {criteria.max_value}
                    </p>
                  </div>
                  <div className="w-32">
                    <Label htmlFor={`factor-${criteria.id}`}>{t.rankingModes.factor}</Label>
                    <Input
                      id={`factor-${criteria.id}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={criteriaFormData[criteria.id] || 0}
                      onChange={(e) =>
                        setCriteriaFormData({
                          ...criteriaFormData,
                          [criteria.id]: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setCriteriaDialogOpen(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit">{t.common.save}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t.rankingModes.modesList}</CardTitle>
          <CardDescription>{t.rankingModes.allModes}</CardDescription>
        </CardHeader>
        <CardContent>
          {rankingModes.length === 0 ? (
            <p className="text-center py-8 text-gray-500">{t.rankingModes.noModes}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.name}</TableHead>
                  <TableHead>{t.common.description}</TableHead>
                  <TableHead>{t.rankingModes.maxPoints}</TableHead>
                  <TableHead>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingModes.map((mode) => (
                  <TableRow key={mode.id}>
                    <TableCell className="font-medium">{mode.name}</TableCell>
                    <TableCell>{mode.description}</TableCell>
                    <TableCell>{mode.max_total_points}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditCriteria(mode.id)}>
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(mode)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(mode.id)}>
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
