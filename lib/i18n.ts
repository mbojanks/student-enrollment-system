export type Language = "sr" | "en"

export interface Translations {
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    create: string
    update: string
    delete: string
    edit: string
    add: string
    search: string
    actions: string
    name: string
    description: string
    email: string
    phone: string
    address: string
    status: string
    date: string
    yes: string
    no: string
    back: string
    next: string
    submit: string
    close: string
    refresh: string
    view: string
    download: string
    generate: string
    calculate: string
    signOut: string
    signIn: string
    welcome: string
  }

  // Navigation & Layout
  nav: {
    dashboard: string
    institutions: string
    programs: string
    deadlines: string
    criteria: string
    rankingModes: string
    students: string
    applications: string
    reports: string
    studentRegistration: string
    overview: string
    personalInfo: string
    myApplications: string
  }

  // Authentication
  auth: {
    signIn: string
    signOut: string
    email: string
    password: string
    loginCredentials: string
    quickTestLogin: string
    loginAsAdmin: string
    loginAsService: string
    loginAsStudent: string
    createTestUser: string
    profileSetupRequired: string
    setupProfile: string
    createProfile: string
    accountType: string
    firstName: string
    lastName: string
    role: string
    administrator: string
    serviceStaff: string
    student: string
    quickSetupOptions: string
    setAsAdmin: string
    setAsService: string
    setAsStudent: string
    createUserSuccess: string
    userDoesNotExist: string
    useCreateButton: string
  }

  // Roles & Descriptions
  roles: {
    admin: {
      title: string
      description: string
    }
    service: {
      title: string
      description: string
    }
    student: {
      title: string
      description: string
    }
  }

  // Institution Management
  institutions: {
    title: string
    subtitle: string
    addInstitution: string
    editInstitution: string
    institutionName: string
    bankAccount: string
    institutionsList: string
    allInstitutions: string
    noInstitutions: string
    deleteConfirm: string
  }

  // Study Programs
  programs: {
    title: string
    subtitle: string
    addProgram: string
    editProgram: string
    programName: string
    educationLevel: string
    bachelor: string
    master: string
    institution: string
    accreditationValidUntil: string
    enrollmentSchoolYear: string
    programsList: string
    allPrograms: string
    noPrograms: string
    level: string
    accreditationUntil: string
    schoolYear: string
    unknownInstitution: string
    deleteConfirm: string
  }

  // Enrollment Deadlines
  deadlines: {
    title: string
    subtitle: string
    addDeadline: string
    editDeadline: string
    deadlineName: string
    deadlineDate: string
    committeeHeadFirstName: string
    committeeHeadLastName: string
    deadlinesList: string
    allDeadlines: string
    noDeadlines: string
    committeeHead: string
    deleteConfirm: string
  }

  // Ranking Criteria
  criteria: {
    title: string
    subtitle: string
    addCriteria: string
    editCriteria: string
    criteriaName: string
    minValue: string
    maxValue: string
    criteriaList: string
    allCriteria: string
    noCriteria: string
    valueRange: string
    deleteConfirm: string
    minMaxError: string
    namePlaceholder: string
    descriptionPlaceholder: string
  }

  // Ranking Modes
  rankingModes: {
    title: string
    subtitle: string
    addMode: string
    editMode: string
    modeName: string
    modesList: string
    allModes: string
    noModes: string
    deleteConfirm: string
    maxTotalPoints: string
    maxPoints: string
    configureCriteria: string
    configureCriteriaDesc: string
    factor: string
  }

  // Student Management
  studentManagement: {
    title: string
    subtitle: string
    searchStudents: string
    studentsCount: string
    studentCandidates: string
    allStudents: string
    noStudents: string
    noStudentsSearch: string
    ssn: string
    previousEducation: string
    noApplications: string
    rank: string
  }

  // Student Registration
  studentRegistration: {
    title: string
    subtitle: string
    studentInfo: string
    studentInfoDesc: string
    dateOfBirth: string
    socialSecurityNumber: string
    fatherFirstName: string
    fatherLastName: string
    motherFirstName: string
    motherLastName: string
    phoneNumber: string
    emailAddress: string
    previousEducationTitle: string
    programMajor: string
    startYear: string
    endYear: string
    registerStudent: string
    registrationSuccess: string
  }

  // Application Management
  applicationManagement: {
    title: string
    subtitle: string
    calculateRankings: string
    newApplication: string
    createNewApplication: string
    createApplicationDesc: string
    selectStudent: string
    selectProgram: string
    selectDeadline: string
    selectRankingMode: string
    applicationsList: string
    allApplications: string
    noApplications: string
    points: string
    addEditScores: string
    rankingCalculationSuccess: string
    rankingCalculationError: string
    noPendingApplications: string
    filterByProgram: string
    filterByDeadline: string
    allPrograms: string
    allDeadlines: string
    editApplication: string
    editApplicationDesc: string
    confirmDelete: string
  }

  // Criteria Scores
  criteriaScores: {
    title: string
    subtitle: string
    range: string
    score: string
    saveScores: string
    enterAtLeastOne: string
    scoreOutOfRange: string
    failedToSave: string
  }

  // Report Generation
  reports: {
    title: string
    subtitle: string
    generateReport: string
    generateReportDesc: string
    studyProgram: string
    enrollmentDeadline: string
    selectStudyProgram: string
    selectEnrollmentDeadline: string
    committeeHeadInfo: string
    reportSignedBy: string
    generatePDF: string
    generateExcel: string
    generating: string
    selectBothRequired: string
    reportFeatures: string
    reportFeaturesDesc: string
    studentInformation: string
    rankingDetails: string
    studentInfoFeatures: string
    rankingDetailsFeatures: string
  }

  // Student Portal
  studentPortal: {
    welcomeMessage: string
    subtitle: string
    personalInformation: string
    personalInfoDesc: string
    fullName: string
    enrollmentPeriod: string
    rankingMode: string
    applicationDate: string
    rankingInformation: string
    totalPoints: string
    rankPosition: string
    financing: string
    active: string
    importantInformation: string
    importantInfoList: string
    noPersonalInfo: string
    contactAdmissions: string
    studies: string
  }

  // System Messages
  messages: {
    initializingApp: string
    redirectingToDashboard: string
    loadingInfo: string
    somethingWentWrong: string
    reloadPage: string
    clearError: string
    failedToFetch: string
    failedToSave: string
    failedToDelete: string
    deleteConfirmation: string
    profileCreationError: string
    authError: string
    sessionTimeout: string
    unexpectedError: string
  }

  // Main Page
  mainPage: {
    title: string
    subtitle: string
    adminDashboard: string
    adminDescription: string
    serviceInterface: string
    serviceDescription: string
    studentPortal: string
    studentPortalDescription: string
  }

  // Application Status
  applicationStatus: {
    pending: string
    accepted: string
    rejected: string
    budget: string
    selfFinancing: string
  }

  // Education Levels
  educationLevels: {
    bachelor: string
    master: string
  }
}

