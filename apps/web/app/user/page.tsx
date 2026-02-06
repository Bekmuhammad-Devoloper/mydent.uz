'use client';'use client';



import { useState, useEffect, useCallback } from 'react';import { useState, useEffect, useCallback } from 'react';

import Image from 'next/image';import Image from 'next/image';

import Script from 'next/script';import { useAuthStore } from '../../lib/store';

import { useAuthStore } from '../../lib/store';import {

import {  registerUser, getUserByPhone, getUserAppointments, getUserDiagnoses,

  registerUser, getUserByTelegramId, getUserAppointments, getUserDiagnoses,  cancelUserAppointment, getRegions, getClinicsByRegion, getClinicSpecialties,

  cancelUserAppointment, getRegions, getClinicsByRegion, getClinicSpecialties,  getDoctorsByClinicAndSpecialty, getDoctorDetail, getDoctorSlots, createAppointment,

  getDoctorsByClinicAndSpecialty, getDoctorSlots, createAppointment,} from '../../lib/api';

} from '../../lib/api';import {

import {  User, Phone, Globe, ArrowLeft, Calendar, Building2, Stethoscope,

  User, Phone, Globe, ArrowLeft, Calendar, Building2, Stethoscope,  Clock, Star, Award, Banknote, MapPin, LogOut, CalendarDays,

  Clock, Award, Banknote, MapPin, LogOut, CalendarDays,  ClipboardList, FileText, CheckCircle, XCircle, AlertCircle,

  ClipboardList, FileText, CheckCircle, XCircle, AlertCircle, Smartphone,} from 'lucide-react';

} from 'lucide-react';import toast from 'react-hot-toast';

import toast from 'react-hot-toast';

/* ════════════════════════ LANGUAGE SELECT ════════════════════════ */

/* ═══════ Telegram WebApp helpers ═══════ */function LangPage({ onSelect }: { onSelect: (l: 'UZ' | 'RU') => void }) {

function getTg(): any {  return (

  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">

    return (window as any).Telegram.WebApp;      <div className="card max-w-sm w-full text-center">

  }        <div className="flex justify-center mb-4">

  return null;          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />

}        </div>

function isTg(): boolean { return !!getTg()?.initDataUnsafe?.user; }        <h1 className="text-2xl font-bold mb-2">MedBook</h1>

        <p className="text-gray-500 mb-6">Tilni tanlang / Выберите язык</p>

/* ════════════════════════ LANGUAGE SELECT ════════════════════════ */        <div className="space-y-3">

function LangPage({ onSelect }: { onSelect: (l: 'UZ' | 'RU') => void }) {          <button onClick={() => onSelect('UZ')} className="btn-primary w-full flex items-center justify-center gap-2">

  return (            <Globe className="w-5 h-5" /> O&#39;zbek tili

    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100">          </button>

      <div className="card max-w-sm w-full text-center">          <button onClick={() => onSelect('RU')} className="w-full py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">

        <div className="flex justify-center mb-4">            <Globe className="w-5 h-5" /> Русский язык

          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />          </button>

        </div>        </div>

        <h1 className="text-2xl font-bold mb-2">MedBook</h1>      </div>

        <p className="text-gray-500 mb-6">Tilni tanlang / Выберите язык</p>    </div>

        <div className="space-y-3">  );

          <button onClick={() => onSelect('UZ')} className="btn-primary w-full flex items-center justify-center gap-2">}

            <Globe className="w-5 h-5" /> O&#39;zbek tili

          </button>/* ════════════════════════ REGISTER ════════════════════════ */

          <button onClick={() => onSelect('RU')} className="w-full py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">function RegisterPage({ lang, onDone }: { lang: 'UZ' | 'RU'; onDone: (u: any) => void }) {

            <Globe className="w-5 h-5" /> Русский язык  const [phone, setPhone] = useState('+998');

          </button>  const [firstName, setFirstName] = useState('');

        </div>  const [lastName, setLastName] = useState('');

      </div>  const [loading, setLoading] = useState(false);

    </div>  const t = lang === 'UZ'

  );    ? { title: 'Ro\'yxatdan o\'tish', ph: 'Telefon raqam', fn: 'Ism', ln: 'Familiya', btn: 'Davom etish' }

}    : { title: 'Регистрация', ph: 'Номер телефона', fn: 'Имя', ln: 'Фамилия', btn: 'Продолжить' };



