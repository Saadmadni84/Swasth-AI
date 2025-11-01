

# SwasthAI - Supabase Integration Guide

This guide will help you set up Supabase database integration for your SwasthAI healthcare management application.

## 🚀 Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account or sign in
2. Click on "New Project"
3. Choose your organization and fill in project details:
   - **Project Name**: SwasthAI
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to be set up (this may take a few minutes)

### 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Key (anon public)**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure Environment Variables

1. Open your `.env` file in the SwasthAI project root
2. Replace the placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Copy the entire contents of `database/schema.sql` file
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema creation

This will create:
- All necessary tables (profiles, family_members, health_records, appointments, health_insights)
- Row Level Security (RLS) policies
- Database triggers and functions
- Storage bucket for health documents

### 5. Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Enable email authentication (it's enabled by default)

### 6. Install Dependencies and Run

The required dependencies are already installed. Just run the development server:

```bash
npm run dev
```

## 📋 Features Included

### Authentication
- User registration and login
- Email verification
- Password reset functionality
- Protected routes with middleware

### Database Operations
- **Profiles**: User profile management
- **Family Members**: Add and manage family members
- **Health Records**: Store medical documents and records
- **Appointments**: Schedule and manage doctor appointments
- **Health Insights**: AI-generated health recommendations
- **File Storage**: Secure storage for medical documents

### UI Components
- Dashboard with data visualization
- Sample data creation for testing
- Responsive design with Tailwind CSS
- Accessible UI components using Radix UI

## 🔒 Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Secure File Storage**: Files are stored with proper access controls
- **Authentication Middleware**: Protects sensitive routes
- **Data Validation**: Type-safe database operations

## 📱 Usage Examples

### Creating a Profile
```typescript
import { profileOperations } from '@/lib/database-utils'

const { data, error } = await profileOperations.upsertProfile({
  id: user.id,
  email: user.email,
  full_name: 'Shahzad khan',
  phone: '+1234567890',
  // ... other profile data
})
```

### Adding a Family Member
```typescript
import { familyOperations } from '@/lib/database-utils'

const { data, error } = await familyOperations.addFamilyMember({
  user_id: user.id,
  full_name: 'Sania',
  relationship: 'spouse',
  blood_group: 'A+',
  // ... other member data
})
```

### Scheduling an Appointment
```typescript
import { appointmentOperations } from '@/lib/database-utils'

const { data, error } = await appointmentOperations.addAppointment({
  user_id: user.id,
  doctor_name: 'Dr. Smith',
  doctor_specialty: 'Cardiologist',
  appointment_date: '2024-01-15',
  appointment_time: '10:00',
  status: 'scheduled'
})
```

## 🎯 Testing the Integration

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000`
3. Create a new account or sign in
4. Visit the dashboard at: `http://localhost:3000/dashboard`
5. Test the sample data creation buttons to verify database connectivity

## 🛠️ Troubleshooting

### Common Issues

**Environment Variables Not Loading:**
- Restart your development server after updating `.env`
- Ensure environment variables don't have extra spaces or quotes

**Database Connection Issues:**
- Verify your Supabase URL and API key are correct
- Check that your Supabase project is active and not paused

**Authentication Problems:**
- Confirm email authentication is enabled in Supabase
- Check that redirect URLs are configured correctly

**RLS Policy Issues:**
- Ensure the database schema was created correctly
- Check that RLS policies are enabled for all tables

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Review the Supabase dashboard logs
3. Verify your environment variables are set correctly
4. Ensure the database schema was created successfully

## 📚 Next Steps

1. **Customize the Schema**: Modify `database/schema.sql` to add more fields as needed
2. **Add More Features**: Extend the database utils with additional operations
3. **Implement File Upload**: Use the file operations for document storage
4. **Add Real-time Features**: Use Supabase's real-time subscriptions
5. **Deploy to Production**: Configure production environment variables

## 🔗 Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

Your SwasthAI application is now fully integrated with Supabase! 🎉