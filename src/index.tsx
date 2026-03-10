import './index.css';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { AuthProvider } from './lib/store/authStore';
// Lordicon custom element TypeScript declaration
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lord-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement> &
      {
        src?: string;
        trigger?: string;
        colors?: string;
        stroke?: string;
        state?: string;
      };
    }
  }
}
// Load Lordicon script once at app startup
const lordiconScript = document.createElement('script');
lordiconScript.src = 'https://cdn.lordicon.com/lordicon.js';
lordiconScript.async = true;
document.head.appendChild(lordiconScript);
render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);