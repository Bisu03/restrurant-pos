import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { SessionProvider, useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";
// import LoadingScreen from "../components/LoadingScreen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoadingScreen from "../components/LoadingScreen";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const queryClient = new QueryClient();
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(() => {
        console.log("Service Worker Registered");
      });
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          {Component.adminRoute ? (
            <AdminRoute>
                <Component {...pageProps} />
            </AdminRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}

function AdminRoute({ children }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  useEffect(() => {
    if (status === "loading") return; 
    if (!isUser) Router.push("/"); 
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  return (
    <div>
      <LoadingScreen />
    </div>
  );
}

export default MyApp;