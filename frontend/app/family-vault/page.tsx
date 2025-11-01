'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { familyOperations, vaultOperations, emergencyContactOperations } from '@/lib/database-utils';
import { StorageService, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZES } from '@/lib/storage';
import { FamilyMember, VaultDocument, EmergencyContact } from '@/lib/database.types';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Eye,
  Phone,
  AlertTriangle,
  Calendar,
  Droplets,
  Plus,
  Folder,
  Image as ImageIcon,
  FileIcon,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/protected-route';
import DatabaseStatus from '@/components/database-status';

export default function FamilyVault() {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeTab, setActiveTab] = useState('family');
  const [isLoading, setIsLoading] = useState(true);
  
  // Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  
  // Documents
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  
  // Emergency Contacts
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load family members
      const { data: familyData, error: familyError } = await familyOperations.getFamilyMembers(user.id);
      if (familyError) {
        console.error('Error loading family members:', familyError);
      } else {
        setFamilyMembers(familyData || []);
      }
      
      // Load vault documents
      try {
        const { data: documentsData, error: documentsError } = await vaultOperations.getVaultDocuments(user.id);
        if (documentsError) {
          console.error('Error loading documents:', documentsError);
          // If table doesn't exist, show a helpful message
          if (documentsError.message?.includes('vault_documents')) {
            toast.error('Database setup required. Please check DATABASE-SETUP.md');
          }
        } else {
          setDocuments(documentsData || []);
        }
      } catch (error) {
        console.error('Failed to load documents:', error);
        setDocuments([]);
      }
      
      // Load emergency contacts
      try {
        const { data: contactsData, error: contactsError } = await emergencyContactOperations.getEmergencyContacts(user.id);
        if (contactsError) {
          console.error('Error loading emergency contacts:', contactsError);
          // If table doesn't exist, show a helpful message
          if (contactsError.message?.includes('emergency_contacts')) {
            toast.error('Database setup required. Please check DATABASE-SETUP.md');
          }
        } else {
          setEmergencyContacts(contactsData || []);
        }
      } catch (error) {
        console.error('Failed to load emergency contacts:', error);
        setEmergencyContacts([]);
      }
      
    } catch (error) {
      console.error('Error loading vault data:', error);
      toast.error('Failed to load vault data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    const validation = StorageService.validateFile(file, {
      maxSize: MAX_FILE_SIZES.DOCUMENT,
      allowedTypes: ALLOWED_DOCUMENT_TYPES,
    });

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (!selectedDocumentType) {
      toast.error('Please select a document type');
      return;
    }

    setIsUploading(true);
    try {
      // Upload to storage
      const uploadResult = await StorageService.uploadDocument(file, user.id, selectedDocumentType);
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      // Save document metadata to database
      const { data, error } = await vaultOperations.addVaultDocument({
        user_id: user.id,
        document_type: selectedDocumentType,
        title: file.name,
        file_url: uploadResult.url,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        is_encrypted: false,
      });

      if (error) throw error;

      setDocuments(prev => [...prev, data!]);
      toast.success('Document uploaded successfully!');
      setSelectedDocumentType('');
    } catch (error: any) {
      toast.error('Failed to upload document: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      const { error } = await vaultOperations.deleteVaultDocument(documentId);
      if (error) throw error;

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      toast.success('Document deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete document: ' + error.message);
    }
  };

  const getRelationLabel = (relation: string) => {
    const labels: Record<string, string> = {
      spouse: 'Spouse',
      child: 'Child',
      parent: 'Parent',
      sibling: 'Sibling',
      grandparent: 'Grandparent',
      grandchild: 'Grandchild',
      other: 'Family Member'
    };
    return labels[relation] || 'Family Member';
  };
  
  const calculateAge = (dob: string | null) => {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (mimeType === 'application/pdf') return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          <h1 className="text-3xl font-bold">Family Vault</h1>
          <p className="text-muted-foreground">
            Securely store and manage your family's important documents and information.
          </p>
        </div>

        <div className="mb-6">
          <DatabaseStatus />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="family">
              <Users className="mr-2 h-4 w-4" />
              Family Members
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="mr-2 h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="contacts">
              <Phone className="mr-2 h-4 w-4" />
              Emergency Contacts
            </TabsTrigger>
          </TabsList>

          {/* Family Members Tab */}
          <TabsContent value="family" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Family Members</CardTitle>
                    <CardDescription>
                      Manage your family members and their health information
                    </CardDescription>
                  </div>
                  <Button onClick={() => router.push('/family-vault/add-member')}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {familyMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No family members added yet</p>
                    <Button onClick={() => router.push('/family-vault/add-member')}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Your First Family Member
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {familyMembers.map((member) => (
                      <Card key={member.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.full_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{member.full_name}</CardTitle>
                              <CardDescription>
                                {getRelationLabel(member.relationship)} • {calculateAge(member.date_of_birth)} years
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            {member.blood_group && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Blood Group:</span>
                                <Badge variant="secondary" className="flex items-center">
                                  <Droplets className="h-3 w-3 mr-1" />
                                  {member.blood_group}
                                </Badge>
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Phone:</span>
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex space-x-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Document Vault</CardTitle>
                    <CardDescription>
                      Upload and manage important family documents
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="identity">Identity Documents</SelectItem>
                        <SelectItem value="medical">Medical Records</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="legal">Legal Documents</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="photo">Photos</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || !selectedDocumentType}
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {isUploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No documents uploaded yet</p>
                    <p className="text-sm text-muted-foreground">
                      Select a document type and upload your first document
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <Card key={doc.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(doc.mime_type)}
                              <div className="min-w-0 flex-1">
                                <p className="font-medium truncate">{doc.title}</p>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {doc.document_type.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Size: {formatFileSize(doc.file_size)}</p>
                            <p>Uploaded: {new Date(doc.created_at).toLocaleDateString()}</p>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex space-x-2 w-full">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => window.open(doc.file_url, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => window.open(doc.file_url, '_blank')}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>
                      Manage emergency contacts for your family
                    </CardDescription>
                  </div>
                  <Button onClick={() => router.push('/family-vault/add-contact')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {emergencyContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No emergency contacts added yet</p>
                    <Button onClick={() => router.push('/family-vault/add-contact')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Emergency Contact
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {emergencyContacts.map((contact) => (
                      <Card key={contact.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">{contact.name}</CardTitle>
                              <CardDescription className="capitalize">
                                {contact.relationship}
                                {contact.is_primary && (
                                  <Badge variant="default" className="ml-2">Primary</Badge>
                                )}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.phone}</span>
                            </div>
                            {contact.email && (
                              <div className="flex items-center space-x-2">
                                <span className="text-muted-foreground">Email:</span>
                                <span>{contact.email}</span>
                              </div>
                            )}
                            {contact.address && (
                              <div className="flex items-start space-x-2">
                                <span className="text-muted-foreground">Address:</span>
                                <span className="flex-1">{contact.address}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="flex space-x-2 w-full">
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                          </div>
                        </CardFooter>
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
