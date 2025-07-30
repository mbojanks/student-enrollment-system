"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase"
import { useTranslation } from "@/lib/i18n"

interface CriteriaScoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string
  onScoreAdded: () => void
}

interface RankingCriteria {
  id: string
  name: string
  min_value: number
  max_value: number
}

interface ExistingScore {
  ranking_criteria_id: string
  score: number
}

export function CriteriaScoreDialog({ open, onOpenChange, applicationId, onScoreAdded }: CriteriaScoreDialogProps) {
  const { t } = useTranslation()
  const [criteria, setCriteria] = useState<RankingCriteria[]>([])
  const [existingScores, setExistingScores] = useState<ExistingScore[]>([])
  const [scores, setScores] = useState<{ [key: string]: number }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    if (open && applicationId) {
      fetchData()
    }
  }, [open, applicationId])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch all ranking criteria
      const { data: criteriaData, error: criteriaError } = await supabase
        .from("ranking_criteria")
        .select("id, name, min_value, max_value")
        .order("name")

      if (criteriaError) throw criteriaError

      // Fetch existing scores for this application
      const { data: scoresData, error: scoresError } = await supabase
        .from("application_criteria_scores")
        .select("ranking_criteria_id, score")
        .eq("application_id", applicationId)

      if (scoresError) throw scoresError

      setCriteria(criteriaData || [])
      setExistingScores(scoresData || [])

      // Initialize scores state with existing scores
      const initialScores: { [key: string]: number } = {}
      scoresData?.forEach((score) => {
        initialScores[score.ranking_criteria_id] = score.score
      })
      setScores(initialScores)
    } catch (error) {
      setError(t.messages.failedToFetch)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Prepare scores for upsert
      const scoresToUpsert = Object.entries(scores)
        .filter(([_, score]) => score !== undefined && score !== null)
        .map(([criteriaId, score]) => ({
          application_id: applicationId,
          ranking_criteria_id: criteriaId,
          score: score,
        }))

      if (scoresToUpsert.length === 0) {
        setError(t.criteriaScores.enterAtLeastOne)
        return
      }

      // Validate scores are within range
      for (const scoreEntry of scoresToUpsert) {
        const criterion = criteria.find((c) => c.id === scoreEntry.ranking_criteria_id)
        if (criterion) {
          if (scoreEntry.score < criterion.min_value || scoreEntry.score > criterion.max_value) {
            setError(
              t.criteriaScores.scoreOutOfRange
                .replace("{criteria}", criterion.name)
                .replace("{min}", criterion.min_value.toString())
                .replace("{max}", criterion.max_value.toString()),
            )
            return
          }
        }
      }

      // Upsert scores
      const { error } = await supabase.from("application_criteria_scores").upsert(scoresToUpsert)

      if (error) throw error

      onScoreAdded()
      onOpenChange(false)
      setScores({})
    } catch (error) {
      setError(t.criteriaScores.failedToSave)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.criteriaScores.title}</DialogTitle>
          <DialogDescription>{t.criteriaScores.subtitle}</DialogDescription>
        </DialogHeader>

        {loading && <div className="text-center py-4">{t.common.loading}</div>}

        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {criteria.map((criterion) => (
                <div key={criterion.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Label htmlFor={`score-${criterion.id}`} className="font-medium">
                        {criterion.name}
                      </Label>
                      <p className="text-sm text-gray-500">
                        {t.criteriaScores.range}: {criterion.min_value} - {criterion.max_value}
                      </p>
                    </div>
                    <div className="w-32">
                      <Input
                        id={`score-${criterion.id}`}
                        type="number"
                        min={criterion.min_value}
                        max={criterion.max_value}
                        step="0.01"
                        value={scores[criterion.id] || ""}
                        onChange={(e) =>
                          setScores({
                            ...scores,
                            [criterion.id]: e.target.value ? Number.parseFloat(e.target.value) : 0,
                          })
                        }
                        placeholder={t.criteriaScores.score}
                      />
                    </div>
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" disabled={loading}>
                {t.criteriaScores.saveScores}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
