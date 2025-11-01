// API client for the health scheduler backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  upcomingEvents?: {
    title: string;
    date: string;
  }[];
}

export interface Notification {
  id: string;
  memberId: string;
  memberName: string;
  eventTitle: string;
  eventDate: string;
  daysUntil: number;
  notifiedAt: string;
  status: 'pending' | 'sent';
}

// Family member API functions
export async function getFamilyMembers(): Promise<FamilyMember[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/family-members`);
    if (!response.ok) {
      throw new Error('Failed to fetch family members');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching family members:', error);
    return [];
  }
}

export async function addFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/family-members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add family member');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding family member:', error);
    return null;
  }
}

export async function updateFamilyMember(member: FamilyMember): Promise<FamilyMember | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/family-members/${member.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(member),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update family member');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating family member:', error);
    return null;
  }
}

export async function deleteFamilyMember(memberId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/family-members/${memberId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete family member');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting family member:', error);
    return false;
  }
}

// Notification API functions
export async function getNotifications(): Promise<Notification[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
}