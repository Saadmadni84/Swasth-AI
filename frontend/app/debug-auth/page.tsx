'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugAuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<any>(null);

  const testDirectSignIn = async () => {
    console.log('=== Direct Supabase Sign In Test ===');
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('Direct sign in result:', result);
      setResult(result);
      
      // Also test getting session immediately after
      const sessionResult = await supabase.auth.getSession();
      console.log('Session after sign in:', sessionResult);
      
    } catch (error) {
      console.error('Direct sign in error:', error);
      setResult({ error });
    }
  };

  const testGetSession = async () => {
    console.log('=== Get Current Session Test ===');
    try {
      const result = await supabase.auth.getSession();
      console.log('Current session:', result);
      setResult(result);
    } catch (error) {
      console.error('Get session error:', error);
      setResult({ error });
    }
  };

  const testSignOut = async () => {
    console.log('=== Sign Out Test ===');
    try {
      const result = await supabase.auth.signOut();
      console.log('Sign out result:', result);
      setResult(result);
    } catch (error) {
      console.error('Sign out error:', error);
      setResult({ error });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testDirectSignIn}>
              Test Direct Sign In
            </Button>
            <Button onClick={testGetSession} variant="outline">
              Get Current Session
            </Button>
            <Button onClick={testSignOut} variant="destructive">
              Sign Out
            </Button>
          </div>
          
          {result && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Instructions:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Enter your email and password</li>
              <li>Click "Test Direct Sign In" to test authentication</li>
              <li>Check the browser console for detailed logs</li>
              <li>Check the result below for the response</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
