import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);
  
  return (
    <>
      <Head>
        <title>Sign Up | StudySync</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h1 className="text-center text-3xl font-extrabold text-gray-900">StudySync</h1>
          <h2 className="mt-2 text-center text-sm text-gray-600">
            Start tracking your study progress today
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <SignupForm />
        </div>
      </div>
    </>
  );
}