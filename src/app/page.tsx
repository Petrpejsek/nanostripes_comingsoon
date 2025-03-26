'use client';

import Image from "next/image";
import Countdown from 'react-countdown';
import { useState, useEffect } from 'react';

interface CountdownProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [launchDate, setLaunchDate] = useState<Date>(new Date());
  const [key, setKey] = useState(0);

  useEffect(() => {
    const savedDate = localStorage.getItem('launchDate');
    if (savedDate) {
      setLaunchDate(new Date(savedDate));
    } else {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 30);
      localStorage.setItem('launchDate', newDate.toISOString());
      setLaunchDate(newDate);
    }

    const interval = setInterval(() => {
      setKey(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Místo volání API jen uložíme email do localStorage
      const emails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
      if (emails.includes(email)) {
        throw new Error('Email je již zaregistrován');
      }
      emails.push(email);
      localStorage.setItem('subscribedEmails', JSON.stringify(emails));
      
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error('Subscribe form error:', error);
        setError('Došlo k neočekávané chybě');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownProps) => {
    if (completed) {
      return <div className="text-3xl font-bold text-blue-600">Launch time!</div>;
    }
    
    return (
      <div className="flex gap-8 text-4xl font-bold">
        <div className="flex flex-col items-center bg-white/80 p-4 rounded-xl shadow-md">
          <span className="text-blue-600">{String(days).padStart(2, '0')}</span>
          <span className="text-sm font-medium text-gray-600 mt-1">Days</span>
        </div>
        <div className="flex flex-col items-center bg-white/80 p-4 rounded-xl shadow-md">
          <span className="text-blue-600">{String(hours).padStart(2, '0')}</span>
          <span className="text-sm font-medium text-gray-600 mt-1">Hours</span>
        </div>
        <div className="flex flex-col items-center bg-white/80 p-4 rounded-xl shadow-md">
          <span className="text-blue-600">{String(minutes).padStart(2, '0')}</span>
          <span className="text-sm font-medium text-gray-600 mt-1">Minutes</span>
        </div>
        <div className="flex flex-col items-center bg-white/80 p-4 rounded-xl shadow-md">
          <span className="text-blue-600">{String(seconds).padStart(2, '0')}</span>
          <span className="text-sm font-medium text-gray-600 mt-1">Seconds</span>
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="w-full max-w-4xl space-y-16 text-center">
        {/* Logo */}
        <div className="relative mx-auto h-32 w-96 transform hover:scale-105 transition-transform duration-300">
          <Image
            src="/logo.png"
            alt="Nanostripes Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
            className="drop-shadow-lg"
          />
        </div>

        {/* Hlavní text */}
        <div className="space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Something exciting is coming...
          </h1>
          <p className="text-2xl text-gray-600 font-light tracking-wide">
            A new era of supplements
          </p>
        </div>

        {/* Odpočet */}
        <div className="flex justify-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-lg">
          <Countdown 
            key={key}
            date={launchDate} 
            renderer={renderer}
            precision={3}
          />
        </div>

        {/* Email formulář */}
        <div className="mx-auto max-w-md space-y-4 p-6 rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg">
          {submitted ? (
            <div className="animate-fade-in">
              <p className="text-green-600 text-xl font-medium">Thank you for subscribing!</p>
              <p className="text-gray-500 mt-2">We'll keep you updated on our progress.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className="w-full rounded-xl border border-gray-200 px-6 py-4 text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none disabled:bg-gray-100 transition-all duration-200"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-lg text-white font-medium transition-all duration-200 hover:opacity-90 hover:shadow-lg disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : 'Get notified'}
              </button>
              {error && (
                <p className="text-red-500 bg-red-50 p-3 rounded-lg animate-shake">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
