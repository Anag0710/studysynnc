import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <>
      <Head>
        <title>StudySync - Collaborative Study Tracker</title>
        <meta name="description" content="Track your study progress with friends" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <span className="text-xl font-bold text-indigo-600">StudySync</span>
                </div>
              </div>
              <div className="flex items-center">
                <Link href="/login">
                  <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900">
                    Login
                  </span>
                </Link>
                <Link href="/signup">
                  <span className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Sign Up
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="pt-12 sm:pt-16 lg:pt-20">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl text-center">
                  Study Better <span className="text-indigo-600">Together</span>
                </h1>
                <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-500 text-center">
                  StudySync helps you form small study groups and track daily progress together. 
                  Stay accountable, consistent, and motivated.
                </p>
                <div className="mt-10 flex justify-center">
                  <Link href="/signup">
                    <span className="px-8 py-3 rounded-md shadow text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                      Get Started
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-3">Study Groups</h3>
                  <p className="text-gray-600">
                    Create or join small study groups with up to 6 members. Share progress and stay motivated together.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-3">Track Progress</h3>
                  <p className="text-gray-600">
                    Log your daily study hours, topics, and confidence levels. Watch your progress over time.
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-3">Leaderboard</h3>
                  <p className="text-gray-600">
                    Compete with your group members in a friendly way to see who studies the most consistently.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-white pt-16 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-t border-gray-200 pt-8 text-center">
              <p className="text-sm text-gray-500">
                &copy; {new Date().getFullYear()} StudySync. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}