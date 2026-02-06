'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAuthStore } from '../../lib/store';
import {
  loginDoctor,
  getDoctorAppointments, updateAppointmentStatus, cancelDoctorAppointment,
  createManualAppointment, getDoctorSchedule, upsertDoctorSchedule,
  deleteDoctorScheduleDay, getDoctorTimeOffs, createDoctorTimeOff,
  deleteDoctorTimeOff, getDoctorSettings, updateDoctorSettings,
  getDoctorPanelSlots,
} from '../../lib/api';
import {
  Stethoscope, ClipboardList, UserPlus, CalendarDays, Umbrella,
  Settings, Phone, Clock, Check, X, Pencil, Trash2, LogOut,
  CheckCircle, Calendar, Eye, EyeOff, AlertCircle, XCircle, Plus,
  FileText, Pill, Banknote,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* ════════════════════════ LOGIN ════════════════════════ */
function DoctorLogin({ onLogin }: { onLogin: (d: any) => void }) {
  const [phone, setPhone] = useState('+998');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePhone = (val: string) => {
    let v = val.replace(/[^0-9+]/g, '');
    if (!v.startsWith('+998')) v = '+998';
    if (v.length > 13) v = v.slice(0, 13);
    setPhone(v);
  };

  const submit = async () => {
    if (phone.length !== 13) return toast.error("To'g'ri telefon raqam kiriting: +998XXXXXXXXX");
    if (!password) return toast.error('Parolni kiriting');
    setLoading(true);
    try {
      const { data } = await loginDoctor(phone, password);
      toast.success('Xush kelibsiz!');
      onLogin(data);
    } catch {
      toast.error('Login yoki parol xato');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Shifokor Panel</h1>
        <p className="text-gray-500 text-center mb-6">Tizimga kirish</p>
        <div className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input value={phone} onChange={(e) => handlePhone(e.target.value)} placeholder="+998XXXXXXXXX" className="input pl-11" />
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
              className="input pr-11"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400" title="Toggle password">
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button onClick={submit} disabled={loading} className="btn-primary w-full">
            {loading ? 'Kuting...' : 'Kirish'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ APPOINTMENTS TAB ════════════════════════ */
function AppointmentsTab({ doctor }: { doctor: any }) {
  const [list, setList] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  /* ── Complete modal state ── */
  const [completeModal, setCompleteModal] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [completing, setCompleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const { data } = await getDoctorAppointments(doctor.id, date); setList(data); }
    catch { toast.error('Xatolik'); }
    setLoading(false);
  }, [doctor.id, date]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (appId: string, status: string) => {
    try {
      await updateAppointmentStatus(doctor.id, appId, { status });
      toast.success('Holat yangilandi');
      load();
    } catch { toast.error('Xatolik'); }
  };

  const cancel = async (appId: string) => {
    if (!confirm("Bekor qilinsinmi?")) return;
    try { await cancelDoctorAppointment(doctor.id, appId); toast.success('Bekor qilindi'); load(); }
    catch { toast.error('Xatolik'); }
  };

  const openCompleteModal = (appointment: any) => {
    setCompleteModal(appointment);
    setDiagnosis(appointment.diagnosis?.description || '');
    setPrescription(appointment.diagnosis?.prescription || '');
    setFinalPrice(appointment.finalPrice?.toString() || doctor.price?.toString() || '');
  };

  const submitComplete = async () => {
    if (!diagnosis.trim()) return toast.error("Tashxisni kiriting");
    setCompleting(true);
    try {
      await updateAppointmentStatus(doctor.id, completeModal.id, {
        status: 'COMPLETED',
        diagnosis: diagnosis.trim(),
        prescription: prescription.trim() || undefined,
        finalPrice: finalPrice ? parseInt(finalPrice) : undefined,
      });
      toast.success('Qabul tugallandi');
      setCompleteModal(null);
      setDiagnosis('');
      setPrescription('');
      setFinalPrice('');
      load();
    } catch { toast.error('Xatolik'); }
    setCompleting(false);
  };

  const statusBadge = (s: string) => {
    const map: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
      PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle className="w-3 h-3" />, label: 'Kutilmoqda' },
      ACCEPTED: { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-3 h-3" />, label: 'Qabul qilindi' },
      COMPLETED: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" />, label: 'Tugallandi' },
      CANCELLED: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" />, label: 'Bekor qilingan' },
    };
    const b = map[s] || map.PENDING;
    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${b.color}`}>{b.icon} {b.label}</span>;
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" /> Navbatlar
        </h2>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input max-w-[180px] ml-auto" title="Sana" />
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-8">Yuklanmoqda...</p>
      ) : (
        <div className="space-y-3">
          {list.map((a: any) => (
            <div key={a.id} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-gray-800">
                    {a.user ? `${a.user.firstName || ''} ${a.user.lastName || ''}` : a.patientName || 'Noma\'lum'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> {a.startTime} - {a.endTime}
                    {a.patientPhone && <><Phone className="w-3 h-3 ml-2" /> {a.patientPhone}</>}
                  </div>
                </div>
                {statusBadge(a.status)}
              </div>

              {/* Show diagnosis info for completed */}
              {a.status === 'COMPLETED' && a.diagnosis && (
                <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200 space-y-1">
                  <p className="text-sm text-green-800"><FileText className="w-3.5 h-3.5 inline mr-1" /><strong>Tashxis:</strong> {a.diagnosis.description}</p>
                  {a.diagnosis.prescription && (
                    <p className="text-sm text-green-700"><Pill className="w-3.5 h-3.5 inline mr-1" /><strong>Dorilar:</strong> {a.diagnosis.prescription}</p>
                  )}
                  {a.finalPrice != null && (
                    <p className="text-sm text-green-700"><Banknote className="w-3.5 h-3.5 inline mr-1" /><strong>Narx:</strong> {a.finalPrice.toLocaleString()} so&apos;m</p>
                  )}
                </div>
              )}

              {/* Action buttons */}
              {a.status === 'PENDING' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => changeStatus(a.id, 'ACCEPTED')} className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition" title="Qabul qilish">
                    <Check className="w-4 h-4" /> Qabul
                  </button>
                  <button onClick={() => cancel(a.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition" title="Bekor qilish">
                    <X className="w-4 h-4" /> Bekor
                  </button>
                </div>
              )}
              {a.status === 'ACCEPTED' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openCompleteModal(a)} className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition" title="Tugatish">
                    <CheckCircle className="w-4 h-4" /> Tugatish
                  </button>
                  <button onClick={() => cancel(a.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition" title="Bekor qilish">
                    <X className="w-4 h-4" /> Bekor
                  </button>
                </div>
              )}
            </div>
          ))}
          {list.length === 0 && <p className="text-gray-400 text-center py-8">Bu sanada navbatlar yo&#39;q</p>}
        </div>
      )}

      {/* ═══ COMPLETE MODAL ═══ */}
      {completeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setCompleteModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" /> Qabulni tugatish
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Bemor: <strong>{completeModal.user ? `${completeModal.user.firstName || ''} ${completeModal.user.lastName || ''}` : completeModal.patientName || "Noma'lum"}</strong>
              {' · '}{completeModal.startTime} - {completeModal.endTime}
            </p>

            <div className="space-y-4">
              {/* Diagnosis */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FileText className="w-4 h-4 text-blue-500" /> Tashxis <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Masalan: ARVI, Bronxit ..."
                  rows={3}
                  className="input w-full resize-none"
                />
              </div>

              {/* Prescription */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Pill className="w-4 h-4 text-purple-500" /> Dorilar (ixtiyoriy)
                </label>
                <textarea
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="Masalan: Paracetamol 500mg — kuniga 3 mahal, 5 kun"
                  rows={3}
                  className="input w-full resize-none"
                />
              </div>

              {/* Final Price */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Banknote className="w-4 h-4 text-green-500" /> Qabul narxi (so&apos;m)
                </label>
                <input
                  type="number"
                  value={finalPrice}
                  onChange={(e) => setFinalPrice(e.target.value)}
                  placeholder={`Standart: ${doctor.price?.toLocaleString() || 0}`}
                  min="0"
                  className="input w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setCompleteModal(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition font-medium">
                Bekor qilish
              </button>
              <button onClick={submitComplete} disabled={completing} className="flex-1 py-2.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium disabled:opacity-50">
                {completing ? 'Saqlanmoqda...' : 'Tasdiqlash'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════ ADD PATIENT TAB ════════════════════════ */
function AddPatientTab({ doctor }: { doctor: any }) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [manualStart, setManualStart] = useState('');
  const [manualEnd, setManualEnd] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('+998');
  const [loading, setLoading] = useState(false);
  const [useManual, setUseManual] = useState(false);
  const [isDayOff, setIsDayOff] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const handlePhone = (val: string) => {
    let v = val.replace(/[^0-9+]/g, '');
    if (!v.startsWith('+998')) v = '+998';
    if (v.length > 13) v = v.slice(0, 13);
    setPatientPhone(v);
  };
  const isPhoneValid = (p: string) => !p || p === '+998' || /^\+998\d{9}$/.test(p);

  const loadSlots = async (d: string) => {
    setDate(d);
    setSelectedSlot('');
    setIsDayOff(false);
    try {
      // Check if this day of week has a schedule
      const selectedDate = new Date(d);
      const dayOfWeek = selectedDate.getDay(); // 0=Sun, 6=Sat
      const { data: schedules } = await getDoctorSchedule(doctor.id);
      const hasSchedule = (schedules || []).some((s: any) => s.dayOfWeek === dayOfWeek);

      if (!hasSchedule) {
        setIsDayOff(true);
        setSlots([]);
        setUseManual(false);
        return;
      }

      // Check if this specific date is a time off
      const { data: timeoffs } = await getDoctorTimeOffs(doctor.id);
      const dayOff = (timeoffs || []).some((t: any) => {
        const tDate = t.date?.split('T')[0];
        return tDate === d && !t.startTime && !t.endTime;
      });
      if (dayOff) {
        setIsDayOff(true);
        setSlots([]);
        setUseManual(false);
        return;
      }

      const { data } = await getDoctorPanelSlots(doctor.id, d);
      const available = Array.isArray(data) ? data.filter((s: any) => s.available !== false) : [];
      setSlots(available);
      setUseManual(available.length === 0);
    } catch {
      setSlots([]);
      setUseManual(true);
    }
  };

  const submit = async () => {
    let startTime = '';
    let endTime = '';

    if (useManual) {
      if (!date || !manualStart || !manualEnd || !patientName) return toast.error("Maydonlarni to'ldiring");
      startTime = manualStart;
      endTime = manualEnd;
    } else {
      if (!date || !selectedSlot || !patientName) return toast.error("Maydonlarni to'ldiring");
      const parts = selectedSlot.split('-');
      startTime = parts[0].trim();
      endTime = parts[1].trim();
    }

    if (!isPhoneValid(patientPhone)) return toast.error("Telefon formati noto'g'ri. Masalan: +998901234567");
    const phoneToSend = patientPhone && patientPhone !== '+998' ? patientPhone : undefined;

    setLoading(true);
    try {
      await createManualAppointment(doctor.id, {
        date,
        startTime,
        endTime,
        patientName,
        patientPhone: phoneToSend,
      });
      toast.success("Bemor qo'shildi!");
      setPatientName(''); setPatientPhone('+998'); setSelectedSlot('');
      setManualStart(''); setManualEnd('');
      if (date) loadSlots(date);
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Xatolik';
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-green-600" /> Bemor qo&#39;shish
      </h2>
      <div className="space-y-4 max-w-lg">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Sana</label>
          <input type="date" min={today} value={date} onChange={(e) => loadSlots(e.target.value)} className="input" title="Sana tanlang" />
        </div>

        {date && isDayOff && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700 font-medium flex items-center gap-2">
              <Umbrella className="w-5 h-5" /> Bu kun dam olish kuni — bemor qo&#39;shib bo&#39;lmaydi
            </p>
          </div>
        )}

        {date && !isDayOff && slots.length > 0 && !useManual && (
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Bo&#39;sh vaqtlar</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((s: any) => {
                const label = typeof s === 'string' ? s : `${s.startTime}-${s.endTime}`;
                return (
                  <button
                    key={label}
                    onClick={() => setSelectedSlot(label)}
                    className={`p-2 rounded-lg border text-sm font-medium transition ${
                      selectedSlot === label ? 'bg-green-600 text-white border-green-600' : 'bg-white hover:border-green-400'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {date && !isDayOff && slots.length === 0 && !useManual && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" /> Bo&#39;sh vaqt yo&#39;q. Jadval sozlanmagan yoki barcha vaqtlar band.
            </p>
          </div>
        )}

        {date && !isDayOff && (
          <button
            type="button"
            onClick={() => { setUseManual(!useManual); setSelectedSlot(''); }}
            className="text-sm text-teal-600 hover:underline flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" />
            {useManual ? "Bo'sh vaqtlardan tanlash" : "Vaqtni qo'lda kiritish"}
          </button>
        )}

        {useManual && !isDayOff && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Boshlanish vaqti</label>
              <input type="time" value={manualStart} onChange={(e) => setManualStart(e.target.value)} className="input" title="Boshlanish" />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Tugash vaqti</label>
              <input type="time" value={manualEnd} onChange={(e) => setManualEnd(e.target.value)} className="input" title="Tugash" />
            </div>
          </div>
        )}

        {!isDayOff && (
          <>
            <input value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Bemor ismi" className="input" />
            <div>
              <input
                value={patientPhone}
                onChange={(e) => handlePhone(e.target.value)}
                placeholder="+998XXXXXXXXX"
                className={`input ${patientPhone && patientPhone !== '+998' && !isPhoneValid(patientPhone) ? 'border-red-400 focus:ring-red-400' : ''}`}
              />
              {patientPhone && patientPhone !== '+998' && !isPhoneValid(patientPhone) && (
                <p className="text-xs text-red-500 mt-1">+998 dan keyin 9 ta raqam kiriting</p>
              )}
            </div>

            <button onClick={submit} disabled={loading} className="btn-primary w-full">
              {loading ? '...' : "Qo'shish"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════ SCHEDULE TAB ════════════════════════ */
const DAY_NAMES = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

function ScheduleTab({ doctor }: { doctor: any }) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [editDay, setEditDay] = useState<number | null>(null);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');

  const load = useCallback(async () => {
    try { const { data } = await getDoctorSchedule(doctor.id); setSchedules(data); }
    catch { toast.error('Xatolik'); }
  }, [doctor.id]);

  useEffect(() => { load(); }, [load]);

  const save = async (day: number) => {
    try {
      await upsertDoctorSchedule(doctor.id, day, { startTime, endTime });
      toast.success('Saqlandi');
      setEditDay(null); load();
    } catch { toast.error('Xatolik'); }
  };

  const remove = async (day: number) => {
    if (!confirm("Dam olish kuni qilinsinmi?")) return;
    try { await deleteDoctorScheduleDay(doctor.id, day); toast.success("O'chirildi"); load(); }
    catch { toast.error('Xatolik'); }
  };

  const getSchedule = (day: number) => schedules.find((s: any) => s.dayOfWeek === day);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <CalendarDays className="w-6 h-6 text-indigo-600" /> Ish jadvali
      </h2>
      <div className="space-y-2">
        {DAY_NAMES.map((name, i) => {
          const sch = getSchedule(i);
          const isEditing = editDay === i;

          return (
            <div key={i} className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-800 w-28">{name}</div>

                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input max-w-[130px]" title="Boshlanish" />
                    <span className="text-gray-400">—</span>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input max-w-[130px]" title="Tugash" />
                    <button onClick={() => save(i)} className="text-green-600 hover:text-green-800" title="Saqlash">
                      <Check className="w-5 h-5" />
                    </button>
                    <button onClick={() => setEditDay(null)} className="text-gray-400 hover:text-gray-600" title="Bekor">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : sch ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {sch.startTime} — {sch.endTime}
                    </span>
                    <button onClick={() => { setEditDay(i); setStartTime(sch.startTime); setEndTime(sch.endTime); }} className="text-blue-500 hover:text-blue-700" title="Tahrirlash">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(i)} className="text-red-500 hover:text-red-700" title="O'chirish">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Dam olish kuni</span>
                    <button onClick={() => { setEditDay(i); setStartTime('09:00'); setEndTime('18:00'); }} className="text-green-500 hover:text-green-700" title="Qo'shish">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════ TIME OFF TAB ════════════════════════ */
function TimeOffTab({ doctor }: { doctor: any }) {
  const [list, setList] = useState<any[]>([]);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const load = useCallback(async () => {
    try { const { data } = await getDoctorTimeOffs(doctor.id); setList(data); }
    catch { toast.error('Xatolik'); }
  }, [doctor.id]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (!date) return toast.error('Sanani tanlang');
    setLoading(true);
    try {
      await createDoctorTimeOff(doctor.id, {
        date,
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        reason: reason || undefined,
      });
      toast.success("Dam olish qo'shildi");
      setDate(''); setStartTime(''); setEndTime(''); setReason(''); load();
    } catch { toast.error('Xatolik'); }
    setLoading(false);
  };

  const remove = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await deleteDoctorTimeOff(doctor.id, id); toast.success("O'chirildi"); load(); }
    catch { toast.error('Xatolik'); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Umbrella className="w-6 h-6 text-orange-600" /> Dam olish kunlari
      </h2>

      {/* Add form */}
      <div className="bg-gray-50 rounded-lg border p-4 mb-6">
        <h3 className="font-medium mb-3">Yangi dam olish</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Sana</label>
            <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className="input" title="Sana" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Sabab (ixtiyoriy)</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Sabab" className="input" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Boshlanish (ixtiyoriy)</label>
            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input" title="Boshlanish vaqti" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Tugash (ixtiyoriy)</label>
            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input" title="Tugash vaqti" />
          </div>
        </div>
        <button onClick={submit} disabled={loading} className="btn-primary mt-3">
          {loading ? '...' : "Qo'shish"}
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {list.map((t: any) => (
          <div key={t.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div>
              <span className="font-medium">{t.date?.split('T')[0]}</span>
              {t.startTime && t.endTime && (
                <span className="text-sm text-gray-500 ml-2">{t.startTime} — {t.endTime}</span>
              )}
              {!t.startTime && <span className="text-sm text-gray-400 ml-2">Kun bo&#39;yi</span>}
              {t.reason && <span className="text-sm text-gray-400 ml-2">({t.reason})</span>}
            </div>
            <button onClick={() => remove(t.id)} className="text-red-500 hover:text-red-700" title="O'chirish">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Dam olish kunlari yo&#39;q</p>}
      </div>
    </div>
  );
}

/* ════════════════════════ SETTINGS TAB ════════════════════════ */
function SettingsTab({ doctor }: { doctor: any }) {
  const [price, setPrice] = useState(0);
  const [avgServiceMin, setAvgServiceMin] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDoctorSettings(doctor.id)
      .then(({ data }) => {
        setPrice(data.price || 0);
        setAvgServiceMin(data.avgServiceMin || 30);
      })
      .catch(() => {});
  }, [doctor.id]);

  const save = async () => {
    setLoading(true);
    try {
      await updateDoctorSettings(doctor.id, { price, avgServiceMin });
      toast.success('Saqlandi');
    } catch { toast.error('Xatolik'); }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Settings className="w-6 h-6 text-gray-600" /> Sozlamalar
      </h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-sm text-gray-600 mb-1 block">Narx (so&#39;m)</label>
          <input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className="input" placeholder="Narx" />
        </div>
        <div>
          <label className="text-sm text-gray-600 mb-1 block">O&#39;rtacha xizmat vaqti (daqiqa)</label>
          <input type="number" value={avgServiceMin} onChange={(e) => setAvgServiceMin(+e.target.value)} className="input" placeholder="Daqiqa" />
        </div>
        <button onClick={save} disabled={loading} className="btn-primary">
          {loading ? '...' : 'Saqlash'}
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════ MAIN DOCTOR PAGE ════════════════════════ */
type DTab = 'appointments' | 'addPatient' | 'schedule' | 'timeoff' | 'settings';

export default function DoctorPage() {
  const { doctorUser, setDoctorUser, clearDoctor, _hasHydrated } = useAuthStore();
  const [tab, setTab] = useState<DTab>('appointments');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!doctorUser) {
    return <DoctorLogin onLogin={(d) => setDoctorUser(d)} />;
  }

  const tabs: { key: DTab; label: string; icon: React.ReactNode }[] = [
    { key: 'appointments', label: 'Navbatlar', icon: <ClipboardList className="w-5 h-5" /> },
    { key: 'addPatient', label: "Bemor qo'shish", icon: <UserPlus className="w-5 h-5" /> },
    { key: 'schedule', label: 'Jadval', icon: <CalendarDays className="w-5 h-5" /> },
    { key: 'timeoff', label: 'Dam olish', icon: <Umbrella className="w-5 h-5" /> },
    { key: 'settings', label: 'Sozlamalar', icon: <Settings className="w-5 h-5" /> },
  ];

  const tabDescriptions: Record<string, string> = {
    appointments: "Bugungi va boshqa kunlardagi navbatlar",
    addPatient: "Yangi bemorni qo'lda navbatga qo'shish",
    schedule: "Haftalik ish jadvalingizni sozlash",
    timeoff: "Dam olish kunlarini belgilash",
    settings: "Narx va qabul vaqtini sozlash",
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo section */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Image src="/logo.PNG" alt="MedBook" width={44} height={44} className="rounded-xl shadow-sm" />
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">MedBook</h1>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full mt-0.5">
                <Stethoscope className="w-3.5 h-3.5" /> Shifokor
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Boshqaruv
          </p>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {t.icon}
              {t.label}
              {tab === t.key && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </button>
          ))}

          {/* Doctor info card */}
          <div className="mt-4 px-3 py-3 bg-teal-50 rounded-lg">
            <p className="text-[11px] font-semibold text-teal-400 uppercase tracking-wider mb-1">Shifokor</p>
            <p className="text-sm font-bold text-teal-800">{doctorUser.firstName} {doctorUser.lastName}</p>
            <p className="text-xs text-teal-600 mt-0.5 flex items-center gap-1">
              <Stethoscope className="w-3 h-3" /> {doctorUser.specialty?.nameUz || doctorUser.specialtyUz || ''}
            </p>
            {doctorUser.phone && (
              <p className="text-xs text-teal-500 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {doctorUser.phone}
              </p>
            )}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={clearDoctor}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Chiqish
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Menyu"
            title="Menyu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-800">MedBook</h1>
        </header>

        {/* Page header */}
        <div className="px-6 lg:px-8 pt-6 pb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {tabs.find((t) => t.key === tab)?.label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {tabDescriptions[tab]}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 lg:px-8 py-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {tab === 'appointments' && <AppointmentsTab doctor={doctorUser} />}
            {tab === 'addPatient' && <AddPatientTab doctor={doctorUser} />}
            {tab === 'schedule' && <ScheduleTab doctor={doctorUser} />}
            {tab === 'timeoff' && <TimeOffTab doctor={doctorUser} />}
            {tab === 'settings' && <SettingsTab doctor={doctorUser} />}
          </div>
        </div>
      </div>
    </div>
  );
}
