'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { healthRecordOperations, familyOperations, appointmentOperations } from '@/lib/database-utils';
import { StorageService, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZES } from '@/lib/storage';
import { HealthRecord, FamilyMember, Appointment } from '@/lib/database.types';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye,
  Plus,
  Calendar,
  User,
  Stethoscope,
  Pill,
  TestTube,
  Syringe,
  Heart,
  Activity,
  Loader2,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/protected-route';

const RECORD_TYPES = [
  { value: 'prescription', label: 'Prescription', icon: Pill },
  { value: 'lab_report', label: 'Lab Report', icon: TestTube },
  { value: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
  { value: 'vaccination', label: 'Vaccination', icon: Syringe },
  { value: 'surgery', label: 'Surgery', icon: Heart },
  { value: 'other', label: 'Other', icon: FileText },
];

export default function HealthRecordsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('records');
  const [isLoading, setIsLoading] = useState(true);
  
  // Health Records
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [selectedRecordType, setSelectedRecordType] = useState('');
  const [selectedFamilyMember, setSelectedFamilyMember] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Add Record Form
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    record_type: '',
    title: '',
    description: '',
    date_recorded: '',
    doctor_name: '',
    hospital_name: '',
    family_member_id: '',
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    filterRecords();
  }, [healthRecords, selectedRecordType, selectedFamilyMember]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load health records
      const { data: recordsData, error: recordsError } = await healthRecordOperations.getHealthRecords(user.id);
      if (recordsError) {
        console.error('Error loading health records:', recordsError);
      } else {
        setHealthRecords(recordsData || []);
      }
      
      // Load family members
      const { data: familyData, error: familyError } = await familyOperations.getFamilyMembers(user.id);
      if (familyError) {
        console.error('Error loading family members:', familyError);
      } else {
        setFamilyMembers(familyData || []);
      }
      
      // Load appointments
      const { data: appointmentsData, error: appointmentsError } = await appointmentOperations.getAppointments(user.id);
      if (appointmentsError) {
        console.error('Error loading appointments:', appointmentsError);
      } else {
        setAppointments(appointmentsData || []);
      }
      
    } catch (error) {
      console.error('Error loading health data:', error);
      toast.error('Failed to load health data');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...healthRecords];
    
    if (selectedRecordType) {
      filtered = filtered.filter(record => record.record_type === selectedRecordType);
    }
    
    if (selectedFamilyMember) {
      if (selectedFamilyMember === 'self') {
        filtered = filtered.filter(record => !record.family_member_id);
      } else {
        filtered = filtered.filter(record => record.family_member_id === selectedFamilyMember);
      }
    }
    
    setFilteredRecords(filtered);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const validation = StorageService.validateFile(file, {
      maxSize: MAX_FILE_SIZES.HEALTH_RECORD,
      allowedTypes: ALLOWED_DOCUMENT_TYPES,
    });

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setIsUploading(true);
    try {
      // Upload to storage
      const uploadResult = await StorageService.uploadHealthRecord(file, user.id);
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      // Update form data with file URL
      setFormData(prev => ({ ...prev, file_url: uploadResult.url }));
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      toast.error('Failed to upload file: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data, error } = await healthRecordOperations.addHealthRecord({
        user_id: user.id,
        family_member_id: formData.family_member_id || null,
        record_type: formData.record_type,
        title: formData.title,
        description: formData.description,
        date_recorded: formData.date_recorded,
        doctor_name: formData.doctor_name || null,
        hospital_name: formData.hospital_name || null,
        file_url: (formData as any).file_url || null,
      });

      if (error) throw error;

      setHealthRecords(prev => [data!, ...prev]);
      setShowAddForm(false);
      setFormData({
        record_type: '',
        title: '',
        description: '',
        date_recorded: '',
        doctor_name: '',
        hospital_name: '',
        family_member_id: '',
      });
      toast.success('Health record added successfully!');
    } catch (error: any) {
      toast.error('Failed to add health record: ' + error.message);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      const { error } = await healthRecordOperations.deleteHealthRecord(recordId);
      if (error) throw error;

      setHealthRecords(prev => prev.filter(record => record.id !== recordId));
      toast.success('Health record deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete health record: ' + error.message);
    }
  };

  const getRecordTypeIcon = (type: string) => {
    const recordType = RECORD_TYPES.find(rt => rt.value === type);
    const IconComponent = recordType?.icon || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getRecordTypeLabel = (type: string) => {
    const recordType = RECORD_TYPES.find(rt => rt.value === type);
    return recordType?.label || type;
  };

  const getFamilyMemberName = (familyMemberId: string | null) => {
    if (!familyMemberId) return 'You';
    const member = familyMembers.find(m => m.id === familyMemberId);
    return member?.full_name || 'Unknown';
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-muted-foreground">
            Manage your family's health records, appointments, and medical information.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="records">
              <FileText className="mr-2 h-4 w-4" />
              Health Records
            </TabsTrigger>
            <TabsTrigger value="appointments">
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </TabsTrigger>
          </TabsList>

          {/* Health Records Tab */}
          <TabsContent value="records" className="space-y-6">
            {/* Filters and Add Button */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Health Records</CardTitle>
                    <CardDescription>
                      View and manage health records for you and your family
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <Label htmlFor="record-type-filter">Filter by Type</Label>
                    <Select value={selectedRecordType} onValueChange={setSelectedRecordType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        {RECORD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="family-member-filter">Filter by Person</Label>
                    <Select value={selectedFamilyMember} onValueChange={setSelectedFamilyMember}>
                      <SelectTrigger>
                        <SelectValue placeholder="All family members" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All family members</SelectItem>
                        <SelectItem value="self">You</SelectItem>
                        {familyMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No health records found</p>
                    <Button onClick={() => setShowAddForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Health Record
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecords.map((record) => (
                      <Card key={record.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getRecordTypeIcon(record.record_type)}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{record.title}</p>
                                <p className="text-sm text-muted-foreground">
                                  {getRecordTypeLabel(record.record_type)}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRecord(record.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Patient:</span>
                              <span>{getFamilyMemberName(record.family_member_id)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Date:</span>
                              <span>{new Date(record.date_recorded).toLocaleDateString()}</span>
                            </div>
                            {record.doctor_name && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Doctor:</span>
                                <span>{record.doctor_name}</span>
                              </div>
                            )}
                            {record.description && (
                              <p className="text-muted-foreground text-xs mt-2 line-clamp-2">
                                {record.description}
                              </p>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex space-x-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {record.file_url && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => window.open(record.file_url!, '_blank')}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                File
                              </Button>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Record Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add Health Record</CardTitle>
                  <CardDescription>
                    Add a new health record for you or a family member
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="record_type">Record Type</Label>
                        <Select 
                          value={formData.record_type} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, record_type: value }))}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                          <SelectContent>
                            {RECORD_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="family_member_id">Patient</Label>
                        <Select 
                          value={formData.family_member_id} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, family_member_id: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">You</SelectItem>
                            {familyMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                {member.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g., Annual Physical Exam"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="date_recorded">Date</Label>
                        <Input
                          id="date_recorded"
                          type="date"
                          value={formData.date_recorded}
                          onChange={(e) => setFormData(prev => ({ ...prev, date_recorded: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="doctor_name">Doctor Name</Label>
                        <Input
                          id="doctor_name"
                          value={formData.doctor_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, doctor_name: e.target.value }))}
                          placeholder="Dr. Smith"
                        />
                      </div>
                      <div>
                        <Label htmlFor="hospital_name">Hospital/Clinic</Label>
                        <Input
                          id="hospital_name"
                          value={formData.hospital_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, hospital_name: e.target.value }))}
                          placeholder="City Hospital"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Additional notes about this record..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Attach File (Optional)</Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full"
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 mr-2" />
                        )}
                        {isUploading ? 'Uploading...' : 'Upload File'}
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Add Record
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appointments</CardTitle>
                    <CardDescription>
                      View and manage medical appointments
                    </CardDescription>
                  </div>
                  <Button onClick={() => router.push('/health-records/add-appointment')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No appointments scheduled</p>
                    <Button onClick={() => router.push('/health-records/add-appointment')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Your First Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <Card key={appointment.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                                <Stethoscope className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{appointment.doctor_name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.doctor_specialty}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {appointment.hospital_name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {new Date(appointment.appointment_date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.appointment_time}
                              </p>
                              <Badge 
                                variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                                className="mt-1"
                              >
                                {appointment.status}
                              </Badge>
                            </div>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-4">
                              {appointment.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_DOCUMENT_TYPES.join(',')}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </ProtectedRoute>
  );
}
