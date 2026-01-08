
export interface Patient {
  id: string;
  name: string;
  socialName?: string;
  email: string;
  phone: string;
  birthDate: string;
  sex: 'M' | 'F';
  color?: string;
  maritalStatus?: string;
  birthPlace?: string;
  address: string;
  city?: string;
  state?: string;
  cep?: string;
  profession?: string;
  cpf: string;
  rg: string;
  fatherName: string;
  motherName: string;
  spouseName?: string;
  indication?: string;
  insuranceId: string;
  medicalHistory: string[];
}

export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;
}

export interface Insurance {
  id: string;
  name: string;
  ansCode?: string;
  status: 'Ativo' | 'Inativo';
}

export interface Anamnesis {
  id: string;
  patientId: string;
  date: string;
  complaint: string; // Queixa principal
  history: string;   // HMA
  habits: string;    // Hábitos de vida
}

export interface MedicalReport {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  title: string;
  content: string;
  // Campos de exame integrados
  examName?: string;
  examDate?: string;
  examResult?: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  phone: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Consulta' | 'Retorno' | 'Exame';
  status: 'Agendado' | 'Confirmado' | 'Cancelado' | 'Concluído';
}
