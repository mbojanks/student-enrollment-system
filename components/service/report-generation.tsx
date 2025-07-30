"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { FileText, FileSpreadsheet } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Language, useTranslation } from "@/lib/i18n"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: typeof autoTable
  }
}

interface ReportGenerationProps {
  language: Language
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
  committee_head_first_name: string
  committee_head_last_name: string
}

export function ReportGeneration({ language }: ReportGenerationProps) {
  const { t } = useTranslation(language)
  const [programs, setPrograms] = useState<StudyProgram[]>([])
  const [deadlines, setDeadlines] = useState<EnrollmentDeadline[]>([])
  const [selectedProgram, setSelectedProgram] = useState("")
  const [selectedDeadline, setSelectedDeadline] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [programsResult, deadlinesResult] = await Promise.all([
        supabase.from("study_programs").select("id, name, education_level").order("name"),
        supabase.from("enrollment_deadlines").select("*").order("deadline_date", { ascending: false }),
      ])

      if (programsResult.error) throw programsResult.error
      if (deadlinesResult.error) throw deadlinesResult.error

      setPrograms(programsResult.data || [])
      setDeadlines(deadlinesResult.data || [])
    } catch (error) {
      setError(t.messages.failedToFetch)
    }
  }

  const generateReport = async (format: "pdf" | "excel") => {
    if (!selectedProgram || !selectedDeadline) {
      setError(t.reports.selectBothRequired)
      return
    }

    setLoading(true)
    setError("")

    try {
      // Fetch applications data for the report
      const { data: applications, error: applicationsError } = await supabase
        .from("applications")
        .select(`
          *,
          student_candidates (
            first_name,
            last_name,
            email,
            social_security_number,
            date_of_birth,
            phone,
            previous_education_program,
            previous_education_institution
          ),
          study_programs (name, education_level, institutions(name, address)),
          enrollment_deadlines (
            name,
            school_year,
            committee_head_first_name,
            committee_head_last_name
          ),
          ranking_modes (name),
          application_criteria_scores (
          score,
          ranking_criteria (name)
        )
        `)
        .eq("study_program_id", selectedProgram)
        .eq("enrollment_deadline_id", selectedDeadline)
        .order("rank_position", { ascending: true })

      if (applicationsError) throw applicationsError

      const program = programs.find((p) => p.id === selectedProgram)
      const deadline = deadlines.find((d) => d.id === selectedDeadline)

      if (format === "pdf") {
        generatePDFReport(applications || [], program, deadline)
      } else {
        generateExcelReport(applications || [], program, deadline)
      }

      setError("")
    } catch (error) {
      setError(t.messages.failedToFetch + ": " + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  const generatePDFReport = (applications: any[], program: any, deadline: any) => {
    const doc = new jsPDF('p', 'mm', 'a4')

    // Set font for Serbian text support
    // Receiving data using GET request
    fetch("/LiberationSans-Regular.ttf", {
    // Adding Get request
    method: "GET",
    // Setting headers
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    // Setting response type to arraybuffer NOT NECESSARY
    //responseType: "arraybuffer"
    })
    // Handling the received binary data
    .then(response =>{
      if (response.ok){
        return response.blob();
      } else {
        throw new Error("Failed to fetch font file");
      }
      //console.log("Binary data send Successfully");
    })
    .then(blob => {
      // add the font to jsPDF
      const fr = new FileReader();
      fr.onload = function(e) {
        const binaryString = e.target?.result;
        //console.log("File content as binary string:", binaryString);
        // You can now work with the binaryString
        doc.addFileToVFS("MyFont.ttf", binaryString as string);
        doc.addFont("MyFont.ttf", "MyFont", "normal");
        doc.setFont("MyFont");
        // Header
        doc.setFontSize(14)
        doc.text(applications[0].study_programs.institutions.name, doc.internal.pageSize.width / 2, 15, { align: "center" })
        doc.setFontSize(12)
        doc.text(applications[0].study_programs.institutions.address, doc.internal.pageSize.width / 2, 20, { align: "center" })
        doc.setFontSize(20)
        doc.text("RANKING REPORT / ИЗВЕШТАЈ О РАНГИРАЊУ", 20, 40)

        doc.setFontSize(12)
        doc.text(`Study Program / Студијски програм: ${program?.name || "N/A"}`, 20, 55)
        doc.text(
          `Education Level / Ниво образовања: ${program?.education_level === "bachelor" ? "Bachelor / Основне студије" : "Master / Мастер студије"}`,
          20,
          65,
        )
        doc.text(`Enrollment Period / Период уписа: ${deadline?.name || "N/A"} (${deadline?.school_year || "N/A"})`, 20, 75)
        doc.text(
          `Committee Head / Председник комисије: ${deadline?.committee_head_first_name || ""} ${deadline?.committee_head_last_name || ""}`,
          20,
          85,
        )
        doc.text(`Generated / Генерисано: ${new Date().toLocaleDateString()}`, 20, 95)

        // Summary statistics
        const totalCandidates = applications.length
        const acceptedCandidates = applications.filter((app) => app.status === "accepted").length
        const budgetPlaces = applications.filter((app) => app.financing_type === "budget").length
        const selfFinancingPlaces = applications.filter((app) => app.financing_type === "self_financing").length

        doc.text(`Total Candidates / Укупно кандидата: ${totalCandidates}`, 20, 110)
        doc.text(`Accepted / Прихваћено: ${acceptedCandidates}`, 20, 120)
        doc.text(`Budget Places / Буџетска места: ${budgetPlaces}`, 20, 130)
        doc.text(`Self-Financing / Самофинансирање: ${selfFinancingPlaces}`, 20, 140)

        // Prepare table data
        const tableData = applications.map((app, index) => [
          app.rank_position || index + 1,
          `${app.student_candidates?.first_name || ""} ${app.student_candidates?.last_name || ""}`,
          app.student_candidates?.social_security_number || "N/A",
          app.total_points?.toFixed(2) || "0.00",
          app.status === "accepted"
            ? "Accepted / Прихваћено"
            : app.status === "rejected"
              ? "Rejected / Одбачено"
              : "Pending / На чекању",
          app.financing_type === "budget"
            ? "Budget / Буџет"
            : app.financing_type === "self_financing"
              ? "Self-Financing / Самофинансирање"
              : "N/A",
          app.student_candidates?.email || "N/A",
        ]);

        // Add table
        autoTable(doc, {
          head: [
            [
              "Rank\nРанг",
              "Full Name\nПуно име",
              "SSN\nЈМБГ",
              "Points\nПоени",
              "Status\nСтатус",
              "Financing\nФинансирање",
              "Email\nЕ-пошта",
            ],
          ],
          body: tableData,
          startY: 135,
          styles: { fontSize: 8, cellPadding: 2, font: 'MyFont', fontStyle: 'normal',
          },
          headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 9, font: 'MyFont', fontStyle: 'normal' },
          alternateRowStyles: { fillColor: [245, 245, 245] },
          margin: { top: 135, left: 10, right: 10 },
          tableWidth: "auto",
          columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 35 },
            2: { cellWidth: 25 },
            3: { cellWidth: 20 },
            4: { cellWidth: 30 },
            5: { cellWidth: 30 },
            6: { cellWidth: 35 },
          },
        })

        // Footer with signature
        const finalY = (doc as any).lastAutoTable.finalY || 220
        doc.text("Committee Head Signature / Потпис председника комисије:", 20, finalY + 30)
        doc.text("_________________________________", 20, finalY + 50)
        doc.text(
          `${deadline?.committee_head_first_name || ""} ${deadline?.committee_head_last_name || ""}`,
          20,
          finalY + 60,
        )

        // Save the PDF
        const fileName = `ranking-report-${program?.name?.replace(/\s+/g, "-")}-${Date.now()}.pdf`
        doc.save(fileName)
      }
      fr.onerror = function(e) {
        throw new Error(e.target?.error?.message);
      }

      fr.readAsBinaryString(blob); // Read the file as a binary string
      //console.log("Binary data received Successfully")
    })
    .catch(err => {
      console.log("Found error:", err)
    });
    //doc.setFont("helvetica")
  }

  const generateExcelReport = (applications: any[], program: any, deadline: any) => {
    // Create workbook
    const wb = XLSX.utils.book_new()

    // Summary sheet data
    const summaryData = [
      ["RANKING REPORT / ИЗВЕШТАЈ О РАНГИРАЊУ"],
      [""],
      ["Study Program / Студијски програм:", program?.name || "N/A"],
      [
        "Education Level / Ниво образовања:",
        program?.education_level === "bachelor" ? "Bachelor / Основне студије" : "Master / Мастер студије",
      ],
      ["Enrollment Period / Период уписа:", `${deadline?.name || "N/A"} (${deadline?.school_year || "N/A"})`],
      [
        "Committee Head / Председник комисије:",
        `${deadline?.committee_head_first_name || ""} ${deadline?.committee_head_last_name || ""}`,
      ],
      ["Generated / Генерисано:", new Date().toLocaleDateString()],
      [""],
      ["SUMMARY / РЕЗИМЕ"],
      ["Total Candidates / Укупно кандидата:", applications.length],
      ["Accepted / Прихваћено:", applications.filter((app) => app.status === "accepted").length],
      ["Budget Places / Буџетска места:", applications.filter((app) => app.financing_type === "budget").length],
      [
        "Self-Financing / Самофинансирање:",
        applications.filter((app) => app.financing_type === "self_financing").length,
      ],
    ]

    // Create summary sheet
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary")

    // Applications data
    const applicationsData = [
      [
        "Rank\nРанг",
        "First Name\nИме",
        "Last Name\nПрезиме",
        "SSN\nЈМБГ",
        "Email\nЕ-пошта",
        "Phone\nТелефон",
        "Date of Birth\nДатум рођења",
        "Previous Education\nПретходно образовање",
        "Previous Institution\nПретходна установа",
        "Total Points\nУкупни поени",
        "Status\nСтатус",
        "Financing Type\nТип финансирања",
      ],
      ...applications.map((app, index) => [
        app.rank_position || index + 1,
        app.student_candidates?.first_name || "",
        app.student_candidates?.last_name || "",
        app.student_candidates?.social_security_number || "",
        app.student_candidates?.email || "",
        app.student_candidates?.phone || "",
        app.student_candidates?.date_of_birth
          ? new Date(app.student_candidates.date_of_birth).toLocaleDateString()
          : "",
        app.student_candidates?.previous_education_program || "",
        app.student_candidates?.previous_education_institution || "",
        app.total_points || 0,
        app.status === "accepted"
          ? "Accepted / Прихваћено"
          : app.status === "rejected"
            ? "Rejected / Одбачено"
            : "Pending / На чекању",
        app.financing_type === "budget"
          ? "Budget / Буџет"
          : app.financing_type === "self_financing"
            ? "Self-Financing / Самофинансирање"
            : "N/A",
      ]),
    ]

    // Create applications sheet
    const applicationsWs = XLSX.utils.aoa_to_sheet(applicationsData)

    // Set column widths
    const colWidths = [
      { wch: 8 }, // Rank
      { wch: 15 }, // First Name
      { wch: 15 }, // Last Name
      { wch: 15 }, // SSN
      { wch: 25 }, // Email
      { wch: 15 }, // Phone
      { wch: 12 }, // Date of Birth
      { wch: 25 }, // Previous Education
      { wch: 25 }, // Previous Institution
      { wch: 12 }, // Total Points
      { wch: 20 }, // Status
      { wch: 20 }, // Financing Type
    ]
    applicationsWs["!cols"] = colWidths

    XLSX.utils.book_append_sheet(wb, applicationsWs, "Applications")

    // Criteria scores sheet (if available)
    if (applications.some((app) => app.application_criteria_scores?.length > 0)) {
      const criteriaData = [["Student Name\nИме студента", "Criteria\nКритеријум", "Score\nРезултат"]]

      applications.forEach((app) => {
        const studentName = `${app.student_candidates?.first_name || ""} ${app.student_candidates?.last_name || ""}`
        if (app.application_criteria_scores) {
          app.application_criteria_scores.forEach((score: any) => {
            criteriaData.push([studentName, score.ranking_criteria?.name || "N/A", score.score || 0])
          })
        }
      })

      const criteriaWs = XLSX.utils.aoa_to_sheet(criteriaData)
      criteriaWs["!cols"] = [{ wch: 25 }, { wch: 30 }, { wch: 10 }]
      XLSX.utils.book_append_sheet(wb, criteriaWs, "Criteria Scores")
    }

    // Save the Excel file
    const fileName = `ranking-report-${program?.name?.replace(/\s+/g, "-")}-${Date.now()}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.reports.title}</h2>
        <p className="text-gray-600">{t.reports.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t.reports.generateReport}</CardTitle>
          <CardDescription>{t.reports.generateReportDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="program">{t.reports.studyProgram}</Label>
              <Select value={selectedProgram} onValueChange={setSelectedProgram}>
                <SelectTrigger>
                  <SelectValue placeholder={t.reports.selectStudyProgram} />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.name} (
                      {program.education_level === "bachelor" ? t.educationLevels.bachelor : t.educationLevels.master})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">{t.reports.enrollmentDeadline}</Label>
              <Select value={selectedDeadline} onValueChange={setSelectedDeadline}>
                <SelectTrigger>
                  <SelectValue placeholder={t.reports.selectEnrollmentDeadline} />
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
          </div>

          {selectedDeadline && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">{t.reports.committeeHeadInfo}</h4>
              <p className="text-sm text-gray-600">
                {deadlines.find((d) => d.id === selectedDeadline)?.committee_head_first_name}{" "}
                {deadlines.find((d) => d.id === selectedDeadline)?.committee_head_last_name}
              </p>
              <p className="text-xs text-gray-500 mt-1">{t.reports.reportSignedBy}</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={() => generateReport("pdf")}
              disabled={loading || !selectedProgram || !selectedDeadline}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              {loading ? t.reports.generating : t.reports.generatePDF}
            </Button>
            <Button
              onClick={() => generateReport("excel")}
              disabled={loading || !selectedProgram || !selectedDeadline}
              variant="outline"
              className="flex-1"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              {loading ? t.reports.generating : t.reports.generateExcel}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.reports.reportFeatures}</CardTitle>
          <CardDescription>{t.reports.reportFeaturesDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">{t.reports.studentInformation}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {t.reports.studentInfoFeatures.split("\n").map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{t.reports.rankingDetails}</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {t.reports.rankingDetailsFeatures.split("\n").map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
