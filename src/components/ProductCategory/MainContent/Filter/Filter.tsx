import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import Product from 'src/model/Product';
import FilterStatus from './Accordions/FilterStatus';
import Checkboxs from './Checkboxs';
import PriceRange from './PriceRange';

type AppProps = {
	productsList: Product[];
};

export default function Filter({ productsList }: AppProps) {
	const [isShowFilter, setIsShowFilter] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const toggleFilter = () => {
		setIsShowFilter((isShow) => !isShow);
	};

	if (!isClient) {
		return null;
	}

	const isMobile = window.innerWidth < 630;

	return (
		<>
			{isMobile && !isShowFilter && (
				<GiHamburgerMenu className="text-2xl z-20 " onClick={toggleFilter} />
			)}
			{isMobile && isShowFilter && (
				<CgClose className="text-2xl z-20 " onClick={toggleFilter} />
			)}
			<div
				className={`sm:absolute sm:top-0 sm:left-[-200px] ${
					isShowFilter &&
					'sm:top-[420px] sm:left-0 sm:z-10 shadow-lg bg-white text-sm w-[230px]'
				}`}>
				<PriceRange />
				<FilterStatus />
				<Checkboxs productsList={productsList} />
			</div>
		</>
	);
}
