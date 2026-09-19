import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import React from 'react';
import AdminV2ReviewClient from './AdminV2ReviewClient';

export const metadata = {
  title: 'V2 Harvester & Admin Review | Citizen Satisfaction Meter',
  description: 'Review AI and Wikipedia harvested ministers before publishing to the live platform.'
};

export default async function AdminV2ReviewPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin');
  }
  if ((session.user as any)?.role !== 'ADMIN') {
    return <div className="p-8 text-center text-red-600 font-medium">Unauthorized: Admins only.</div>;
  }

  return <AdminV2ReviewClient />;
}
