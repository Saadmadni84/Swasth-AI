'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth-context';
import { profileOperations } from '@/lib/database-utils';
import { Profile } from '@/lib/database.types';
import { Edit, LogOut, Mail, Phone, MapPin, Calendar, Droplets, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/protected-route';
import FamilyWallet from '@/components/family-wallet';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await profileOperations.getProfile(user.id);
      if (error) {
        console.error('Error loading profile:', error);
        // Profile might not exist yet, that's okay
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      // The auth context will handle the redirect via router.refresh()
      // No need to manually redirect here as it can cause race conditions
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
      // On error, manually redirect to login
      router.push('/auth/login');
    } finally {
      setIsSigningOut(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="lg:col-span-1">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">
                {profile?.full_name || 'Complete your profile'}
              </CardTitle>
              <CardDescription>
                {user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center space-x-2">
                <Button onClick={() => router.push('/profile/edit')} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              
              {profile?.blood_group && (
                <div className="flex items-center justify-center">
                  <Badge variant="secondary" className="flex items-center">
                    <Droplets className="h-3 w-3 mr-1" />
                    {profile.blood_group}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!profile ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Complete your profile to get started
                    </p>
                    <Button onClick={() => router.push('/profile/edit')}>
                      <Edit className="h-4 w-4 mr-2" />
                      Complete Profile
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{profile.email}</p>
                      </div>
                    </div>
                    
                    {profile.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Phone</p>
                          <p className="text-sm text-muted-foreground">{profile.phone}</p>
                        </div>
                      </div>
                    )}
                    
                    {profile.date_of_birth && (
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date of Birth</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(profile.date_of_birth)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {profile.gender && (
                      <div className="flex items-center space-x-3">
                        <div className="h-4 w-4" />
                        <div>
                          <p className="text-sm font-medium">Gender</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {profile.gender.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            {profile && (profile.address || profile.city || profile.state) && (
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <div className="text-sm text-muted-foreground">
                        {profile.address && <p>{profile.address}</p>}
                        <p>
                          {[profile.city, profile.state, profile.pincode]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            {profile?.emergency_contact && (
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="text-sm font-medium">Emergency Contact</p>
                      <p className="text-sm text-muted-foreground">{profile.emergency_contact}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => router.push('/profile/edit')} 
                    variant="outline"
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Separator orientation="vertical" className="hidden sm:block" />
                  <Button 
                    onClick={handleSignOut} 
                    variant="destructive" 
                    disabled={isSigningOut}
                    className="flex-1"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {isSigningOut ? 'Signing out...' : 'Sign Out'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Family Wallet Section */}
        <div className="mt-8">
          <FamilyWallet />
        </div>
      </div>
    </ProtectedRoute>
  );
}