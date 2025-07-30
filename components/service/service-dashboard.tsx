"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StudentCandidateForm } from "./student-candidate-form"
import { ApplicationManagement } from "./application-management"
import { ReportGeneration } from "./report-generation"
import { UserPlus, FileText, BarChart3 } from "lucide-react"
import { useTranslation, type Language } from "@/lib/i18n"
import { LanguageSelector } from "../language-selector"

interface ServiceDashboardProps {
  setLanguageUp: (language: Language) => void
}

export function ServiceDashboard({ setLanguageUp }: ServiceDashboardProps) {
  const [language, setLanguage] = useState<Language>("sr")
  const { t } = useTranslation(language)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "sr" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
    setLanguageUp(newLanguage)
  }


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t.roles.service.title}</h1>
        <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />
      </div>
      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {t.nav.studentRegistration}
          </TabsTrigger>
          <TabsTrigger value="applications" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t.nav.applications}
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {t.nav.reports}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <StudentCandidateForm language={language}/>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <ApplicationManagement language={language}/>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportGeneration language={language}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}
