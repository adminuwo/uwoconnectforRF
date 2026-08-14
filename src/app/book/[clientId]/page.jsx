"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Clock, User, Phone, CheckCircle } from 'lucide-react';

const Card = ({ className = '', children }) => <div className={`bg-white rounded-2xl border border-slate-200 ${className}`}>{children}</div>;
const CardHeader = ({ className = '', children }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardTitle = ({ className = '', children }) => <h2 className={`text-2xl font-bold text-slate-900 ${className}`}>{children}</h2>;
const CardDescription = ({ className = '', children }) => <p className={`text-sm text-slate-500 mt-1 ${className}`}>{children}</p>;
const CardContent = ({ className = '', children }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardFooter = ({ className = '', children }) => <div className={`p-6 border-t border-slate-100 ${className}`}>{children}</div>;
const Button = ({ className = '', children, ...props }) => <button className={`py-3 px-4 rounded-xl font-semibold transition-all cursor-pointer ${className}`} {...props}>{children}</button>;
const Input = ({ className = '', ...props }) => <input className={`w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-indigo-500 ${className}`} {...props} />;
const Label = ({ className = '', children, ...props }) => <label className={`text-sm font-bold text-slate-700 block ${className}`} {...props}>{children}</label>;

export default function PublicBookingPage() {
  const { clientId } = useParams();
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
      const res = await fetch(`${baseUrl}/api/public/calendar/${clientId}/slots?date=${date}`);
      const data = await res.json();
      
      if (res.ok) {
        setAvailability(data.availability);
        setBusinessName(data.business_name);
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
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
      const res = await fetch(`${baseUrl}/api/public/calendar/${clientId}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          time,
          customer_name: customerName,
        })
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
            <CardTitle className="text-2xl font-bold">Booking Confirmed!</CardTitle>
            <CardDescription>
              Your appointment with {businessName} has been successfully scheduled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="font-medium text-slate-700">
              {new Date(date).toLocaleDateString()} at {time}
            </p>
            <p className="text-sm text-slate-500">
              We look forward to speaking with you, {customerName}.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => window.location.reload()}>Book Another</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Card className="w-full max-w-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">{businessName}</h1>
          <p className="text-indigo-100 opacity-90">Schedule an appointment with us</p>
        </div>
        
        <CardContent className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side: Date Selection and Availability */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="date" className="text-base font-semibold flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Select Date
                </Label>
                <Input 
                  type="date" 
                  id="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-100 rounded-lg p-4 border border-slate-200">
                <h3 className="font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Availability Summary
                </h3>
                {loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-slate-300 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-300 rounded w-1/2"></div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 whitespace-pre-wrap">
                    {availability || "Select a date to see availability."}
                  </p>
                )}
              </div>
            </div>

            {/* Right side: Booking Form */}
            <div>
              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <Label htmlFor="time" className="text-sm font-semibold text-slate-700 mb-1 block">
                    Preferred Time (HH:MM)
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="time"
                      type="time" 
                      value={time} 
                      onChange={(e) => setTime(e.target.value)}
                      className="pl-10 border-slate-300 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-semibold text-slate-700 mb-1 block">
                    Your Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                    <Input 
                      id="name"
                      placeholder="John Doe" 
                      value={customerName} 
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="pl-10 border-slate-300 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={bookingLoading || loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-xl transition-all mt-4"
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Appointment'}
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
