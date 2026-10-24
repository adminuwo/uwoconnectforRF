"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';

const Card = ({ className = '', children }) => <div className={`bg-white rounded-2xl border border-slate-200 ${className}`}>{children}</div>;
const CardHeader = ({ className = '', children }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ className = '', children }) => <h2 className={`text-2xl font-bold text-slate-900 ${className}`}>{children}</h2>;
const CardDescription = ({ className = '', children }) => <p className={`text-sm text-slate-500 mt-1 ${className}`}>{children}</p>;
const CardContent = ({ className = '', children }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardFooter = ({ className = '', children }) => <div className={`p-6 border-t border-slate-100 ${className}`}>{children}</div>;
const Button = ({ className = '', children, ...props }) => <button className={`py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer ${className}`} {...props}>{children}</button>;
const Input = ({ className = '', ...props }) => <input className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-indigo-500 ${className}`} {...props} />;
const Label = ({ className = '', children, ...props }) => <label className={`text-sm font-bold text-slate-700 block ${className}`} {...props}>{children}</label>;

export default function PublicBookingClient({ clientId }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [availability, setAvailability] = useState('');
  const [businessName, setBusinessName] = useState('Loading...');
  const [loading, setLoading] = useState(false);
  
  // Booking Form State
  const [time, setTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchAvailability();
    }
  }, [clientId, date]);

  const fetchAvailability = async () => {
    setLoading(true);
    setError('');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/api/public/calendar/${clientId}/slots?date=${date}`);
      const data = await res.json();
      
      if (res.ok) {
        setAvailability(data.availability);
        setBusinessName(data.business_name || 'Business Booking');
      } else {
        setError(data.error || 'Failed to fetch availability.');
      }
    } catch (err) {
      setError('An error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!time || !customerName) {
      setError('Please fill all fields');
      return;
    }
    
    setBookingLoading(true);
    setError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const res = await fetch(`${baseUrl}/api/public/calendar/${clientId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time,
          customer_name: customerName,
        }),
      });
      
      const data = await res.json();
      if (res.ok) {
        setBookingSuccess(true);
      } else {
        setError(data.error || 'Booking failed');
      }
    } catch (err) {
      setError('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-green-500">
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Booking Confirmed!</CardTitle>
            <CardDescription className="text-slate-600">
              Your appointment with <span className="font-semibold text-slate-800">{businessName}</span> has been confirmed.
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-50 border-y border-slate-100 p-4 my-2 text-sm text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Date:</span>
              <span className="font-medium text-slate-700">{date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Time:</span>
              <span className="font-medium text-slate-700">{time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Name:</span>
              <span className="font-medium text-slate-700">{customerName}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => {
                setBookingSuccess(false);
                setTime('');
                setCustomerName('');
              }}
              className="w-full bg-slate-900 text-white hover:bg-slate-800"
            >
              Book Another Time
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {businessName}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Schedule an appointment directly on the calendar below
          </p>
        </div>

        <Card className="shadow-xl">
          <form onSubmit={handleBook}>
            <CardContent className="space-y-6 pt-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-200">
                  {error}
                </div>
              )}

              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Select Date
                </Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Select Time
                </Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              {/* Customer Name */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  Your Name
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>

              {/* Live Availability Info */}
              {loading ? (
                <div className="text-center py-4 text-sm text-slate-500 animate-pulse">
                  Checking schedule availability...
                </div>
              ) : availability ? (
                <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs text-indigo-900 leading-relaxed font-mono whitespace-pre-wrap">
                  {availability}
                </div>
              ) : null}
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={bookingLoading || loading}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
              >
                {bookingLoading ? 'Confirming...' : 'Schedule Appointment'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
