import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Portal = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = useState(false);
	const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setMounted(true);
		const element = document.querySelector('#my-portal') as HTMLElement;
		setPortalElement(element);
		return () => setMounted(false);
	}, []);

	if (!mounted || !portalElement) return null;

	return createPortal(children, portalElement);
};

export default Portal;
