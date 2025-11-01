"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { emergencyContactOperations } from "@/lib/database-utils";
import { EmergencyContactInsert } from "@/lib/database.types";
import { toast } from "sonner";
import ProtectedRoute from "@/components/protected-route";

export default function AddEmergencyContactPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "family" as const,
    phone: "",
    email: "",
    address: "",
    is_primary: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const contactData: EmergencyContactInsert = {
        user_id: user.id,
        name: formData.name,
        relationship: formData.relationship,
        phone: formData.phone,
        email: formData.email || null,
        address: formData.address || null,
        is_primary: formData.is_primary
      };

      const { data, error } = await emergencyContactOperations.addEmergencyContact(contactData);
      
      if (error) {
        toast.error("Failed to add emergency contact: " + error.message);
        return;
      }

      if (data) {
        toast.success("Emergency contact added successfully!");
        router.push("/family-vault");
      }
    } catch (error: any) {
      toast.error("Failed to add emergency contact: " + error.message);
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
                <CardTitle>Add Emergency Contact</CardTitle>
                <CardDescription>
                  Add an emergency contact for your family's safety and security.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter full name" 
                    value={formData.name} 
                    onChange={(e) => handleInputChange('name', e.target.value)}
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
                      <SelectItem value="family">Family Member</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="neighbor">Neighbor</SelectItem>
                      <SelectItem value="colleague">Colleague</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    placeholder="Enter phone number" 
                    value={formData.phone} 
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="Enter email address" 
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  placeholder="Enter full address" 
                  value={formData.address} 
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Include street address, city, state, and postal code
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_primary" 
                  checked={formData.is_primary}
                  onCheckedChange={(checked) => handleInputChange('is_primary', checked as boolean)}
                />
                <Label htmlFor="is_primary" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Set as primary emergency contact
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Primary contacts will be contacted first in case of emergencies
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !formData.name.trim() || !formData.phone.trim()}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Emergency Contact
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
