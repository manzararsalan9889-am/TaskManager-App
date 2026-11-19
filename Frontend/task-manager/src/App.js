import { useEffect } from "react";
import RouteContainer from "./components/RouteContainer";
import './index.css';
import ToastProvider from "./toast/ToastProvider";
import { AuthenticateProvider } from "./useAuthenticate";
import { App as CapacitorApp } from '@capacitor/app';

export default function App() {
  useEffect(() => {
    let backListener;

    const setupBackButton = async () => {
      backListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapacitorApp.exitApp();
        }
      });
    };

    setupBackButton();

    return () => {
      if (backListener) {
        backListener.remove();
      }
    };
  }, []);
  return (
    <ToastProvider>
      <AuthenticateProvider>
        <RouteContainer />
      </AuthenticateProvider>
    </ToastProvider>
  )
}

