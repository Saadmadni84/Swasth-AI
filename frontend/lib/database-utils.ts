import { supabase } from './supabase'
import type {
  Database,
  Profile,
  ProfileInsert,
  ProfileUpdate,
  FamilyMember,
  FamilyMemberInsert,
  FamilyMemberUpdate,
  HealthRecord,
  HealthRecordInsert,
  HealthRecordUpdate,
  Appointment,
  AppointmentInsert,
  AppointmentUpdate,
  HealthInsight,
  HealthInsightInsert,
  HealthInsightUpdate,
  VaultDocument,
  VaultDocumentInsert,
  VaultDocumentUpdate,
  EmergencyContact,
  EmergencyContactInsert,
  EmergencyContactUpdate,
} from './database.types'

// Profile operations
export const profileOperations = {
  // Get user profile
  async getProfile(userId: string): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Create or update profile
  async upsertProfile(profile: ProfileInsert | ProfileUpdate): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile, { onConflict: 'id' })
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update profile
  async updateProfile(userId: string, updates: ProfileUpdate): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}

// Family member operations
export const familyOperations = {
  // Get all family members for a user
  async getFamilyMembers(userId: string): Promise<{ data: FamilyMember[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Add family member
  async addFamilyMember(familyMember: FamilyMemberInsert): Promise<{ data: FamilyMember | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .insert(familyMember)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update family member
  async updateFamilyMember(id: string, updates: FamilyMemberUpdate): Promise<{ data: FamilyMember | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete family member
  async deleteFamilyMember(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id)
      
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }
}

// Health record operations
export const healthRecordOperations = {
  // Get health records for a user
  async getHealthRecords(userId: string, familyMemberId?: string): Promise<{ data: HealthRecord[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('health_records')
        .select('*')
        .eq('user_id', userId)
      
      if (familyMemberId) {
        query = query.eq('family_member_id', familyMemberId)
      }
      
      const { data, error } = await query.order('date_recorded', { ascending: false })
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Add health record
  async addHealthRecord(record: HealthRecordInsert): Promise<{ data: HealthRecord | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .insert(record)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update health record
  async updateHealthRecord(id: string, updates: HealthRecordUpdate): Promise<{ data: HealthRecord | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_records')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete health record
  async deleteHealthRecord(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('health_records')
        .delete()
        .eq('id', id)
      
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }
}

// Appointment operations
export const appointmentOperations = {
  // Get appointments for a user
  async getAppointments(userId: string, status?: string): Promise<{ data: Appointment[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query.order('appointment_date', { ascending: true })
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get upcoming appointments
  async getUpcomingAppointments(userId: string): Promise<{ data: Appointment[] | null; error: Error | null }> {
    try {
      const today = new Date().toISOString().split('T')[0]
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', userId)
        .gte('appointment_date', today)
        .in('status', ['scheduled', 'confirmed'])
        .order('appointment_date', { ascending: true })
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Add appointment
  async addAppointment(appointment: AppointmentInsert): Promise<{ data: Appointment | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert(appointment)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update appointment
  async updateAppointment(id: string, updates: AppointmentUpdate): Promise<{ data: Appointment | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Cancel appointment
  async cancelAppointment(id: string): Promise<{ data: Appointment | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }
}

// Health insight operations
export const insightOperations = {
  // Get insights for a user
  async getInsights(userId: string, isRead?: boolean): Promise<{ data: HealthInsight[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('health_insights')
        .select('*')
        .eq('user_id', userId)
      
      if (isRead !== undefined) {
        query = query.eq('is_read', isRead)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Add insight
  async addInsight(insight: HealthInsightInsert): Promise<{ data: HealthInsight | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_insights')
        .insert(insight)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Mark insight as read
  async markInsightAsRead(id: string): Promise<{ data: HealthInsight | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('health_insights')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete insight
  async deleteInsight(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('health_insights')
        .delete()
        .eq('id', id)
      
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }
}

// File upload utilities
export const fileOperations = {
  // Upload file to Supabase Storage
  async uploadFile(bucket: string, path: string, file: File): Promise<{ data: { path: string } | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file)
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Get file URL
  async getFileUrl(bucket: string, path: string): Promise<{ data: { publicUrl: string } | null; error: Error | null }> {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)
      
      return { data, error: null }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete file
  async deleteFile(bucket: string, path: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path])
      
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }
}

// Vault document operations
export const vaultOperations = {
  // Get vault documents for a user
  async getVaultDocuments(userId: string, documentType?: string): Promise<{ data: VaultDocument[] | null; error: Error | null }> {
    try {
      let query = supabase
        .from('vault_documents')
        .select('*')
        .eq('user_id', userId)
      
      if (documentType) {
        query = query.eq('document_type', documentType)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Add vault document
  async addVaultDocument(document: VaultDocumentInsert): Promise<{ data: VaultDocument | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('vault_documents')
        .insert(document)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update vault document
  async updateVaultDocument(id: string, updates: VaultDocumentUpdate): Promise<{ data: VaultDocument | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('vault_documents')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete vault document
  async deleteVaultDocument(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('vault_documents')
        .delete()
        .eq('id', id)
      
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }
}

// Emergency contact operations
export const emergencyContactOperations = {
  // Get emergency contacts for a user
  async getEmergencyContacts(userId: string): Promise<{ data: EmergencyContact[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false })
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Add emergency contact
  async addEmergencyContact(contact: EmergencyContactInsert): Promise<{ data: EmergencyContact | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert(contact)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Update emergency contact
  async updateEmergencyContact(id: string, updates: EmergencyContactUpdate): Promise<{ data: EmergencyContact | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  },

  // Delete emergency contact
  async deleteEmergencyContact(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id)
      
      return { error }
    } catch (error) {
      return { error: error as Error }
    }
  }
}

// Realtime subscriptions
export const subscriptionOperations = {
  // Subscribe to table changes
  subscribeToTable(table: keyof Database['public']['Tables'], callback: (payload: any) => void, userId?: string) {
    let subscription = supabase.channel(`${table}_changes`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table,
        filter: userId ? `user_id=eq.${userId}` : undefined
      }, callback)
    
    return subscription.subscribe()
  },

  // Unsubscribe from channel
  unsubscribe(channel: any) {
    return supabase.removeChannel(channel)
  }
}