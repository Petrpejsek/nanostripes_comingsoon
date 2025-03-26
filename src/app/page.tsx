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
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Došlo k neočekávané chybě');
      }

      setSubmitted(true);
      setEmail('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Došlo k neočekávané chybě');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderer = ({ days, hours, minutes, seconds, completed }: CountdownProps) => {
    if (completed) {
      return <div className="text-2xl font-bold">Launch time!</div>;
    }
    
    return (
      <div className="flex gap-8 text-5xl font-bold">
        <div className="flex flex-col items-center">
          <span>{String(days).padStart(2, '0')}</span>
          <span className="text-base font-normal">Days</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{String(hours).padStart(2, '0')}</span>
          <span className="text-base font-normal">Hours</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{String(minutes).padStart(2, '0')}</span>
          <span className="text-base font-normal">Minutes</span>
        </div>
        <div className="flex flex-col items-center">
          <span>{String(seconds).padStart(2, '0')}</span>
          <span className="text-base font-normal">Seconds</span>
        </div>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-4xl space-y-16 text-center">
        {/* Logo */}
        <div className="mx-auto mb-8">
          <img
            src="/logo.png"
            alt="Nanostripes Logo"
            className="mx-auto h-auto w-[400px]"
          />
        </div>

        {/* Hlavní text */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Something exciting is coming...</h1>
          <p className="text-2xl">A new era of supplements</p>
        </div>

        {/* Odpočet */}
        <div className="flex justify-center">
          <Countdown 
            key={key}
            date={launchDate} 
            renderer={renderer}
            precision={3}
          />
        </div>

        {/* Email formulář */}
        <div className="mx-auto max-w-md space-y-4">
          {submitted ? (
            <p className="text-green-600 text-xl">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full rounded-full border border-gray-300 px-6 py-3 text-lg focus:border-black focus:outline-none disabled:bg-gray-100"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full bg-black px-6 py-3 text-lg text-white transition hover:bg-gray-800 disabled:bg-gray-400"
              >
                {isLoading ? 'Sending...' : 'Get notified'}
              </button>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
