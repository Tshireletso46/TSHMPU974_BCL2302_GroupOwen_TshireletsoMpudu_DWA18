import './App.css';
import PodcastList from './components/PodcastList';
import Supa from './config/SupabaseClient';
import { Supabase } from './config/SupabaseClient';
import { useState, useEffect } from 'react';
import Season from './components/Seasons';

export default function App() {
  // const [signUpState, setSignUpState] = useState('SignPhase')
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [phase, setPhase] = useState('signUpPhase')
  const [pageState, setPageState] = useState('signUpPhase')

  useEffect(() => {
    const authListener = Supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("User signed in successfully:", session.user.email);
        setPhase('previewPhase')
        setIsSignedIn(true)
      }
    });

    return () => {
      authListener.unsubscribe;
    };
  }, [])
  
  async function HandlePreviewClick(event) {
    if (phase === 'previewPhase') {
      const buttonId = event.target.id
      console.log(buttonId)
      // const showTitle = event.currentTarget.title
      if (buttonId) {
        try {
          const response = await fetch(`https://podcast-api.netlify.app/id/${buttonId}`);
          const data = await response.json();
          setPageState(data.seasons)
          setPhase('seasonPhase')
        } catch (error) {
          console.error('Error fetching Preview data:', error.message);
        }
      }
    }
  }

  return (
    <>
    { phase ==='seasonPhase' && <Season pageState={pageState}/>}
    {phase === "previewPhase" && isSignedIn ? (
        <>
          <div className="app">
            <PodcastList  HandlePreviewClick={HandlePreviewClick}/>
          </div>
        </>
      ) : (
        <Supa />
      )}
    </>
  );
 }