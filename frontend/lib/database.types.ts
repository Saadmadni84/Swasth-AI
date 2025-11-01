export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          date_of_birth: string | null
          gender: string | null
          blood_group: string | null
          emergency_contact: string | null
          address: string | null
          city: string | null
          state: string | null
          pincode: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          blood_group?: string | null
          emergency_contact?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          date_of_birth?: string | null
          gender?: string | null
          blood_group?: string | null
          emergency_contact?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
        }
        Relationships: []
      }
      family_members: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          full_name: string
          relationship: string
          date_of_birth: string | null
          gender: string | null
          blood_group: string | null
          phone: string | null
          medical_conditions: string[] | null
          allergies: string[] | null
          medications: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          full_name: string
          relationship: string
          date_of_birth?: string | null
          gender?: string | null
          blood_group?: string | null
          phone?: string | null
          medical_conditions?: string[] | null
          allergies?: string[] | null
          medications?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          full_name?: string
          relationship?: string
          date_of_birth?: string | null
          gender?: string | null
          blood_group?: string | null
          phone?: string | null
          medical_conditions?: string[] | null
          allergies?: string[] | null
          medications?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      health_records: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          family_member_id: string | null
          record_type: string
          title: string
          description: string | null
          date_recorded: string
          doctor_name: string | null
          hospital_name: string | null
          file_url: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          family_member_id?: string | null
          record_type: string
          title: string
          description?: string | null
          date_recorded: string
          doctor_name?: string | null
          hospital_name?: string | null
          file_url?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          family_member_id?: string | null
          record_type?: string
          title?: string
          description?: string | null
          date_recorded?: string
          doctor_name?: string | null
          hospital_name?: string | null
          file_url?: string | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "health_records_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          }
        ]
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          family_member_id: string | null
          doctor_name: string
          doctor_specialty: string | null
          hospital_name: string | null
          appointment_date: string
          appointment_time: string
          status: string
          notes: string | null
          reminder_sent: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          family_member_id?: string | null
          doctor_name: string
          doctor_specialty?: string | null
          hospital_name?: string | null
          appointment_date: string
          appointment_time: string
          status?: string
          notes?: string | null
          reminder_sent?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          family_member_id?: string | null
          doctor_name?: string
          doctor_specialty?: string | null
          hospital_name?: string | null
          appointment_date?: string
          appointment_time?: string
          status?: string
          notes?: string | null
          reminder_sent?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          }
        ]
      }
      health_insights: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          insight_type: string
          title: string
          content: string
          data: Json | null
          is_read: boolean
          priority: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          insight_type: string
          title: string
          content: string
          data?: Json | null
          is_read?: boolean
          priority?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          insight_type?: string
          title?: string
          content?: string
          data?: Json | null
          is_read?: boolean
          priority?: string
        }
        Relationships: [
          {
            foreignKeyName: "health_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      vault_documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          family_member_id: string | null
          document_type: string
          title: string
          description: string | null
          file_url: string
          file_name: string
          file_size: number
          mime_type: string
          is_encrypted: boolean
          tags: string[] | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          family_member_id?: string | null
          document_type: string
          title: string
          description?: string | null
          file_url: string
          file_name: string
          file_size: number
          mime_type: string
          is_encrypted?: boolean
          tags?: string[] | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          family_member_id?: string | null
          document_type?: string
          title?: string
          description?: string | null
          file_url?: string
          file_name?: string
          file_size?: number
          mime_type?: string
          is_encrypted?: boolean
          tags?: string[] | null
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "vault_documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vault_documents_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          }
        ]
      }
      emergency_contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          relationship: string
          phone: string
          email: string | null
          address: string | null
          is_primary: boolean
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          relationship: string
          phone: string
          email?: string | null
          address?: string | null
          is_primary?: boolean
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          relationship?: string
          phone?: string
          email?: string | null
          address?: string | null
          is_primary?: boolean
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      record_type: 'prescription' | 'lab_report' | 'diagnosis' | 'vaccination' | 'surgery' | 'other'
      appointment_status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'
      insight_priority: 'low' | 'medium' | 'high' | 'critical'
      gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
      relationship: 'spouse' | 'parent' | 'child' | 'sibling' | 'grandparent' | 'grandchild' | 'other'
      document_type: 'identity' | 'medical' | 'insurance' | 'legal' | 'financial' | 'education' | 'photo' | 'other'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for common operations
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type FamilyMember = Database['public']['Tables']['family_members']['Row']
export type FamilyMemberInsert = Database['public']['Tables']['family_members']['Insert']
export type FamilyMemberUpdate = Database['public']['Tables']['family_members']['Update']

export type HealthRecord = Database['public']['Tables']['health_records']['Row']
export type HealthRecordInsert = Database['public']['Tables']['health_records']['Insert']
export type HealthRecordUpdate = Database['public']['Tables']['health_records']['Update']

export type Appointment = Database['public']['Tables']['appointments']['Row']
export type AppointmentInsert = Database['public']['Tables']['appointments']['Insert']
export type AppointmentUpdate = Database['public']['Tables']['appointments']['Update']

export type HealthInsight = Database['public']['Tables']['health_insights']['Row']
export type HealthInsightInsert = Database['public']['Tables']['health_insights']['Insert']
export type HealthInsightUpdate = Database['public']['Tables']['health_insights']['Update']

export type VaultDocument = Database['public']['Tables']['vault_documents']['Row']
export type VaultDocumentInsert = Database['public']['Tables']['vault_documents']['Insert']
export type VaultDocumentUpdate = Database['public']['Tables']['vault_documents']['Update']

export type EmergencyContact = Database['public']['Tables']['emergency_contacts']['Row']
export type EmergencyContactInsert = Database['public']['Tables']['emergency_contacts']['Insert']
export type EmergencyContactUpdate = Database['public']['Tables']['emergency_contacts']['Update']