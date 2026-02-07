'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import { useAuthStore } from '../../lib/store';
import {
  registerUser,
  getUserByTelegramId,
  getUserAppointments,
  getUserDiagnoses,
  cancelUserAppointment,
  getRegions,
  getClinicsByRegion,
  getClinicSpecialties,
  getDoctorsByClinicAndSpecialty,
  getDoctorSlots,
  createAppointment,
} from '../../lib/api';
import {
  Phone, Globe, ArrowLeft, Calendar, Building2, Stethoscope,
  Clock, Award, Banknote, MapPin, LogOut, CalendarDays,
  ClipboardList, FileText, CheckCircle, XCircle, Smartphone,
} from 'lucide-react';
import toast from 'react-hot-toast';

function getTg(): any {
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    return (window as any).Telegram.WebApp;
  }
  return null;
}
function isTg(): boolean { return !!getTg()?.initDataUnsafe?.user; }

function LangPage({ onSelect }: { onSelect: (l: 'UZ' | 'RU') => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="card max-w-sm w-full text-center">
        <div className="flex justify-center mb-4">
          <Image src="/logo.PNG" alt="BookMed" width={64} height={64} className="rounded-xl" />
        </div>
        <h1 className="text-2xl font-bold mb-2">BookMed</h1>
        <p className="text-gray-500 mb-6">{'Тилни танланг / Выберите язык'}</p>
        <div className="space-y-3">
          <button onClick={() => onSelect('UZ')} className="btn-primary w-full flex items-center justify-center gap-2">
            <Globe className="w-5 h-5" /> {"O'zbek tili"}
          </button>
          <button onClick={() => onSelect('RU')} className="w-full py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <Globe className="w-5 h-5" /> {'Русский язык'}
          </button>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ lang, onDone, tgUser }: { lang: 'UZ' | 'RU'; onDone: (u: any) => void; tgUser?: any }) {
  const [phone, setPhone] = useState('+998');
  const [firstName, setFirstName] = useState(tgUser?.first_name || '');
  const [lastName, setLastName] = useState(tgUser?.last_name || '');
  const [loading, setLoading] = useState(false);
  const t = lang === 'UZ'
    ? { title: "Ro'yxatdan o'tish", fn: 'Ism', ln: 'Familiya', btn: 'Davom etish' }
    : { title: 'Регистрация', fn: 'Имя', ln: 'Фамилия', btn: 'Продолжить' };

  const handlePhone = (val: string) => {
    let v = val.replace(/[^0-9+]/g, '');
    if (!v.startsWith('+998')) v = '+998';
    if (v.length > 13) v = v.slice(0, 13);
    setPhone(v);
  };

  const submit = async () => {
    if (phone.length !== 13) return toast.error(lang === 'UZ' ? "To'g'ri telefon raqam kiriting" : 'Введите правильный номер');
    setLoading(true);
    try {
      const payload: any = { phone, firstName, lastName, language: lang };
      if (tgUser?.id) payload.telegramId = String(tgUser.id);
      const { data } = await registerUser(payload);
      toast.success(lang === 'UZ' ? 'Muvaffaqiyatli!' : 'Успешно!');
      onDone(data);
    } catch {
      toast.error(lang === 'UZ' ? 'Xatolik yuz berdi' : 'Произошла ошибка');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Image src="/logo.PNG" alt="BookMed" width={64} height={64} className="rounded-xl" />
        </div>
        <h2 className="text-xl font-bold text-center mb-6">{t.title}</h2>
        {tgUser && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center text-sm text-blue-700">
            <Smartphone className="w-4 h-4 inline mr-1" />
            Telegram: {tgUser.first_name} {tgUser.last_name || ''}
          </div>
        )}
        <div className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input value={phone} onChange={(e) => handlePhone(e.target.value)} placeholder="+998XXXXXXXXX" className="input pl-11" />
          </div>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.fn} className="input" />
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.ln} className="input" />
          <button onClick={submit} disabled={loading} className="btn-primary w-full">{loading ? '...' : t.btn}</button>
        </div>
      </div>
    </div>
  );
}

