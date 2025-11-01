import { NextRequest, NextResponse } from 'next/server';

// This is a simple API route for the profile system
// It currently just returns mock data, but can be extended to use a database

export async function GET() {
  try {
    // For now, return empty profile data
    // In the future, this could fetch from a database
    return NextResponse.json({
      success: true,
      profile: {
        full_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        blood_group: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        emergency_contact: '',
        medical_conditions: '',
        allergies: '',
        medications: ''
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();
    
    // For now, just return the data as saved
    // In the future, this could save to a database
    console.log('Profile data received:', profileData);
    
    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      profile: profileData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const profileData = await request.json();
    
    // For now, just return the data as updated
    // In the future, this could update in a database
    console.log('Profile data updated:', profileData);
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: profileData
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}