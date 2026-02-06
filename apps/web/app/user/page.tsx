'use client';'use client';'use client';



import { useState, useEffect, useCallback } from 'react';

import Image from 'next/image';

import Script from 'next/script';import { useState, useEffect, useCallback } from 'react';import { useState, useEffect, useCallback } from 'react';

import { useAuthStore } from '../../lib/store';

import {import Image from 'next/image';import Image from 'next/image';

  registerUser,

  getUserByTelegramId,import Script from 'next/script';import { useAuthStore } from '../../lib/store';

  getUserAppointments,

  getUserDiagnoses,import { useAuthStore } from '../../lib/store';import {

  cancelUserAppointment,

  getRegions,import {  registerUser, getUserByPhone, getUserAppointments, getUserDiagnoses,

  getClinicsByRegion,

  getClinicSpecialties,  registerUser, getUserByTelegramId, getUserAppointments, getUserDiagnoses,  cancelUserAppointment, getRegions, getClinicsByRegion, getClinicSpecialties,

  getDoctorsByClinicAndSpecialty,

  getDoctorSlots,  cancelUserAppointment, getRegions, getClinicsByRegion, getClinicSpecialties,  getDoctorsByClinicAndSpecialty, getDoctorDetail, getDoctorSlots, createAppointment,

  createAppointment,

} from '../../lib/api';  getDoctorsByClinicAndSpecialty, getDoctorSlots, createAppointment,} from '../../lib/api';

import {

  User,} from '../../lib/api';import {

  Phone,

  Globe,import {  User, Phone, Globe, ArrowLeft, Calendar, Building2, Stethoscope,

  ArrowLeft,

  Calendar,  User, Phone, Globe, ArrowLeft, Calendar, Building2, Stethoscope,  Clock, Star, Award, Banknote, MapPin, LogOut, CalendarDays,

  Building2,

  Stethoscope,  Clock, Award, Banknote, MapPin, LogOut, CalendarDays,  ClipboardList, FileText, CheckCircle, XCircle, AlertCircle,

  Clock,

  Award,  ClipboardList, FileText, CheckCircle, XCircle, AlertCircle, Smartphone,} from 'lucide-react';

  Banknote,

  MapPin,} from 'lucide-react';import toast from 'react-hot-toast';

  LogOut,

  CalendarDays,import toast from 'react-hot-toast';

  ClipboardList,

  FileText,/* ════════════════════════ LANGUAGE SELECT ════════════════════════ */

  CheckCircle,

  XCircle,/* ═══════ Telegram WebApp helpers ═══════ */function LangPage({ onSelect }: { onSelect: (l: 'UZ' | 'RU') => void }) {

  AlertCircle,

  Smartphone,function getTg(): any {  return (

} from 'lucide-react';

import toast from 'react-hot-toast';  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">



/* ═══════ Telegram WebApp helpers ═══════ */    return (window as any).Telegram.WebApp;      <div className="card max-w-sm w-full text-center">

function getTg(): any {

  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {  }        <div className="flex justify-center mb-4">

    return (window as any).Telegram.WebApp;

  }  return null;          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />

  return null;

}}        </div>



function isTg(): boolean {function isTg(): boolean { return !!getTg()?.initDataUnsafe?.user; }        <h1 className="text-2xl font-bold mb-2">MedBook</h1>

  return !!getTg()?.initDataUnsafe?.user;

}        <p className="text-gray-500 mb-6">Tilni tanlang / Выберите язык</p>



/* ════════════════════════ LANGUAGE SELECT ════════════════════════ *//* ════════════════════════ LANGUAGE SELECT ════════════════════════ */        <div className="space-y-3">

function LangPage({ onSelect }: { onSelect: (l: 'UZ' | 'RU') => void }) {

  return (function LangPage({ onSelect }: { onSelect: (l: 'UZ' | 'RU') => void }) {          <button onClick={() => onSelect('UZ')} className="btn-primary w-full flex items-center justify-center gap-2">

    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100">

      <div className="card max-w-sm w-full text-center">  return (            <Globe className="w-5 h-5" /> O&#39;zbek tili

        <div className="flex justify-center mb-4">

          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-100">          </button>

        </div>

        <h1 className="text-2xl font-bold mb-2">MedBook</h1>      <div className="card max-w-sm w-full text-center">          <button onClick={() => onSelect('RU')} className="w-full py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">

        <p className="text-gray-500 mb-6">Tilni tanlang / Выберите язык</p>

        <div className="space-y-3">        <div className="flex justify-center mb-4">            <Globe className="w-5 h-5" /> Русский язык

          <button

            onClick={() => onSelect('UZ')}          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />          </button>

            className="btn-primary w-full flex items-center justify-center gap-2"

          >        </div>        </div>

            <Globe className="w-5 h-5" /> O&apos;zbek tili

          </button>        <h1 className="text-2xl font-bold mb-2">MedBook</h1>      </div>

          <button

            onClick={() => onSelect('RU')}        <p className="text-gray-500 mb-6">Tilni tanlang / Выберите язык</p>    </div>

            className="w-full py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"

          >        <div className="space-y-3">  );

            <Globe className="w-5 h-5" /> Русский язык

          </button>          <button onClick={() => onSelect('UZ')} className="btn-primary w-full flex items-center justify-center gap-2">}

        </div>

      </div>            <Globe className="w-5 h-5" /> O&#39;zbek tili

    </div>

  );          </button>/* ════════════════════════ REGISTER ════════════════════════ */

}

          <button onClick={() => onSelect('RU')} className="w-full py-3 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2">function RegisterPage({ lang, onDone }: { lang: 'UZ' | 'RU'; onDone: (u: any) => void }) {

/* ════════════════════════ REGISTER ════════════════════════ */

function RegisterPage({            <Globe className="w-5 h-5" /> Русский язык  const [phone, setPhone] = useState('+998');

  lang,

  onDone,          </button>  const [firstName, setFirstName] = useState('');

  tgUser,

}: {        </div>  const [lastName, setLastName] = useState('');

  lang: 'UZ' | 'RU';

  onDone: (u: any) => void;      </div>  const [loading, setLoading] = useState(false);

  tgUser?: any;

}) {    </div>  const t = lang === 'UZ'

  const [phone, setPhone] = useState('+998');

  const [firstName, setFirstName] = useState(tgUser?.first_name || '');  );    ? { title: 'Ro\'yxatdan o\'tish', ph: 'Telefon raqam', fn: 'Ism', ln: 'Familiya', btn: 'Davom etish' }

  const [lastName, setLastName] = useState(tgUser?.last_name || '');

  const [loading, setLoading] = useState(false);}    : { title: 'Регистрация', ph: 'Номер телефона', fn: 'Имя', ln: 'Фамилия', btn: 'Продолжить' };



  const t =

    lang === 'UZ'

      ? { title: "Ro'yxatdan o'tish", fn: 'Ism', ln: 'Familiya', btn: 'Davom etish' }/* ════════════════════════ REGISTER ════════════════════════ */  const handlePhone = (val: string) => {

      : { title: 'Регистрация', fn: 'Имя', ln: 'Фамилия', btn: 'Продолжить' };

function RegisterPage({ lang, onDone, tgUser }: { lang: 'UZ' | 'RU'; onDone: (u: any) => void; tgUser?: any }) {    let v = val.replace(/[^0-9+]/g, '');

  const handlePhone = (val: string) => {

    let v = val.replace(/[^0-9+]/g, '');  const [phone, setPhone] = useState('+998');    if (!v.startsWith('+998')) v = '+998';

    if (!v.startsWith('+998')) v = '+998';

    if (v.length > 13) v = v.slice(0, 13);  const [firstName, setFirstName] = useState(tgUser?.first_name || '');    if (v.length > 13) v = v.slice(0, 13);

    setPhone(v);

  };  const [lastName, setLastName] = useState(tgUser?.last_name || '');    setPhone(v);



  const submit = async () => {  const [loading, setLoading] = useState(false);  };

    if (phone.length !== 13) {

      return toast.error(  const t = lang === 'UZ'

        lang === 'UZ' ? "To'g'ri telefon raqam kiriting" : 'Введите корректный номер',

      );    ? { title: 'Ro\'yxatdan o\'tish', fn: 'Ism', ln: 'Familiya', btn: 'Davom etish' }  const submit = async () => {

    }

    setLoading(true);    : { title: 'Регистрация', fn: 'Имя', ln: 'Фамилия', btn: 'Продолжить' };    if (phone.length !== 13) return toast.error(lang === 'UZ' ? "To'g'ri telefon raqam kiriting: +998XXXXXXXXX" : 'Введите корректный номер: +998XXXXXXXXX');

    try {

      const payload: any = { phone, firstName, lastName, language: lang };    setLoading(true);

      if (tgUser?.id) payload.telegramId = String(tgUser.id);

      const { data } = await registerUser(payload);  const handlePhone = (val: string) => {    try {

      toast.success(lang === 'UZ' ? 'Muvaffaqiyatli!' : 'Успешно!');

      onDone(data);    let v = val.replace(/[^0-9+]/g, '');      const { data } = await registerUser({ phone, firstName, lastName, language: lang });

    } catch {

      toast.error(lang === 'UZ' ? 'Xatolik yuz berdi' : 'Произошла ошибка');    if (!v.startsWith('+998')) v = '+998';      toast.success(lang === 'UZ' ? 'Muvaffaqiyatli!' : 'Успешно!');

    }

    setLoading(false);    if (v.length > 13) v = v.slice(0, 13);      onDone(data);

  };

    setPhone(v);    } catch {

  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">  };      toast.error(lang === 'UZ' ? 'Xatolik yuz berdi' : 'Произошла ошибка');

      <div className="card max-w-md w-full">

        <div className="flex justify-center mb-4">    }

          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />

        </div>  const submit = async () => {    setLoading(false);

        <h2 className="text-xl font-bold text-center mb-6">{t.title}</h2>

        {tgUser && (    if (phone.length !== 13) return toast.error(lang === 'UZ' ? "To'g'ri telefon raqam kiriting" : 'Введите корректный номер');  };

          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center text-sm text-blue-700">

            <Smartphone className="w-4 h-4 inline mr-1" />    setLoading(true);

            Telegram: {tgUser.first_name} {tgUser.last_name || ''}

          </div>    try {  return (

        )}

        <div className="space-y-4">      const payload: any = { phone, firstName, lastName, language: lang };    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">

          <div className="relative">

            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />      if (tgUser?.id) payload.telegramId = String(tgUser.id);      <div className="card max-w-md w-full">

            <input

              value={phone}      const { data } = await registerUser(payload);        <div className="flex justify-center mb-4">

              onChange={(e) => handlePhone(e.target.value)}

              placeholder="+998XXXXXXXXX"      toast.success(lang === 'UZ' ? 'Muvaffaqiyatli!' : 'Успешно!');          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />

              className="input pl-11"

            />      onDone(data);        </div>

          </div>

          <input    } catch {        <h2 className="text-xl font-bold text-center mb-6">{t.title}</h2>

            value={firstName}

            onChange={(e) => setFirstName(e.target.value)}      toast.error(lang === 'UZ' ? 'Xatolik yuz berdi' : 'Произошла ошибка');        <div className="space-y-4">

            placeholder={t.fn}

            className="input"    }          <div className="relative">

          />

          <input    setLoading(false);            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />

            value={lastName}

            onChange={(e) => setLastName(e.target.value)}  };            <input value={phone} onChange={(e) => handlePhone(e.target.value)} placeholder="+998XXXXXXXXX" className="input pl-11" />

            placeholder={t.ln}

            className="input"          </div>

          />

          <button onClick={submit} disabled={loading} className="btn-primary w-full">  return (          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.fn} className="input" />

            {loading ? '...' : t.btn}

          </button>    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center p-4">          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.ln} className="input" />

        </div>

      </div>      <div className="card max-w-md w-full">          <button onClick={submit} disabled={loading} className="btn-primary w-full">

    </div>

  );        <div className="flex justify-center mb-4">            {loading ? '...' : t.btn}

}

          <Image src="/logo.PNG" alt="MedBook" width={64} height={64} className="rounded-xl" />          </button>

/* ════════════════════════ BOOKING FLOW ════════════════════════ */

type BookStep = 'region' | 'clinic' | 'specialty' | 'doctor' | 'date' | 'confirm';        </div>        </div>



function BookingFlow({        <h2 className="text-xl font-bold text-center mb-6">{t.title}</h2>      </div>

  user,

  lang,        {tgUser && (    </div>

  onBack,

}: {          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-center text-sm text-blue-700">  );

  user: any;

  lang: 'UZ' | 'RU';            <Smartphone className="w-4 h-4 inline mr-1" />}

  onBack: () => void;

}) {            Telegram: {tgUser.first_name} {tgUser.last_name || ''}

  const [step, setStep] = useState<BookStep>('region');

  const [regions, setRegions] = useState<any[]>([]);          </div>/* ════════════════════════ BOOKING FLOW ════════════════════════ */

  const [clinics, setClinics] = useState<any[]>([]);

  const [specialties, setSpecialties] = useState<any[]>([]);        )}type BookStep = 'region' | 'clinic' | 'specialty' | 'doctor' | 'date' | 'confirm';

  const [doctors, setDoctors] = useState<any[]>([]);

  const [slots, setSlots] = useState<any[]>([]);        <div className="space-y-4">



  const [selectedRegion, setSelectedRegion] = useState<any>(null);          <div className="relative">function BookingFlow({ user, lang, onBack }: { user: any; lang: 'UZ' | 'RU'; onBack: () => void }) {

  const [selectedClinic, setSelectedClinic] = useState<any>(null);

  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />  const [step, setStep] = useState<BookStep>('region');

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState('');            <input value={phone} onChange={(e) => handlePhone(e.target.value)} placeholder="+998XXXXXXXXX" className="input pl-11" />  const [regions, setRegions] = useState<any[]>([]);

  const [selectedSlot, setSelectedSlot] = useState('');

  const [loading, setLoading] = useState(false);          </div>  const [clinics, setClinics] = useState<any[]>([]);



  const nm = (item: any) => (lang === 'UZ' ? item.nameUz : item.nameRu);          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder={t.fn} className="input" />  const [specialties, setSpecialties] = useState<any[]>([]);

  const sp = (d: any) => (lang === 'UZ' ? d.specialtyUz : d.specialtyRu);

          <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder={t.ln} className="input" />  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {

    getRegions().then(({ data }) => setRegions(data));          <button onClick={submit} disabled={loading} className="btn-primary w-full">  const [slots, setSlots] = useState<string[]>([]);

  }, []);

            {loading ? '...' : t.btn}  const [isDayOff, setIsDayOff] = useState(false);

  const pickRegion = async (r: any) => {

    setSelectedRegion(r);          </button>

    const { data } = await getClinicsByRegion(r.id);

    setClinics(data);        </div>  const [selectedRegion, setSelectedRegion] = useState<any>(null);

    setStep('clinic');

  };      </div>  const [selectedClinic, setSelectedClinic] = useState<any>(null);



  const pickClinic = async (c: any) => {    </div>  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);

    setSelectedClinic(c);

    try {  );  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

      const { data } = await getClinicSpecialties(c.id);

      setSpecialties(data);}  const [selectedDate, setSelectedDate] = useState('');

    } catch {

      setSpecialties([]);  const [selectedSlot, setSelectedSlot] = useState('');

    }

    setStep('specialty');/* ════════════════════════ BOOKING FLOW ════════════════════════ */  const [loading, setLoading] = useState(false);

  };

