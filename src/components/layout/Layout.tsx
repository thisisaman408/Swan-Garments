import Header from '@/components/layout/Header';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import 'animate.css';
import hangerEmpty from 'assets/hangerEmpty.png';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { BsFacebook, BsInstagram, BsYoutube } from 'react-icons/bs';
import { FaFacebookF } from 'react-icons/fa';
import { GrSun } from 'react-icons/gr';
import { Transition } from 'react-transition-group';
import sendCartData, { fetchCartData } from 'src/store/redux-toolkit/cartThunk';
import { useAppDispatch, useAppSelector } from 'src/store/redux-toolkit/hooks';
import useStore from 'src/store/zustand/useStore';
import classes from 'styles/scrollbar.module.css';

type AppProps = {
	children: React.ReactNode;
};

let isInitial = true;

export default function Layout({ children }: AppProps): JSX.Element {
	const [parent] = useAutoAnimate();
	const dispatch = useAppDispatch();
	const cart = useAppSelector((state) => state.cart);
	const router = useRouter();
	const setToken = useStore((state) => state.setToken);
	const setEmail = useStore((state) => state.setEmail);
	const setAvatar = useStore((state) => state.setAvatar);
	const isLoggedIn = useStore((state) => !!state.tokenId);
	const setLovedProductIds = useStore((state) => state.setLovedProductIds);

	// Client-side hydration state
	const [isClient, setIsClient] = useState(false);
	const [isOpenLabel, setIsOpenLabel] = useState(false);

	// Refs for transitions
	const nodeRef = useRef(null);

	// Show/hide header logic
	const showHeader =
		router.pathname === '/auth' || router.pathname === '/' ? false : true;

	// Redux state
	const totalQuantity = useAppSelector((state) => state.cart.totalQuantity);
	const cartItems = useAppSelector((state) => state.cart.items);

	// Initialize client-side state
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Fetch cart data on mount
	useEffect(() => {
		dispatch(fetchCartData());
	}, [dispatch]);

	// Handle cart changes
	useEffect(() => {
		if (isInitial) {
			isInitial = false;
			return;
		}

		if (cart.changed) {
			dispatch(sendCartData(cart));
		}
	}, [cart, dispatch]);

	// Handle localStorage access only on client
	useEffect(() => {
		if (!isClient) return;

		const token = localStorage.getItem('token');
		const email = localStorage.getItem('email');
		const avatar = localStorage.getItem('avatar');

		if (token && email && avatar) {
			setToken(token);
			setEmail(email);
			setAvatar(avatar);
		}
	}, [setToken, setEmail, setAvatar, isClient]);

	// Handle loved products localStorage access only on client
	useEffect(() => {
		if (!isClient || !isLoggedIn) return;

		const lovedProductIdsJSON = localStorage.getItem('love');
		if (lovedProductIdsJSON !== null) {
			const lovedProductIds = JSON.parse(lovedProductIdsJSON);
			setLovedProductIds(lovedProductIds);
		}
	}, [isLoggedIn, setLovedProductIds, isClient]);

	// Handle label click
	const handleClickLabel = () => {
		setIsOpenLabel((prev) => !prev);
	};

	// Close label on route change
	useEffect(() => {
		setIsOpenLabel(false);
	}, [router.pathname]);

	// Don't render interactive elements until client is ready
	if (!isClient) {
		return (
			<>
				{showHeader && <Header />}
				<main className="bg-[#fafafa] dark:bg-[#191919] dark:text-[#DDDDDD]">
					{children}
				</main>
				{showHeader && <footer className="h-[38px] bg-[#333333]"></footer>}
			</>
		);
	}

	return (
		<>
			{showHeader && <Header />}

			<main className="bg-[#fafafa] dark:bg-[#191919] dark:text-[#DDDDDD]">
				{children}

				<Transition
					in={isOpenLabel}
					timeout={800}
					mountOnEnter
					unmountOnExit
					nodeRef={nodeRef}>
					{(state) => {
						return (
							<div
								ref={nodeRef}
								className={`fixed right-[36px] top-[45vh] bg-[#F6F5F3] py-3 px-3 z-20 shadow-sm ${
									state === 'entering'
										? 'animate__animated animate__bounceInRight animate__fast'
										: state === 'exiting'
										? 'animate__animated animate__bounceOutRight animate__fast'
										: ''
								}`}>
								<h3 className="font-semibold text-xl mb-5 pb-3 border-b-2 border-primary-color">
									Cart ({totalQuantity})
								</h3>
								<div
									className={`h-[250px] overflow-auto ${classes['custom-scrollbar']} mb-3`}>
									{cartItems.length > 0 && (
										<ul
											// @ts-ignore
											ref={parent}>
											{cartItems.map((cartItem) => (
												<li
													key={cartItem.id}
													className="flex items-center gap-2 rounded-sm px-3 py-2 mb-3">
													<div className="relative h-24 w-24">
														<Image
															src={cartItem.img}
															layout="fill"
															className="object-cover"
															alt=""
														/>
													</div>
													<div className="flex-1">
														<p className="font-medium max-w-[200px] mb-2">
															{cartItem.name}
														</p>
														<p className="font-medium mb-2">
															$ {cartItem.price}
														</p>
														<div className="flex-between mb-1 text-sm text-gray-700">
															<p>Size:</p>
															<p>{cartItem.size}</p>
														</div>
														<div className="flex-between mb-1 text-sm text-gray-700">
															<p>Quantity:</p>
															<p>{cartItem.quantity}</p>
														</div>
													</div>
												</li>
											))}
										</ul>
									)}
									{cartItems.length === 0 && (
										<div className="py-14 px-10">
											<div className="relative h-16 w-44 mb-6">
												<Image
													src={hangerEmpty}
													layout="fill"
													className="object-cover"
													alt=""
												/>
											</div>
											<p className="font-medium text-gray-600 text-xl text-center">
												Your cart is empty
											</p>
										</div>
									)}
								</div>
								<Link href="/cart" passHref legacyBehavior>
									<a
										className="uppercase bg-primary-color font-medium text-lg
                    rounded-full
                    active:shadow-sm active:scale-[.98] active:translate-y-0 
                    active:bg-[#e5b32f] 
                    hover:bg-[#fecd48] hover:-translate-y-[2px] 
                    transition-all duration-[250ms] 
                    z-10 relative overflow-hidden 
                    py-3 px-5
                    mx-auto
                    group
                    block text-center max-w-[150px]">
										Checkout
										<div
											className="-z-10 bg-[#ffffff33] 
                      absolute top-[-1000%] bottom-[-375%] 
                      w-9 
                      translate3d-rotate group-hover:transition group-hover:duration-[1000ms] group-hover:ease-in-out group-hover:translate3d-rotate-hover"></div>
									</a>
								</Link>
							</div>
						);
					}}
				</Transition>

				{showHeader && (
					<button
						onClick={handleClickLabel}
						className="fixed right-0 top-[45vh] bg-primary-color py-3 px-2 flex flex-col items-center gap-1 z-30">
						<p className="text-xl font-semibold" suppressHydrationWarning>
							{totalQuantity}
						</p>
						<GrSun className="text-xl font-semibold hover:text-[#eee] transition cursor-pointer" />
					</button>
				)}

				{showHeader && (
					<div className="fixed right-0 top-[60vh] bg-[#666] py-3 px-2 flex flex-col gap-3 z-30">
						<Link href="https://www.facebook.com/fuocy" passHref legacyBehavior>
							<a target="_blank" rel="noopener noreferrer">
								<FaFacebookF className="text-xl text-[#999] hover:text-[#eee] transition cursor-pointer" />
							</a>
						</Link>
						<Link
							href="https://www.youtube.com/watch?v=s5YjHRWba5A"
							passHref
							legacyBehavior>
							<a target="_blank" rel="noopener noreferrer">
								<BsYoutube className="text-xl text-[#999] hover:text-[#eee] transition cursor-pointer" />
							</a>
						</Link>
						<Link
							href="https://www.instagram.com/h2.huu_huan/"
							passHref
							legacyBehavior>
							<a target="_blank" rel="noopener noreferrer">
								<BsInstagram className="text-xl text-[#999] hover:text-[#eee] transition cursor-pointer" />
							</a>
						</Link>
					</div>
				)}
			</main>

			{showHeader && (
				<footer className="h-[38px] bg-[#333333] flex items-center px-10 justify-between">
					<p className="text-white">Copyright Fuocy © 2022</p>
					<div className="flex gap-4 items-center">
						<p className="text-white">Contact me: </p>
						<Link href="https://www.facebook.com/fuocy" legacyBehavior>
							<a target="_blank" rel="noopener noreferrer">
								<BsFacebook
									size={22}
									className="text-white hover:text-blue-500 transition duration-300"
								/>
							</a>
						</Link>
						<Link href="https://github.com/fuocy" legacyBehavior>
							<a target="_blank" rel="noopener noreferrer">
								<AiFillGithub
									size={25}
									className="text-white hover:text-blue-500 transition duration-300"
								/>
							</a>
						</Link>
					</div>
				</footer>
			)}
		</>
	);
}