/* ════════════════════════ REGISTER ════════════════════════ */  const handlePhone = (val: string) => {

function RegisterPage({ lang, onDone, tgUser }: { lang: 'UZ' | 'RU'; onDone: (u: any) => void; tgUser?: any }) {    let v = val.replace(/[^0-9+]/g, '');

  const [phone, setPhone] = useState('+998');    if (!v.startsWith('+998')) v = '+998';

  const [firstName, setFirstName] = useState(tgUser?.first_name || '');    if (v.length > 13) v = v.slice(0, 13);

  const [lastName, setLastName] = useState(tgUser?.last_name || '');    setPhone(v);

  const [loading, setLoading] = useState(false);  };

  const t = lang === 'UZ'

    ? { title: 'Ro\'yxatdan o\'tish', fn: 'Ism', ln: 'Familiya', btn: 'Davom etish' }  const submit = async () => {

    : { title: 'Регистрация', fn: 'Имя', ln: 'Фамилия', btn: 'Продолжить' };    if (phone.length !== 13) return toast.error(lang === 'UZ' ? "To'g'ri telefon raqam kiriting: +998XXXXXXXXX" : 'Введите корректный номер: +998XXXXXXXXX');

    setLoading(true);

  const handlePhone = (val: string) => {    try {

    let v = val.replace(/[^0-9+]/g, '');      const { data } = await registerUser({ phone, firstName, lastName, language: lang });

    if (!v.startsWith('+998')) v = '+998';      toast.success(lang === 'UZ' ? 'Muvaffaqiyatli!' : 'Успешно!');

    if (v.length > 13) v = v.slice(0, 13);      onDone(data);

    setPhone(v);    } catch {

  };      toast.error(lang === 'UZ' ? 'Xatolik yuz berdi' : 'Произошла ошибка');

    }

  const submit = async () => {    setLoading(false);

    if (phone.length !== 13) return toast.error(lang === 'UZ' ? "To'g'ri telefon raqam kiriting" : 'Введите корректный номер');  };

    setLoading(true);

    try {  return (

      const payload: any = { phone, firstName, lastName, language: lang };    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">

      if (tgUser?.id) payload.telegramId = String(tgUser.id);      <div className="card max-w-md w-full">

      const { data } = await registerUser(payload);        <div className="flex justify-center mb-4">

      toast.success(lang === 'UZ' ? 'Muvaffaqiyatli!' : 'Успешно!');          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />

      onDone(data);        </div>

    } catch {        <h2 className="text-xl font-bold text-center mb-6">{t.title}</h2>

      toast.error(lang === 'UZ' ? 'Xatolik yuz berdi' : 'Произошла ошибка');        <div className="space-y-4">

    }          <div className="relative">

    setLoading(false);            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

  };            <input value={phone} onChange={(e) => handlePhone(e.target.value)} placeholder="+998XXXXXXXXX" className="input pl-11" />

          </div>

  return (          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.fn} className="input" />

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.ln} className="input" />

      <div className="card max-w-md w-full">          <button onClick={submit} disabled={loading} className="btn-primary w-full">

        <div className="flex justify-center mb-4">            {loading ? '...' : t.btn}

          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />          </button>

        </div>        </div>

        <h2 className="text-xl font-bold text-center mb-6">{t.title}</h2>      </div>

        {tgUser && (    </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center text-sm text-blue-700">  );

            <Smartphone className="w-4 h-4 inline mr-1" />}

            Telegram: {tgUser.first_name} {tgUser.last_name || ''}

          </div>/* ════════════════════════ BOOKING FLOW ════════════════════════ */

        )}type BookStep = 'region' | 'clinic' | 'specialty' | 'doctor' | 'date' | 'confirm';

        <div className="space-y-4">

          <div className="relative">function BookingFlow({ user, lang, onBack }: { user: any; lang: 'UZ' | 'RU'; onBack: () => void }) {

            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />  const [step, setStep] = useState<BookStep>('region');

            <input value={phone} onChange={(e) => handlePhone(e.target.value)} placeholder="+998XXXXXXXXX" className="input pl-11" />  const [regions, setRegions] = useState<any[]>([]);

          </div>  const [clinics, setClinics] = useState<any[]>([]);

          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.fn} className="input" />  const [specialties, setSpecialties] = useState<any[]>([]);

          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.ln} className="input" />  const [doctors, setDoctors] = useState<any[]>([]);

          <button onClick={submit} disabled={loading} className="btn-primary w-full">  const [slots, setSlots] = useState<string[]>([]);

            {loading ? '...' : t.btn}  const [isDayOff, setIsDayOff] = useState(false);

          </button>

        </div>  const [selectedRegion, setSelectedRegion] = useState<any>(null);

      </div>  const [selectedClinic, setSelectedClinic] = useState<any>(null);

    </div>  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);

  );  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

}  const [selectedDate, setSelectedDate] = useState('');

  const [selectedSlot, setSelectedSlot] = useState('');

/* ════════════════════════ BOOKING FLOW ════════════════════════ */  const [loading, setLoading] = useState(false);

type BookStep = 'region' | 'clinic' | 'specialty' | 'doctor' | 'date' | 'confirm';

  const nm = (item: any) => lang === 'UZ' ? item.nameUz : item.nameRu;

