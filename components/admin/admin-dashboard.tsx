"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstitutionManagement } from "./institution-management"
import { StudyProgramManagement } from "./study-program-management"
import { EnrollmentDeadlines } from "./enrollment-deadlines"
import { RankingModes } from "./ranking-modes"
import { StudentManagement } from "./student-management"
import { RankingCriteria } from "./ranking-criteria"
import { Building2, BookOpen, Calendar, Trophy, Users, Target } from "lucide-react"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation, type Language } from "@/lib/i18n"

interface AdminDashboardProps {
  setLanguageUp: (language: Language) => void
}

export function AdminDashboard({ setLanguageUp }: AdminDashboardProps) {
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
        <h1 className="text-3xl font-bold">{t.roles.admin.title}</h1>
        <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />
      </div>

      <Tabs defaultValue="institutions" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="institutions" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            {t.nav.institutions}
          </TabsTrigger>
          <TabsTrigger value="programs" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t.nav.programs}
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t.nav.deadlines}
          </TabsTrigger>
          <TabsTrigger value="criteria" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t.nav.criteria}
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            {t.nav.rankingModes}
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t.nav.students}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="institutions" className="mt-6">
          <InstitutionManagement language={language} />
        </TabsContent>

        <TabsContent value="programs" className="mt-6">
          <StudyProgramManagement language={language} />
        </TabsContent>

        <TabsContent value="deadlines" className="mt-6">
          <EnrollmentDeadlines language={language} />
        </TabsContent>

        <TabsContent value="criteria" className="mt-6">
          <RankingCriteria language={language} />
        </TabsContent>

        <TabsContent value="ranking" className="mt-6">
          <RankingModes language={language} />
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <StudentManagement language={language} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
