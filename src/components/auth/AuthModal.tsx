import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  defaultView?: 'login' | 'signup'
}

export const AuthModal = ({ 
  isOpen, 
  onOpenChange, 
  defaultView = 'login' 
}: AuthModalProps) => {
  const [view, setView] = useState<'login' | 'signup'>(defaultView)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {view === 'login' ? (
          <LoginForm onSwitchToSignup={() => setView('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => setView('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}