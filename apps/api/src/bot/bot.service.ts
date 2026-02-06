import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { PrismaService } from '../common/prisma.service';

/* ── Session stored in-memory (per chatId) ── */
interface Session {
  step?: string;
  lang?: 'UZ' | 'RU';
  phone?: string;
  userId?: string;
  regionId?: string;
  clinicId?: string;
  specialtyId?: string;
  doctorId?: string;
  date?: string;
  slot?: string; // "09:00-09:30"
}

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Telegraf;
  private sessions = new Map<number, Session>();
  private readonly logger = new Logger(BotService.name);

  constructor(private readonly prisma: PrismaService) {
    this.bot = new Telegraf(process.env.BOT_TOKEN!);
  }

  private s(chatId: number): Session {
    if (!this.sessions.has(chatId)) this.sessions.set(chatId, {});
    return this.sessions.get(chatId)!;
  }

  /* ══════════════════ Translations ══════════════════ */
  private t(lang: 'UZ' | 'RU' | undefined, key: string): string {
    const map: Record<string, Record<string, string>> = {
      welcome: {
        UZ: "🏥 *MedBook* — Tibbiy navbat tizimi\n\nTilni tanlang:",
        RU: "🏥 *MedBook* — Система медицинской записи\n\nВыберите язык:",
      },
      lang_set: { UZ: "✅ Til tanlandi: O'zbek", RU: "✅ Язык выбран: Русский" },
      send_phone: {
        UZ: "📱 Telefon raqamingizni yuboring (tugmani bosing):",
        RU: "📱 Отправьте свой номер телефона (нажмите кнопку):",
      },
      registered: { UZ: "✅ Ro'yxatdan o'tdingiz!", RU: "✅ Вы зарегистрированы!" },
      main_menu: { UZ: "🏠 Asosiy menyu", RU: "🏠 Главное меню" },
      book: { UZ: "📋 Navbat olish", RU: "📋 Записаться" },
      my_appointments: { UZ: "📅 Navbatlarim", RU: "📅 Мои записи" },
      my_diagnoses: { UZ: "📄 Tashxislarim", RU: "📄 Мои диагнозы" },
      select_region: { UZ: "🌍 Hududni tanlang:", RU: "🌍 Выберите регион:" },
      select_clinic: { UZ: "🏥 Klinikani tanlang:", RU: "🏥 Выберите клинику:" },
      select_specialty: { UZ: "🏷 Mutaxassislikni tanlang:", RU: "🏷 Выберите специальность:" },
      select_doctor: { UZ: "👨‍⚕️ Shifokorni tanlang:", RU: "👨‍⚕️ Выберите врача:" },
      select_date: { UZ: "📅 Sanani tanlang:", RU: "📅 Выберите дату:" },
      select_slot: { UZ: "🕐 Vaqtni tanlang:", RU: "🕐 Выберите время:" },
      no_clinics: { UZ: "😔 Klinikalar topilmadi", RU: "😔 Клиники не найдены" },
      no_specialties: { UZ: "😔 Mutaxassisliklar topilmadi", RU: "😔 Специальности не найдены" },
      no_doctors: { UZ: "😔 Shifokorlar topilmadi", RU: "😔 Врачи не найдены" },
      no_slots: { UZ: "😔 Bo'sh vaqt yo'q (dam olish kuni)", RU: "😔 Нет свободного времени (выходной)" },
      no_appointments: { UZ: "📭 Navbatlar topilmadi", RU: "📭 Записей нет" },
      no_diagnoses: { UZ: "📭 Tashxislar topilmadi", RU: "📭 Диагнозов нет" },
      confirm: { UZ: "✅ Tasdiqlaysizmi?", RU: "✅ Подтвердить?" },
      booked: { UZ: "🎉 Navbat muvaffaqiyatli olindi!", RU: "🎉 Запись успешно создана!" },
      cancelled: { UZ: "❌ Navbat bekor qilindi", RU: "❌ Запись отменена" },
      error: { UZ: "⚠️ Xatolik yuz berdi", RU: "⚠️ Произошла ошибка" },
      back: { UZ: "⬅️ Orqaga", RU: "⬅️ Назад" },
      cancel_btn: { UZ: "❌ Bekor qilish", RU: "❌ Отменить" },
      yes: { UZ: "✅ Ha", RU: "✅ Да" },
      no: { UZ: "❌ Yo'q", RU: "❌ Нет" },
      slot_taken: { UZ: "⚠️ Bu vaqt allaqachon band", RU: "⚠️ Это время уже занято" },
      settings: { UZ: "⚙️ Til o'zgartirish", RU: "⚙️ Сменить язык" },
    };
    return (map[key] || {})[lang || 'UZ'] || key;
  }

  /* ══════════════════ Module Init ══════════════════ */
  async onModuleInit() {
    if (!process.env.BOT_TOKEN) {
      this.logger.warn('BOT_TOKEN not set, Telegram bot disabled');
      return;
    }

    this.setupHandlers();

    this.bot.launch().then(() => {
      this.logger.log('🤖 Telegram bot started: @bookmed_uzbot');
    }).catch((err) => {
      this.logger.error('Failed to start bot', err);
    });
  }

  /* ══════════════════ Handlers ══════════════════ */
  private setupHandlers() {
    // /start
    this.bot.start(async (ctx) => {
      const chatId = ctx.chat.id;
      this.sessions.set(chatId, {});
      await ctx.replyWithMarkdown(
        this.t(undefined, 'welcome'),
        Markup.inlineKeyboard([
          [Markup.button.callback("🇺🇿 O'zbek tili", 'lang_uz')],
          [Markup.button.callback("🇷🇺 Русский язык", 'lang_ru')],
        ]),
      );
    });

    // ── Language select ──
    this.bot.action('lang_uz', async (ctx) => {
      await ctx.answerCbQuery();
      const s = this.s(ctx.chat!.id);
      s.lang = 'UZ';
      s.step = 'phone';
      await this.askPhone(ctx);
    });

    this.bot.action('lang_ru', async (ctx) => {
      await ctx.answerCbQuery();
      const s = this.s(ctx.chat!.id);
      s.lang = 'RU';
      s.step = 'phone';
      await this.askPhone(ctx);
    });

    // ── Change language ──
    this.bot.action('change_lang', async (ctx) => {
      await ctx.answerCbQuery();
      const chatId = ctx.chat!.id;
      this.sessions.set(chatId, {});
      await ctx.editMessageText(
        this.t(undefined, 'welcome'),
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.callback("🇺🇿 O'zbek tili", 'lang_uz')],
            [Markup.button.callback("🇷🇺 Русский язык", 'lang_ru')],
          ]),
        },
      );
    });

    // ── Contact (phone) ──
    this.bot.on('contact', async (ctx) => {
      const chatId = ctx.chat.id;
      const s = this.s(chatId);
      if (s.step !== 'phone') return;

      let phone = ctx.message.contact.phone_number;
      if (!phone.startsWith('+')) phone = '+' + phone;
      s.phone = phone;

      // Register or find user
      const user = await this.prisma.user.upsert({
        where: { phone },
        create: {
          phone,
          firstName: ctx.message.contact.first_name || undefined,
          lastName: ctx.message.contact.last_name || undefined,
          language: s.lang || 'UZ',
          telegramId: BigInt(chatId),
        },
        update: {
          firstName: ctx.message.contact.first_name || undefined,
          lastName: ctx.message.contact.last_name || undefined,
          language: s.lang || 'UZ',
          telegramId: BigInt(chatId),
        },
      });

      s.userId = user.id;
      s.step = 'menu';

      await ctx.reply(this.t(s.lang, 'registered'), { reply_markup: { remove_keyboard: true } });
      await this.showMainMenu(ctx, s);
    });

    // ── Main menu actions ──
    this.bot.action('menu', async (ctx) => {
      await ctx.answerCbQuery();
      const s = this.s(ctx.chat!.id);
      s.step = 'menu';
      await this.showMainMenu(ctx, s);
    });

    this.bot.action('book', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showRegions(ctx);
    });

    this.bot.action('my_appointments', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showMyAppointments(ctx);
    });

    this.bot.action('my_diagnoses', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showMyDiagnoses(ctx);
    });

    // ── Booking flow callbacks ──
    this.bot.action(/^region_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const regionId = ctx.match[1];
      this.s(ctx.chat!.id).regionId = regionId;
      await this.showClinics(ctx, regionId);
    });

    this.bot.action(/^clinic_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const clinicId = ctx.match[1];
      this.s(ctx.chat!.id).clinicId = clinicId;
      await this.showSpecialties(ctx, clinicId);
    });

    this.bot.action(/^spec_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const specId = ctx.match[1];
      this.s(ctx.chat!.id).specialtyId = specId;
      await this.showDoctors(ctx);
    });

    this.bot.action(/^doc_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const docId = ctx.match[1];
      this.s(ctx.chat!.id).doctorId = docId;
      await this.showDates(ctx);
    });

    this.bot.action(/^date_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const date = ctx.match[1];
      this.s(ctx.chat!.id).date = date;
      await this.showSlots(ctx, date);
    });

    this.bot.action(/^slot_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      const slot = ctx.match[1]; // "09:00-09:30"
      this.s(ctx.chat!.id).slot = slot;
      await this.showConfirm(ctx);
    });

    this.bot.action('confirm_book', async (ctx) => {
      await ctx.answerCbQuery();
      await this.confirmBooking(ctx);
    });

    this.bot.action(/^cancel_app_(.+)$/, async (ctx) => {
      await ctx.answerCbQuery();
      await this.cancelAppointment(ctx, ctx.match[1]);
    });

    // ── Back buttons ──
    this.bot.action('back_regions', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showRegions(ctx);
    });

    this.bot.action('back_clinics', async (ctx) => {
      await ctx.answerCbQuery();
      const s = this.s(ctx.chat!.id);
      if (s.regionId) await this.showClinics(ctx, s.regionId);
      else await this.showRegions(ctx);
    });

    this.bot.action('back_specialties', async (ctx) => {
      await ctx.answerCbQuery();
      const s = this.s(ctx.chat!.id);
      if (s.clinicId) await this.showSpecialties(ctx, s.clinicId);
      else await this.showRegions(ctx);
    });

    this.bot.action('back_doctors', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showDoctors(ctx);
    });

    this.bot.action('back_dates', async (ctx) => {
      await ctx.answerCbQuery();
      await this.showDates(ctx);
    });

    // Error handler
    this.bot.catch((err: any) => {
      this.logger.error('Bot error:', err);
    });
  }

  /* ══════════════════ Ask Phone ══════════════════ */
  private async askPhone(ctx: any) {
    const s = this.s(ctx.chat!.id);
    // Check if user already registered with this telegramId
    const existing = await this.prisma.user.findUnique({
      where: { telegramId: BigInt(ctx.chat!.id) },
    });
    if (existing) {
      s.userId = existing.id;
      s.phone = existing.phone;
      // Update language
      await this.prisma.user.update({
        where: { id: existing.id },
        data: { language: s.lang || 'UZ' },
      });
      s.step = 'menu';
      await ctx.reply(
        this.t(s.lang, 'lang_set'),
        { reply_markup: { remove_keyboard: true } },
      );
      await this.showMainMenu(ctx, s);
      return;
    }

    await ctx.reply(this.t(s.lang, 'send_phone'), {
      reply_markup: {
        keyboard: [[{
          text: s.lang === 'RU' ? '📱 Отправить номер' : "📱 Telefon raqamni yuborish",
          request_contact: true,
        }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  }

  /* ══════════════════ Main Menu ══════════════════ */
  private async showMainMenu(ctx: any, s: Session) {
    const text = `🏥 *MedBook*\n\n${this.t(s.lang, 'main_menu')}`;
    const kb = Markup.inlineKeyboard([
      [Markup.button.webApp('🌐 ' + (s.lang === 'RU' ? 'Открыть приложение' : 'Ilovani ochish'), 'https://mydent.uz/user')],
      [Markup.button.callback(this.t(s.lang, 'book'), 'book')],
      [Markup.button.callback(this.t(s.lang, 'my_appointments'), 'my_appointments')],
      [Markup.button.callback(this.t(s.lang, 'my_diagnoses'), 'my_diagnoses')],
      [Markup.button.callback(this.t(s.lang, 'settings'), 'change_lang')],
    ]);
    try { await ctx.editMessageText(text, { parse_mode: 'Markdown', ...kb }); }
    catch { await ctx.replyWithMarkdown(text, kb); }
  }

  /* ══════════════════ Booking Flow ══════════════════ */

  private async showRegions(ctx: any) {
    const s = this.s(ctx.chat!.id);
    const regions = await this.prisma.region.findMany({ orderBy: { nameUz: 'asc' } });
    const nm = (r: any) => s.lang === 'RU' ? r.nameRu : r.nameUz;

    const buttons = regions.map((r) => [Markup.button.callback(`📍 ${nm(r)}`, `region_${r.id}`)]);
    buttons.push([Markup.button.callback(this.t(s.lang, 'back'), 'menu')]);

    const text = this.t(s.lang, 'select_region');
    const kb = Markup.inlineKeyboard(buttons);
    try { await ctx.editMessageText(text, kb); }
    catch { await ctx.reply(text, kb); }
  }

  private async showClinics(ctx: any, regionId: string) {
    const s = this.s(ctx.chat!.id);
    const clinics = await this.prisma.clinic.findMany({
      where: { regionId },
      orderBy: { nameUz: 'asc' },
    });
    const nm = (c: any) => s.lang === 'RU' ? c.nameRu : c.nameUz;

    if (clinics.length === 0) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'back'), 'back_regions')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'no_clinics'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'no_clinics'), kb); }
      return;
    }

    const buttons = clinics.map((c) => [Markup.button.callback(`🏥 ${nm(c)}`, `clinic_${c.id}`)]);
    buttons.push([Markup.button.callback(this.t(s.lang, 'back'), 'back_regions')]);

    const text = this.t(s.lang, 'select_clinic');
    const kb = Markup.inlineKeyboard(buttons);
    try { await ctx.editMessageText(text, kb); }
    catch { await ctx.reply(text, kb); }
  }

  private async showSpecialties(ctx: any, clinicId: string) {
    const s = this.s(ctx.chat!.id);
    const doctors = await this.prisma.doctor.findMany({
      where: { clinicId },
      select: { specialty: true },
      distinct: ['specialtyId'],
    });
    const specialties = doctors.map((d) => d.specialty);
    const nm = (sp: any) => s.lang === 'RU' ? sp.nameRu : sp.nameUz;

    if (specialties.length === 0) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'back'), 'back_clinics')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'no_specialties'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'no_specialties'), kb); }
      return;
    }

    const buttons = specialties.map((sp) => [Markup.button.callback(`🏷 ${nm(sp)}`, `spec_${sp.id}`)]);
    buttons.push([Markup.button.callback(this.t(s.lang, 'back'), 'back_clinics')]);

    const text = this.t(s.lang, 'select_specialty');
    const kb = Markup.inlineKeyboard(buttons);
    try { await ctx.editMessageText(text, kb); }
    catch { await ctx.reply(text, kb); }
  }

  private async showDoctors(ctx: any) {
    const s = this.s(ctx.chat!.id);
    const doctors = await this.prisma.doctor.findMany({
      where: { clinicId: s.clinicId, specialtyId: s.specialtyId },
      include: { specialty: true },
      orderBy: { firstName: 'asc' },
    });

    if (doctors.length === 0) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'back'), 'back_specialties')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'no_doctors'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'no_doctors'), kb); }
      return;
    }

    const buttons = doctors.map((d) => {
      const label = `👨‍⚕️ ${d.firstName} ${d.lastName} — ${d.price?.toLocaleString()} ${s.lang === 'RU' ? 'сум' : "so'm"}`;
      return [Markup.button.callback(label, `doc_${d.id}`)];
    });
    buttons.push([Markup.button.callback(this.t(s.lang, 'back'), 'back_specialties')]);

    const text = this.t(s.lang, 'select_doctor');
    const kb = Markup.inlineKeyboard(buttons);
    try { await ctx.editMessageText(text, kb); }
    catch { await ctx.reply(text, kb); }
  }

  private async showDates(ctx: any) {
    const s = this.s(ctx.chat!.id);
    // Show next 7 days
    const buttons: any[] = [];
    const dayNames: Record<string, string[]> = {
      UZ: ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan'],
      RU: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    };
    const names = dayNames[s.lang || 'UZ'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = names[d.getDay()];
      const label = `${dayName}, ${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      buttons.push(Markup.button.callback(label, `date_${dateStr}`));
    }

    // 2 buttons per row
    const rows: any[] = [];
    for (let i = 0; i < buttons.length; i += 2) {
      rows.push(buttons.slice(i, i + 2));
    }
    rows.push([Markup.button.callback(this.t(s.lang, 'back'), 'back_doctors')]);

    const text = this.t(s.lang, 'select_date');
    const kb = Markup.inlineKeyboard(rows);
    try { await ctx.editMessageText(text, kb); }
    catch { await ctx.reply(text, kb); }
  }

  private async showSlots(ctx: any, date: string) {
    const s = this.s(ctx.chat!.id);
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: s.doctorId },
      include: { schedules: true },
    });
    if (!doctor) return;

    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay();
    const schedule = doctor.schedules.find((sc) => sc.dayOfWeek === dayOfWeek);

    if (!schedule) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'back'), 'back_dates')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'no_slots'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'no_slots'), kb); }
      return;
    }

    // Time offs
    const timeOffs = await this.prisma.timeOff.findMany({ where: { doctorId: doctor.id, date: dateObj } });
    const fullDayOff = timeOffs.find((t) => !t.startTime && !t.endTime);
    if (fullDayOff) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'back'), 'back_dates')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'no_slots'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'no_slots'), kb); }
      return;
    }

    // Existing appointments
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id, date: dateObj, status: { in: ['PENDING', 'ACCEPTED'] } },
    });

    // Generate slots
    const avgMin = doctor.avgServiceMin || 30;
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);
    let cur = startH * 60 + startM;
    const end = endH * 60 + endM;

    const availableSlots: { start: string; end: string }[] = [];
    while (cur + avgMin <= end) {
      const slotStart = `${String(Math.floor(cur / 60)).padStart(2, '0')}:${String(cur % 60).padStart(2, '0')}`;
      const slotEndMin = cur + avgMin;
      const slotEnd = `${String(Math.floor(slotEndMin / 60)).padStart(2, '0')}:${String(slotEndMin % 60).padStart(2, '0')}`;

      const isTimeOff = timeOffs.some((t) => t.startTime && t.endTime && slotStart < t.endTime && slotEnd > t.startTime);
      const isBooked = appointments.some((a) => slotStart < a.endTime && slotEnd > a.startTime);

      if (!isTimeOff && !isBooked) {
        availableSlots.push({ start: slotStart, end: slotEnd });
      }
      cur = slotEndMin;
    }

    if (availableSlots.length === 0) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'back'), 'back_dates')]]);
      const text = this.t(s.lang, 'no_slots');
      try { await ctx.editMessageText(text, kb); }
      catch { await ctx.reply(text, kb); }
      return;
    }

    // 3 buttons per row
    const buttons = availableSlots.map((sl) =>
      Markup.button.callback(`🕐 ${sl.start}`, `slot_${sl.start}-${sl.end}`),
    );
    const rows: any[] = [];
    for (let i = 0; i < buttons.length; i += 3) {
      rows.push(buttons.slice(i, i + 3));
    }
    rows.push([Markup.button.callback(this.t(s.lang, 'back'), 'back_dates')]);

    const text = this.t(s.lang, 'select_slot');
    const kb = Markup.inlineKeyboard(rows);
    try { await ctx.editMessageText(text, kb); }
    catch { await ctx.reply(text, kb); }
  }

  /* ══════════════════ Confirm Booking ══════════════════ */
  private async showConfirm(ctx: any) {
    const s = this.s(ctx.chat!.id);
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: s.doctorId },
      include: { specialty: true, clinic: true },
    });
    if (!doctor) return;

    const nm = (item: any) => s.lang === 'RU' ? item.nameRu : item.nameUz;
    const spName = doctor.specialty ? nm(doctor.specialty) : '';
    const clinicName = doctor.clinic ? nm(doctor.clinic) : '';
    const [startTime, endTime] = (s.slot || '').split('-');

    const text = s.lang === 'RU'
      ? `✅ *Подтвердите запись:*\n\n👨‍⚕️ Врач: *${doctor.firstName} ${doctor.lastName}*\n🏷 Специальность: ${spName}\n🏥 Клиника: ${clinicName}\n📅 Дата: ${s.date}\n🕐 Время: ${startTime} — ${endTime}\n💰 Цена: ${doctor.price?.toLocaleString()} сум`
      : `✅ *Tasdiqlang:*\n\n👨‍⚕️ Shifokor: *${doctor.firstName} ${doctor.lastName}*\n🏷 Mutaxassislik: ${spName}\n🏥 Klinika: ${clinicName}\n📅 Sana: ${s.date}\n🕐 Vaqt: ${startTime} — ${endTime}\n💰 Narx: ${doctor.price?.toLocaleString()} so'm`;

    const kb = Markup.inlineKeyboard([
      [Markup.button.callback(this.t(s.lang, 'yes'), 'confirm_book')],
      [Markup.button.callback(this.t(s.lang, 'back'), 'back_dates')],
    ]);

    try { await ctx.editMessageText(text, { parse_mode: 'Markdown', ...kb }); }
    catch { await ctx.replyWithMarkdown(text, kb); }
  }

  private async confirmBooking(ctx: any) {
    const s = this.s(ctx.chat!.id);
    if (!s.userId || !s.doctorId || !s.date || !s.slot) return;

    const [startTime, endTime] = s.slot.split('-');

    try {
      // Check slot availability
      const existing = await this.prisma.appointment.findFirst({
        where: {
          doctorId: s.doctorId,
          date: new Date(s.date),
          startTime,
          status: { in: ['PENDING', 'ACCEPTED'] },
        },
      });

      if (existing) {
        const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'back'), 'back_dates')]]);
        try { await ctx.editMessageText(this.t(s.lang, 'slot_taken'), kb); }
        catch { await ctx.reply(this.t(s.lang, 'slot_taken'), kb); }
        return;
      }

      await this.prisma.appointment.create({
        data: {
          userId: s.userId,
          doctorId: s.doctorId,
          date: new Date(s.date),
          startTime,
          endTime,
          status: 'PENDING',
        },
      });

      const text = this.t(s.lang, 'booked');
      const kb = Markup.inlineKeyboard([
        [Markup.button.callback(this.t(s.lang, 'main_menu'), 'menu')],
      ]);
      try { await ctx.editMessageText(text, kb); }
      catch { await ctx.reply(text, kb); }
    } catch (err) {
      this.logger.error('Booking error', err);
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'main_menu'), 'menu')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'error'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'error'), kb); }
    }
  }

  /* ══════════════════ My Appointments ══════════════════ */
  private async showMyAppointments(ctx: any) {
    const s = this.s(ctx.chat!.id);
    if (!s.userId) return;

    const appointments = await this.prisma.appointment.findMany({
      where: { userId: s.userId },
      include: { doctor: { include: { specialty: true, clinic: true } }, diagnosis: true },
      orderBy: { date: 'desc' },
      take: 10,
    });

    if (appointments.length === 0) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'main_menu'), 'menu')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'no_appointments'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'no_appointments'), kb); }
      return;
    }

    const statusEmoji: Record<string, string> = {
      PENDING: '🟡', ACCEPTED: '🔵', COMPLETED: '🟢', CANCELLED: '🔴',
    };
    const statusLabel: Record<string, Record<string, string>> = {
      PENDING: { UZ: 'Kutilmoqda', RU: 'Ожидание' },
      ACCEPTED: { UZ: 'Qabul qilindi', RU: 'Принят' },
      COMPLETED: { UZ: 'Tugallandi', RU: 'Завершён' },
      CANCELLED: { UZ: 'Bekor qilingan', RU: 'Отменён' },
    };

    const nm = (item: any) => s.lang === 'RU' ? item.nameRu : item.nameUz;

    let text = s.lang === 'RU' ? '📅 *Мои записи:*\n\n' : '📅 *Navbatlarim:*\n\n';

    const cancelButtons: any[] = [];
    for (const a of appointments) {
      const dateStr = new Date(a.date).toISOString().split('T')[0];
      const emoji = statusEmoji[a.status] || '⚪';
      const label = (statusLabel[a.status] || {})[s.lang || 'UZ'] || a.status;
      const price = a.finalPrice ?? a.doctor?.price ?? 0;

      text += `${emoji} *${a.doctor.firstName} ${a.doctor.lastName}*\n`;
      text += `   🏥 ${nm(a.doctor.clinic)}\n`;
      text += `   📅 ${dateStr} | 🕐 ${a.startTime}—${a.endTime}\n`;
      text += `   💰 ${price.toLocaleString()} ${s.lang === 'RU' ? 'сум' : "so'm"} | ${label}\n`;

      if (a.diagnosis) {
        text += `   📋 ${s.lang === 'RU' ? 'Диагноз' : 'Tashxis'}: ${a.diagnosis.description}\n`;
        if (a.diagnosis.prescription) {
          text += `   💊 ${s.lang === 'RU' ? 'Рецепт' : 'Dorilar'}: ${a.diagnosis.prescription}\n`;
        }
      }
      text += '\n';

      if (a.status === 'PENDING') {
        cancelButtons.push([Markup.button.callback(
          `❌ ${a.doctor.firstName} ${a.doctor.lastName} (${a.startTime})`,
          `cancel_app_${a.id}`,
        )]);
      }
    }

    const buttons = [...cancelButtons, [Markup.button.callback(this.t(s.lang, 'main_menu'), 'menu')]];
    const kb = Markup.inlineKeyboard(buttons);
    try { await ctx.editMessageText(text, { parse_mode: 'Markdown', ...kb }); }
    catch { await ctx.replyWithMarkdown(text, kb); }
  }

  /* ══════════════════ Cancel Appointment ══════════════════ */
  private async cancelAppointment(ctx: any, appointmentId: string) {
    const s = this.s(ctx.chat!.id);
    try {
      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: 'CANCELLED' },
      });
      await ctx.answerCbQuery(this.t(s.lang, 'cancelled'));
      await this.showMyAppointments(ctx);
    } catch {
      await ctx.answerCbQuery(this.t(s.lang, 'error'));
    }
  }

  /* ══════════════════ My Diagnoses ══════════════════ */
  private async showMyDiagnoses(ctx: any) {
    const s = this.s(ctx.chat!.id);
    if (!s.userId) return;

    const diagnoses = await this.prisma.diagnosis.findMany({
      where: { appointment: { userId: s.userId } },
      include: { doctor: true, appointment: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    if (diagnoses.length === 0) {
      const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'main_menu'), 'menu')]]);
      try { await ctx.editMessageText(this.t(s.lang, 'no_diagnoses'), kb); }
      catch { await ctx.reply(this.t(s.lang, 'no_diagnoses'), kb); }
      return;
    }

    let text = s.lang === 'RU' ? '📄 *Мои диагнозы:*\n\n' : '📄 *Tashxislarim:*\n\n';

    for (const d of diagnoses) {
      const dateStr = d.createdAt.toISOString().split('T')[0];
      text += `👨‍⚕️ *${d.doctor.firstName} ${d.doctor.lastName}*\n`;
      text += `   📅 ${dateStr}\n`;
      text += `   📋 ${d.description}\n`;
      if (d.prescription) {
        text += `   💊 ${s.lang === 'RU' ? 'Рецепт' : 'Dorilar'}: ${d.prescription}\n`;
      }
      if (d.appointment?.finalPrice != null) {
        text += `   💰 ${d.appointment.finalPrice.toLocaleString()} ${s.lang === 'RU' ? 'сум' : "so'm"}\n`;
      }
      text += '\n';
    }

    const kb = Markup.inlineKeyboard([[Markup.button.callback(this.t(s.lang, 'main_menu'), 'menu')]]);
    try { await ctx.editMessageText(text, { parse_mode: 'Markdown', ...kb }); }
    catch { await ctx.replyWithMarkdown(text, kb); }
  }
}
