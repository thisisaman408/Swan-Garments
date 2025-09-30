import { saveState } from '@/components/common/browser-storage';
import Layout from '@/components/layout/Layout';
import { debounce } from 'debounce';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from 'src/store/redux-toolkit/store';
import 'styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
	//////////////////////////////////////////////////////////////////////
	/////////////////////BAR_PROCESS/////////////////////////////////////
	// import NProgress from "nprogress";
	// import "styles/nprogress.css";
	// import { useEffect } from "react";
	// import { useRouter } from "next/router";
	// const router = useRouter();

	// useEffect(() => {
	//   const handleStart = (url: string) => {
	//     NProgress.start();
	//   };
	//   const handleStop = () => {
	//     NProgress.done();
	//   };

	//   router.events.on("routeChangeStart", handleStart);
	//   router.events.on("routeChangeComplete", handleStop);
	//   router.events.on("routeChangeError", handleStop);

	//   return () => {
	//     router.events.off("routeChangeStart", handleStart);
	//     router.events.off("routeChangeComplete", handleStop);
	//     router.events.off("routeChangeError", handleStop);
	//   };
	// }, [router]);
	//////////////////////////////////////////////////////////////////////

	useEffect(() => {
		const unsubscribe = store.subscribe(
			debounce(() => {
				saveState(store.getState());
			}, 800)
		);

		// Cleanup subscription on unmount
		return unsubscribe;
	}, []);

	return (
		<>
			<Head>
				<link
					rel="shortcut icon"
					href="/favicon-sun.ico"
					type="image/x-icon"
					suppressHydrationWarning
				/>
			</Head>
			<Provider store={store}>
				<Layout>
					<Component {...pageProps} suppressHydrationWarning />
				</Layout>
			</Provider>
		</>
	);
}

export default MyApp;

// async redirects() {
//   return [{ source: "/", destination: "/men", permanent: false }];
// },