function BookingFlow({ user, lang, onBack }: { user: any; lang: 'UZ' | 'RU'; onBack: () => void }) {  const sp = (d: any) => lang === 'UZ' ? d.specialtyUz : d.specialtyRu;

  const [step, setStep] = useState<BookStep>('region');

  const [regions, setRegions] = useState<any[]>([]);  useEffect(() => {

  const [clinics, setClinics] = useState<any[]>([]);    getRegions().then(({ data }) => setRegions(data));

  const [specialties, setSpecialties] = useState<any[]>([]);  }, []);

  const [doctors, setDoctors] = useState<any[]>([]);

  const [slots, setSlots] = useState<any[]>([]);  const pickRegion = async (r: any) => {

    setSelectedRegion(r);

  const [selectedRegion, setSelectedRegion] = useState<any>(null);    const { data } = await getClinicsByRegion(r.id);

  const [selectedClinic, setSelectedClinic] = useState<any>(null);    setClinics(data);

  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);    setStep('clinic');

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);  };

  const [selectedDate, setSelectedDate] = useState('');

  const [selectedSlot, setSelectedSlot] = useState('');  const pickClinic = async (c: any) => {

  const [loading, setLoading] = useState(false);    setSelectedClinic(c);

    try {

  const nm = (item: any) => lang === 'UZ' ? item.nameUz : item.nameRu;      const { data } = await getClinicSpecialties(c.id);

  const sp = (d: any) => lang === 'UZ' ? d.specialtyUz : d.specialtyRu;      setSpecialties(data);

    } catch {

  useEffect(() => { getRegions().then(({ data }) => setRegions(data)); }, []);      setSpecialties([]);

    }

  const pickRegion = async (r: any) => { setSelectedRegion(r); const { data } = await getClinicsByRegion(r.id); setClinics(data); setStep('clinic'); };    setStep('specialty');

  const pickClinic = async (c: any) => { setSelectedClinic(c); try { const { data } = await getClinicSpecialties(c.id); setSpecialties(data); } catch { setSpecialties([]); } setStep('specialty'); };  };

  const pickSpecialty = async (s: any) => { setSelectedSpecialty(s); const { data } = await getDoctorsByClinicAndSpecialty(selectedClinic.id, s.id); setDoctors(data); setStep('doctor'); };

  const pickDoctor = (d: any) => { setSelectedDoctor(d); setSelectedDate(''); setSlots([]); setStep('date'); };  const pickSpecialty = async (s: any) => {

    setSelectedSpecialty(s);

  const loadSlots = async (date: string) => {    const { data } = await getDoctorsByClinicAndSpecialty(selectedClinic.id, s.id);

    setSelectedDate(date); setSelectedSlot('');    setDoctors(data);

    try { const { data } = await getDoctorSlots(selectedDoctor.id, date); setSlots(Array.isArray(data) ? data.filter((s: any) => s.available !== false) : data); }    setStep('doctor');

    catch { setSlots([]); }  };

  };

  const pickDoctor = (d: any) => {

  const confirmBooking = async () => {    setSelectedDoctor(d);

    if (!selectedSlot) return toast.error(lang === 'UZ' ? 'Vaqtni tanlang' : 'Выберите время');    setSelectedDate('');

    setLoading(true);    setSlots([]);

    try {    setIsDayOff(false);

      const [startTime, endTime] = selectedSlot.split('-');    setStep('date');

      await createAppointment({ userId: user.id, doctorId: selectedDoctor.id, date: selectedDate, startTime: startTime.trim(), endTime: endTime.trim() });  };

      toast.success(lang === 'UZ' ? 'Navbat olindi! 🎉' : 'Запись создана! 🎉');

      const tg = getTg();  const loadSlots = async (date: string) => {

      if (tg) { tg.showAlert(lang === 'UZ' ? 'Navbat muvaffaqiyatli olindi!' : 'Запись успешно создана!', () => tg.close()); }    setSelectedDate(date);

      else onBack();    setSelectedSlot('');

    } catch { toast.error(lang === 'UZ' ? 'Xatolik' : 'Ошибка'); }    setIsDayOff(false);

    setLoading(false);    try {

  };      const { data } = await getDoctorSlots(selectedDoctor.id, date);

      const available = Array.isArray(data) ? data.filter((s: any) => s.available !== false) : data;

  const goBack = useCallback(() => {      if (available.length === 0) {

    if (step === 'clinic') setStep('region');        setIsDayOff(true);

    else if (step === 'specialty') setStep('clinic');      }

    else if (step === 'doctor') setStep('specialty');      setSlots(available);

    else if (step === 'date') setStep('doctor');    } catch {

    else if (step === 'confirm') setStep('date');      setSlots([]);

    else onBack();      setIsDayOff(true);

  }, [step, onBack]);    }

  };

  // Telegram BackButton

  useEffect(() => {  const confirmBooking = async () => {

    const tg = getTg();    if (!selectedSlot) return toast.error(lang === 'UZ' ? 'Vaqtni tanlang' : 'Выберите время');

    if (tg) { tg.BackButton.show(); tg.BackButton.onClick(goBack); return () => { tg.BackButton.offClick(goBack); tg.BackButton.hide(); }; }    setLoading(true);

  }, [goBack]);    try {

      const [startTime, endTime] = selectedSlot.split('-');

  const today = new Date().toISOString().split('T')[0];      await createAppointment({

  const allSteps: BookStep[] = ['region', 'clinic', 'specialty', 'doctor', 'date', 'confirm'];        userId: user.id,

  const idx = allSteps.indexOf(step);        doctorId: selectedDoctor.id,

        date: selectedDate,

  return (        startTime: startTime.trim(),

    <div className="max-w-2xl mx-auto">        endTime: endTime.trim(),

      {/* Progress */}      });

      <div className="mb-4">      toast.success(lang === 'UZ' ? 'Navbat olindi!' : 'Запись создана!');

        <div className="flex gap-1">{allSteps.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= idx ? 'bg-blue-500' : 'bg-gray-200'}`} />)}</div>      onBack();

        <p className="text-xs text-gray-400 text-center mt-1">{idx + 1}/{allSteps.length}</p>    } catch {

      </div>      toast.error(lang === 'UZ' ? 'Xatolik' : 'Ошибка');

    }

      {!isTg() && (    setLoading(false);

        <button onClick={goBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">  };

          <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}

        </button>  const goBack = () => {

      )}    if (step === 'clinic') setStep('region');

    else if (step === 'specialty') setStep('clinic');

      {step === 'region' && (    else if (step === 'doctor') setStep('specialty');

        <div>    else if (step === 'date') setStep('doctor');

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Hududni tanlang' : 'Выберите регион'}</h2>    else if (step === 'confirm') setStep('date');

          <div className="space-y-2">{regions.map((r: any) => <button key={r.id} onClick={() => pickRegion(r)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-blue-400 hover:shadow-sm transition font-medium">{nm(r)}</button>)}</div>    else onBack();

        </div>  };

      )}

  const today = new Date().toISOString().split('T')[0];

      {step === 'clinic' && (

        <div>  return (

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Building2 className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Klinikani tanlang' : 'Выберите клинику'}</h2>    <div className="max-w-2xl mx-auto">

          <div className="space-y-2">      <button onClick={goBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">

            {clinics.map((c: any) => <button key={c.id} onClick={() => pickClinic(c)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-green-400 hover:shadow-sm transition"><div className="font-medium">{nm(c)}</div>{c.address && <div className="text-sm text-gray-400 mt-1"><MapPin className="w-3 h-3 inline" /> {c.address}</div>}</button>)}        <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}

            {clinics.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Klinikalar topilmadi' : 'Клиники не найдены'}</p>}      </button>

          </div>

        </div>      {/* REGION */}

      )}      {step === 'region' && (

        <div>

      {step === 'specialty' && (          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

        <div>            <MapPin className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Hududni tanlang' : 'Выберите регион'}

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="w-6 h-6 text-purple-600" /> {lang === 'UZ' ? 'Mutaxassislikni tanlang' : 'Выберите специальность'}</h2>          </h2>

          <div className="space-y-2">          <div className="space-y-2">

            {specialties.map((s: any) => <button key={s.id} onClick={() => pickSpecialty(s)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-purple-400 hover:shadow-sm transition font-medium">{nm(s)}</button>)}            {regions.map((r: any) => (

            {specialties.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Mutaxassisliklar topilmadi' : 'Специальности не найдены'}</p>}              <button key={r.id} onClick={() => pickRegion(r)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-blue-400 hover:shadow-sm transition">

          </div>                <span className="font-medium">{nm(r)}</span>

        </div>              </button>

      )}            ))}

          </div>

      {step === 'doctor' && (        </div>

        <div>      )}

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Stethoscope className="w-6 h-6 text-teal-600" /> {lang === 'UZ' ? 'Shifokorni tanlang' : 'Выберите врача'}</h2>

          <div className="space-y-3">      {/* CLINIC */}

            {doctors.map((d: any) => (      {step === 'clinic' && (

              <button key={d.id} onClick={() => pickDoctor(d)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-teal-400 hover:shadow-sm transition">        <div>

                <div className="font-bold text-gray-800">{d.firstName} {d.lastName}</div>          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">            <Building2 className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Klinikani tanlang' : 'Выберите клинику'}

                  <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {sp(d)}</span>          </h2>

                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.experienceYears} {lang === 'UZ' ? 'yil' : 'лет'}</span>          <div className="space-y-2">

                  <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> {d.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span>            {clinics.map((c: any) => (

                </div>              <button key={c.id} onClick={() => pickClinic(c)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-green-400 hover:shadow-sm transition">

              </button>                <div className="font-medium">{nm(c)}</div>

            ))}                {c.address && <div className="text-sm text-gray-400 mt-1"><MapPin className="w-3 h-3 inline" /> {c.address}</div>}

            {doctors.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Shifokorlar topilmadi' : 'Врачи не найдены'}</p>}              </button>

          </div>            ))}

        </div>            {clinics.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Klinikalar topilmadi' : 'Клиники не найдены'}</p>}

      )}          </div>

        </div>

      {step === 'date' && (      )}

        <div>

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-6 h-6 text-indigo-600" /> {lang === 'UZ' ? 'Sana va vaqt' : 'Дата и время'}</h2>      {/* SPECIALTY */}

          <div className="mb-4">      {step === 'specialty' && (

            <label className="text-sm text-gray-600 mb-1 block">{lang === 'UZ' ? 'Sanani tanlang' : 'Выберите дату'}</label>        <div>

            <input type="date" min={today} value={selectedDate} onChange={(e) => loadSlots(e.target.value)} className="input" />          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

          </div>            <Award className="w-6 h-6 text-purple-600" /> {lang === 'UZ' ? 'Mutaxassislikni tanlang' : 'Выберите специальность'}

          {selectedDate && (          </h2>

            <div>          <div className="space-y-2">

              <p className="text-sm text-gray-600 mb-2">{lang === 'UZ' ? 'Bo\'sh vaqtlar' : 'Свободное время'}:</p>            {specialties.map((s: any) => (

              {slots.length > 0 ? (              <button key={s.id} onClick={() => pickSpecialty(s)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-purple-400 hover:shadow-sm transition font-medium">

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">                {nm(s)}

                  {slots.map((s: any) => {              </button>

                    const label = typeof s === 'string' ? s : `${s.startTime}-${s.endTime}`;            ))}

                    return <button key={label} onClick={() => { setSelectedSlot(label); setStep('confirm'); }} className={`p-2 rounded-lg border text-sm font-medium transition ${selectedSlot === label ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-400'}`}><Clock className="w-3 h-3 inline mr-1" />{label}</button>;            {specialties.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Mutaxassisliklar topilmadi' : 'Специальности не найдены'}</p>}

                  })}          </div>

                </div>        </div>

              ) : (      )}

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">

                  <p className="text-sm text-red-600 font-medium">{lang === 'UZ' ? "Dam olish kuni" : "Выходной"}</p>      {/* DOCTOR */}

                </div>      {step === 'doctor' && (

              )}        <div>

            </div>          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

          )}            <Stethoscope className="w-6 h-6 text-teal-600" /> {lang === 'UZ' ? 'Shifokorni tanlang' : 'Выберите врача'}

        </div>          </h2>

      )}          <div className="space-y-3">

            {doctors.map((d: any) => (

      {step === 'confirm' && selectedDoctor && (              <button key={d.id} onClick={() => pickDoctor(d)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-teal-400 hover:shadow-sm transition">

        <div>                <div className="font-bold text-gray-800">{d.firstName} {d.lastName}</div>

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tasdiqlash' : 'Подтверждение'}</h2>                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">

          <div className="bg-white rounded-lg border p-5 space-y-3 mb-4">                  <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {sp(d)}</span>

            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Shifokor' : 'Врач'}</span><span className="font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</span></div>                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.experienceYears} {lang === 'UZ' ? 'yil' : 'лет'}</span>

            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Mutaxassislik' : 'Специальность'}</span><span className="font-medium">{sp(selectedDoctor)}</span></div>                  <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> {d.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span>

            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Klinika' : 'Клиника'}</span><span className="font-medium">{nm(selectedClinic)}</span></div>                </div>

            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Sana' : 'Дата'}</span><span className="font-medium">{selectedDate}</span></div>              </button>

            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Vaqt' : 'Время'}</span><span className="font-medium">{selectedSlot}</span></div>            ))}

            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Narx' : 'Стоимость'}</span><span className="font-bold text-green-600">{selectedDoctor.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span></div>            {doctors.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Shifokorlar topilmadi' : 'Врачи не найдены'}</p>}

          </div>          </div>

          <button onClick={confirmBooking} disabled={loading} className="btn-primary w-full">{loading ? '...' : lang === 'UZ' ? '✅ Tasdiqlash' : '✅ Подтвердить'}</button>        </div>

        </div>      )}

      )}

    </div>      {/* DATE & SLOT */}

  );      {step === 'date' && (

}        <div>

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

/* ════════════════════════ APPOINTMENTS LIST ════════════════════════ */            <Calendar className="w-6 h-6 text-indigo-600" /> {lang === 'UZ' ? 'Sana va vaqt' : 'Дата и время'}

function AppointmentsList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {          </h2>

  const [list, setList] = useState<any[]>([]);          <div className="mb-4">

  const [loading, setLoading] = useState(true);            <label className="text-sm text-gray-600 mb-1 block">{lang === 'UZ' ? 'Sanani tanlang' : 'Выберите дату'}</label>

  const load = useCallback(async () => { setLoading(true); try { const { data } = await getUserAppointments(user.id); setList(data); } catch {} setLoading(false); }, [user.id]);            <input type="date" min={today} value={selectedDate} onChange={(e) => loadSlots(e.target.value)} className="input" />

  useEffect(() => { load(); }, [load]);          </div>

          {selectedDate && (

  const cancel = async (appId: string) => {            <div>

    if (!confirm(lang === 'UZ' ? 'Bekor qilinsinmi?' : 'Отменить?')) return;              <p className="text-sm text-gray-600 mb-2">{lang === 'UZ' ? 'Bo\'sh vaqtlar' : 'Свободное время'}:</p>

    try { await cancelUserAppointment(user.id, appId); toast.success(lang === 'UZ' ? 'Bekor qilindi' : 'Отменено'); load(); } catch { toast.error('Xatolik'); }              {slots.length > 0 ? (

  };                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">

                  {slots.map((s: any) => {

  const badge = (s: string) => {                    const label = typeof s === 'string' ? s : `${s.startTime}-${s.endTime}`;

    const m: Record<string, { c: string; l: string }> = {                    return (

      PENDING: { c: 'bg-yellow-100 text-yellow-700', l: lang === 'UZ' ? 'Kutilmoqda' : 'Ожидание' },                      <button

      ACCEPTED: { c: 'bg-blue-100 text-blue-700', l: lang === 'UZ' ? 'Qabul qilindi' : 'Принят' },                        key={label}

      COMPLETED: { c: 'bg-green-100 text-green-700', l: lang === 'UZ' ? 'Tugallandi' : 'Завершён' },                        onClick={() => { setSelectedSlot(label); setStep('confirm'); }}

      CANCELLED: { c: 'bg-red-100 text-red-700', l: lang === 'UZ' ? 'Bekor qilingan' : 'Отменён' },                        className={`p-2 rounded-lg border text-sm font-medium transition ${

    };                          selectedSlot === label ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-400'

    const b = m[s] || m.PENDING;                        }`}

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.c}`}>{b.l}</span>;                      >

  };                        <Clock className="w-3 h-3 inline mr-1" />{label}

                      </button>

  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;                    );

  return (                  })}

    <div>                </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDays className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Navbatlarim' : 'Мои записи'}</h2>              ) : (

      <div className="space-y-3">                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">

        {list.map((a: any) => (                  <p className="text-sm text-red-600 font-medium">

          <div key={a.id} className="bg-white rounded-lg border p-4">                    {lang === 'UZ' ? "Bu kuni shifokor qabul qilmaydi — dam olish kuni" : "Врач не принимает в этот день — выходной"}

            <div className="flex items-start justify-between">                  </p>

              <div>                </div>

                <div className="font-bold text-gray-800">{a.doctor?.firstName} {a.doctor?.lastName}</div>              )}

                <div className="text-sm text-gray-500 mt-1">{a.date?.split('T')[0]} | {a.startTime} - {a.endTime}</div>            </div>

                <div className="text-sm text-green-600 font-medium mt-1">{(a.finalPrice ?? a.doctor?.price ?? 0).toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</div>          )}

              </div>        </div>

              {badge(a.status)}      )}

            </div>

            {a.status === 'COMPLETED' && a.diagnosis && (      {/* CONFIRM */}

              <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200 text-sm space-y-1">      {step === 'confirm' && selectedDoctor && (

                <p className="text-green-800"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {a.diagnosis.description}</p>        <div>

                {a.diagnosis.prescription && <p className="text-green-700"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {a.diagnosis.prescription}</p>}          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

              </div>            <CheckCircle className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tasdiqlash' : 'Подтверждение'}

            )}          </h2>

            {a.status === 'PENDING' && (          <div className="bg-white rounded-lg border p-5 space-y-3 mb-4">

              <button onClick={() => cancel(a.id)} className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"><XCircle className="w-4 h-4" /> {lang === 'UZ' ? 'Bekor qilish' : 'Отменить'}</button>            <div className="flex justify-between">

            )}              <span className="text-gray-500">{lang === 'UZ' ? 'Shifokor' : 'Врач'}</span>

          </div>              <span className="font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</span>

        ))}            </div>

        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Navbatlar topilmadi' : 'Записей нет'}</p>}            <div className="flex justify-between">

      </div>              <span className="text-gray-500">{lang === 'UZ' ? 'Mutaxassislik' : 'Специальность'}</span>

    </div>              <span className="font-medium">{sp(selectedDoctor)}</span>

  );            </div>

}            <div className="flex justify-between">

              <span className="text-gray-500">{lang === 'UZ' ? 'Klinika' : 'Клиника'}</span>

/* ════════════════════════ DIAGNOSES LIST ════════════════════════ */              <span className="font-medium">{nm(selectedClinic)}</span>

function DiagnosesList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {            </div>

  const [list, setList] = useState<any[]>([]);            <div className="flex justify-between">

  const [loading, setLoading] = useState(true);              <span className="text-gray-500">{lang === 'UZ' ? 'Sana' : 'Дата'}</span>

  useEffect(() => { getUserDiagnoses(user.id).then(({ data }) => setList(data)).catch(() => {}).finally(() => setLoading(false)); }, [user.id]);              <span className="font-medium">{selectedDate}</span>

  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;            </div>

  return (            <div className="flex justify-between">

    <div>              <span className="text-gray-500">{lang === 'UZ' ? 'Vaqt' : 'Время'}</span>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы'}</h2>              <span className="font-medium">{selectedSlot}</span>

      <div className="space-y-3">            </div>

        {list.map((d: any) => (            <div className="flex justify-between">

          <div key={d.id} className="bg-white rounded-lg border p-4">              <span className="text-gray-500">{lang === 'UZ' ? 'Narx' : 'Стоимость'}</span>

            <div className="font-bold text-gray-800">{d.doctor?.firstName} {d.doctor?.lastName}</div>              <span className="font-bold text-green-600">{selectedDoctor.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span>

            <div className="text-sm text-gray-500 mt-1">{d.createdAt?.split('T')[0]}</div>            </div>

            <p className="mt-2 text-gray-700"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {d.description}</p>          </div>

            {d.prescription && <p className="mt-1 text-gray-600 text-sm"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {d.prescription}</p>}          <button onClick={confirmBooking} disabled={loading} className="btn-primary w-full">

          </div>            {loading ? '...' : lang === 'UZ' ? 'Tasdiqlash' : 'Подтвердить'}

        ))}          </button>

        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Tashxislar topilmadi' : 'Диагнозов нет'}</p>}        </div>

      </div>      )}

    </div>    </div>

  );  );

}}



/* ════════════════════════ MAIN MENU ════════════════════════ *//* ════════════════════════ APPOINTMENTS LIST ════════════════════════ */

type MenuView = 'menu' | 'booking' | 'appointments' | 'diagnoses';function AppointmentsList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {

  const [list, setList] = useState<any[]>([]);

function UserMenu({ user, lang, onLogout }: { user: any; lang: 'UZ' | 'RU'; onLogout: () => void }) {  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<MenuView>('menu');

  const load = useCallback(async () => {

  useEffect(() => {    setLoading(true);

    const tg = getTg();    try { const { data } = await getUserAppointments(user.id); setList(data); }

    if (tg && view !== 'menu') { tg.BackButton.show(); const h = () => setView('menu'); tg.BackButton.onClick(h); return () => { tg.BackButton.offClick(h); tg.BackButton.hide(); }; }    catch { toast.error('Xatolik'); }

    if (tg && view === 'menu') tg.BackButton.hide();    setLoading(false);

  }, [view]);  }, [user.id]);



  if (view === 'booking') return <div className="min-h-screen bg-gray-50 p-4"><BookingFlow user={user} lang={lang} onBack={() => setView('menu')} /></div>;  useEffect(() => { load(); }, [load]);

  if (view === 'appointments') return (

    <div className="min-h-screen bg-gray-50 p-4"><div className="max-w-2xl mx-auto">  const cancel = async (appId: string) => {

      {!isTg() && <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 mb-4"><ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}</button>}    if (!confirm(lang === 'UZ' ? 'Bekor qilinsinmi?' : 'Отменить?')) return;

      <AppointmentsList user={user} lang={lang} />    try { await cancelUserAppointment(user.id, appId); toast.success(lang === 'UZ' ? 'Bekor qilindi' : 'Отменено'); load(); }

    </div></div>    catch { toast.error('Xatolik'); }

  );  };

  if (view === 'diagnoses') return (

    <div className="min-h-screen bg-gray-50 p-4"><div className="max-w-2xl mx-auto">  const statusBadge = (s: string) => {

      {!isTg() && <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 mb-4"><ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}</button>}    const m: Record<string, { color: string; icon: React.ReactNode; label: string }> = {

      <DiagnosesList user={user} lang={lang} />      PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Kutilmoqda' : 'Ожидание' },

    </div></div>      ACCEPTED: { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Qabul qilindi' : 'Принят' },

  );      COMPLETED: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Tugallandi' : 'Завершён' },

      CANCELLED: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Bekor qilingan' : 'Отменён' },

  const items = [    };

    { key: 'booking', icon: <CalendarDays className="w-8 h-8 text-blue-600" />, title: lang === 'UZ' ? 'Navbat olish' : 'Записаться', desc: lang === 'UZ' ? "Shifokorga yozilish" : 'Запись к врачу', color: 'hover:border-blue-400' },    const b = m[s] || m.PENDING;

    { key: 'appointments', icon: <ClipboardList className="w-8 h-8 text-purple-600" />, title: lang === 'UZ' ? 'Navbatlarim' : 'Мои записи', desc: lang === 'UZ' ? "Barcha navbatlar" : 'Все записи', color: 'hover:border-purple-400' },    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${b.color}`}>{b.icon} {b.label}</span>;

    { key: 'diagnoses', icon: <FileText className="w-8 h-8 text-green-600" />, title: lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы', desc: lang === 'UZ' ? "Shifokor xulosalari" : 'Заключения врачей', color: 'hover:border-green-400' },  };

  ];

  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;

  return (

    <div className="min-h-screen bg-gray-50">  return (

      <header className="bg-white shadow-sm border-b">    <div>

        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

          <div className="flex items-center gap-3">        <CalendarDays className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Navbatlarim' : 'Мои записи'}

            <Image src="/logo.PNG" alt="MedBook" width={36} height={36} className="rounded-lg" />      </h2>

            <div><h1 className="text-lg font-bold text-gray-800">MedBook</h1><p className="text-xs text-gray-500">{user.firstName} {user.lastName}</p></div>      <div className="space-y-3">

          </div>        {list.map((a: any) => (

          {!isTg() && <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"><LogOut className="w-4 h-4" /> {lang === 'UZ' ? 'Chiqish' : 'Выход'}</button>}          <div key={a.id} className="bg-white rounded-lg border p-4">

        </div>            <div className="flex items-start justify-between">

      </header>              <div>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-3">                <div className="font-bold text-gray-800">{a.doctor?.firstName} {a.doctor?.lastName}</div>

        {items.map((it) => (                <div className="text-sm text-gray-500 mt-1">{a.date?.split('T')[0]} | {a.startTime} - {a.endTime}</div>

          <button key={it.key} onClick={() => setView(it.key as MenuView)} className={`w-full text-left p-5 bg-white rounded-xl border transition shadow-sm hover:shadow-md ${it.color}`}>                {(a.finalPrice != null || a.doctor?.price != null) && (

            <div className="flex items-center gap-4">{it.icon}<div><div className="font-bold text-gray-800">{it.title}</div><div className="text-sm text-gray-500">{it.desc}</div></div></div>                  <div className="text-sm text-green-600 font-medium mt-1">

          </button>                    {(a.finalPrice ?? a.doctor?.price ?? 0).toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}

        ))}                  </div>

      </div>                )}

    </div>              </div>

  );              {statusBadge(a.status)}

}            </div>

            {/* Diagnosis & prescription for completed */}

/* ════════════════════════ MAIN PAGE ════════════════════════ */            {a.status === 'COMPLETED' && a.diagnosis && (

export default function UserPage() {              <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200 space-y-1 text-sm">

  const { currentUser, setCurrentUser, clearUser, _hasHydrated } = useAuthStore();                <p className="text-green-800"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {a.diagnosis.description}</p>

  const [lang, setLang] = useState<'UZ' | 'RU' | null>(null);                {a.diagnosis.prescription && (

  const [tgUser, setTgUser] = useState<any>(null);                  <p className="text-green-700"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {a.diagnosis.prescription}</p>

  const [ready, setReady] = useState(false);                )}

              </div>

  // Telegram SDK loaded            )}

  const onSdkLoad = useCallback(() => {            {a.status === 'PENDING' && (

    const tg = getTg();              <button onClick={() => cancel(a.id)} className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1">

    if (tg?.initDataUnsafe?.user) {                <XCircle className="w-4 h-4" /> {lang === 'UZ' ? 'Bekor qilish' : 'Отменить'}

      const u = tg.initDataUnsafe.user;              </button>

      setTgUser(u);            )}

      tg.expand();          </div>

      tg.ready();        ))}

      // Auto lang        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Navbatlar topilmadi' : 'Записей нет'}</p>}

      if (!lang) setLang(u.language_code === 'ru' ? 'RU' : 'UZ');      </div>

      // Auto login    </div>

      if (!currentUser) {  );

        getUserByTelegramId(String(u.id))}

          .then(({ data }) => { setCurrentUser(data); setReady(true); })

          .catch(() => setReady(true));/* ════════════════════════ DIAGNOSES LIST ════════════════════════ */

        return;function DiagnosesList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {

      }  const [list, setList] = useState<any[]>([]);

    }  const [loading, setLoading] = useState(true);

    setReady(true);

  }, []); // eslint-disable-line react-hooks/exhaustive-deps  useEffect(() => {

    getUserDiagnoses(user.id).then(({ data }) => setList(data)).catch(() => {}).finally(() => setLoading(false));

  const TgScript = <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" onLoad={onSdkLoad} />;  }, [user.id]);



  if (!_hasHydrated || !ready) return <>{TgScript}<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div className="text-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto" /><p className="text-sm text-gray-500 mt-3">MedBook</p></div></div></>;  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;

  if (!lang) return <>{TgScript}<LangPage onSelect={setLang} /></>;

  if (!currentUser) return <>{TgScript}<RegisterPage lang={lang} onDone={setCurrentUser} tgUser={tgUser} /></>;  return (

  return <>{TgScript}<UserMenu user={currentUser} lang={lang} onLogout={() => { clearUser(); setLang(null); }} /></>;    <div>

}      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

        <FileText className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы'}
      </h2>
      <div className="space-y-3">
        {list.map((d: any) => (
          <div key={d.id} className="bg-white rounded-lg border p-4">
            <div className="font-bold text-gray-800">{d.doctor?.firstName} {d.doctor?.lastName}</div>
            <div className="text-sm text-gray-500 mt-1">{d.createdAt?.split('T')[0]}</div>
            <p className="mt-2 text-gray-700"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {d.description}</p>
            {d.prescription && (
              <p className="mt-1 text-gray-600 text-sm"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {d.prescription}</p>
            )}
            {d.appointment?.finalPrice != null && (
              <p className="mt-1 text-sm text-green-600 font-medium">{lang === 'UZ' ? 'Narx:' : 'Стоимость:'} {d.appointment.finalPrice.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</p>
            )}
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Tashxislar topilmadi' : 'Диагнозов нет'}</p>}
      </div>
    </div>
  );
}

/* ════════════════════════ MAIN MENU ════════════════════════ */
type MenuView = 'menu' | 'booking' | 'appointments' | 'diagnoses';

function UserMenu({ user, lang, onLogout }: { user: any; lang: 'UZ' | 'RU'; onLogout: () => void }) {
  const [view, setView] = useState<MenuView>('menu');

  if (view === 'booking') return (
    <div className="min-h-screen bg-gray-50 p-4">
      <BookingFlow user={user} lang={lang} onBack={() => setView('menu')} />
    </div>
  );
  if (view === 'appointments') return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}
        </button>
        <AppointmentsList user={user} lang={lang} />
      </div>
    </div>
  );
  if (view === 'diagnoses') return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}
        </button>
        <DiagnosesList user={user} lang={lang} />
      </div>
    </div>
  );

  const items = [
    {
      key: 'booking',
      icon: <CalendarDays className="w-8 h-8 text-blue-600" />,
      title: lang === 'UZ' ? 'Navbat olish' : 'Записаться',
      desc: lang === 'UZ' ? "Shifokorga yozilish" : 'Запись к врачу',
      color: 'hover:border-blue-400',
    },
    {
      key: 'appointments',
      icon: <ClipboardList className="w-8 h-8 text-purple-600" />,
      title: lang === 'UZ' ? 'Navbatlarim' : 'Мои записи',
      desc: lang === 'UZ' ? "Barcha navbatlar" : 'Все записи',
      color: 'hover:border-purple-400',
    },
    {
      key: 'diagnoses',
      icon: <FileText className="w-8 h-8 text-green-600" />,
      title: lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы',
      desc: lang === 'UZ' ? "Shifokor xulosalari" : 'Заключения врачей',
      color: 'hover:border-green-400',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.PNG" alt="MedBook" width={36} height={36} className="rounded-lg" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">MedBook</h1>
              <p className="text-xs text-gray-500">{user.firstName} {user.lastName}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm">
            <LogOut className="w-4 h-4" /> {lang === 'UZ' ? 'Chiqish' : 'Выход'}
          </button>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="space-y-3">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setView(it.key as MenuView)}
              className={`w-full text-left p-5 bg-white rounded-xl border transition shadow-sm hover:shadow-md ${it.color}`}
            >
              <div className="flex items-center gap-4">
                {it.icon}
                <div>
                  <div className="font-bold text-gray-800">{it.title}</div>
                  <div className="text-sm text-gray-500">{it.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════ MAIN PAGE ════════════════════════ */
export default function UserPage() {
  const { currentUser, setCurrentUser, clearUser, _hasHydrated } = useAuthStore();
  const [lang, setLang] = useState<'UZ' | 'RU' | null>(null);

  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!lang) return <LangPage onSelect={setLang} />;
  if (!currentUser) return <RegisterPage lang={lang} onDone={(u) => setCurrentUser(u)} />;
  return <UserMenu user={currentUser} lang={lang} onLogout={() => { clearUser(); setLang(null); }} />;
}
