// LeadGen SaaS Frontend (React + Next.js + Tailwind CSS + Supabase Auth)

'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LeadGenDashboard() {
  const supabase = createClientComponentClient();

  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleLogin() {
    await supabase.auth.signInWithOtp({ email: prompt('Enter your email:') });
  }

  async function handleScrape() {
    setLoading(true);
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;

    const res = await fetch('/api/leads/scrape', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ searchTerm, location })
    });
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  }

  async function handleExport() {
    const { data: session } = await supabase.auth.getSession();
    const token = session?.session?.access_token;
    const res = await fetch('/api/leads/export', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">LeadGen SaaS</h1>

      {!user ? (
        <Button onClick={handleLogin}>Sign in with Magic Link</Button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input placeholder="Search term (e.g. dentists)" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <Input placeholder="Location (e.g. Boston)" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <Button onClick={handleScrape} disabled={loading}>{loading ? 'Scraping...' : 'Find Leads'}</Button>
            <Button onClick={handleExport}>Export CSV</Button>
          </div>
          <ul className="mt-6 space-y-4">
            {leads.map((lead, i) => (
              <li key={i} className="border p-4 rounded-xl shadow-sm">
                <h2 className="font-semibold">{lead.name}</h2>
                <p><a href={lead.website} target="_blank" className="text-blue-600 underline">{lead.website}</a></p>
                <p className="text-sm italic">{lead.outreach_email}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
