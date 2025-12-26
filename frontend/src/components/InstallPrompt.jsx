import { useState, useEffect } from 'react'
import './InstallPrompt.css'

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      
      // Show prompt after a delay (optional)
      setTimeout(() => {
        const hasSeenPrompt = localStorage.getItem('hasSeenInstallPrompt')
        if (!hasSeenPrompt) {
          setShowPrompt(true)
        }
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
    localStorage.setItem('hasSeenInstallPrompt', 'true')
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('hasSeenInstallPrompt', 'true')
  }

  if (!showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">📱</div>
        <div className="install-prompt-text">
          <h3>Install SCT Helper</h3>
          <p>Add to your home screen for quick access and offline use!</p>
        </div>
        <div className="install-prompt-actions">
          <button onClick={handleInstallClick} className="install-btn">
            Install
          </button>
          <button onClick={handleDismiss} className="dismiss-btn">
            Not Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallPrompt

