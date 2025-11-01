'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Database, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { vaultOperations, emergencyContactOperations } from '@/lib/database-utils';

interface DatabaseStatus {
  vaultDocuments: boolean;
  emergencyContacts: boolean;
  storageSetup: boolean;
}

export default function DatabaseStatus() {
  const { user } = useAuth();
  const [status, setStatus] = useState<DatabaseStatus>({
    vaultDocuments: false,
    emergencyContacts: false,
    storageSetup: false
  });
  const [isChecking, setIsChecking] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (user) {
      checkDatabaseStatus();
    }
  }, [user]);

  const checkDatabaseStatus = async () => {
    if (!user) return;

    setIsChecking(true);
    const newStatus = { ...status };

    try {
      // Check vault_documents table
      const { error: vaultError } = await vaultOperations.getVaultDocuments(user.id);
      newStatus.vaultDocuments = !vaultError || !vaultError.message?.includes('vault_documents');

      // Check emergency_contacts table
      const { error: contactsError } = await emergencyContactOperations.getEmergencyContacts(user.id);
      newStatus.emergencyContacts = !contactsError || !contactsError.message?.includes('emergency_contacts');

      // Storage setup check (simplified - assume it's set up if tables exist)
      newStatus.storageSetup = newStatus.vaultDocuments;

      setStatus(newStatus);
    } catch (error) {
      console.error('Error checking database status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const allTablesExist = status.vaultDocuments && status.emergencyContacts;

  if (isChecking) {
    return (
      <Alert>
        <Database className="h-4 w-4" />
        <AlertTitle>Checking Database Status...</AlertTitle>
        <AlertDescription>
          Verifying database setup for SwasthAI features.
        </AlertDescription>
      </Alert>
    );
  }

  if (allTablesExist) {
    return (
      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800 dark:text-green-200">Database Ready</AlertTitle>
        <AlertDescription className="text-green-700 dark:text-green-300">
          All required database tables are set up correctly.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <CardTitle className="text-orange-800 dark:text-orange-200">Database Setup Required</CardTitle>
        </div>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          Some database tables are missing. Please complete the setup to use all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium text-orange-800 dark:text-orange-200">Table Status:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Vault Documents</span>
              <Badge variant={status.vaultDocuments ? "default" : "destructive"}>
                {status.vaultDocuments ? "Ready" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Emergency Contacts</span>
              <Badge variant={status.emergencyContacts ? "default" : "destructive"}>
                {status.emergencyContacts ? "Ready" : "Missing"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide" : "Show"} Setup Instructions
          </Button>
          
          {showDetails && (
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border text-sm space-y-3">
              <h5 className="font-medium">Quick Setup Steps:</h5>
              <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>Go to your Supabase Dashboard</li>
                <li>Navigate to SQL Editor</li>
                <li>Copy and run the script from <code>database/missing-tables.sql</code></li>
                <li>Refresh this page to verify setup</li>
              </ol>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open Supabase
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={checkDatabaseStatus}
                >
                  Recheck Status
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
