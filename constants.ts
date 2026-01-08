
import { Patient, Appointment, Doctor, Insurance, MedicalReport } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Roberto Santos', crm: '12345-SP', specialty: 'Cardiologia', phone: '(11) 91111-2222', email: 'roberto@clinica.com' },
  { id: 'd2', name: 'Dra. Maria Clara', crm: '67890-SP', specialty: 'Dermatologia', phone: '(11) 92222-3333', email: 'maria@clinica.com' }
];

export const MOCK_INSURANCES: Insurance[] = [
  { id: 'i1', name: 'Unimed', ansCode: '456789', status: 'Ativo' },
  { id: 'i2', name: 'Bradesco Saúde', ansCode: '123123', status: 'Ativo' },
  { id: 'i3', name: 'SulAmérica', ansCode: '999888', status: 'Inativo' }
];

export const MOCK_REPORTS: MedicalReport[] = [
  { id: 'r1', patientId: '1', doctorId: 'd1', date: '2024-05-15', title: 'Eletrocardiograma de Repouso', content: 'Ritmo sinusal regular, sem alterações de repolarização.' }
];

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'JULIA DE MIRANDA',
    socialName: 'Ricardo',
    email: 'comercial@pes.com.br',
    phone: '(11) 3286-5300',
    birthDate: '1977-04-04',
    sex: 'F',
    color: 'Branca',
    maritalStatus: 'Casado(a)',
    birthPlace: 'São Paulo',
    address: 'Rua 1 de Junho, Jardim Gaivotas',
    city: 'São Paulo',
    state: 'SP',
    cep: '04849-307',
    profession: 'Professor(a)',
    medicalHistory: ['Hipertensão'],
    cpf: '333.444.555-67',
    rg: '12.345.678-9',
    fatherName: 'Carlos Miranda',
    motherName: 'Laura Miranda',
    spouseName: 'Daniel Souza',
    indication: 'Juliana Miranda',
    insuranceId: 'i1'
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '101',
    patientId: '1',
    patientName: 'JULIA DE MIRANDA',
    phone: '(11) 3286-5300',
    doctorName: 'Dr. Roberto Santos',
    date: '2024-05-20',
    time: '09:00',
    type: 'Consulta',
    status: 'Confirmado'
  }
];

export const FINANCIAL_DATA = [
  { name: 'Jan', value: 45000 },
  { name: 'Fev', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Abr', value: 61000 },
  { name: 'Mai', value: 55000 }
];
