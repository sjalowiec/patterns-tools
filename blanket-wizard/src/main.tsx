import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import BlanketWizard from './BlanketWizard'
import './wizard_styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlanketWizard />
  </StrictMode>,
)
