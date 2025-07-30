"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Copy, User, Shield, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserSetupGuide() {
  const defaultUsers = [
    {
      role: "admin",
      email: "admin@university.edu",
      password: "admin123",
      name: "System Administrator",
      icon: Shield,
      description: "Full system access - manage institutions, programs, deadlines, and ranking systems",
    },
    {
      role: "service",
      email: "service@university.edu",
      password: "service123",
      name: "Service Staff",
      icon: Users,
      description: "Register students, manage applications, and generate reports",
    },
    {
      role: "student",
      email: "student@university.edu",
      password: "student123",
      name: "John Doe",
      icon: User,
      description: "View personal information and application status",
    },
  ]

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Student Enrollment System Setup</h1>
        <p className="text-gray-600">Create these default users to get started with the system</p>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Setup Required:</strong> You need to create these users in Supabase Auth first, then add their
          profiles to the database. Follow the steps below.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Create Auth Users in Supabase</CardTitle>
            <CardDescription>Go to your Supabase dashboard → Authentication → Users → Add User</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {defaultUsers.map((user) => {
                const IconComponent = user.icon
                return (
                  <div key={user.role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant="outline">{user.role}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Email:</span>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{user.email}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(user.email)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">Password:</span>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{user.password}</code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(user.password)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Get User UUIDs</CardTitle>
            <CardDescription>After creating the auth users, get their UUIDs from the auth.users table</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm">
                In your Supabase dashboard, go to <strong>Table Editor → auth → users</strong> and copy the UUID for
                each user you created.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <code className="text-sm">
                  SELECT id, email FROM auth.users WHERE email IN ('admin@university.edu', 'service@university.edu',
                  'student@university.edu');
                </code>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Create User Profiles</CardTitle>
            <CardDescription>
              Run this SQL in your Supabase SQL Editor (replace UUIDs with actual ones from Step 2)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{`-- Replace 'your-admin-uuid-here' with actual UUIDs from auth.users table

-- Admin user profile
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-admin-uuid-here', 'admin@university.edu', 'System', 'Administrator', 'admin');

-- Service user profile  
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-service-uuid-here', 'service@university.edu', 'Service', 'Staff', 'service');

-- Student user profile
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-student-uuid-here', 'student@university.edu', 'John', 'Doe', 'student');

-- Sample student candidate data for the student user
INSERT INTO student_candidates (
    user_id, first_name, last_name, date_of_birth, social_security_number,
    father_first_name, father_last_name, mother_first_name, mother_last_name,
    phone, email, previous_education_program, previous_education_institution,
    previous_education_start_year, previous_education_end_year
) VALUES (
    'your-student-uuid-here', 'John', 'Doe', DATE '2000-05-15', '1234567890',
    'Robert', 'Doe', 'Mary', 'Doe', '+1-555-0123', 'student@university.edu',
    'General High School Program', 'Central High School', 2016, 2020
);`}</code>
                </pre>
              </div>
              <Button
                onClick={() =>
                  copyToClipboard(`-- Replace 'your-admin-uuid-here' with actual UUIDs from auth.users table

-- Admin user profile
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-admin-uuid-here', 'admin@university.edu', 'System', 'Administrator', 'admin');

-- Service user profile  
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-service-uuid-here', 'service@university.edu', 'Service', 'Staff', 'service');

-- Student user profile
INSERT INTO user_profiles (user_id, email, first_name, last_name, role) VALUES
('your-student-uuid-here', 'student@university.edu', 'John', 'Doe', 'student');

-- Sample student candidate data for the student user
INSERT INTO student_candidates (
    user_id, first_name, last_name, date_of_birth, social_security_number,
    father_first_name, father_last_name, mother_first_name, mother_last_name,
    phone, email, previous_education_program, previous_education_institution,
    previous_education_start_year, previous_education_end_year
) VALUES (
    'your-student-uuid-here', 'John', 'Doe', DATE '2000-05-15', '1234567890',
    'Robert', 'Doe', 'Mary', 'Doe', '+1-555-0123', 'student@university.edu',
    'General High School Program', 'Central High School', 2016, 2020
);`)
                }
                variant="outline"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy SQL
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 4: Test Login</CardTitle>
            <CardDescription>Try logging in with each user to verify the setup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {defaultUsers.map((user) => (
                <div key={user.role} className="p-4 border rounded-lg text-center">
                  <Badge className="mb-2">{user.role}</Badge>
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-sm text-gray-600">{user.password}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Security Note:</strong> Change these default passwords after initial setup. These are only for testing
          purposes.
        </AlertDescription>
      </Alert>
    </div>
  )
}
