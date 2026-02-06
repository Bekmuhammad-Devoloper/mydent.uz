import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ─── Regions ────────────────────────────────────────
export const getRegions = () => api.get('/admin/regions');
export const createRegion = (data: { nameUz: string; nameRu: string }) => api.post('/admin/regions', data);
export const updateRegion = (id: string, data: { nameUz?: string; nameRu?: string }) => api.put(`/admin/regions/${id}`, data);
export const deleteRegion = (id: string) => api.delete(`/admin/regions/${id}`);

// ─── Clinics ────────────────────────────────────────
export const getClinics = () => api.get('/admin/clinics');
export const getClinicsByRegion = (regionId: string) => api.get(`/clinics/by-region/${regionId}`);
export const getClinic = (id: string) => api.get(`/admin/clinics/${id}`);
export const createClinic = (data: any) => api.post('/admin/clinics', data);
export const updateClinic = (id: string, data: any) => api.put(`/admin/clinics/${id}`, data);
export const deleteClinic = (id: string) => api.delete(`/admin/clinics/${id}`);
export const getClinicSpecialties = (clinicId: string) => api.get(`/clinics/${clinicId}/specialties`);

// ─── Owners ─────────────────────────────────────────
export const getOwners = () => api.get('/admin/owners');
export const getOwner = (id: string) => api.get(`/admin/owners/${id}`);
export const createOwner = (data: { phone: string; password: string; clinicId: string }) => api.post('/admin/owners', data);
export const updateOwner = (id: string, data: any) => api.put(`/admin/owners/${id}`, data);
export const deleteOwner = (id: string) => api.delete(`/admin/owners/${id}`);

// ─── Specialties (Founder) ──────────────────────────
export const getSpecialties = () => api.get('/admin/specialties');
export const createSpecialty = (data: { nameUz: string; nameRu: string }) => api.post('/admin/specialties', data);
export const updateSpecialty = (id: string, data: { nameUz?: string; nameRu?: string }) => api.put(`/admin/specialties/${id}`, data);
export const deleteSpecialty = (id: string) => api.delete(`/admin/specialties/${id}`);

// ─── Doctors (Admin) ────────────────────────────────
export const getDoctors = () => api.get('/admin/doctors');
export const getDoctorsByClinic = (clinicId: string) => api.get(`/admin/doctors/by-clinic/${clinicId}`);
export const getDoctor = (id: string) => api.get(`/admin/doctors/${id}`);
export const createDoctor = (data: any) => api.post('/admin/doctors', data);
export const updateDoctor = (id: string, data: any) => api.put(`/admin/doctors/${id}`, data);
export const deleteDoctor = (id: string) => api.delete(`/admin/doctors/${id}`);

// ─── Clinic Stats (Owner) ───────────────────────────
export const getClinicStats = (clinicId: string) => api.get(`/admin/clinic-stats/${clinicId}`);

// ─── Doctors (Public) ───────────────────────────────
export const getDoctorsByClinicAndSpecialty = (clinicId: string, specialty: string) =>
  api.get(`/doctors/by-clinic/${clinicId}?specialty=${encodeURIComponent(specialty)}`);
export const getDoctorDetail = (id: string) => api.get(`/doctors/${id}`);
export const getDoctorSlots = (id: string, date: string) => api.get(`/doctors/${id}/slots?date=${date}`);

// ─── Auth ───────────────────────────────────────────
export const loginFounder = (phone: string, password: string) =>
  api.post('/admin/login/founder', { phone, password });
export const loginOwner = (phone: string, password: string) =>
  api.post('/admin/login/owner', { phone, password });
export const loginDoctor = (phone: string, password: string) =>
  api.post('/doctor-panel/login', { phone, password });

// ─── Users ──────────────────────────────────────────
export const createUser = (data: any) => api.post('/users/register', data);
export const registerUser = (data: any) => api.post('/users/register', data);
export const getUserByPhone = (phone: string) => api.get(`/users/by-phone/${phone}`);
export const getUserAppointments = (userId: string) => api.get(`/users/${userId}/appointments`);
export const getUserDiagnoses = (userId: string) => api.get(`/users/${userId}/diagnoses`);
export const cancelUserAppointment = (userId: string, appointmentId: string) =>
  api.put(`/users/${userId}/appointments/${appointmentId}/cancel`);

// ─── Appointments ───────────────────────────────────
export const createAppointment = (data: any) => api.post('/appointments', data);

// ─── Doctor Panel ───────────────────────────────────
export const getDoctorAppointments = (doctorId: string, date?: string) =>
  api.get(`/doctor-panel/${doctorId}/appointments${date ? `?date=${date}` : ''}`);
export const updateAppointmentStatus = (doctorId: string, appointmentId: string, data: any) =>
  api.put(`/doctor-panel/${doctorId}/appointments/${appointmentId}/status`, data);
export const cancelDoctorAppointment = (doctorId: string, appointmentId: string) =>
  api.put(`/doctor-panel/${doctorId}/appointments/${appointmentId}/cancel`);
export const createManualAppointment = (doctorId: string, data: any) =>
  api.post(`/doctor-panel/${doctorId}/appointments/manual`, data);
export const getDoctorSchedule = (doctorId: string) => api.get(`/doctor-panel/${doctorId}/schedule`);
export const upsertDoctorSchedule = (doctorId: string, dayOfWeek: number, data: { startTime: string; endTime: string }) =>
  api.put(`/doctor-panel/${doctorId}/schedule/${dayOfWeek}`, data);
export const deleteDoctorScheduleDay = (doctorId: string, dayOfWeek: number) =>
  api.delete(`/doctor-panel/${doctorId}/schedule/${dayOfWeek}`);
export const getDoctorTimeOffs = (doctorId: string) => api.get(`/doctor-panel/${doctorId}/timeoffs`);
export const createDoctorTimeOff = (doctorId: string, data: any) =>
  api.post(`/doctor-panel/${doctorId}/timeoffs`, data);
export const deleteDoctorTimeOff = (doctorId: string, timeOffId: string) =>
  api.delete(`/doctor-panel/${doctorId}/timeoffs/${timeOffId}`);
export const getDoctorSettings = (doctorId: string) => api.get(`/doctor-panel/${doctorId}/settings`);
export const updateDoctorSettings = (doctorId: string, data: { price?: number; avgServiceMin?: number }) =>
  api.put(`/doctor-panel/${doctorId}/settings`, data);
export const getDoctorPanelSlots = (doctorId: string, date: string) =>
  api.get(`/doctor-panel/${doctorId}/slots?date=${date}`);

export default api;