type BookStep = 'region' | 'clinic' | 'specialty' | 'doctor' | 'date' | 'confirm';

  const pickSpecialty = async (s: any) => {

    setSelectedSpecialty(s);  const nm = (item: any) => lang === 'UZ' ? item.nameUz : item.nameRu;

    const { data } = await getDoctorsByClinicAndSpecialty(selectedClinic.id, s.id);

    setDoctors(data);function BookingFlow({ user, lang, onBack }: { user: any; lang: 'UZ' | 'RU'; onBack: () => void }) {  const sp = (d: any) => lang === 'UZ' ? d.specialtyUz : d.specialtyRu;

    setStep('doctor');

  };  const [step, setStep] = useState<BookStep>('region');



  const pickDoctor = (d: any) => {  const [regions, setRegions] = useState<any[]>([]);  useEffect(() => {

    setSelectedDoctor(d);

    setSelectedDate('');  const [clinics, setClinics] = useState<any[]>([]);    getRegions().then(({ data }) => setRegions(data));

    setSlots([]);

    setStep('date');  const [specialties, setSpecialties] = useState<any[]>([]);  }, []);

  };

  const [doctors, setDoctors] = useState<any[]>([]);

  const loadSlots = async (date: string) => {

    setSelectedDate(date);  const [slots, setSlots] = useState<any[]>([]);  const pickRegion = async (r: any) => {

    setSelectedSlot('');

    try {    setSelectedRegion(r);

      const { data } = await getDoctorSlots(selectedDoctor.id, date);

      setSlots(Array.isArray(data) ? data.filter((s: any) => s.available !== false) : data);  const [selectedRegion, setSelectedRegion] = useState<any>(null);    const { data } = await getClinicsByRegion(r.id);

    } catch {

      setSlots([]);  const [selectedClinic, setSelectedClinic] = useState<any>(null);    setClinics(data);

    }

  };  const [selectedSpecialty, setSelectedSpecialty] = useState<any>(null);    setStep('clinic');



  const confirmBooking = async () => {  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);  };

    if (!selectedSlot) {

      return toast.error(lang === 'UZ' ? 'Vaqtni tanlang' : 'Выберите время');  const [selectedDate, setSelectedDate] = useState('');

    }

    setLoading(true);  const [selectedSlot, setSelectedSlot] = useState('');  const pickClinic = async (c: any) => {

    try {

      const [startTime, endTime] = selectedSlot.split('-');  const [loading, setLoading] = useState(false);    setSelectedClinic(c);

      await createAppointment({

        userId: user.id,    try {

        doctorId: selectedDoctor.id,

        date: selectedDate,  const nm = (item: any) => lang === 'UZ' ? item.nameUz : item.nameRu;      const { data } = await getClinicSpecialties(c.id);

        startTime: startTime.trim(),

        endTime: endTime.trim(),  const sp = (d: any) => lang === 'UZ' ? d.specialtyUz : d.specialtyRu;      setSpecialties(data);

      });

      toast.success(lang === 'UZ' ? 'Navbat olindi! 🎉' : 'Запись создана! 🎉');    } catch {

      const tg = getTg();

      if (tg) {  useEffect(() => { getRegions().then(({ data }) => setRegions(data)); }, []);      setSpecialties([]);

        tg.showAlert(

          lang === 'UZ' ? 'Navbat muvaffaqiyatli olindi!' : 'Запись успешно создана!',    }

          () => tg.close(),

        );  const pickRegion = async (r: any) => { setSelectedRegion(r); const { data } = await getClinicsByRegion(r.id); setClinics(data); setStep('clinic'); };    setStep('specialty');

      } else {

        onBack();  const pickClinic = async (c: any) => { setSelectedClinic(c); try { const { data } = await getClinicSpecialties(c.id); setSpecialties(data); } catch { setSpecialties([]); } setStep('specialty'); };  };

      }

    } catch {  const pickSpecialty = async (s: any) => { setSelectedSpecialty(s); const { data } = await getDoctorsByClinicAndSpecialty(selectedClinic.id, s.id); setDoctors(data); setStep('doctor'); };

      toast.error(lang === 'UZ' ? 'Xatolik' : 'Ошибка');

    }  const pickDoctor = (d: any) => { setSelectedDoctor(d); setSelectedDate(''); setSlots([]); setStep('date'); };  const pickSpecialty = async (s: any) => {

    setLoading(false);

  };    setSelectedSpecialty(s);



  const goBack = useCallback(() => {  const loadSlots = async (date: string) => {    const { data } = await getDoctorsByClinicAndSpecialty(selectedClinic.id, s.id);

    if (step === 'clinic') setStep('region');

    else if (step === 'specialty') setStep('clinic');    setSelectedDate(date); setSelectedSlot('');    setDoctors(data);

    else if (step === 'doctor') setStep('specialty');

    else if (step === 'date') setStep('doctor');    try { const { data } = await getDoctorSlots(selectedDoctor.id, date); setSlots(Array.isArray(data) ? data.filter((s: any) => s.available !== false) : data); }    setStep('doctor');

    else if (step === 'confirm') setStep('date');

    else onBack();    catch { setSlots([]); }  };

  }, [step, onBack]);

  };

  // Telegram BackButton

  useEffect(() => {  const pickDoctor = (d: any) => {

    const tg = getTg();

    if (tg) {  const confirmBooking = async () => {    setSelectedDoctor(d);

      tg.BackButton.show();

      tg.BackButton.onClick(goBack);    if (!selectedSlot) return toast.error(lang === 'UZ' ? 'Vaqtni tanlang' : 'Выберите время');    setSelectedDate('');

      return () => {

        tg.BackButton.offClick(goBack);    setLoading(true);    setSlots([]);

        tg.BackButton.hide();

      };    try {    setIsDayOff(false);

    }

  }, [goBack]);      const [startTime, endTime] = selectedSlot.split('-');    setStep('date');



  const today = new Date().toISOString().split('T')[0];      await createAppointment({ userId: user.id, doctorId: selectedDoctor.id, date: selectedDate, startTime: startTime.trim(), endTime: endTime.trim() });  };

  const allSteps: BookStep[] = ['region', 'clinic', 'specialty', 'doctor', 'date', 'confirm'];

  const idx = allSteps.indexOf(step);      toast.success(lang === 'UZ' ? 'Navbat olindi! 🎉' : 'Запись создана! 🎉');



  return (      const tg = getTg();  const loadSlots = async (date: string) => {

    <div className="max-w-2xl mx-auto">

      {/* Progress bar */}      if (tg) { tg.showAlert(lang === 'UZ' ? 'Navbat muvaffaqiyatli olindi!' : 'Запись успешно создана!', () => tg.close()); }    setSelectedDate(date);

      <div className="mb-4">

        <div className="flex gap-1">      else onBack();    setSelectedSlot('');

          {allSteps.map((_, i) => (

            <div    } catch { toast.error(lang === 'UZ' ? 'Xatolik' : 'Ошибка'); }    setIsDayOff(false);

              key={i}

              className={`h-1.5 flex-1 rounded-full ${i <= idx ? 'bg-blue-500' : 'bg-gray-200'}`}    setLoading(false);    try {

            />

          ))}  };      const { data } = await getDoctorSlots(selectedDoctor.id, date);

        </div>

        <p className="text-xs text-gray-400 text-center mt-1">      const available = Array.isArray(data) ? data.filter((s: any) => s.available !== false) : data;

          {idx + 1}/{allSteps.length}

        </p>  const goBack = useCallback(() => {      if (available.length === 0) {

      </div>

    if (step === 'clinic') setStep('region');        setIsDayOff(true);

      {!isTg() && (

        <button    else if (step === 'specialty') setStep('clinic');      }

          onClick={goBack}

          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"    else if (step === 'doctor') setStep('specialty');      setSlots(available);

        >

          <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}    else if (step === 'date') setStep('doctor');    } catch {

        </button>

      )}    else if (step === 'confirm') setStep('date');      setSlots([]);



      {/* REGION */}    else onBack();      setIsDayOff(true);

      {step === 'region' && (

        <div>  }, [step, onBack]);    }

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

            <MapPin className="w-6 h-6 text-blue-600" />{' '}  };

            {lang === 'UZ' ? 'Hududni tanlang' : 'Выберите регион'}

          </h2>  // Telegram BackButton

          <div className="space-y-2">

            {regions.map((r: any) => (  useEffect(() => {  const confirmBooking = async () => {

              <button

                key={r.id}    const tg = getTg();    if (!selectedSlot) return toast.error(lang === 'UZ' ? 'Vaqtni tanlang' : 'Выберите время');

                onClick={() => pickRegion(r)}

                className="w-full text-left p-4 bg-white rounded-lg border hover:border-blue-400 hover:shadow-sm transition font-medium"    if (tg) { tg.BackButton.show(); tg.BackButton.onClick(goBack); return () => { tg.BackButton.offClick(goBack); tg.BackButton.hide(); }; }    setLoading(true);

              >

                {nm(r)}  }, [goBack]);    try {

              </button>

            ))}      const [startTime, endTime] = selectedSlot.split('-');

          </div>

        </div>  const today = new Date().toISOString().split('T')[0];      await createAppointment({

      )}

  const allSteps: BookStep[] = ['region', 'clinic', 'specialty', 'doctor', 'date', 'confirm'];        userId: user.id,

      {/* CLINIC */}

      {step === 'clinic' && (  const idx = allSteps.indexOf(step);        doctorId: selectedDoctor.id,

        <div>

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">        date: selectedDate,

            <Building2 className="w-6 h-6 text-green-600" />{' '}

            {lang === 'UZ' ? 'Klinikani tanlang' : 'Выберите клинику'}  return (        startTime: startTime.trim(),

          </h2>

          <div className="space-y-2">    <div className="max-w-2xl mx-auto">        endTime: endTime.trim(),

            {clinics.map((c: any) => (

              <button      {/* Progress */}      });

                key={c.id}

                onClick={() => pickClinic(c)}      <div className="mb-4">      toast.success(lang === 'UZ' ? 'Navbat olindi!' : 'Запись создана!');

                className="w-full text-left p-4 bg-white rounded-lg border hover:border-green-400 hover:shadow-sm transition"

              >        <div className="flex gap-1">{allSteps.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= idx ? 'bg-blue-500' : 'bg-gray-200'}`} />)}</div>      onBack();

                <div className="font-medium">{nm(c)}</div>

                {c.address && (        <p className="text-xs text-gray-400 text-center mt-1">{idx + 1}/{allSteps.length}</p>    } catch {

                  <div className="text-sm text-gray-400 mt-1">

                    <MapPin className="w-3 h-3 inline" /> {c.address}      </div>      toast.error(lang === 'UZ' ? 'Xatolik' : 'Ошибка');

                  </div>

                )}    }

              </button>

            ))}      {!isTg() && (    setLoading(false);

            {clinics.length === 0 && (

              <p className="text-gray-400 text-center py-8">        <button onClick={goBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">  };

                {lang === 'UZ' ? 'Klinikalar topilmadi' : 'Клиники не найдены'}

              </p>          <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}

            )}

          </div>        </button>  const goBack = () => {

        </div>

      )}      )}    if (step === 'clinic') setStep('region');



      {/* SPECIALTY */}    else if (step === 'specialty') setStep('clinic');

      {step === 'specialty' && (

        <div>      {step === 'region' && (    else if (step === 'doctor') setStep('specialty');

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

            <Award className="w-6 h-6 text-purple-600" />{' '}        <div>    else if (step === 'date') setStep('doctor');

            {lang === 'UZ' ? 'Mutaxassislikni tanlang' : 'Выберите специальность'}

          </h2>          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><MapPin className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Hududni tanlang' : 'Выберите регион'}</h2>    else if (step === 'confirm') setStep('date');

          <div className="space-y-2">

            {specialties.map((s: any) => (          <div className="space-y-2">{regions.map((r: any) => <button key={r.id} onClick={() => pickRegion(r)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-blue-400 hover:shadow-sm transition font-medium">{nm(r)}</button>)}</div>    else onBack();

              <button

                key={s.id}        </div>  };

                onClick={() => pickSpecialty(s)}

                className="w-full text-left p-4 bg-white rounded-lg border hover:border-purple-400 hover:shadow-sm transition font-medium"      )}

              >

                {nm(s)}  const today = new Date().toISOString().split('T')[0];

              </button>

            ))}      {step === 'clinic' && (

            {specialties.length === 0 && (

              <p className="text-gray-400 text-center py-8">        <div>  return (

                {lang === 'UZ' ? 'Mutaxassisliklar topilmadi' : 'Специальности не найдены'}

              </p>          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Building2 className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Klinikani tanlang' : 'Выберите клинику'}</h2>    <div className="max-w-2xl mx-auto">

            )}

          </div>          <div className="space-y-2">      <button onClick={goBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">

        </div>

      )}            {clinics.map((c: any) => <button key={c.id} onClick={() => pickClinic(c)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-green-400 hover:shadow-sm transition"><div className="font-medium">{nm(c)}</div>{c.address && <div className="text-sm text-gray-400 mt-1"><MapPin className="w-3 h-3 inline" /> {c.address}</div>}</button>)}        <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}



      {/* DOCTOR */}            {clinics.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Klinikalar topilmadi' : 'Клиники не найдены'}</p>}      </button>

      {step === 'doctor' && (

        <div>          </div>

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

            <Stethoscope className="w-6 h-6 text-teal-600" />{' '}        </div>      {/* REGION */}

            {lang === 'UZ' ? 'Shifokorni tanlang' : 'Выберите врача'}

          </h2>      )}      {step === 'region' && (

          <div className="space-y-3">

            {doctors.map((d: any) => (        <div>

              <button

                key={d.id}      {step === 'specialty' && (          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

                onClick={() => pickDoctor(d)}

                className="w-full text-left p-4 bg-white rounded-lg border hover:border-teal-400 hover:shadow-sm transition"        <div>            <MapPin className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Hududni tanlang' : 'Выберите регион'}

              >

                <div className="font-bold text-gray-800">          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Award className="w-6 h-6 text-purple-600" /> {lang === 'UZ' ? 'Mutaxassislikni tanlang' : 'Выберите специальность'}</h2>          </h2>

                  {d.firstName} {d.lastName}

                </div>          <div className="space-y-2">          <div className="space-y-2">

                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">

                  <span className="flex items-center gap-1">            {specialties.map((s: any) => <button key={s.id} onClick={() => pickSpecialty(s)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-purple-400 hover:shadow-sm transition font-medium">{nm(s)}</button>)}            {regions.map((r: any) => (

                    <Award className="w-3 h-3" /> {sp(d)}

                  </span>            {specialties.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Mutaxassisliklar topilmadi' : 'Специальности не найдены'}</p>}              <button key={r.id} onClick={() => pickRegion(r)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-blue-400 hover:shadow-sm transition">

                  <span className="flex items-center gap-1">

                    <Clock className="w-3 h-3" /> {d.experienceYears}{' '}          </div>                <span className="font-medium">{nm(r)}</span>

                    {lang === 'UZ' ? 'yil' : 'лет'}

                  </span>        </div>              </button>

                  <span className="flex items-center gap-1">

                    <Banknote className="w-3 h-3" /> {d.price?.toLocaleString()}{' '}      )}            ))}

                    {lang === 'UZ' ? "so'm" : 'сум'}

                  </span>          </div>

                </div>

              </button>      {step === 'doctor' && (        </div>

            ))}

            {doctors.length === 0 && (        <div>      )}

              <p className="text-gray-400 text-center py-8">

                {lang === 'UZ' ? 'Shifokorlar topilmadi' : 'Врачи не найдены'}          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Stethoscope className="w-6 h-6 text-teal-600" /> {lang === 'UZ' ? 'Shifokorni tanlang' : 'Выберите врача'}</h2>

              </p>

            )}          <div className="space-y-3">      {/* CLINIC */}

          </div>

        </div>            {doctors.map((d: any) => (      {step === 'clinic' && (

      )}

              <button key={d.id} onClick={() => pickDoctor(d)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-teal-400 hover:shadow-sm transition">        <div>

      {/* DATE & TIME */}

      {step === 'date' && (                <div className="font-bold text-gray-800">{d.firstName} {d.lastName}</div>          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

        <div>

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">            <Building2 className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Klinikani tanlang' : 'Выберите клинику'}

            <Calendar className="w-6 h-6 text-indigo-600" />{' '}

            {lang === 'UZ' ? 'Sana va vaqt' : 'Дата и время'}                  <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {sp(d)}</span>          </h2>

          </h2>

          <div className="mb-4">                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.experienceYears} {lang === 'UZ' ? 'yil' : 'лет'}</span>          <div className="space-y-2">

            <label className="text-sm text-gray-600 mb-1 block">

              {lang === 'UZ' ? 'Sanani tanlang' : 'Выберите дату'}                  <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> {d.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span>            {clinics.map((c: any) => (

            </label>

            <input                </div>              <button key={c.id} onClick={() => pickClinic(c)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-green-400 hover:shadow-sm transition">

              type="date"

              min={today}              </button>                <div className="font-medium">{nm(c)}</div>

              value={selectedDate}

              onChange={(e) => loadSlots(e.target.value)}            ))}                {c.address && <div className="text-sm text-gray-400 mt-1"><MapPin className="w-3 h-3 inline" /> {c.address}</div>}

              className="input"

            />            {doctors.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Shifokorlar topilmadi' : 'Врачи не найдены'}</p>}              </button>

          </div>

          {selectedDate && (          </div>            ))}

            <div>

              <p className="text-sm text-gray-600 mb-2">        </div>            {clinics.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Klinikalar topilmadi' : 'Клиники не найдены'}</p>}

                {lang === 'UZ' ? "Bo'sh vaqtlar" : 'Свободное время'}:

              </p>      )}          </div>

              {slots.length > 0 ? (

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">        </div>

                  {slots.map((s: any) => {

                    const label = typeof s === 'string' ? s : `${s.startTime}-${s.endTime}`;      {step === 'date' && (      )}

                    return (

                      <button        <div>

                        key={label}

                        onClick={() => {          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Calendar className="w-6 h-6 text-indigo-600" /> {lang === 'UZ' ? 'Sana va vaqt' : 'Дата и время'}</h2>      {/* SPECIALTY */}

                          setSelectedSlot(label);

                          setStep('confirm');          <div className="mb-4">      {step === 'specialty' && (

                        }}

                        className={`p-2 rounded-lg border text-sm font-medium transition ${            <label className="text-sm text-gray-600 mb-1 block">{lang === 'UZ' ? 'Sanani tanlang' : 'Выберите дату'}</label>        <div>

                          selectedSlot === label

                            ? 'bg-blue-600 text-white border-blue-600'            <input type="date" min={today} value={selectedDate} onChange={(e) => loadSlots(e.target.value)} className="input" />          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

                            : 'bg-white hover:border-blue-400'

                        }`}          </div>            <Award className="w-6 h-6 text-purple-600" /> {lang === 'UZ' ? 'Mutaxassislikni tanlang' : 'Выберите специальность'}

                      >

                        <Clock className="w-3 h-3 inline mr-1" />          {selectedDate && (          </h2>

                        {label}

                      </button>            <div>          <div className="space-y-2">

                    );

                  })}              <p className="text-sm text-gray-600 mb-2">{lang === 'UZ' ? 'Bo\'sh vaqtlar' : 'Свободное время'}:</p>            {specialties.map((s: any) => (

                </div>

              ) : (              {slots.length > 0 ? (              <button key={s.id} onClick={() => pickSpecialty(s)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-purple-400 hover:shadow-sm transition font-medium">

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">

                  <p className="text-sm text-red-600 font-medium">                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">                {nm(s)}

                    {lang === 'UZ' ? 'Dam olish kuni' : 'Выходной'}

                  </p>                  {slots.map((s: any) => {              </button>

                </div>

              )}                    const label = typeof s === 'string' ? s : `${s.startTime}-${s.endTime}`;            ))}

            </div>

          )}                    return <button key={label} onClick={() => { setSelectedSlot(label); setStep('confirm'); }} className={`p-2 rounded-lg border text-sm font-medium transition ${selectedSlot === label ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-400'}`}><Clock className="w-3 h-3 inline mr-1" />{label}</button>;            {specialties.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Mutaxassisliklar topilmadi' : 'Специальности не найдены'}</p>}

        </div>

      )}                  })}          </div>



      {/* CONFIRM */}                </div>        </div>

      {step === 'confirm' && selectedDoctor && (

        <div>              ) : (      )}

          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

            <CheckCircle className="w-6 h-6 text-green-600" />{' '}                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">

            {lang === 'UZ' ? 'Tasdiqlash' : 'Подтверждение'}

          </h2>                  <p className="text-sm text-red-600 font-medium">{lang === 'UZ' ? "Dam olish kuni" : "Выходной"}</p>      {/* DOCTOR */}

          <div className="bg-white rounded-lg border p-5 space-y-3 mb-4">

            <div className="flex justify-between">                </div>      {step === 'doctor' && (

              <span className="text-gray-500">{lang === 'UZ' ? 'Shifokor' : 'Врач'}</span>

              <span className="font-medium">              )}        <div>

                {selectedDoctor.firstName} {selectedDoctor.lastName}

              </span>            </div>          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

            </div>

            <div className="flex justify-between">          )}            <Stethoscope className="w-6 h-6 text-teal-600" /> {lang === 'UZ' ? 'Shifokorni tanlang' : 'Выберите врача'}

              <span className="text-gray-500">

                {lang === 'UZ' ? 'Mutaxassislik' : 'Специальность'}        </div>          </h2>

              </span>

              <span className="font-medium">{sp(selectedDoctor)}</span>      )}          <div className="space-y-3">

            </div>

            <div className="flex justify-between">            {doctors.map((d: any) => (

              <span className="text-gray-500">{lang === 'UZ' ? 'Klinika' : 'Клиника'}</span>

              <span className="font-medium">{nm(selectedClinic)}</span>      {step === 'confirm' && selectedDoctor && (              <button key={d.id} onClick={() => pickDoctor(d)} className="w-full text-left p-4 bg-white rounded-lg border hover:border-teal-400 hover:shadow-sm transition">

            </div>

            <div className="flex justify-between">        <div>                <div className="font-bold text-gray-800">{d.firstName} {d.lastName}</div>

              <span className="text-gray-500">{lang === 'UZ' ? 'Sana' : 'Дата'}</span>

              <span className="font-medium">{selectedDate}</span>          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tasdiqlash' : 'Подтверждение'}</h2>                <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">

            </div>

            <div className="flex justify-between">          <div className="bg-white rounded-lg border p-5 space-y-3 mb-4">                  <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {sp(d)}</span>

              <span className="text-gray-500">{lang === 'UZ' ? 'Vaqt' : 'Время'}</span>

              <span className="font-medium">{selectedSlot}</span>            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Shifokor' : 'Врач'}</span><span className="font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</span></div>                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {d.experienceYears} {lang === 'UZ' ? 'yil' : 'лет'}</span>

            </div>

            <div className="flex justify-between">            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Mutaxassislik' : 'Специальность'}</span><span className="font-medium">{sp(selectedDoctor)}</span></div>                  <span className="flex items-center gap-1"><Banknote className="w-3 h-3" /> {d.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span>

              <span className="text-gray-500">{lang === 'UZ' ? 'Narx' : 'Стоимость'}</span>

              <span className="font-bold text-green-600">            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Klinika' : 'Клиника'}</span><span className="font-medium">{nm(selectedClinic)}</span></div>                </div>

                {selectedDoctor.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}

              </span>            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Sana' : 'Дата'}</span><span className="font-medium">{selectedDate}</span></div>              </button>

            </div>

          </div>            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Vaqt' : 'Время'}</span><span className="font-medium">{selectedSlot}</span></div>            ))}

          <button onClick={confirmBooking} disabled={loading} className="btn-primary w-full">

            {loading ? '...' : lang === 'UZ' ? '✅ Tasdiqlash' : '✅ Подтвердить'}            <div className="flex justify-between"><span className="text-gray-500">{lang === 'UZ' ? 'Narx' : 'Стоимость'}</span><span className="font-bold text-green-600">{selectedDoctor.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span></div>            {doctors.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Shifokorlar topilmadi' : 'Врачи не найдены'}</p>}

          </button>

        </div>          </div>          </div>

      )}

    </div>          <button onClick={confirmBooking} disabled={loading} className="btn-primary w-full">{loading ? '...' : lang === 'UZ' ? '✅ Tasdiqlash' : '✅ Подтвердить'}</button>        </div>

  );

}        </div>      )}



/* ════════════════════════ APPOINTMENTS LIST ════════════════════════ */      )}

