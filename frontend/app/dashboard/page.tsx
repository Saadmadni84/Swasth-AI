'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import Navbar from '@/components/navbar'
import Link from 'next/link'
import { 
  profileOperations, 
  familyOperations, 
  appointmentOperations, 
  healthRecordOperations,
  insightOperations 
} from '@/lib/database-utils'
import { 
  Profile, 
  FamilyMember, 
  Appointment, 
  HealthRecord, 
  HealthInsight 
} from '@/lib/database.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  CalendarDays, 
  Users, 
  FileText, 
  TrendingUp, 
  Plus,
  Activity,
  Heart,
  Stethoscope,
  Calendar,
  Bell,
  Settings,
  UserPlus,
  BookOpen,
  BarChart3,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  CheckCircle,
  Home,
  User,
  Shield,
  Zap,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [recentRecords, setRecentRecords] = useState<HealthRecord[]>([])
  const [unreadInsights, setUnreadInsights] = useState<HealthInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && !isLoading) {
      loadDashboardData()
    }
  }, [user, isLoading])

  const loadDashboardData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Load user profile
      const { data: profileData } = await profileOperations.getProfile(user.id)
      setProfile(profileData)

      // Load family members
      const { data: familyData } = await familyOperations.getFamilyMembers(user.id)
      setFamilyMembers(familyData || [])

      // Load upcoming appointments
      const { data: appointmentsData } = await appointmentOperations.getUpcomingAppointments(user.id)
      setUpcomingAppointments(appointmentsData?.slice(0, 5) || [])

      // Load recent health records
      const { data: recordsData } = await healthRecordOperations.getHealthRecords(user.id)
      setRecentRecords(recordsData?.slice(0, 5) || [])

      // Load unread insights
      const { data: insightsData } = await insightOperations.getInsights(user.id, false)
      setUnreadInsights(insightsData?.slice(0, 3) || [])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSampleProfile = async () => {
    if (!user) return

    const sampleProfile = {
      id: user.id,
      email: user.email || '',
      full_name: 'John Doe',
      phone: '+1234567890',
      date_of_birth: '1990-01-01',
      gender: 'male',
      blood_group: 'O+',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110001'
    }

    const { data } = await profileOperations.upsertProfile(sampleProfile)
    if (data) {
      setProfile(data)
    }
  }

  const addSampleFamilyMember = async () => {
    if (!user) return

    const sampleMember = {
      user_id: user.id,
      full_name: 'sania',
      relationship: 'spouse',
      date_of_birth: '1992-05-15',
      gender: 'female',
      blood_group: 'A+',
      phone: '+1234567891'
    }

    const { data } = await familyOperations.addFamilyMember(sampleMember)
    if (data) {
      setFamilyMembers([...familyMembers, data])
    }
  }

  const addSampleAppointment = async () => {
    if (!user) return

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const sampleAppointment = {
      user_id: user.id,
      doctor_name: 'Dr. Smith',
      doctor_specialty: 'Cardiologist',
      hospital_name: 'City Hospital',
      appointment_date: tomorrow.toISOString().split('T')[0],
      appointment_time: '10:00',
      status: 'scheduled',
      notes: 'Regular checkup'
    }

    const { data } = await appointmentOperations.addAppointment(sampleAppointment)
    if (data) {
      setUpcomingAppointments([...upcomingAppointments, data])
    }
  }

  if (isLoading || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="text-lg text-gray-600">Loading dashboard...</div>
          </div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h2>
              <p className="text-gray-600 mb-6">Please log in to view your dashboard.</p>
              <Link 
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <span></span>
                <span className="ml-2">Login to Continue</span>
              </Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {profile?.full_name || user.email}!</p>
          </div>

      {/* Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile</CardTitle>
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback>
                {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile ? 'Complete' : 'Incomplete'}</div>
            <p className="text-xs text-muted-foreground">
              {profile ? 'Profile information is complete' : 'Complete your profile'}
            </p>
            {!profile && (
              <Button size="sm" className="mt-2" onClick={createSampleProfile}>
                Create Sample Profile
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Family Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{familyMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              {familyMembers.length === 0 ? 'No family members added' : 'Family members added'}
            </p>
            <Button size="sm" className="mt-2" onClick={addSampleFamilyMember}>
              <Plus className="h-3 w-3 mr-1" /> Add Sample Member
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingAppointments.length === 0 ? 'No upcoming appointments' : 'Scheduled appointments'}
            </p>
            <Button size="sm" className="mt-2" onClick={addSampleAppointment}>
              <Plus className="h-3 w-3 mr-1" /> Add Sample Appointment
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentRecords.length}</div>
            <p className="text-xs text-muted-foreground">
              {recentRecords.length === 0 ? 'No health records' : 'Recent health records'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Family Members
            </CardTitle>
            <CardDescription>Your registered family members</CardDescription>
          </CardHeader>
          <CardContent>
            {familyMembers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No family members added yet</p>
            ) : (
              <div className="space-y-4">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.full_name}</p>
                        <p className="text-sm text-gray-500">{member.relationship}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{member.blood_group || 'Unknown'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{appointment.doctor_name}</p>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{appointment.doctor_specialty}</p>
                    <p className="text-sm text-gray-500">
                      {appointment.appointment_date} at {appointment.appointment_time}
                    </p>
                    {appointment.hospital_name && (
                      <p className="text-sm text-gray-500">{appointment.hospital_name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Health Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Health Records
            </CardTitle>
            <CardDescription>Your latest health records and documents</CardDescription>
          </CardHeader>
          <CardContent>
            {recentRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No health records uploaded</p>
            ) : (
              <div className="space-y-4">
                {recentRecords.map((record) => (
                  <div key={record.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{record.title}</p>
                      <Badge variant="outline">{record.record_type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">{record.description}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(record.date_recorded).toLocaleDateString()}
                    </p>
                    {record.doctor_name && (
                      <p className="text-sm text-gray-500">Dr. {record.doctor_name}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Health Insights
            </CardTitle>
            <CardDescription>Personalized health recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {unreadInsights.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No new insights available</p>
            ) : (
              <div className="space-y-4">
                {unreadInsights.map((insight) => (
                  <div key={insight.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{insight.title}</p>
                      <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{insight.content}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </>
  )
}
