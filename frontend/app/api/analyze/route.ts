import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface PatientInfo {
  name?: string;
  age?: string;
  gender?: string;
  date?: string;
  [key: string]: string | undefined;
}

interface TestResult {
  test: string;
  value: string;
  unit?: string;
  range?: string;
  status?: 'normal' | 'high' | 'low';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // TODO: In production, integrate with actual OCR service
    // For now, return mock data for demonstration
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock response data
    const mockPatientInfo: PatientInfo = {
      name: 'John Doe',
      age: '45 years',
      gender: 'Male',
      date: new Date().toLocaleDateString(),
      'Patient ID': 'MED-2025-001',
      'Report Date': new Date().toLocaleDateString()
    };

    const mockTestResults: TestResult[] = [
      {
        test: 'Blood Glucose (Fasting)',
        value: '95',
        unit: 'mg/dL',
        range: '70-100 mg/dL',
        status: 'normal'
      },
      {
        test: 'Total Cholesterol',
        value: '220',
        unit: 'mg/dL',
        range: '<200 mg/dL',
        status: 'high'
      },
      {
        test: 'HDL Cholesterol',
        value: '45',
        unit: 'mg/dL',
        range: '>40 mg/dL',
        status: 'normal'
      },
      {
        test: 'LDL Cholesterol',
        value: '145',
        unit: 'mg/dL',
        range: '<100 mg/dL',
        status: 'high'
      },
      {
        test: 'Triglycerides',
        value: '150',
        unit: 'mg/dL',
        range: '<150 mg/dL',
        status: 'normal'
      },
      {
        test: 'Hemoglobin A1C',
        value: '5.4',
        unit: '%',
        range: '<5.7%',
        status: 'normal'
      },
      {
        test: 'Blood Pressure',
        value: '130/85',
        unit: 'mmHg',
        range: '<120/80 mmHg',
        status: 'high'
      }
    ];

    const mockSummary = `Based on the medical report analysis:

The patient's blood glucose and HbA1c levels are within normal range, indicating good blood sugar control. However, attention is needed for cardiovascular health markers:

• Total Cholesterol is elevated at 220 mg/dL (optimal: <200 mg/dL)
• LDL Cholesterol is high at 145 mg/dL (optimal: <100 mg/dL)
• Blood Pressure is slightly elevated at 130/85 mmHg

Recommendations:
1. Consider lifestyle modifications including diet and exercise
2. Monitor cholesterol levels regularly
3. Follow up with healthcare provider for potential medication adjustment
4. Maintain current blood sugar management strategies

Note: This is an AI-generated analysis and should not replace professional medical advice. Please consult with your healthcare provider for personalized recommendations.`;

    const response = {
      success: true,
      patientInfo: mockPatientInfo,
      testResults: mockTestResults,
      summary: mockSummary
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error processing medical report:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while processing the report',
        patientInfo: {},
        testResults: [],
        summary: ''
      },
      { status: 500 }
    );
  }
}