function AppointmentsList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {

  const [list, setList] = useState<any[]>([]);    </div>      {/* DATE & SLOT */}

  const [loading, setLoading] = useState(true);

  );      {step === 'date' && (

  const load = useCallback(async () => {

    setLoading(true);}        <div>

    try {

      const { data } = await getUserAppointments(user.id);          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

      setList(data);

    } catch {/* ════════════════════════ APPOINTMENTS LIST ════════════════════════ */            <Calendar className="w-6 h-6 text-indigo-600" /> {lang === 'UZ' ? 'Sana va vaqt' : 'Дата и время'}

      /* empty */

    }function AppointmentsList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {          </h2>

    setLoading(false);

  }, [user.id]);  const [list, setList] = useState<any[]>([]);          <div className="mb-4">



  useEffect(() => {  const [loading, setLoading] = useState(true);            <label className="text-sm text-gray-600 mb-1 block">{lang === 'UZ' ? 'Sanani tanlang' : 'Выберите дату'}</label>

    load();

  }, [load]);  const load = useCallback(async () => { setLoading(true); try { const { data } = await getUserAppointments(user.id); setList(data); } catch {} setLoading(false); }, [user.id]);            <input type="date" min={today} value={selectedDate} onChange={(e) => loadSlots(e.target.value)} className="input" />



  const cancel = async (appId: string) => {  useEffect(() => { load(); }, [load]);          </div>

    if (!confirm(lang === 'UZ' ? 'Bekor qilinsinmi?' : 'Отменить?')) return;

    try {          {selectedDate && (

      await cancelUserAppointment(user.id, appId);

      toast.success(lang === 'UZ' ? 'Bekor qilindi' : 'Отменено');  const cancel = async (appId: string) => {            <div>

      load();

    } catch {    if (!confirm(lang === 'UZ' ? 'Bekor qilinsinmi?' : 'Отменить?')) return;              <p className="text-sm text-gray-600 mb-2">{lang === 'UZ' ? 'Bo\'sh vaqtlar' : 'Свободное время'}:</p>

      toast.error('Xatolik');

    }    try { await cancelUserAppointment(user.id, appId); toast.success(lang === 'UZ' ? 'Bekor qilindi' : 'Отменено'); load(); } catch { toast.error('Xatolik'); }              {slots.length > 0 ? (

  };

  };                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">

  const badge = (s: string) => {

    const m: Record<string, { c: string; l: string }> = {                  {slots.map((s: any) => {

      PENDING: {

        c: 'bg-yellow-100 text-yellow-700',  const badge = (s: string) => {                    const label = typeof s === 'string' ? s : `${s.startTime}-${s.endTime}`;

        l: lang === 'UZ' ? 'Kutilmoqda' : 'Ожидание',

      },    const m: Record<string, { c: string; l: string }> = {                    return (

      ACCEPTED: {

        c: 'bg-blue-100 text-blue-700',      PENDING: { c: 'bg-yellow-100 text-yellow-700', l: lang === 'UZ' ? 'Kutilmoqda' : 'Ожидание' },                      <button

        l: lang === 'UZ' ? 'Qabul qilindi' : 'Принят',

      },      ACCEPTED: { c: 'bg-blue-100 text-blue-700', l: lang === 'UZ' ? 'Qabul qilindi' : 'Принят' },                        key={label}

      COMPLETED: {

        c: 'bg-green-100 text-green-700',      COMPLETED: { c: 'bg-green-100 text-green-700', l: lang === 'UZ' ? 'Tugallandi' : 'Завершён' },                        onClick={() => { setSelectedSlot(label); setStep('confirm'); }}

        l: lang === 'UZ' ? 'Tugallandi' : 'Завершён',

      },      CANCELLED: { c: 'bg-red-100 text-red-700', l: lang === 'UZ' ? 'Bekor qilingan' : 'Отменён' },                        className={`p-2 rounded-lg border text-sm font-medium transition ${

      CANCELLED: {

        c: 'bg-red-100 text-red-700',    };                          selectedSlot === label ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:border-blue-400'

        l: lang === 'UZ' ? 'Bekor qilingan' : 'Отменён',

      },    const b = m[s] || m.PENDING;                        }`}

    };

    const b = m[s] || m.PENDING;    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.c}`}>{b.l}</span>;                      >

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${b.c}`}>{b.l}</span>;

  };  };                        <Clock className="w-3 h-3 inline mr-1" />{label}



  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;                      </button>



  return (  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;                    );

    <div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">  return (                  })}

        <CalendarDays className="w-6 h-6 text-blue-600" />{' '}

        {lang === 'UZ' ? 'Navbatlarim' : 'Мои записи'}    <div>                </div>

      </h2>

      <div className="space-y-3">      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><CalendarDays className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Navbatlarim' : 'Мои записи'}</h2>              ) : (

        {list.map((a: any) => (

          <div key={a.id} className="bg-white rounded-lg border p-4">      <div className="space-y-3">                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">

            <div className="flex items-start justify-between">

              <div>        {list.map((a: any) => (                  <p className="text-sm text-red-600 font-medium">

                <div className="font-bold text-gray-800">

                  {a.doctor?.firstName} {a.doctor?.lastName}          <div key={a.id} className="bg-white rounded-lg border p-4">                    {lang === 'UZ' ? "Bu kuni shifokor qabul qilmaydi — dam olish kuni" : "Врач не принимает в этот день — выходной"}

                </div>

                <div className="text-sm text-gray-500 mt-1">            <div className="flex items-start justify-between">                  </p>

                  {a.date?.split('T')[0]} | {a.startTime} - {a.endTime}

                </div>              <div>                </div>

                <div className="text-sm text-green-600 font-medium mt-1">

                  {(a.finalPrice ?? a.doctor?.price ?? 0).toLocaleString()}{' '}                <div className="font-bold text-gray-800">{a.doctor?.firstName} {a.doctor?.lastName}</div>              )}

                  {lang === 'UZ' ? "so'm" : 'сум'}

                </div>                <div className="text-sm text-gray-500 mt-1">{a.date?.split('T')[0]} | {a.startTime} - {a.endTime}</div>            </div>

              </div>

              {badge(a.status)}                <div className="text-sm text-green-600 font-medium mt-1">{(a.finalPrice ?? a.doctor?.price ?? 0).toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</div>          )}

            </div>

            {a.status === 'COMPLETED' && a.diagnosis && (              </div>        </div>

              <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200 text-sm space-y-1">

                <p className="text-green-800">              {badge(a.status)}      )}

                  <strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong>{' '}

                  {a.diagnosis.description}            </div>

                </p>

                {a.diagnosis.prescription && (            {a.status === 'COMPLETED' && a.diagnosis && (      {/* CONFIRM */}

                  <p className="text-green-700">

                    <strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong>{' '}              <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200 text-sm space-y-1">      {step === 'confirm' && selectedDoctor && (

                    {a.diagnosis.prescription}

                  </p>                <p className="text-green-800"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {a.diagnosis.description}</p>        <div>

                )}

              </div>                {a.diagnosis.prescription && <p className="text-green-700"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {a.diagnosis.prescription}</p>}          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

            )}

            {a.status === 'PENDING' && (              </div>            <CheckCircle className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tasdiqlash' : 'Подтверждение'}

              <button

                onClick={() => cancel(a.id)}            )}          </h2>

                className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"

              >            {a.status === 'PENDING' && (          <div className="bg-white rounded-lg border p-5 space-y-3 mb-4">

                <XCircle className="w-4 h-4" />{' '}

                {lang === 'UZ' ? 'Bekor qilish' : 'Отменить'}              <button onClick={() => cancel(a.id)} className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"><XCircle className="w-4 h-4" /> {lang === 'UZ' ? 'Bekor qilish' : 'Отменить'}</button>            <div className="flex justify-between">

              </button>

            )}            )}              <span className="text-gray-500">{lang === 'UZ' ? 'Shifokor' : 'Врач'}</span>

          </div>

        ))}          </div>              <span className="font-medium">{selectedDoctor.firstName} {selectedDoctor.lastName}</span>

        {list.length === 0 && (

          <p className="text-gray-400 text-center py-8">        ))}            </div>

            {lang === 'UZ' ? 'Navbatlar topilmadi' : 'Записей нет'}

          </p>        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Navbatlar topilmadi' : 'Записей нет'}</p>}            <div className="flex justify-between">

        )}

      </div>      </div>              <span className="text-gray-500">{lang === 'UZ' ? 'Mutaxassislik' : 'Специальность'}</span>

    </div>

  );    </div>              <span className="font-medium">{sp(selectedDoctor)}</span>

}

  );            </div>

/* ════════════════════════ DIAGNOSES LIST ════════════════════════ */

function DiagnosesList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {}            <div className="flex justify-between">

  const [list, setList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);              <span className="text-gray-500">{lang === 'UZ' ? 'Klinika' : 'Клиника'}</span>



  useEffect(() => {/* ════════════════════════ DIAGNOSES LIST ════════════════════════ */              <span className="font-medium">{nm(selectedClinic)}</span>

    getUserDiagnoses(user.id)

      .then(({ data }) => setList(data))function DiagnosesList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {            </div>

      .catch(() => {})

      .finally(() => setLoading(false));  const [list, setList] = useState<any[]>([]);            <div className="flex justify-between">

  }, [user.id]);

  const [loading, setLoading] = useState(true);              <span className="text-gray-500">{lang === 'UZ' ? 'Sana' : 'Дата'}</span>

  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;

  useEffect(() => { getUserDiagnoses(user.id).then(({ data }) => setList(data)).catch(() => {}).finally(() => setLoading(false)); }, [user.id]);              <span className="font-medium">{selectedDate}</span>

  return (

    <div>  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;            </div>

      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

        <FileText className="w-6 h-6 text-green-600" />{' '}  return (            <div className="flex justify-between">

        {lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы'}

      </h2>    <div>              <span className="text-gray-500">{lang === 'UZ' ? 'Vaqt' : 'Время'}</span>

      <div className="space-y-3">

        {list.map((d: any) => (      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы'}</h2>              <span className="font-medium">{selectedSlot}</span>

          <div key={d.id} className="bg-white rounded-lg border p-4">

            <div className="font-bold text-gray-800">      <div className="space-y-3">            </div>

              {d.doctor?.firstName} {d.doctor?.lastName}

            </div>        {list.map((d: any) => (            <div className="flex justify-between">

            <div className="text-sm text-gray-500 mt-1">{d.createdAt?.split('T')[0]}</div>

            <p className="mt-2 text-gray-700">          <div key={d.id} className="bg-white rounded-lg border p-4">              <span className="text-gray-500">{lang === 'UZ' ? 'Narx' : 'Стоимость'}</span>

              <strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {d.description}

            </p>            <div className="font-bold text-gray-800">{d.doctor?.firstName} {d.doctor?.lastName}</div>              <span className="font-bold text-green-600">{selectedDoctor.price?.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</span>

            {d.prescription && (

              <p className="mt-1 text-gray-600 text-sm">            <div className="text-sm text-gray-500 mt-1">{d.createdAt?.split('T')[0]}</div>            </div>

                <strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {d.prescription}

              </p>            <p className="mt-2 text-gray-700"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {d.description}</p>          </div>

            )}

          </div>            {d.prescription && <p className="mt-1 text-gray-600 text-sm"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {d.prescription}</p>}          <button onClick={confirmBooking} disabled={loading} className="btn-primary w-full">

        ))}

        {list.length === 0 && (          </div>            {loading ? '...' : lang === 'UZ' ? 'Tasdiqlash' : 'Подтвердить'}

          <p className="text-gray-400 text-center py-8">

            {lang === 'UZ' ? 'Tashxislar topilmadi' : 'Диагнозов нет'}        ))}          </button>

          </p>

        )}        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Tashxislar topilmadi' : 'Диагнозов нет'}</p>}        </div>

      </div>

    </div>      </div>      )}

  );

}    </div>    </div>



/* ════════════════════════ MAIN MENU ════════════════════════ */  );  );