export const translations: Record<Language, Translations> = {
  sr: {
    common: {
      loading: "Учитавање...",
      error: "Грешка",
      success: "Успех",
      cancel: "Откажи",
      save: "Сачувај",
      create: "Креирај",
      update: "Ажурирај",
      delete: "Обриши",
      edit: "Измени",
      add: "Додај",
      search: "Претрага",
      actions: "Акције",
      name: "Назив",
      description: "Опис",
      email: "Е-пошта",
      phone: "Телефон",
      address: "Адреса",
      status: "Статус",
      date: "Датум",
      yes: "Да",
      no: "Не",
      back: "Назад",
      next: "Следеће",
      submit: "Пошаљи",
      close: "Затвори",
      refresh: "Освежи",
      view: "Прикажи",
      download: "Преузми",
      generate: "Генериши",
      calculate: "Израчунај",
      signOut: "Одјави се",
      signIn: "Пријави се",
      welcome: "Добродошли",
    },

    nav: {
      dashboard: "Контролна табла",
      institutions: "Установе",
      programs: "Програми",
      deadlines: "Рокови",
      criteria: "Критеријуми",
      rankingModes: "Режими рангирања",
      students: "Студенти",
      applications: "Пријаве",
      reports: "Извештаји",
      studentRegistration: "Регистрација студената",
      overview: "Преглед",
      personalInfo: "Лични подаци",
      myApplications: "Моје пријаве",
    },

    auth: {
      signIn: "Пријава",
      signOut: "Одјава",
      email: "Е-пошта",
      password: "Лозинка",
      loginCredentials: "Унесите ваше податке за приступ систему за упис",
      quickTestLogin: "Брза тест пријава:",
      loginAsAdmin: "Пријави се као администратор",
      loginAsService: "Пријави се као службеник",
      loginAsStudent: "Пријави се као студент",
      createTestUser: "Креирај тест корисника",
      profileSetupRequired: "Потребно је подешавање профила",
      setupProfile: "Подеси профил",
      createProfile: "Креирај профил",
      accountType: "Тип налога",
      firstName: "Име",
      lastName: "Презиме",
      role: "Улога",
      administrator: "Администратор",
      serviceStaff: "Службеник",
      student: "Студент",
      quickSetupOptions: "Опције брзог подешавања",
      setAsAdmin: "Подеси као администратор",
      setAsService: "Подеси као службеник",
      setAsStudent: "Подеси као студент",
      createUserSuccess: "Корисник је успешно креиран и пријављен!",
      userDoesNotExist: "Тест корисник не постоји. Користите дугме 'Креирај тест корисника' да га креирате.",
      useCreateButton: "Ако корисници не постоје, користите дугме 'Креирај тест корисника' изнад",
    },

    roles: {
      admin: {
        title: "Администраторска контролна табла",
        description: "Управљање установама, студијским програмима, роковима за упис и системима рангирања",
      },
      service: {
        title: "Интерфејс службе",
        description: "Регистрација студената, управљање пријавама и генерисање свеобухватних извештаја",
      },
      student: {
        title: "Студентски портал",
        description: "Преглед статуса пријаве, позиције у рангирању и личних информација",
      },
    },

    institutions: {
      title: "Образовне установе",
      subtitle: "Управљање информацијама о установама и банковним рачунима",
      addInstitution: "Додај установу",
      editInstitution: "Измени установу",
      institutionName: "Назив установе",
      bankAccount: "Број банковног рачуна",
      institutionsList: "Листа установа",
      allInstitutions: "Све регистроване образовне установе",
      noInstitutions: "Нема пронађених установа",
      deleteConfirm: "Да ли сте сигурни да желите да обришете ову установу?",
    },

    programs: {
      title: "Студијски програми",
      subtitle: "Управљање основним и мастер студијским програмима са акредитацијом",
      addProgram: "Додај програм",
      editProgram: "Измени програм",
      programName: "Назив програма",
      educationLevel: "Ниво образовања",
      bachelor: "Основне студије",
      master: "Мастер студије",
      institution: "Установа",
      accreditationValidUntil: "Акредитација важи до",
      enrollmentSchoolYear: "Школска година уписа",
      programsList: "Листа студијских програма",
      allPrograms: "Сви регистровани студијски програми са статусом акредитације",
      noPrograms: "Нема пронађених студијских програма",
      level: "Ниво",
      accreditationUntil: "Акредитација до",
      schoolYear: "Школска година",
      unknownInstitution: "Непозната установа",
      deleteConfirm: "Да ли сте сигурни да желите да обришете овај студијски програм?",
    },

    deadlines: {
      title: "Рокови за упис",
      subtitle: "Управљање роковима за упис и информацијама о пријемној комисији",
      addDeadline: "Додај рок",
      editDeadline: "Измени рок",
      deadlineName: "Назив рока",
      deadlineDate: "Датум рока",
      committeeHeadFirstName: "Име председника комисије",
      committeeHeadLastName: "Презиме председника комисије",
      deadlinesList: "Листа рокова за упис",
      allDeadlines: "Сви рокови за упис са информацијама о комисији",
      noDeadlines: "Нема пронађених рокова за упис",
      committeeHead: "Председник комисије",
      deleteConfirm: "Да ли сте сигурни да желите да обришете овај рок за упис?",
    },

    criteria: {
      title: "Критеријуми рангирања",
      subtitle: "Управљање критеријумима који се користе за рангирање и евалуацију студената",
      addCriteria: "Додај критеријум",
      editCriteria: "Измени критеријум",
      criteriaName: "Назив критеријума",
      minValue: "Минимална вредност",
      maxValue: "Максимална вредност",
      criteriaList: "Листа критеријума рангирања",
      allCriteria: "Сви доступни критеријуми за евалуацију студената",
      noCriteria: "Нема пронађених критеријума рангирања",
      valueRange: "Опсег вредности",
      deleteConfirm:
        "Да ли сте сигурни да желите да обришете овај критеријум рангирања? Ово ће га такође уклонити из свих режима рангирања.",
      minMaxError: "Минимална вредност мора бити мања од максималне вредности",
      namePlaceholder: "нпр. Просек у средњој школи, САТ резултат, итд.",
      descriptionPlaceholder: "Опишите шта овај критеријум мери...",
    },

    rankingModes: {
      title: "Режими рангирања",
      subtitle: "Управљање различитим приступима рангирања студената",
      addMode: "Додај режим",
      editMode: "Измени режим",
      modeName: "Назив режима",
      modesList: "Листа режима рангирања",
      allModes: "Сви режими рангирања",
      noModes: "Нема пронађених режима рангирања",
      deleteConfirm: "Да ли сте сигурни да желите да обришете овај режим рангирања?",
      maxTotalPoints: "Максимални укупни поени",
      maxPoints: "Макс. поени",
      configureCriteria: "Конфигуриши критеријуме рангирања",
      configureCriteriaDesc: "Подесите факторе множења за сваки критеријум. Поставите на 0 да искључите критеријум.",
      factor: "Фактор",
    },

    studentManagement: {
      title: "Управљање студентима",
      subtitle: "Преглед свих регистрованих кандидата за студенте и њихових пријава",
      searchStudents: "Претражи студенте...",
      studentsCount: "од студената",
      studentCandidates: "Кандидати за студенте",
      allStudents: "Сви регистровани кандидати за студенте са статусом пријаве",
      noStudents: "Нема пронађених студената",
      noStudentsSearch: "Нема студената који одговарају вашој претрази",
      ssn: "ЈМБГ",
      previousEducation: "Претходно образовање",
      noApplications: "Нема пријава",
      rank: "Ранг",
    },

    studentRegistration: {
      title: "Регистрација студената",
      subtitle: "Регистрација нових кандидата за студенте са аутоматским генерисањем акредитива",
      studentInfo: "Информације о студенту",
      studentInfoDesc: "Унесите комплетне информације о студенту. Подаци за пријаву ће бити аутоматски генерисани.",
      dateOfBirth: "Датум рођења",
      socialSecurityNumber: "Јединствени матични број грађана",
      fatherFirstName: "Име оца",
      fatherLastName: "Презиме оца",
      motherFirstName: "Име мајке",
      motherLastName: "Презиме мајке",
      phoneNumber: "Број телефона",
      emailAddress: "Адреса е-поште",
      previousEducationTitle: "Претходно образовање",
      programMajor: "Програм/Смер",
      startYear: "Година почетка",
      endYear: "Година завршетка",
      registerStudent: "Региструј студента",
      registrationSuccess: "Студент је успешно регистрован!",
    },

    applicationManagement: {
      title: "Управљање пријавама",
      subtitle: "Управљање студентским пријавама и израчунавање рангирања",
      calculateRankings: "Израчунај рангирања",
      newApplication: "Нова пријава",
      createNewApplication: "Креирај нову пријаву",
      createApplicationDesc: "Креирај нову пријаву за кандидата за студента.",
      selectStudent: "Изабери студента",
      selectProgram: "Изабери програм",
      selectDeadline: "Изабери рок",
      selectRankingMode: "Изабери режим рангирања",
      applicationsList: "Листа пријава",
      allApplications: "Све студентске пријаве са тренутним статусом и рангирањима",
      noApplications: "Нема пронађених пријава",
      points: "Поени",
      addEditScores: "Додај/Измени резултате критеријума",
      rankingCalculationSuccess: "Рангирања су успешно израчуната!",
      rankingCalculationError:
        "Неуспешно израчунавање рангирања. Молимо проверите да све пријаве имају резултате критеријума.",
      noPendingApplications: "Нема пријава на чекању за израчунавање рангирања",
      filterByProgram: "Филтрирај по програму",
      filterByDeadline: "Филтрирај по року",
      allPrograms: "Сви програми",
      allDeadlines: "Сви рокови",
      editApplication: "Измени пријаву",
      editApplicationDesc: "Измените детаље пријаве за изабраног студента.",
      confirmDelete: "Да ли сте сигурни да желите да обришете ову пријаву?",
    },

    criteriaScores: {
      title: "Додај/Измени резултате критеријума",
      subtitle: "Унесите резултате за сваки критеријум рангирања. Оставите празно да прескочите критеријум.",
      range: "Опсег",
      score: "Резултат",
      saveScores: "Сачувај резултате",
      enterAtLeastOne: "Молимо унесите најмање један резултат",
      scoreOutOfRange: "Резултат за {criteria} мора бити између {min} и {max}",
      failedToSave: "Неуспешно чување резултата",
    },

    reports: {
      title: "Генерисање извештаја",
      subtitle: "Генериши извештаје о рангирању у ПДФ или Ексел формату",
      generateReport: "Генериши извештај о рангирању",
      generateReportDesc: "Изабери студијски програм и рок за упис да генеришеш свеобухватан извештај о рангирању",
      studyProgram: "Студијски програм",
      enrollmentDeadline: "Рок за упис",
      selectStudyProgram: "Изабери студијски програм",
      selectEnrollmentDeadline: "Изабери рок за упис",
      committeeHeadInfo: "Информације о председнику комисије",
      reportSignedBy: "Овај извештај ће бити потписан од стране председника комисије",
      generatePDF: "Генериши ПДФ извештај",
      generateExcel: "Генериши Ексел извештај",
      generating: "Генерисање...",
      selectBothRequired: "Молимо изаберите и студијски програм и рок за упис",
      reportFeatures: "Карактеристике извештаја",
      reportFeaturesDesc: "Генерисани извештаји укључују следеће информације",
      studentInformation: "Информације о студенту",
      rankingDetails: "Детаљи рангирања",
      studentInfoFeatures:
        "• Пуно име и контакт подаци\n• Јединствени матични број грађана\n• Претходно образовање\n• Статус пријаве",
      rankingDetailsFeatures:
        "• Укупни поени израчунати\n• Позиција у рангу\n• Тип финансирања (буџет/самофинансирање)\n• Потпис председника комисије",
    },

    studentPortal: {
      welcomeMessage: "Добродошли, {name}!",
      subtitle: "Прегледајте статус ваше пријаве и информације о рангирању",
      personalInformation: "Лични подаци",
      personalInfoDesc: "Ваши регистровани лични подаци",
      fullName: "Пуно име",
      enrollmentPeriod: "Период уписа",
      rankingMode: "Режим рангирања",
      applicationDate: "Датум пријаве",
      rankingInformation: "Информације о рангирању",
      totalPoints: "Укупни поени:",
      rankPosition: "Позиција у рангу:",
      financing: "Финансирање:",
      active: "Активно",
      importantInformation: "Важне информације",
      importantInfoList:
        "• Рангирања се редовно ажурирају током периода уписа\n• Бићете обавештени о свим променама статуса путем е-поште\n• За питања о вашој пријави, контактирајте пријемну канцеларију\n• Коначни резултати ће бити објављени након истека рока за упис",
      noPersonalInfo: "Нема пронађених личних информација. Молимо контактирајте пријемну канцеларију.",
      contactAdmissions: "контактирајте пријемну канцеларију",
      studies: "студије",
    },

    messages: {
      initializingApp: "Иницијализација апликације...",
      redirectingToDashboard: "Преусмеравање на {role} контролну таблу...",
      loadingInfo: "Учитавање ваших информација...",
      somethingWentWrong: "Нешто је пошло по зло",
      reloadPage: "Поново учитај страницу",
      clearError: "Обриши грешку",
      failedToFetch: "Неуспешно дохватање",
      failedToSave: "Неуспешно чување",
      failedToDelete: "Неуспешно брисање",
      deleteConfirmation: "Да ли сте сигурни да желите да обришете",
      profileCreationError: "Неуспешно креирање профила",
      authError: "Грешка при аутентификацији",
      sessionTimeout: "Истекла је сесија",
      unexpectedError: "Догодила се неочекивана грешка",
    },

    mainPage: {
      title: "Систем за упис студената",
      subtitle:
        "Свеобухватно управљање уписом за образовне установе са приступом заснованим на улогама за администраторе, службенике и студенте.",
      adminDashboard: "Администраторска контролна табла",
      adminDescription: "Управљање установама, студијским програмима, роковима за упис и системима рангирања",
      serviceInterface: "Интерфејс службе",
      serviceDescription: "Регистрација студената, управљање пријавама и генерисање свеобухватних извештаја",
      studentPortal: "Студентски портал",
      studentPortalDescription: "Преглед статуса пријаве, позиције у рангирању и личних информација",
    },

    applicationStatus: {
      pending: "на чекању",
      accepted: "прихваћено",
      rejected: "одбачено",
      budget: "буџет",
      selfFinancing: "самофинансирање",
    },

    educationLevels: {
      bachelor: "основне",
      master: "мастер",
    },
  },

  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      create: "Create",
      update: "Update",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      search: "Search",
      actions: "Actions",
      name: "Name",
      description: "Description",
      email: "Email",
      phone: "Phone",
      address: "Address",
      status: "Status",
      date: "Date",
      yes: "Yes",
      no: "No",
      back: "Back",
      next: "Next",
      submit: "Submit",
      close: "Close",
      refresh: "Refresh",
      view: "View",
      download: "Download",
      generate: "Generate",
      calculate: "Calculate",
      signOut: "Sign Out",
      signIn: "Sign In",
      welcome: "Welcome",
    },

    nav: {
      dashboard: "Dashboard",
      institutions: "Institutions",
      programs: "Programs",
      deadlines: "Deadlines",
      criteria: "Criteria",
      rankingModes: "Ranking Modes",
      students: "Students",
      applications: "Applications",
      reports: "Reports",
      studentRegistration: "Student Registration",
      overview: "Overview",
      personalInfo: "Personal Info",
      myApplications: "My Applications",
    },

    auth: {
      signIn: "Sign In",
      signOut: "Sign Out",
      email: "Email",
      password: "Password",
      loginCredentials: "Enter your credentials to access the enrollment system",
      quickTestLogin: "Quick Test Login:",
      loginAsAdmin: "Login as Admin",
      loginAsService: "Login as Service",
      loginAsStudent: "Login as Student",
      createTestUser: "Create Test User",
      profileSetupRequired: "Profile Setup Required",
      setupProfile: "Set Up Profile",
      createProfile: "Create Profile",
      accountType: "Account Type",
      firstName: "First Name",
      lastName: "Last Name",
      role: "Role",
      administrator: "Administrator",
      serviceStaff: "Service Staff",
      student: "Student",
      quickSetupOptions: "Quick Setup Options",
      setAsAdmin: "Set as Admin",
      setAsService: "Set as Service Staff",
      setAsStudent: "Set as Student",
      createUserSuccess: "User created and logged in successfully!",
      userDoesNotExist: "Test user doesn't exist. Use 'Create Test User' button to create it.",
      useCreateButton: "If users don't exist, use 'Create Test User' button above",
    },

    roles: {
      admin: {
        title: "Admin Dashboard",
        description: "Manage institutions, study programs, enrollment deadlines, and ranking systems",
      },
      service: {
        title: "Service Interface",
        description: "Register students, manage applications, and generate comprehensive reports",
      },
      student: {
        title: "Student Portal",
        description: "View application status, ranking position, and personal information",
      },
    },

    institutions: {
      title: "Educational Institutions",
      subtitle: "Manage institutional information and bank accounts",
      addInstitution: "Add Institution",
      editInstitution: "Edit Institution",
      institutionName: "Institution Name",
      bankAccount: "Bank Account Number",
      institutionsList: "Institutions List",
      allInstitutions: "All registered educational institutions",
      noInstitutions: "No institutions found",
      deleteConfirm: "Are you sure you want to delete this institution?",
    },

    programs: {
      title: "Study Programs",
      subtitle: "Manage bachelor and master study programs with accreditation",
      addProgram: "Add Program",
      editProgram: "Edit Program",
      programName: "Program Name",
      educationLevel: "Education Level",
      bachelor: "Bachelor Studies",
      master: "Master Studies",
      institution: "Institution",
      accreditationValidUntil: "Accreditation Valid Until",
      enrollmentSchoolYear: "Enrollment School Year",
      programsList: "Study Programs List",
      allPrograms: "All registered study programs with accreditation status",
      noPrograms: "No study programs found",
      level: "Level",
      accreditationUntil: "Accreditation Until",
      schoolYear: "School Year",
      unknownInstitution: "Unknown Institution",
      deleteConfirm: "Are you sure you want to delete this study program?",
    },

    deadlines: {
      title: "Enrollment Deadlines",
      subtitle: "Manage enrollment deadlines and admissions committee information",
      addDeadline: "Add Deadline",
      editDeadline: "Edit Deadline",
      deadlineName: "Deadline Name",
      deadlineDate: "Deadline Date",
      committeeHeadFirstName: "Committee Head First Name",
      committeeHeadLastName: "Committee Head Last Name",
      deadlinesList: "Enrollment Deadlines List",
      allDeadlines: "All enrollment deadlines with committee information",
      noDeadlines: "No enrollment deadlines found",
      committeeHead: "Committee Head",
      deleteConfirm: "Are you sure you want to delete this enrollment deadline?",
    },

    criteria: {
      title: "Ranking Criteria",
      subtitle: "Manage the criteria used for student ranking and evaluation",
      addCriteria: "Add Criteria",
      editCriteria: "Edit Criteria",
      criteriaName: "Criteria Name",
      minValue: "Minimum Value",
      maxValue: "Maximum Value",
      criteriaList: "Ranking Criteria List",
      allCriteria: "All available criteria for student evaluation",
      noCriteria: "No ranking criteria found",
      valueRange: "Value Range",
      deleteConfirm:
        "Are you sure you want to delete this ranking criteria? This will also remove it from all ranking modes.",
      minMaxError: "Minimum value must be less than maximum value",
      namePlaceholder: "e.g., High School GPA, SAT Score, etc.",
      descriptionPlaceholder: "Describe what this criteria measures...",
    },

    rankingModes: {
      title: "Ranking Modes",
      subtitle: "Manage different approaches to student ranking",
      addMode: "Add Mode",
      editMode: "Edit Mode",
      modeName: "Mode Name",
      modesList: "Ranking Modes List",
      allModes: "All ranking modes",
      noModes: "No ranking modes found",
      deleteConfirm: "Are you sure you want to delete this ranking mode?",
      maxTotalPoints: "Maximum Total Points",
      maxPoints: "Max Points",
      configureCriteria: "Configure Ranking Criteria",
      configureCriteriaDesc: "Set multiplication factors for each criteria. Set to 0 to exclude a criteria.",
      factor: "Factor",
    },

    studentManagement: {
      title: "Student Management",
      subtitle: "Overview of all registered student candidates and their applications",
      searchStudents: "Search students...",
      studentsCount: "of students",
      studentCandidates: "Student Candidates",
      allStudents: "All registered student candidates with their application status",
      noStudents: "No students found",
      noStudentsSearch: "No students found matching your search",
      ssn: "SSN",
      previousEducation: "Previous Education",
      noApplications: "No applications",
      rank: "Rank",
    },

    studentRegistration: {
      title: "Student Registration",
      subtitle: "Register new student candidates with automatic credential generation",
      studentInfo: "Student Information",
      studentInfoDesc: "Enter complete student information. Login credentials will be generated automatically.",
      dateOfBirth: "Date of Birth",
      socialSecurityNumber: "Social Security Number",
      fatherFirstName: "Father's First Name",
      fatherLastName: "Father's Last Name",
      motherFirstName: "Mother's First Name",
      motherLastName: "Mother's Last Name",
      phoneNumber: "Phone Number",
      emailAddress: "Email Address",
      previousEducationTitle: "Previous Education",
      programMajor: "Program/Major",
      startYear: "Start Year",
      endYear: "End Year",
      registerStudent: "Register Student",
      registrationSuccess: "Student registered successfully!",
    },

    applicationManagement: {
      title: "Application Management",
      subtitle: "Manage student applications and calculate rankings",
      calculateRankings: "Calculate Rankings",
      newApplication: "New Application",
      createNewApplication: "Create New Application",
      createApplicationDesc: "Create a new application for a student candidate.",
      selectStudent: "Select student",
      selectProgram: "Select program",
      selectDeadline: "Select deadline",
      selectRankingMode: "Select ranking mode",
      applicationsList: "Applications List",
      allApplications: "All student applications with their current status and rankings",
      noApplications: "No applications found",
      points: "Points",
      addEditScores: "Add/Edit Criteria Scores",
      rankingCalculationSuccess: "Rankings calculated successfully!",
      rankingCalculationError: "Failed to calculate rankings. Please check that all applications have criteria scores.",
      noPendingApplications: "No pending applications found to calculate rankings",
      filterByProgram: "Filter by Program",
      filterByDeadline: "Filter by Deadline",
      allPrograms: "All Programs",
      allDeadlines: "All Deadlines",
      editApplication: "Edit Application",
      editApplicationDesc: "Edit application details for the selected student.",
      confirmDelete: "Are you sure you want to delete this application?",
    },

    criteriaScores: {
      title: "Add/Edit Criteria Scores",
      subtitle: "Enter scores for each ranking criteria. Leave blank to skip a criteria.",
      range: "Range",
      score: "Score",
      saveScores: "Save Scores",
      enterAtLeastOne: "Please enter at least one score",
      scoreOutOfRange: "Score for {criteria} must be between {min} and {max}",
      failedToSave: "Failed to save scores",
    },

    reports: {
      title: "Report Generation",
      subtitle: "Generate ranking reports in PDF or Excel format",
      generateReport: "Generate Ranking Report",
      generateReportDesc: "Select a study program and enrollment deadline to generate a comprehensive ranking report",
      studyProgram: "Study Program",
      enrollmentDeadline: "Enrollment Deadline",
      selectStudyProgram: "Select study program",
      selectEnrollmentDeadline: "Select enrollment deadline",
      committeeHeadInfo: "Committee Head Information",
      reportSignedBy: "This report will be signed by the committee head",
      generatePDF: "Generate PDF Report",
      generateExcel: "Generate Excel Report",
      generating: "Generating...",
      selectBothRequired: "Please select both a study program and enrollment deadline",
      reportFeatures: "Report Features",
      reportFeaturesDesc: "Generated reports include the following information",
      studentInformation: "Student Information",
      rankingDetails: "Ranking Details",
      studentInfoFeatures:
        "• Full name and contact details\n• Social security number\n• Previous education background\n• Application status",
      rankingDetailsFeatures:
        "• Total points calculated\n• Rank position\n• Financing type (budget/self-financing)\n• Committee head signature",
    },

    studentPortal: {
      welcomeMessage: "Welcome, {name}!",
      subtitle: "View your application status and ranking information",
      personalInformation: "Personal Information",
      personalInfoDesc: "Your registered personal details",
      fullName: "Full Name",
      enrollmentPeriod: "Enrollment Period",
      rankingMode: "Ranking Mode",
      applicationDate: "Application Date",
      rankingInformation: "Ranking Information",
      totalPoints: "Total Points:",
      rankPosition: "Rank Position:",
      financing: "Financing:",
      active: "Active",
      importantInformation: "Important Information",
      importantInfoList:
        "• Rankings are updated regularly during the enrollment period\n• You will be notified of any status changes via email\n• For questions about your application, contact the admissions office\n• Final results will be published after the enrollment deadline",
      noPersonalInfo: "No personal information found. Please contact the admissions office.",
      contactAdmissions: "contact the admissions office",
      studies: "Studies",
    },

    messages: {
      initializingApp: "Initializing application...",
      redirectingToDashboard: "Redirecting to {role} dashboard...",
      loadingInfo: "Loading your information...",
      somethingWentWrong: "Something went wrong",
      reloadPage: "Reload Page",
      clearError: "Clear Error",
      failedToFetch: "Failed to fetch",
      failedToSave: "Failed to save",
      failedToDelete: "Failed to delete",
      deleteConfirmation: "Are you sure you want to delete",
      profileCreationError: "Failed to create profile",
      authError: "Error processing authentication",
      sessionTimeout: "Session timeout",
      unexpectedError: "An unexpected error occurred",
    },

    mainPage: {
      title: "Student Enrollment System",
      subtitle:
        "Comprehensive enrollment management for educational institutions with role-based access for administrators, service staff, and students.",
      adminDashboard: "Admin Dashboard",
      adminDescription: "Manage institutions, study programs, enrollment deadlines, and ranking systems",
      serviceInterface: "Service Interface",
      serviceDescription: "Register students, manage applications, and generate comprehensive reports",
      studentPortal: "Student Portal",
      studentPortalDescription: "View application status, ranking position, and personal information",
    },

    applicationStatus: {
      pending: "pending",
      accepted: "accepted",
      rejected: "rejected",
      budget: "budget",
      selfFinancing: "self-financing",
    },

    educationLevels: {
      bachelor: "bachelor",
      master: "master",
    },
  },
}

export function useTranslation(language: Language = "sr") {
  const t = translations[language]

  const formatMessage = (message: string, params: Record<string, string> = {}) => {
    return Object.entries(params).reduce((msg, [key, value]) => msg.replace(`{${key}}`, value), message)
  }

  return { t, formatMessage }
}
