'use client';

import Link from 'next/link';
import Image from 'next/image';
import { User, Stethoscope, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Image src="/logo.PNG" alt="BookMed" width={80} height={80} className="rounded-xl" />
          </div>
          <h1 className="text-5xl font-bold text-primary-700 mb-4">BookMed</h1>
          <p className="text-xl text-gray-600">Tibbiy navbat olish tizimi</p>
          <p className="text-gray-500 mt-2">Система онлайн записи к врачам</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Panel */}
          <Link href="/user" className="group">
            <div className="card hover:shadow-lg hover:border-blue-300 transition-all duration-200 text-center cursor-pointer group-hover:scale-105">
              <div className="flex justify-center mb-4">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Bemor</h2>
              <p className="text-gray-500 text-sm">Navbat olish va boshqarish</p>
              <p className="text-gray-400 text-xs mt-1">Запись на прием</p>
            </div>
          </Link>

          {/* Doctor Panel */}
          <Link href="/doctor" className="group">
            <div className="card hover:shadow-lg hover:border-green-300 transition-all duration-200 text-center cursor-pointer group-hover:scale-105">
              <div className="flex justify-center mb-4">
                <Stethoscope className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Shifokor</h2>
              <p className="text-gray-500 text-sm">Bemorlarni boshqarish</p>
              <p className="text-gray-400 text-xs mt-1">Управление пациентами</p>
            </div>
          </Link>

          {/* Admin Panel */}
          <Link href="/admin" className="group">
            <div className="card hover:shadow-lg hover:border-purple-300 transition-all duration-200 text-center cursor-pointer group-hover:scale-105">
              <div className="flex justify-center mb-4">
                <Settings className="w-12 h-12 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Admin</h2>
              <p className="text-gray-500 text-sm">Tizimni boshqarish</p>
              <p className="text-gray-400 text-xs mt-1">Управление системой</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