type MenuView = 'menu' | 'booking' | 'appointments' | 'diagnoses';

}}

function UserMenu({

  user,

  lang,

  onLogout,/* ════════════════════════ MAIN MENU ════════════════════════ *//* ════════════════════════ APPOINTMENTS LIST ════════════════════════ */

}: {

  user: any;type MenuView = 'menu' | 'booking' | 'appointments' | 'diagnoses';function AppointmentsList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {

  lang: 'UZ' | 'RU';

  onLogout: () => void;  const [list, setList] = useState<any[]>([]);

}) {

  const [view, setView] = useState<MenuView>('menu');function UserMenu({ user, lang, onLogout }: { user: any; lang: 'UZ' | 'RU'; onLogout: () => void }) {  const [loading, setLoading] = useState(true);



  useEffect(() => {  const [view, setView] = useState<MenuView>('menu');

    const tg = getTg();

    if (tg && view !== 'menu') {  const load = useCallback(async () => {

      tg.BackButton.show();

      const h = () => setView('menu');  useEffect(() => {    setLoading(true);

      tg.BackButton.onClick(h);

      return () => {    const tg = getTg();    try { const { data } = await getUserAppointments(user.id); setList(data); }

        tg.BackButton.offClick(h);

        tg.BackButton.hide();    if (tg && view !== 'menu') { tg.BackButton.show(); const h = () => setView('menu'); tg.BackButton.onClick(h); return () => { tg.BackButton.offClick(h); tg.BackButton.hide(); }; }    catch { toast.error('Xatolik'); }

      };

    }    if (tg && view === 'menu') tg.BackButton.hide();    setLoading(false);

    if (tg && view === 'menu') tg.BackButton.hide();

  }, [view]);  }, [view]);  }, [user.id]);



  if (view === 'booking') {

    return (

      <div className="min-h-screen bg-gray-50 p-4">  if (view === 'booking') return <div className="min-h-screen bg-gray-50 p-4"><BookingFlow user={user} lang={lang} onBack={() => setView('menu')} /></div>;  useEffect(() => { load(); }, [load]);

        <BookingFlow user={user} lang={lang} onBack={() => setView('menu')} />

      </div>  if (view === 'appointments') return (

    );

  }    <div className="min-h-screen bg-gray-50 p-4"><div className="max-w-2xl mx-auto">  const cancel = async (appId: string) => {



  if (view === 'appointments') {      {!isTg() && <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 mb-4"><ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}</button>}    if (!confirm(lang === 'UZ' ? 'Bekor qilinsinmi?' : 'Отменить?')) return;

    return (

      <div className="min-h-screen bg-gray-50 p-4">      <AppointmentsList user={user} lang={lang} />    try { await cancelUserAppointment(user.id, appId); toast.success(lang === 'UZ' ? 'Bekor qilindi' : 'Отменено'); load(); }

        <div className="max-w-2xl mx-auto">

          {!isTg() && (    </div></div>    catch { toast.error('Xatolik'); }

            <button

              onClick={() => setView('menu')}  );  };

              className="flex items-center gap-2 text-blue-600 mb-4"

            >  if (view === 'diagnoses') return (

              <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}

            </button>    <div className="min-h-screen bg-gray-50 p-4"><div className="max-w-2xl mx-auto">  const statusBadge = (s: string) => {

          )}

          <AppointmentsList user={user} lang={lang} />      {!isTg() && <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 mb-4"><ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}</button>}    const m: Record<string, { color: string; icon: React.ReactNode; label: string }> = {

        </div>

      </div>      <DiagnosesList user={user} lang={lang} />      PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Kutilmoqda' : 'Ожидание' },

    );

  }    </div></div>      ACCEPTED: { color: 'bg-blue-100 text-blue-700', icon: <CheckCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Qabul qilindi' : 'Принят' },



  if (view === 'diagnoses') {  );      COMPLETED: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Tugallandi' : 'Завершён' },

    return (

      <div className="min-h-screen bg-gray-50 p-4">      CANCELLED: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" />, label: lang === 'UZ' ? 'Bekor qilingan' : 'Отменён' },

        <div className="max-w-2xl mx-auto">

          {!isTg() && (  const items = [    };

            <button

              onClick={() => setView('menu')}    { key: 'booking', icon: <CalendarDays className="w-8 h-8 text-blue-600" />, title: lang === 'UZ' ? 'Navbat olish' : 'Записаться', desc: lang === 'UZ' ? "Shifokorga yozilish" : 'Запись к врачу', color: 'hover:border-blue-400' },    const b = m[s] || m.PENDING;

              className="flex items-center gap-2 text-blue-600 mb-4"

            >    { key: 'appointments', icon: <ClipboardList className="w-8 h-8 text-purple-600" />, title: lang === 'UZ' ? 'Navbatlarim' : 'Мои записи', desc: lang === 'UZ' ? "Barcha navbatlar" : 'Все записи', color: 'hover:border-purple-400' },    return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${b.color}`}>{b.icon} {b.label}</span>;

              <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}

            </button>    { key: 'diagnoses', icon: <FileText className="w-8 h-8 text-green-600" />, title: lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы', desc: lang === 'UZ' ? "Shifokor xulosalari" : 'Заключения врачей', color: 'hover:border-green-400' },  };

          )}

          <DiagnosesList user={user} lang={lang} />  ];

        </div>

      </div>  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;

    );

  }  return (



  const items = [    <div className="min-h-screen bg-gray-50">  return (

    {

      key: 'booking',      <header className="bg-white shadow-sm border-b">    <div>

      icon: <CalendarDays className="w-8 h-8 text-blue-600" />,

      title: lang === 'UZ' ? 'Navbat olish' : 'Записаться',        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

      desc: lang === 'UZ' ? 'Shifokorga yozilish' : 'Запись к врачу',

      color: 'hover:border-blue-400',          <div className="flex items-center gap-3">        <CalendarDays className="w-6 h-6 text-blue-600" /> {lang === 'UZ' ? 'Navbatlarim' : 'Мои записи'}

    },

    {            <Image src="/logo.PNG" alt="MedBook" width={36} height={36} className="rounded-lg" />      </h2>

      key: 'appointments',

      icon: <ClipboardList className="w-8 h-8 text-purple-600" />,            <div><h1 className="text-lg font-bold text-gray-800">MedBook</h1><p className="text-xs text-gray-500">{user.firstName} {user.lastName}</p></div>      <div className="space-y-3">

      title: lang === 'UZ' ? 'Navbatlarim' : 'Мои записи',

      desc: lang === 'UZ' ? 'Barcha navbatlar' : 'Все записи',          </div>        {list.map((a: any) => (

      color: 'hover:border-purple-400',

    },          {!isTg() && <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"><LogOut className="w-4 h-4" /> {lang === 'UZ' ? 'Chiqish' : 'Выход'}</button>}          <div key={a.id} className="bg-white rounded-lg border p-4">

    {

      key: 'diagnoses',        </div>            <div className="flex items-start justify-between">

      icon: <FileText className="w-8 h-8 text-green-600" />,

      title: lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы',      </header>              <div>

      desc: lang === 'UZ' ? "Shifokor xulosalari" : 'Заключения врачей',

      color: 'hover:border-green-400',      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-3">                <div className="font-bold text-gray-800">{a.doctor?.firstName} {a.doctor?.lastName}</div>

    },

  ];        {items.map((it) => (                <div className="text-sm text-gray-500 mt-1">{a.date?.split('T')[0]} | {a.startTime} - {a.endTime}</div>



  return (          <button key={it.key} onClick={() => setView(it.key as MenuView)} className={`w-full text-left p-5 bg-white rounded-xl border transition shadow-sm hover:shadow-md ${it.color}`}>                {(a.finalPrice != null || a.doctor?.price != null) && (

    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b">            <div className="flex items-center gap-4">{it.icon}<div><div className="font-bold text-gray-800">{it.title}</div><div className="text-sm text-gray-500">{it.desc}</div></div></div>                  <div className="text-sm text-green-600 font-medium mt-1">

        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">

          <div className="flex items-center gap-3">          </button>                    {(a.finalPrice ?? a.doctor?.price ?? 0).toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}

            <Image src="/logo.PNG" alt="MedBook" width={36} height={36} className="rounded-lg" />

            <div>        ))}                  </div>

              <h1 className="text-lg font-bold text-gray-800">MedBook</h1>

              <p className="text-xs text-gray-500">      </div>                )}

                {user.firstName} {user.lastName}

              </p>    </div>              </div>

            </div>

          </div>  );              {statusBadge(a.status)}

          {!isTg() && (

            <button}            </div>

              onClick={onLogout}

              className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm"            {/* Diagnosis & prescription for completed */}

            >

              <LogOut className="w-4 h-4" /> {lang === 'UZ' ? 'Chiqish' : 'Выход'}/* ════════════════════════ MAIN PAGE ════════════════════════ */            {a.status === 'COMPLETED' && a.diagnosis && (

            </button>

          )}export default function UserPage() {              <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200 space-y-1 text-sm">

        </div>

      </header>  const { currentUser, setCurrentUser, clearUser, _hasHydrated } = useAuthStore();                <p className="text-green-800"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {a.diagnosis.description}</p>

      <div className="max-w-2xl mx-auto px-4 mt-6 space-y-3">

        {items.map((it) => (  const [lang, setLang] = useState<'UZ' | 'RU' | null>(null);                {a.diagnosis.prescription && (

          <button

            key={it.key}  const [tgUser, setTgUser] = useState<any>(null);                  <p className="text-green-700"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {a.diagnosis.prescription}</p>

            onClick={() => setView(it.key as MenuView)}

            className={`w-full text-left p-5 bg-white rounded-xl border transition shadow-sm hover:shadow-md ${it.color}`}  const [ready, setReady] = useState(false);                )}

          >

            <div className="flex items-center gap-4">              </div>

              {it.icon}

              <div>  // Telegram SDK loaded            )}

                <div className="font-bold text-gray-800">{it.title}</div>

                <div className="text-sm text-gray-500">{it.desc}</div>  const onSdkLoad = useCallback(() => {            {a.status === 'PENDING' && (

              </div>

            </div>    const tg = getTg();              <button onClick={() => cancel(a.id)} className="mt-3 text-sm text-red-500 hover:text-red-700 flex items-center gap-1">

          </button>

        ))}    if (tg?.initDataUnsafe?.user) {                <XCircle className="w-4 h-4" /> {lang === 'UZ' ? 'Bekor qilish' : 'Отменить'}

      </div>

    </div>      const u = tg.initDataUnsafe.user;              </button>

  );

}      setTgUser(u);            )}



/* ════════════════════════ MAIN PAGE ════════════════════════ */      tg.expand();          </div>

export default function UserPage() {

  const { currentUser, setCurrentUser, clearUser, _hasHydrated } = useAuthStore();      tg.ready();        ))}

  const [lang, setLang] = useState<'UZ' | 'RU' | null>(null);

  const [tgUser, setTgUser] = useState<any>(null);      // Auto lang        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Navbatlar topilmadi' : 'Записей нет'}</p>}

  const [ready, setReady] = useState(false);

      if (!lang) setLang(u.language_code === 'ru' ? 'RU' : 'UZ');      </div>

  // Telegram SDK loaded

  const onSdkLoad = useCallback(() => {      // Auto login    </div>

    const tg = getTg();

    if (tg?.initDataUnsafe?.user) {      if (!currentUser) {  );

      const u = tg.initDataUnsafe.user;

      setTgUser(u);        getUserByTelegramId(String(u.id))}

      tg.expand();

      tg.ready();          .then(({ data }) => { setCurrentUser(data); setReady(true); })

      // Auto lang

      if (!lang) setLang(u.language_code === 'ru' ? 'RU' : 'UZ');          .catch(() => setReady(true));/* ════════════════════════ DIAGNOSES LIST ════════════════════════ */

      // Auto login

      if (!currentUser) {        return;function DiagnosesList({ user, lang }: { user: any; lang: 'UZ' | 'RU' }) {

        getUserByTelegramId(String(u.id))

          .then(({ data }: { data: any }) => {      }  const [list, setList] = useState<any[]>([]);

            setCurrentUser(data);

            setReady(true);    }  const [loading, setLoading] = useState(true);

          })

          .catch(() => setReady(true));    setReady(true);

        return;

      }  }, []); // eslint-disable-line react-hooks/exhaustive-deps  useEffect(() => {

    }

    setReady(true);    getUserDiagnoses(user.id).then(({ data }) => setList(data)).catch(() => {}).finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);  const TgScript = <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" onLoad={onSdkLoad} />;  }, [user.id]);



  // If not Telegram, mark ready once hydrated

  useEffect(() => {

    if (_hasHydrated && !getTg()) {  if (!_hasHydrated || !ready) return <>{TgScript}<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div className="text-center"><div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto" /><p className="text-sm text-gray-500 mt-3">MedBook</p></div></div></>;  if (loading) return <p className="text-center text-gray-400 py-8">...</p>;

      setReady(true);

    }  if (!lang) return <>{TgScript}<LangPage onSelect={setLang} /></>;

  }, [_hasHydrated]);

  if (!currentUser) return <>{TgScript}<RegisterPage lang={lang} onDone={setCurrentUser} tgUser={tgUser} /></>;  return (

  const TgScript = (

    <Script  return <>{TgScript}<UserMenu user={currentUser} lang={lang} onLogout={() => { clearUser(); setLang(null); }} /></>;    <div>

      src="https://telegram.org/js/telegram-web-app.js"

      strategy="afterInteractive"}      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">

      onLoad={onSdkLoad}

    />        <FileText className="w-6 h-6 text-green-600" /> {lang === 'UZ' ? 'Tashxislarim' : 'Мои диагнозы'}

  );      </h2>

      <div className="space-y-3">

  if (!_hasHydrated || !ready) {        {list.map((d: any) => (

    return (          <div key={d.id} className="bg-white rounded-lg border p-4">

      <>            <div className="font-bold text-gray-800">{d.doctor?.firstName} {d.doctor?.lastName}</div>

        {TgScript}            <div className="text-sm text-gray-500 mt-1">{d.createdAt?.split('T')[0]}</div>

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">            <p className="mt-2 text-gray-700"><strong>{lang === 'UZ' ? 'Tashxis:' : 'Диагноз:'}</strong> {d.description}</p>

          <div className="text-center">            {d.prescription && (

            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent mx-auto" />              <p className="mt-1 text-gray-600 text-sm"><strong>{lang === 'UZ' ? 'Dorilar:' : 'Рецепт:'}</strong> {d.prescription}</p>

            <p className="text-sm text-gray-500 mt-3">MedBook</p>            )}

          </div>            {d.appointment?.finalPrice != null && (

        </div>              <p className="mt-1 text-sm text-green-600 font-medium">{lang === 'UZ' ? 'Narx:' : 'Стоимость:'} {d.appointment.finalPrice.toLocaleString()} {lang === 'UZ' ? "so'm" : 'сум'}</p>

      </>            )}

    );          </div>

  }        ))}

        {list.length === 0 && <p className="text-gray-400 text-center py-8">{lang === 'UZ' ? 'Tashxislar topilmadi' : 'Диагнозов нет'}</p>}

  if (!lang) {      </div>

    return (    </div>

      <>  );

        {TgScript}}

        <LangPage onSelect={setLang} />

      </>/* ════════════════════════ MAIN MENU ════════════════════════ */

    );type MenuView = 'menu' | 'booking' | 'appointments' | 'diagnoses';

  }

function UserMenu({ user, lang, onLogout }: { user: any; lang: 'UZ' | 'RU'; onLogout: () => void }) {

  if (!currentUser) {  const [view, setView] = useState<MenuView>('menu');

    return (

      <>  if (view === 'booking') return (

        {TgScript}    <div className="min-h-screen bg-gray-50 p-4">

        <RegisterPage lang={lang} onDone={setCurrentUser} tgUser={tgUser} />      <BookingFlow user={user} lang={lang} onBack={() => setView('menu')} />

      </>    </div>

    );  );

  }  if (view === 'appointments') return (

    <div className="min-h-screen bg-gray-50 p-4">

  return (      <div className="max-w-2xl mx-auto">

    <>        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">

      {TgScript}          <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}

      <UserMenu        </button>

        user={currentUser}        <AppointmentsList user={user} lang={lang} />

        lang={lang}      </div>

        onLogout={() => {    </div>

          clearUser();  );

          setLang(null);  if (view === 'diagnoses') return (

        }}    <div className="min-h-screen bg-gray-50 p-4">

      />      <div className="max-w-2xl mx-auto">

    </>        <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">

  );          <ArrowLeft className="w-4 h-4" /> {lang === 'UZ' ? 'Orqaga' : 'Назад'}

}        </button>

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
