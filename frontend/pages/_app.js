import '../styles/globals.css';
import 'react-quill/dist/quill.snow.css';
import Head from 'next/head';
import { AuthProvider } from '../lib/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import CustomCursor from '../components/CustomCursor';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>Vision Spark Solutions India Pvt. Ltd. | Innovate • Inspire • Ignite</title>
        <meta name="description" content="Vision Spark Solutions India Pvt. Ltd. - Premier Technology Training, Internships, Campus Training & Career Placement Solutions." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </Head>
      <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900 selection:bg-vsOrange selection:text-white">
        <Navbar />
        <main className="flex-1 pt-[88px]">
          <Component {...pageProps} />
        </main>
        <Footer />
        <ChatbotWidget />
        <CustomCursor />
      </div>
    </AuthProvider>
  );
}
