'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuthStore } from '../../lib/store';
import {
  loginFounder, loginOwner,
  getRegions, createRegion, updateRegion, deleteRegion,
  getClinics, createClinic, updateClinic, deleteClinic,
  getOwners, createOwner, updateOwner, deleteOwner,
  getSpecialties, createSpecialty, updateSpecialty, deleteSpecialty,
  getDoctorsByClinic, createDoctor, updateDoctor, deleteDoctor,
  getClinicStats,
} from '../../lib/api';
import {
  Globe, Building2, User, Stethoscope, Phone,
  Award, Banknote, Pencil, Trash2, Plus, LogOut, Eye, EyeOff, MapPin,
  ShieldCheck, Hospital, Tag, LayoutDashboard, CalendarCheck, DoorOpen,
  Clock, Users, TrendingUp, CheckCircle2, XCircle, Timer, Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';

/* helper: extract error message from API response */
const getErrorMsg = (err: any, fallback = 'Xatolik') => {
  const msg = err?.response?.data?.message;
  if (Array.isArray(msg)) return msg.join(', ');
  return msg || fallback;
};

/* ======================== LOGIN ======================== */
function AdminLogin({ onLogin }: { onLogin: (d: any, r: 'FOUNDER' | 'CLINIC_OWNER') => void }) {
  const [mode, setMode] = useState<'FOUNDER' | 'CLINIC_OWNER'>('FOUNDER');
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
      const fn = mode === 'FOUNDER' ? loginFounder : loginOwner;
      const { data } = await fn(phone, password);
      toast.success('Kirish muvaffaqiyatli!');
      onLogin(data, mode);
    } catch {
      toast.error('Login yoki parol xato');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Image src="/logo.PNG" alt="BookMed" width={64} height={64} className="rounded-xl" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6">Admin Panel</h1>

        {/* Role toggle */}
        <div className="flex gap-2 mb-6">
          {(['FOUNDER', 'CLINIC_OWNER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setMode(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === r ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r === 'FOUNDER' ? 'Founder' : 'Klinika egasi'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              value={phone}
              onChange={(e) => handlePhone(e.target.value)}
              placeholder="+998XXXXXXXXX"
              className="input pl-11"
            />
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Parol"
              className="input pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-3 text-gray-400"
            >
              {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <button
            onClick={submit}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Kuting...' : 'Kirish'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================== REGIONS ======================== */
function RegionsSection() {
  const [list, setList] = useState<any[]>([]);
  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await getRegions();
    setList(data);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!nameUz || !nameRu) return toast.error("Barcha maydonlarni to'ldiring");
    try {
      if (editId) {
        await updateRegion(editId, { nameUz, nameRu });
        toast.success('Yangilandi');
      } else {
        await createRegion({ nameUz, nameRu });
        toast.success("Qo'shildi");
      }
      setNameUz(''); setNameRu(''); setEditId(null); load();
    } catch (e) { toast.error(getErrorMsg(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await deleteRegion(id); toast.success("O'chirildi"); load(); }
    catch (e) { toast.error(getErrorMsg(e)); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Globe className="w-6 h-6 text-blue-600" /> Hududlar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input value={nameUz} onChange={(e) => setNameUz(e.target.value)} placeholder="Nom (UZ)" className="input" />
        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder="Ќазвание (RU)" className="input" />
        <button onClick={save} className="btn-primary flex items-center justify-center gap-2">
          {editId ? <><Pencil className="w-4 h-4" /> Yangilash</> : <><Plus className="w-4 h-4" /> Qo&#39;shish</>}
        </button>
      </div>

      {editId && (
        <button
          onClick={() => { setEditId(null); setNameUz(''); setNameRu(''); }}
          className="text-sm text-gray-500 mb-3 hover:underline"
        >
          Bekor qilish
        </button>
      )}

      <div className="space-y-2">
        {list.map((r: any) => (
          <div key={r.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">{r.nameUz}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-500">{r.nameRu}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(r.id); setNameUz(r.nameUz); setNameRu(r.nameRu); }} className="text-blue-500 hover:text-blue-700">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(r.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Hududlar topilmadi</p>}
      </div>
    </div>
  );
}

/* ======================== CLINICS ======================== */
function ClinicsSection() {
  const [list, setList] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [form, setForm] = useState({ nameUz: '', nameRu: '', address: '', phone: '', regionId: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const [c, r] = await Promise.all([getClinics(), getRegions()]);
    setList(c.data); setRegions(r.data);
  };
  useEffect(() => { load(); }, []);

  const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!form.nameUz || !form.regionId) return toast.error("Maydonlarni to'ldiring");
    try {
      if (editId) {
        await updateClinic(editId, form);
        toast.success('Yangilandi');
      } else {
        await createClinic(form);
        toast.success("Qo'shildi");
      }
      setForm({ nameUz: '', nameRu: '', address: '', phone: '', regionId: '' });
      setEditId(null); load();
    } catch (e) { toast.error(getErrorMsg(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await deleteClinic(id); toast.success("O'chirildi"); load(); }
    catch (e) { toast.error(getErrorMsg(e)); }
  };

  const startEdit = (c: any) => {
    setEditId(c.id);
    setForm({ nameUz: c.nameUz, nameRu: c.nameRu || '', address: c.address || '', phone: c.phone || '', regionId: c.regionId });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Building2 className="w-6 h-6 text-green-600" /> Klinikalar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <input value={form.nameUz} onChange={(e) => upd('nameUz', e.target.value)} placeholder="Nom (UZ)" className="input" />
        <input value={form.nameRu} onChange={(e) => upd('nameRu', e.target.value)} placeholder="Ќазвание (RU)" className="input" />
        <input value={form.address} onChange={(e) => upd('address', e.target.value)} placeholder="Manzil" className="input" />
        <input value={form.phone} onChange={(e) => upd('phone', e.target.value)} placeholder="Telefon" className="input" />
        <select value={form.regionId} onChange={(e) => upd('regionId', e.target.value)} className="input">
          <option value="">Hudud tanlang</option>
          {regions.map((r: any) => (
            <option key={r.id} value={r.id}>{r.nameUz}</option>
          ))}
        </select>
        <button onClick={save} className="btn-primary flex items-center justify-center gap-2">
          {editId ? <><Pencil className="w-4 h-4" /> Yangilash</> : <><Plus className="w-4 h-4" /> Qo&#39;shish</>}
        </button>
      </div>

      {editId && (
        <button
          onClick={() => { setEditId(null); setForm({ nameUz: '', nameRu: '', address: '', phone: '', regionId: '' }); }}
          className="text-sm text-gray-500 mb-3 hover:underline"
        >
          Bekor qilish
        </button>
      )}

      <div className="space-y-2">
        {list.map((c: any) => (
          <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-medium">{c.nameUz}</span>
              {c.address && (
                <span className="text-gray-400 text-sm">
                  <MapPin className="w-3 h-3 inline" /> {c.address}
                </span>
              )}
              {c.phone && (
                <span className="text-gray-400 text-sm">
                  <Phone className="w-3 h-3 inline" /> {c.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                <Stethoscope className="w-3 h-3" /> {c._count?.doctors ?? 0} shifokor
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                <Users className="w-3 h-3" /> {c._patientCount ?? 0} bemor
              </span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="text-blue-500 hover:text-blue-700">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(c.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Klinikalar topilmadi</p>}
      </div>
    </div>
  );
}

/* ======================== OWNERS ======================== */
function OwnersSection() {
  const [list, setList] = useState<any[]>([]);
  const [clinics, setClinics] = useState<any[]>([]);
  const [form, setForm] = useState({ phone: '', password: '', clinicId: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const [o, c] = await Promise.all([getOwners(), getClinics()]);
    setList(o.data); setClinics(c.data);
  };
  useEffect(() => { load(); }, []);

  const upd = (k: string, v: string) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!form.phone || !form.clinicId) return toast.error("Maydonlarni to'ldiring");
    try {
      if (editId) {
        await updateOwner(editId, form);
        toast.success('Yangilandi');
      } else {
        if (!form.password) return toast.error('Parol kiriting');
        await createOwner({ phone: form.phone, password: form.password, clinicId: form.clinicId });
        toast.success("Qo'shildi");
      }
      setForm({ phone: '', password: '', clinicId: '' }); setEditId(null); load();
    } catch (e) { toast.error(getErrorMsg(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await deleteOwner(id); toast.success("O'chirildi"); load(); }
    catch (e) { toast.error(getErrorMsg(e)); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <User className="w-6 h-6 text-orange-600" /> Klinika Egalari
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <input value={form.phone} onChange={(e) => upd('phone', e.target.value)} placeholder="Telefon" className="input" />
        <input
          type="password"
          value={form.password}
          onChange={(e) => upd('password', e.target.value)}
          placeholder={editId ? 'Yangi parol (ixtiyoriy)' : 'Parol'}
          className="input"
        />
        <select value={form.clinicId} onChange={(e) => upd('clinicId', e.target.value)} className="input">
          <option value="">Klinika tanlang</option>
          {clinics.map((c: any) => (
            <option key={c.id} value={c.id}>{c.nameUz}</option>
          ))}
        </select>
        <button onClick={save} className="btn-primary flex items-center justify-center gap-2">
          {editId ? <><Pencil className="w-4 h-4" /> Yangilash</> : <><Plus className="w-4 h-4" /> Qo&#39;shish</>}
        </button>
      </div>

      {editId && (
        <button
          onClick={() => { setEditId(null); setForm({ phone: '', password: '', clinicId: '' }); }}
          className="text-sm text-gray-500 mb-3 hover:underline"
        >
          Bekor qilish
        </button>
      )}

      <div className="space-y-2">
        {list.map((o: any) => (
          <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <Phone className="w-3 h-3 inline text-gray-400" />
              <span className="font-medium ml-1">{o.phone}</span>
              <span className="text-gray-400 text-sm ml-2">{o.clinic?.nameUz || 'Ч'}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setEditId(o.id); setForm({ phone: o.phone, password: '', clinicId: o.clinicId }); }}
                className="text-blue-500 hover:text-blue-700"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(o.id)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Egalar topilmadi</p>}
      </div>
    </div>
  );
}

/* ======================== SPECIALTIES (Founder) ======================== */
function SpecialtiesSection() {
  const [list, setList] = useState<any[]>([]);
  const [nameUz, setNameUz] = useState('');
  const [nameRu, setNameRu] = useState('');
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await getSpecialties();
    setList(data);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!nameUz || !nameRu) return toast.error("Barcha maydonlarni to'ldiring");
    try {
      if (editId) {
        await updateSpecialty(editId, { nameUz, nameRu });
        toast.success('Yangilandi');
      } else {
        await createSpecialty({ nameUz, nameRu });
        toast.success("Qo'shildi");
      }
      setNameUz(''); setNameRu(''); setEditId(null); load();
    } catch (e) { toast.error(getErrorMsg(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await deleteSpecialty(id); toast.success("O'chirildi"); load(); }
    catch (e) { toast.error(getErrorMsg(e)); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Tag className="w-6 h-6 text-teal-600" /> Mutaxassisliklar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input value={nameUz} onChange={(e) => setNameUz(e.target.value)} placeholder="Nom (UZ) Ч Stomatolog" className="input" />
        <input value={nameRu} onChange={(e) => setNameRu(e.target.value)} placeholder="Ќазвание (RU) Ч —томатолог" className="input" />
        <button onClick={save} className="btn-primary flex items-center justify-center gap-2">
          {editId ? <><Pencil className="w-4 h-4" /> Yangilash</> : <><Plus className="w-4 h-4" /> Qo&#39;shish</>}
        </button>
      </div>

      {editId && (
        <button
          onClick={() => { setEditId(null); setNameUz(''); setNameRu(''); }}
          className="text-sm text-gray-500 mb-3 hover:underline"
        >
          Bekor qilish
        </button>
      )}

      <div className="space-y-2">
        {list.map((s: any) => (
          <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span className="font-medium">{s.nameUz}</span>
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-gray-500">{s.nameRu}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditId(s.id); setNameUz(s.nameUz); setNameRu(s.nameRu); }} className="text-blue-500 hover:text-blue-700" title="Tahrirlash">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(s.id)} className="text-red-500 hover:text-red-700" title="O'chirish">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Mutaxassisliklar topilmadi</p>}
      </div>
    </div>
  );
}

/* ======================== CLINIC OWNER: DOCTORS ======================== */
function OwnerDoctorsSection({ clinicId }: { clinicId: string }) {
  const [list, setList] = useState<any[]>([]);
  const [specialties, setSpecialties] = useState<any[]>([]);
  const emptyForm = {
    firstName: '', lastName: '', phone: '', password: '',
    specialtyId: '', room: '',
    experienceYears: 0, price: 0, avgServiceMin: 30, clinicId,
  };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const [d, s] = await Promise.all([getDoctorsByClinic(clinicId), getSpecialties()]);
    setList(d.data); setSpecialties(s.data);
  };
  useEffect(() => { load(); }, [clinicId]);

  const upd = (k: string, v: any) => setForm({ ...form, [k]: v });

  const save = async () => {
    if (!form.firstName || !form.phone || !form.specialtyId)
      return toast.error("Maydonlarni to'ldiring");
    try {
      if (editId) {
        const payload: any = { ...form };
        if (!payload.password) delete payload.password;
        await updateDoctor(editId, payload);
        toast.success('Yangilandi');
      } else {
        if (!form.password) return toast.error('Parol kiriting');
        await createDoctor({ ...form, clinicId });
        toast.success("Qo'shildi");
      }
      setForm(emptyForm); setEditId(null); load();
    } catch (e) { toast.error(getErrorMsg(e)); }
  };

  const remove = async (id: string) => {
    if (!confirm("O'chirilsinmi?")) return;
    try { await deleteDoctor(id); toast.success("O'chirildi"); load(); }
    catch (e) { toast.error(getErrorMsg(e)); }
  };

  const startEdit = (d: any) => {
    setEditId(d.id);
    setForm({
      firstName: d.firstName, lastName: d.lastName, phone: d.phone, password: '',
      specialtyId: d.specialtyId || '', room: d.room || '',
      experienceYears: d.experienceYears, price: d.price,
      avgServiceMin: d.avgServiceMin, clinicId,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Stethoscope className="w-6 h-6 text-teal-600" /> Shifokorlar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <div>
          <label className="label">Ism</label>
          <input value={form.firstName} onChange={(e) => upd('firstName', e.target.value)} placeholder="Ism" className="input" />
        </div>
        <div>
          <label className="label">Familiya</label>
          <input value={form.lastName} onChange={(e) => upd('lastName', e.target.value)} placeholder="Familiya" className="input" />
        </div>
        <div>
          <label className="label">Telefon</label>
          <input value={form.phone} onChange={(e) => upd('phone', e.target.value)} placeholder="+998901234567" className="input" />
        </div>
        <div>
          <label className="label">{editId ? 'Yangi parol (ixtiyoriy)' : 'Parol'}</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => upd('password', e.target.value)}
            placeholder="ХХХХХХХХ"
            className="input"
          />
        </div>
        <div>
          <label className="label">Mutaxassislik</label>
          <select value={form.specialtyId} onChange={(e) => upd('specialtyId', e.target.value)} className="input" title="Mutaxassislik">
            <option value="">Tanlang</option>
            {specialties.map((s: any) => (
              <option key={s.id} value={s.id}>{s.nameUz}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Tajriba (yil)</label>
          <input
            type="number"
            value={form.experienceYears}
            onChange={(e) => upd('experienceYears', +e.target.value)}
            placeholder="0"
            className="input"
          />
        </div>
        <div>
          <label className="label">Narx (so'm)</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => upd('price', +e.target.value)}
            placeholder="150000"
            className="input"
          />
        </div>
        <div>
          <label className="label">O&#39;rtacha xizmat (min)</label>
          <input
            type="number"
            value={form.avgServiceMin}
            onChange={(e) => upd('avgServiceMin', +e.target.value)}
            placeholder="30"
            className="input"
          />
        </div>
        <div>
          <label className="label">Xona (room)</label>
          <input value={form.room} onChange={(e) => upd('room', e.target.value)} placeholder="101" className="input" />
        </div>
        <button onClick={save} className="btn-primary flex items-center justify-center gap-2 self-end">
          {editId ? <><Pencil className="w-4 h-4" /> Yangilash</> : <><Plus className="w-4 h-4" /> Qo&#39;shish</>}
        </button>
      </div>

      {editId && (
        <button
          onClick={() => { setEditId(null); setForm(emptyForm); }}
          className="text-sm text-gray-500 mb-3 hover:underline"
        >
          Bekor qilish
        </button>
      )}

      <div className="space-y-2">
        {list.map((d: any) => (
          <div key={d.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-medium">{d.firstName} {d.lastName}</span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Award className="w-3 h-3" /> {d.specialty?.nameUz || 'Ч'}
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Clock className="w-3 h-3" /> {d.experienceYears} yil
              </span>
              <span className="text-gray-500 text-sm flex items-center gap-1">
                <Timer className="w-3 h-3" /> {d.avgServiceMin} min
              </span>
              <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                <Banknote className="w-3 h-3" /> {d.price?.toLocaleString()} so&#39;m
              </span>
              {d.room && (
                <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                  <DoorOpen className="w-3 h-3" /> {d.room}-xona
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(d)} className="text-blue-500 hover:text-blue-700" title="Tahrirlash">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => remove(d.id)} className="text-red-500 hover:text-red-700" title="O'chirish">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {list.length === 0 && <p className="text-gray-400 text-sm text-center py-4">Shifokorlar topilmadi</p>}
      </div>
    </div>
  );
}

/* ======================== OWNER DASHBOARD ======================== */
function OwnerDashboard({ clinicId }: { clinicId: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getClinicStats(clinicId);
        setStats(data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [clinicId]);

  if (loading) return <p className="text-gray-400 text-center py-8">Yuklanmoqda...</p>;
  if (!stats) return <p className="text-red-400 text-center py-8">Ma&#39;lumot topilmadi</p>;

  const statCards = [
    { label: 'Shifokorlar', value: stats.totalDoctors, icon: <Stethoscope className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Jami qabullar', value: stats.totalAppointments, icon: <CalendarCheck className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Bugun qabullar', value: stats.todayAppointments, icon: <Activity className="w-6 h-6" />, color: 'bg-orange-50 text-orange-600' },
    { label: 'Bajarilgan', value: stats.completedAppointments, icon: <CheckCircle2 className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
    { label: 'Kutilmoqda', value: stats.pendingAppointments, icon: <Clock className="w-6 h-6" />, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Bekor qilingan', value: stats.cancelledAppointments, icon: <XCircle className="w-6 h-6" />, color: 'bg-red-50 text-red-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center mx-auto mb-2`}>
              {s.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-green-100">Jami daromad</p>
          </div>
          <p className="text-3xl font-bold">{stats.totalRevenue?.toLocaleString()} <span className="text-lg font-normal">so&#39;m</span></p>
          <p className="text-xs text-green-200 mt-1">{stats.completedAppointments} ta bajarilgan qabul asosida</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-blue-100">Bugungi daromad</p>
          </div>
          <p className="text-3xl font-bold">{stats.todayRevenue?.toLocaleString()} <span className="text-lg font-normal">so&#39;m</span></p>
          <p className="text-xs text-blue-200 mt-1">Bugun {stats.todayAppointments} ta qabul</p>
        </div>
      </div>

      {/* Doctors Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" /> Shifokorlar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.doctors?.map((d: any) => (
            <div key={d.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-800">{d.firstName} {d.lastName}</h4>
                  <p className="text-sm text-purple-600 font-medium flex items-center gap-1 mt-0.5">
                    <Award className="w-3.5 h-3.5" /> {d.specialty?.nameUz}
                  </p>
                </div>
                {d.room && (
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg flex items-center gap-1">
                    <DoorOpen className="w-3.5 h-3.5" /> {d.room}-xona
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Tajriba</p>
                  <p className="font-bold text-gray-800 text-sm">{d.experienceYears} yil</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Qabul</p>
                  <p className="font-bold text-gray-800 text-sm">{d.avgServiceMin} min</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Narx</p>
                  <p className="font-bold text-green-700 text-sm">{d.price?.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
                <Phone className="w-3 h-3" /> {d.phone}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ======================== OWNER APPOINTMENTS ======================== */
function OwnerAppointments({ clinicId }: { clinicId: string }) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getClinicStats(clinicId);
        setStats(data);
      } catch { /* ignore */ }
      setLoading(false);
    })();
  }, [clinicId]);

  if (loading) return <p className="text-gray-400 text-center py-8">Yuklanmoqda...</p>;
  if (!stats) return <p className="text-red-400 text-center py-8">Ma&#39;lumot topilmadi</p>;

  const statusLabels: Record<string, { text: string; color: string }> = {
    PENDING: { text: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-700' },
    ACCEPTED: { text: 'Qabul qilindi', color: 'bg-blue-100 text-blue-700' },
    COMPLETED: { text: 'Bajarildi', color: 'bg-green-100 text-green-700' },
    CANCELLED: { text: 'Bekor qilindi', color: 'bg-red-100 text-red-700' },
  };

  let appointments = stats.appointments || [];
  if (filter !== 'all') appointments = appointments.filter((a: any) => a.status === filter);
  if (doctorFilter !== 'all') appointments = appointments.filter((a: any) => a.doctorId === doctorFilter);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="min-w-[160px]">
          <label className="label">Status</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input" title="Status filter">
            <option value="all">Barchasi</option>
            <option value="PENDING">Kutilmoqda</option>
            <option value="ACCEPTED">Qabul qilindi</option>
            <option value="COMPLETED">Bajarildi</option>
            <option value="CANCELLED">Bekor qilindi</option>
          </select>
        </div>
        <div className="min-w-[220px]">
          <label className="label">Shifokor</label>
          <select value={doctorFilter} onChange={(e) => setDoctorFilter(e.target.value)} className="input" title="Doctor filter">
            <option value="all">Barcha shifokorlar</option>
            {stats.doctors?.map((d: any) => (
              <option key={d.id} value={d.id}>{d.firstName} {d.lastName} Ч {d.specialty?.nameUz || ''}</option>
            ))}
          </select>
        </div>
        <p className="text-sm text-gray-500 self-end pb-2">
          Jami: <span className="font-bold text-gray-700">{appointments.length}</span> ta qabul
        </p>
      </div>

      {/* Appointments list */}
      <div className="space-y-2">
        {appointments.map((a: any) => {
          const st = statusLabels[a.status] || { text: a.status, color: 'bg-gray-100 text-gray-600' };
          const dateStr = new Date(a.date).toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' });
          const displayPrice = a.finalPrice ?? a.doctor?.price ?? 0;
          return (
            <div key={a.id} className="p-4 bg-gray-50 rounded-xl gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-800">
                      {a.user?.firstName} {a.user?.lastName}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {a.user?.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5" />
                      {a.doctor?.firstName} {a.doctor?.lastName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      {a.doctor?.specialty?.nameUz}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5" />
                      {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {a.startTime} Ч {a.endTime}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-green-700 text-sm whitespace-nowrap">
                    {displayPrice.toLocaleString()} so&#39;m
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${st.color}`}>
                    {st.text}
                  </span>
                </div>
              </div>
              {/* Diagnosis & prescription for completed */}
              {a.status === 'COMPLETED' && a.diagnosis && (
                <div className="mt-2 bg-green-50 rounded-lg p-3 border border-green-200 space-y-1 text-sm">
                  <p className="text-green-800"><strong>Tashxis:</strong> {a.diagnosis.description}</p>
                  {a.diagnosis.prescription && (
                    <p className="text-green-700"><strong>Dorilar:</strong> {a.diagnosis.prescription}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {appointments.length === 0 && (
          <p className="text-gray-400 text-sm text-center py-8">Qabullar topilmadi</p>
        )}
      </div>
    </div>
  );
}

/* ======================== MAIN PAGE ======================== */
type FounderTab = 'regions' | 'clinics' | 'owners' | 'specialties';
type OwnerTab = 'dashboard' | 'doctors' | 'appointments';
type Tab = FounderTab | OwnerTab;

export default function AdminPage() {
  const { adminUser, adminRole, setAdminUser, clearAdmin, _hasHydrated } = useAuthStore();
  const [tab, setTab] = useState<Tab>(adminRole === 'FOUNDER' ? 'regions' : 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Wait for zustand to hydrate from localStorage before deciding login/dashboard */
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  if (!adminUser) {
    return <AdminLogin onLogin={(data, role) => setAdminUser(data, role)} />;
  }

  // Founder tabs
  const founderTabs: { key: FounderTab; label: string; icon: React.ReactNode }[] = [
    { key: 'regions', label: 'Hududlar', icon: <Globe className="w-5 h-5" /> },
    { key: 'clinics', label: 'Klinikalar', icon: <Building2 className="w-5 h-5" /> },
    { key: 'owners', label: 'Egalar', icon: <User className="w-5 h-5" /> },
    { key: 'specialties', label: 'Mutaxassisliklar', icon: <Tag className="w-5 h-5" /> },
  ];

  // Clinic Owner tabs
  const ownerTabs: { key: OwnerTab; label: string; icon: React.ReactNode }[] = [
    { key: 'dashboard', label: 'Statistika', icon: <LayoutDashboard className="w-5 h-5" /> },
    { key: 'doctors', label: 'Shifokorlar', icon: <Stethoscope className="w-5 h-5" /> },
    { key: 'appointments', label: 'Qabullar', icon: <CalendarCheck className="w-5 h-5" /> },
  ];

  const isFounder = adminRole === 'FOUNDER';
  const tabs = isFounder ? founderTabs : ownerTabs;

  // Ensure tab is valid for current role
  const activeTab = tabs.find(t => t.key === tab) ? tab : tabs[0].key;

  const tabDescriptions: Record<string, string> = {
    regions: "Hududlarni boshqarish Ч yaratish, tahrirlash, o'chirish",
    clinics: "Klinikalarni boshqarish Ч yaratish, tahrirlash, o'chirish",
    owners: 'Klinika egalarini boshqarish',
    specialties: "Mutaxassisliklarni boshqarish Ч Stomatolog, Pediatr va h.k.",
    dashboard: "Klinikangiz statistikasi Ч daromad, shifokorlar, qabullar",
    doctors: "Shifokorlarni boshqarish Ч yaratish, tahrirlash, o'chirish",
    appointments: "Barcha shifokorlar bo'yicha qabullar ro'yxati",
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
            <Image src="/logo.PNG" alt="BookMed" width={44} height={44} className="rounded-xl shadow-sm" />
            <div>
              <h1 className="text-lg font-bold text-gray-800 leading-tight">BookMed</h1>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full mt-0.5">
                {isFounder
                  ? <><ShieldCheck className="w-3.5 h-3.5" /> Founder</>
                  : <><Hospital className="w-3.5 h-3.5" /> Klinika egasi</>}
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
                activeTab === t.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {t.icon}
              {t.label}
              {activeTab === t.key && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </button>
          ))}

          {!isFounder && adminUser?.clinic && (
            <div className="mt-4 px-3 py-2 bg-blue-50 rounded-lg">
              <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">Klinika</p>
              <p className="text-sm font-medium text-blue-700">{adminUser.clinic.nameUz}</p>
              {adminUser.clinic.address && (
                <p className="text-xs text-blue-500 mt-0.5"><MapPin className="w-3 h-3 inline" /> {adminUser.clinic.address}</p>
              )}
            </div>
          )}
        </nav>

        {/* User info + Logout */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{adminUser?.phone}</p>
              <p className="text-[11px] text-gray-400">{isFounder ? 'Founder' : 'Klinika egasi'}</p>
            </div>
          </div>
          <button
            onClick={clearAdmin}
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
          <h1 className="text-lg font-bold text-gray-800">BookMed Admin</h1>
        </header>

        {/* Page header */}
        <div className="px-6 lg:px-8 pt-6 pb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {tabs.find((t) => t.key === activeTab)?.label}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {tabDescriptions[activeTab]}
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 lg:px-8 py-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Founder sections */}
            {isFounder && activeTab === 'regions' && <RegionsSection />}
            {isFounder && activeTab === 'clinics' && <ClinicsSection />}
            {isFounder && activeTab === 'owners' && <OwnersSection />}
            {isFounder && activeTab === 'specialties' && <SpecialtiesSection />}
            {/* Clinic Owner sections */}
            {!isFounder && activeTab === 'dashboard' && adminUser?.clinicId && (
              <OwnerDashboard clinicId={adminUser.clinicId} />
            )}
            {!isFounder && activeTab === 'doctors' && adminUser?.clinicId && (
              <OwnerDoctorsSection clinicId={adminUser.clinicId} />
            )}
            {!isFounder && activeTab === 'appointments' && adminUser?.clinicId && (
              <OwnerAppointments clinicId={adminUser.clinicId} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
