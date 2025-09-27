import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

const Backbutton = () => {
    const router = useRouter();
    const handleBack = ()=>{
        router.back();
    }
  return (
    <div><Button onClick={handleBack}><ArrowLeft/></Button></div>
  )
}

export default Backbutton