import React, { useEffect, useState } from 'react'
import './App.css'
import './LoveLetter.css'
import './BookCanvas.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'
import Layout from './layout/Layout'
import Home from './pages/Home'
import LoveLetter from './pages/LoveLetter'
import Test from './pages/Test'
import OpeningAnimation from './components/OpeningAnimation'
import CountdownLock from './components/CountdownLock'

const App = () => {
  const MyRoute = createBrowserRouter(createRoutesFromElements(
    <Route>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path='love-letter' element={<LoveLetter />}></Route>
        <Route path='test' element={<Test />}></Route>
      </Route>
    </Route>
  ))

  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  // Lock state checking target date
  const targetTime = new Date('2026-10-20T23:59:59+05:30').getTime();
  const [isLocked, setIsLocked] = useState(new Date().getTime() < targetTime);

  // Trigger the 9-second cake sequence ONLY when unlocked
  useEffect(() => {
    if (!isLocked) {
      setLoading(true);
      setShowContent(false);
      setAnimateOut(false);

      const timer1 = setTimeout(() => setAnimateOut(true), 8400);
      const timer2 = setTimeout(() => setShowContent(true), 8600);
      const timer3 = setTimeout(() => setLoading(false), 9000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isLocked]);

  return (
    <>
      {isLocked ? (
        <CountdownLock onUnlock={() => setIsLocked(false)} />
      ) : (
        <>
          {loading && <OpeningAnimation animateOut={animateOut} />}
          {showContent && <RouterProvider router={MyRoute} />}
        </>
      )}
    </>
  )
}

export default App