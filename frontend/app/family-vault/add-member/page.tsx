"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { familyOperations } from "@/lib/database-utils";
import { FamilyMemberInsert } from "@/lib/database.types";
import { toast } from "sonner";
import ProtectedRoute from "@/components/protected-route";

export default function AddFamilyMemberPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    relationship: "spouse" as const,
    date_of_birth: "",
    gender: "male" as const,
    blood_group: "",
    phone: "",
    medical_conditions: [] as string[],
    allergies: [] as string[],
    medications: [] as string[]
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const memberData: FamilyMemberInsert = {
        user_id: user.id,
        full_name: formData.full_name,
        relationship: formData.relationship,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender,
        blood_group: formData.blood_group || null,
        phone: formData.phone || null,
        medical_conditions: formData.medical_conditions.length > 0 ? formData.medical_conditions : null,
        allergies: formData.allergies.length > 0 ? formData.allergies : null,
        medications: formData.medications.length > 0 ? formData.medications : null
      };

      const { data, error } = await familyOperations.addFamilyMember(memberData);
      
      if (error) {
        toast.error("Failed to add family member: " + error.message);
        return;
      }

      if (data) {
        toast.success("Family member added successfully!");
        router.push("/family-vault");
      }
    } catch (error: any) {
      toast.error("Failed to add family member: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/family-vault");
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={handleCancel} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>Add Family Member</CardTitle>
                <CardDescription>
                  Add details about your family member to manage their health information.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input 
                    id="full_name" 
                    placeholder="Enter full name" 
                    value={formData.full_name} 
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship *</Label>
                  <Select value={formData.relationship} onValueChange={(value) => handleInputChange('relationship', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="sibling">Sibling</SelectItem>
                      <SelectItem value="grandparent">Grandparent</SelectItem>
                      <SelectItem value="grandchild">Grandchild</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input 
                    id="date_of_birth" 
                    type="date" 
                    value={formData.date_of_birth} 
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="Enter phone number" 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Input 
                    id="allergies" 
                    placeholder="List any allergies (separated by commas)" 
                    value={formData.allergies.join(', ')} 
                    onChange={(e) => handleArrayChange('allergies', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Example: Peanuts, Shellfish, Penicillin
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medical_conditions">Medical Conditions</Label>
                  <Input 
                    id="medical_conditions" 
                    placeholder="List any medical conditions (separated by commas)" 
                    value={formData.medical_conditions.join(', ')} 
                    onChange={(e) => handleArrayChange('medical_conditions', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Example: Diabetes, Hypertension, Asthma
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medications">Current Medications</Label>
                  <Input 
                    id="medications" 
                    placeholder="List current medications (separated by commas)" 
                    value={formData.medications.join(', ')} 
                    onChange={(e) => handleArrayChange('medications', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Example: Metformin 500mg, Lisinopril 10mg
                  </p>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !formData.full_name.trim()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Family Member
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
