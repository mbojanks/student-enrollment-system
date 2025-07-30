"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useTranslation, type Language } from "@/lib/i18n"

interface Institution {
  id: string
  name: string
  address: string
  phone: string
  bank_account: string
  created_at: string
}

interface InstitutionManagementProps {
  language: Language
}

export function InstitutionManagement({ language }: InstitutionManagementProps) {
  const { t } = useTranslation(language)
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingInstitution, setEditingInstitution] = useState<Institution | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    bank_account: "",
  })
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchInstitutions()
  }, [])

  const fetchInstitutions = async () => {
    try {
      const { data, error } = await supabase.from("institutions").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setInstitutions(data || [])
    } catch (error) {
      setError(`${t.messages.failedToFetch} ${t.nav.institutions.toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (editingInstitution) {
        const { error } = await supabase.from("institutions").update(formData).eq("id", editingInstitution.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("institutions").insert([formData])

        if (error) throw error
      }

      setDialogOpen(false)
      setEditingInstitution(null)
      setFormData({ name: "", address: "", phone: "", bank_account: "" })
      fetchInstitutions()
    } catch (error) {
      setError(`${t.messages.failedToSave} ${t.nav.institutions.toLowerCase()}`)
    }
  }

  const handleEdit = (institution: Institution) => {
    setEditingInstitution(institution)
    setFormData({
      name: institution.name,
      address: institution.address,
      phone: institution.phone,
      bank_account: institution.bank_account,
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t.institutions.deleteConfirm)) return

    try {
      const { error } = await supabase.from("institutions").delete().eq("id", id)

      if (error) throw error
      fetchInstitutions()
    } catch (error) {
      setError(`${t.messages.failedToDelete} ${t.nav.institutions.toLowerCase()}`)
    }
  }

  const resetForm = () => {
    setEditingInstitution(null)
    setFormData({ name: "", address: "", phone: "", bank_account: "" })
    setError("")
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        {t.common.loading} {t.nav.institutions.toLowerCase()}...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t.institutions.title}</h2>
          <p className="text-gray-600">{t.institutions.subtitle}</p>
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
              {t.institutions.addInstitution}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingInstitution ? t.institutions.editInstitution : t.institutions.addInstitution}
              </DialogTitle>
              <DialogDescription>{t.institutions.subtitle}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t.institutions.institutionName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t.common.address}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t.common.phone}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank_account">{t.institutions.bankAccount}</Label>
                <Input
                  id="bank_account"
                  value={formData.bank_account}
                  onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
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
                <Button type="submit">{editingInstitution ? t.common.update : t.common.create}</Button>
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
          <CardTitle>{t.institutions.institutionsList}</CardTitle>
          <CardDescription>{t.institutions.allInstitutions}</CardDescription>
        </CardHeader>
        <CardContent>
          {institutions.length === 0 ? (
            <p className="text-center py-8 text-gray-500">{t.institutions.noInstitutions}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.common.name}</TableHead>
                  <TableHead>{t.common.address}</TableHead>
                  <TableHead>{t.common.phone}</TableHead>
                  <TableHead>{t.institutions.bankAccount}</TableHead>
                  <TableHead>{t.common.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {institutions.map((institution) => (
                  <TableRow key={institution.id}>
                    <TableCell className="font-medium">{institution.name}</TableCell>
                    <TableCell>{institution.address}</TableCell>
                    <TableCell>{institution.phone}</TableCell>
                    <TableCell>{institution.bank_account}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(institution)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(institution.id)}>
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