type BookStep = 'region' | 'clinic' | 'specialty' | 'doctor' | 'date' | 'confirm';

function BookingFlow({ user, lang, onBack }: { user: any; lang: 'UZ' | 'RU'; onBack: () => void }) {
  const [step, setStep] = useState<BookStep>('region');
  const [regions, setRegions] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedClinic, setSelectedClinic] = useState<any>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);

  const nm = (item: any) => (lang === 'UZ' ? item.nameUz : item.nameRu);
  const sp = (d: any) => (lang === 'UZ' ? d.specialtyUz : d.specialtyRu);

  useEffect(() => { getRegions().then(({ data }) => setRegions(data)); }, []);

  const pickRegion = async (r: any) => { setSelectedRegion(r); const { data } = await getClinicsByRegion(r.id); setClinics(data); setStep('clinic'); };
  const pickClinic = async (c: any) => { setSelectedClinic(c); try { const { data } = await getClinicSpecialties(c.id); setSpecialties(data); } catch { setSpecialties([]); } setStep('specialty'); };
  const pickSpecialty = async (s: any) => { setSelectedSpecialty(s); const { data } = await getDoctorsByClinicAndSpecialty(selectedClinic.id, s.id); setDoctors(data); setStep('doctor'); };
  const pickDoctor = (d: any) => { setSelectedDoctor(d); setSelectedDate(''); setSlots([]); setStep('date'); };

  const loadSlots = async (date: string) => {
    setSelectedDate(date); setSelectedSlot('');
    try { const { data } = await getDoctorSlots(selectedDoctor.id, date); setSlots(Array.isArray(data) ? data.filter((s: any) => s.available !== false) : data); }
    catch { setSlots([]); }
  };

  const confirmBooking = async () => {
    if (!selectedSlot) return toast.error(lang === 'UZ' ? 'Vaqtni tanlang' : 'Выберите время');
    setLoading(true);
    try {
      const [startTime, endTime] = selectedSlot.split('-');
      await createAppointment({ userId: user.id, doctorId: selectedDoctor.id, date: selectedDate, startTime: startTime.trim(), endTime: endTime.trim() });
      toast.success(lang === 'UZ' ? 'Navbat olindi!' : 'Запись создана!');
      const tg = getTg();
      if (tg) { tg.showAlert(lang === 'UZ' ? 'Navbat muvaffaqiyatli olindi!' : 'Запись успешно создана!', () => tg.close()); }
      else onBack();
    } catch { toast.error(lang === 'UZ' ? 'Xatolik' : 'Ошибка'); }
    setLoading(false);
  };

  const goBack = useCallback(() => {
    if (step === 'clinic') setStep('region');
    else if (step === 'specialty') setStep('clinic');
    else if (step === 'doctor') setStep('specialty');
    else if (step === 'date') setStep('doctor');
    else if (step === 'confirm') setStep('date');
    else onBack();
  }, [step, onBack]);

  useEffect(() => {
    const tg = getTg();
    if (tg) { tg.BackButton.show(); tg.BackButton.onClick(goBack); return () => { tg.BackButton.offClick(goBack); tg.BackButton.hide(); }; }
  }, [goBack]);

  const today = new Date().toISOString().split('T')[0];
  const allSteps: BookStep[] = ['region', 'clinic', 'specialty', 'doctor', 'date', 'confirm'];
  const idx = allSteps.indexOf(step);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex gap-1">{allSteps.map((_, i) => (<div key={i} className={`h-1.5 flex-1 rounded-full ${i <= idx ? 'bg-blue-500' : 'bg-gray-200'}`} />))}</div>
        <p className="text-xs text-gray-400 text-center mt-1">{idx + 1}/{allSteps.length}</p>
      </div>
      {!isTg() && (<button onClick={goBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"><ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}</button>)}

      {step === 'region' && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Hududni tanlang' : 'Выберите регион'}</h2>
          <div className="space-y-2">{regions.map((r: any) => (<button key={r.id} onClick={() => pickRegion(r)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-blue-400 hover:shadow-sm transition font-medium">{nm(r)}</button>))}</div>
        </div>
      )}

      {step === 'clinic' && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Building2 className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Klinikani tanlang' : 'Выберите клинику'}</h2>
          <div className="space-y-2">
            {clinics.map((c: any) => (<button key={c.id} onClick={() => pickClinic(c)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-green-400 hover:shadow-sm transition"><div className="font-medium">{nm(c)}</div>{c.address && <div className="text-sm text-gray-400 mt-1"><MapPin className="w-3 h-3 inline" /> {c.address}</div>}</button>))}
            {clinics.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Klinikalar topilmadi' : 'Клиники не найдены'}</p>}
          </div>
        </div>
      )}

      {step === 'specialty' && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="w-6 h-6 text-purple-600" /> {lang === 'UZ' ? 'Mutaxassislikni tanlang' : 'Выберите специальность'}</h2>
          <div className="space-y-2">
            {specialties.map((s: any) => (<button key={s.id} onClick={() => pickSpecialty(s)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-purple-400 hover:shadow-sm transition font-medium">{nm(s)}</button>))}
            {specialties.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Mutaxassisliklar topilmadi' : 'Специальности не найдены'}</p>}
          </div>
        </div>
      )}

      {step === 'doctor' && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Stethoscope className="w-6 h-6 text-teal-600" /> {lang === 'UZ' ? 'Shifokorni tanlang' : 'Выберите врача'}</h2>
          <div className="space-y-3">
            {doctors.map((d: any) => (
              <button key={d.id} onClick={() => pickDoctor(d)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-teal-400 hover:shadow-sm transition">
                <div className="font-bold text-gray-800">{d.firstName} {d.lastName}</div>
                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">
                  <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {sp(d)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.experienceYears} {lang === 'UZ' ? 'yil' : 'лет'}</span>
                  <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> {d.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span>
                </div>
              </button>
            ))}
            {doctors.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Shifokorlar topilmadi' : 'Врачи не найдены'}</p>}
          </div>
        </div>
      )}

      {step === 'date' && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-6 h-6 text-indigo-600" /> {lang === 'UZ' ? 'Sana va vaqt' : 'Дата и время'}</h2>
          <div className="mb-4">
            <label className="text-sm text-gray-600 mb-1 block">{lang === 'UZ' ? 'Sanani tanlang' : 'Выберите дату'}</label>
            <input type="date" min={today} value={selectedDate} onChange={(e) => loadSlots(e.target.value)} className="input" />
          </div>
          {selectedDate && (
            <div>
              <p className="text-sm text-gray-600 mb-2">{lang === 'UZ' ? "Bo'sh vaqtlar" : 'Свободные слоты'}:</p>
              {slots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((s: any) => {
                    const label = typeof s === 'string' ? s : `${s.startTime}-${s.endTime}`;
                    return (<button key={label} onClick={() => { setSelectedSlot(label); setStep('confirm'); }} className={`p-2 rounded-lg border text-sm font-medium transition ${selectedSlot === label ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-400'}`}><Clock className="w-3 h-3 inline mr-1" />{label}</button>);
                  })}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center"><p className="text-sm text-red-600 font-medium">{lang === 'UZ' ? 'Dam olish kuni' : 'Выходной'}</p></div>
              )}
            </div>
          )}
        </div>
      )}

      {step === 'confirm' && selectedDoctor && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tasdiqlash' : 'Подтверждение'}</h2>
          <div className="bg-white rounded-lg border p-5 space-y-3 mb-4">
            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Shifokor' : 'Врач'}</span><span className="font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Mutaxassislik' : 'Специальность'}</span><span className="font-medium">{sp(selectedDoctor)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Klinika' : 'Клиника'}</span><span className="font-medium">{nm(selectedClinic)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Sana' : 'Дата'}</span><span className="font-medium">{selectedDate}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Vaqt' : 'Время'}</span><span className="font-medium">{selectedSlot}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Narx' : 'Стоимость'}</span><span className="font-bold text-green-600">{selectedDoctor.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span></div>
          </div>
          <button onClick={confirmBooking} disabled={loading} className="btn-primary w-full">{loading ? '...' : lang === 'UZ' ? 'Tasdiqlash' : 'Подтвердить'}</button>
        </div>
      )}
    </div>
  );
}

function AppointmentsList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); try { const { data } = await getUserAppointments(user.id); setList(data); } catch {} setLoading(false); }, [user.id]);
  useEffect(() => { load(); }, [load]);

  const cancel = async (appId: string) => {
    if (!confirm(lang === 'UZ' ? 'Bekor qilinsinmi?' : 'Отменить?')) return;
    try { await cancelUserAppointment(user.id, appId); toast.success(lang === 'UZ' ? 'Bekor qilindi' : 'Отменено'); load(); } catch { toast.error('Xatolik'); }
  };

  const badge = (s: string) => {
    const m: Record<string, { c: string; l: string }> = {
      PENDING: { c: 'bg-yellow-100 text-yellow-700', l: lang === 'UZ' ? 'Kutilmoqda' : 'Ожидание' },
      ACCEPTED: { c: 'bg-blue-100 text-blue-700', l: lang === 'UZ' ? 'Qabul qilindi' : 'Принят' },
      COMPLETED: { c: 'bg-green-100 text-green-700', l: lang === 'UZ' ? 'Tugallandi' : 'Завершён' },
      CANCELLED: { c: 'bg-red-100 text-red-700', l: lang === 'UZ' ? 'Bekor qilingan' : 'Отменён' },
    };
    const b = m[s] || m.PENDING;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.c}`}>{b.l}</span>;
  };

  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDays className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Navbatlarim' : 'Мои записи'}</h2>
      <div className="space-y-3">
        {list.map((a: any) => (
          <div key={a.id} className="bg-white rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-bold text-gray-800">{a.doctor?.firstName} {a.doctor?.lastName}</div>
                <div className="text-sm text-gray-500 mt-1">{a.date?.split('T')[0]} | {a.startTime} - {a.endTime}</div>
                <div className="text-sm text-green-600 font-medium mt-1">{(a.finalPrice ?? a.doctor?.price ?? 0).toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</div>
              </div>
              {badge(a.status)}
            </div>
            {a.status === 'COMPLETED' && a.diagnosis && (
              <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200 text-sm space-y-1">
                <p className="text-green-800"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {a.diagnosis.description}</p>
                {a.diagnosis.prescription && <p className="text-green-700"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {a.diagnosis.prescription}</p>}
              </div>
            )}
            {a.status === 'PENDING' && (
              <button onClick={() => cancel(a.id)} className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"><XCircle className="w-4 h-4" /> {lang === 'UZ' ? 'Bekor qilish' : 'Отменить'}</button>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Navbatlar topilmadi' : 'Записей нет'}</p>}
      </div>
    </div>
  );
}

function DiagnosesList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getUserDiagnoses(user.id).then(({ data }) => setList(data)).catch(() => {}).finally(() => setLoading(false)); }, [user.id]);
  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы'}</h2>
      <div className="space-y-3">
        {list.map((d: any) => (
          <div key={d.id} className="bg-white rounded-lg border p-4">
            <div className="font-bold text-gray-800">{d.doctor?.firstName} {d.doctor?.lastName}</div>
            <div className="text-sm text-gray-500 mt-1">{d.createdAt?.split('T')[0]}</div>
            <p className="mt-2 text-gray-700"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {d.description}</p>
            {d.prescription && <p className="mt-1 text-gray-600 text-sm"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {d.prescription}</p>}
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Tashxislar topilmadi' : 'Диагнозов нет'}</p>}
      </div>
    </div>
  );
}

type MenuView = 'menu' | 'booking' | 'appointments' | 'diagnoses';

function UserMenu({ user, lang, onLogout }: { user: any; lang: 'UZ' | 'RU'; onLogout: () => void }) {
  const [view, setView] = useState<MenuView>('menu');

  useEffect(() => {
    const tg = getTg();
    if (tg && view !== 'menu') { tg.BackButton.show(); const h = () => setView('menu'); tg.BackButton.onClick(h); return () => { tg.BackButton.offClick(h); tg.BackButton.hide(); }; }
    if (tg && view === 'menu') tg.BackButton.hide();
  }, [view]);

  if (view === 'booking') return <div className="min-h-screen bg-gray-50 p-4"><BookingFlow user={user} lang={lang} onBack={() => setView('menu')} /></div>;
  if (view === 'appointments') return (
    <div className="min-h-screen bg-gray-50 p-4"><div className="max-w-2xl mx-auto">
      {!isTg() && <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 mb-4"><ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}</button>}
      <AppointmentsList user={user} lang={lang} />
    </div></div>
  );
  if (view === 'diagnoses') return (
    <div className="min-h-screen bg-gray-50 p-4"><div className="max-w-2xl mx-auto">
      {!isTg() && <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 mb-4"><ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}</button>}
      <DiagnosesList user={user} lang={lang} />
    </div></div>
  );

  const items = [
    { key: 'booking', icon: <CalendarDays className="w-8 h-8 text-blue-600" />, title: lang === 'UZ' ? 'Navbat olish' : 'Записаться', desc: lang === 'UZ' ? 'Shifokorga yozilish' : 'Запись к врачу', color: 'hover:border-blue-400' },
    { key: 'appointments', icon: <ClipboardList className="w-8 h-8 text-purple-600" />, title: lang === 'UZ' ? 'Navbatlarim' : 'Мои записи', desc: lang === 'UZ' ? 'Barcha navbatlar' : 'Все записи', color: 'hover:border-purple-400' },
    { key: 'diagnoses', icon: <FileText className="w-8 h-8 text-green-600" />, title: lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы', desc: lang === 'UZ' ? 'Shifokor xulosalari' : 'Заключения врачей', color: 'hover:border-green-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.PNG" alt="BookMed" width={36} height={36} className="rounded-lg" />
            <div><h1 className="text-lg font-bold text-gray-800">BookMed</h1><p className="text-xs text-gray-500">{user.firstName} {user.lastName}</p></div>
          </div>
          {!isTg() && <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"><LogOut className="w-4 h-4" /> {lang === 'UZ' ? 'Chiqish' : 'Выход'}</button>}
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-3">
        {items.map((it) => (
          <button key={it.key} onClick={() => setView(it.key as MenuView)} className={`w-full text-left p-5 bg-white rounded-xl border transition shadow-sm hover:shadow-md ${it.color}`}>
            <div className="flex items-center gap-4">{it.icon}<div><div className="font-bold text-gray-800">{it.title}</div><div className="text-sm text-gray-500">{it.desc}</div></div></div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function UserPage() {
  const { currentUser, setCurrentUser, clearUser, _hasHydrated } = useAuthStore();
  const [lang, setLang] = useState<'UZ' | 'RU' | null>(null);
  const [tgUser, setTgUser] = useState<any>(null);
  const [ready, setReady] = useState(false);

  const onSdkLoad = useCallback(() => {
    const tg = getTg();
    if (tg?.initDataUnsafe?.user) {
      const u = tg.initDataUnsafe.user;
      setTgUser(u);
      tg.expand();
      tg.ready();
      if (!lang) setLang(u.language_code === 'ru' ? 'RU' : 'UZ');
      if (!currentUser) {
        getUserByTelegramId(String(u.id))
          .then(({ data }: { data: any }) => { setCurrentUser(data); setReady(true); })
          .catch(() => setReady(true));
        return;
      }
    }
    setReady(true);
  }, []);

  useEffect(() => { if (_hasHydrated && !getTg()) setReady(true); }, [_hasHydrated]);

  const TgScript = <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" onLoad={onSdkLoad} />;

  if (!_hasHydrated || !ready) return <>{TgScript}<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div className="text-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto" /><p className="text-sm text-gray-500 mt-3">BookMed</p></div></div></>;
  if (!lang) return <>{TgScript}<LangPage onSelect={setLang} /></>;
  if (!currentUser) return <>{TgScript}<RegisterPage lang={lang} onDone={setCurrentUser} tgUser={tgUser} /></>;
  return <>{TgScript}<UserMenu user={currentUser} lang={lang} onLogout={() => { clearUser(); setLang(null); }} /></>;
}
