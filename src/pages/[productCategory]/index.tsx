import Meta from '@/components/common/Meta';
import ProductCategory from '@/components/ProductCategory/ProductCategory';
import { MongoClient } from 'mongodb';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Product from 'src/model/Product';
type AppProps = {
	products: Product[];
};

export default function ProductCategoryPage({ products }: AppProps) {
	return (
		<>
			<Meta
				title="Lighthouse | Category"
				description="Lighthouse were my everything."
				image="/preview.png"
			/>
			<ProductCategory productsList={products} />;
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const client = await MongoClient.connect(process.env.DB_CONNECTION_STRING!);
	const db = client.db();
	const productClt = db.collection('products');
	const categories = await productClt
		.find({}, { projection: { category: 1, _id: 0 } })
		.toArray();
	const uniqueCategories = Array.from(
		new Set(categories.map((item) => item.category))
	);

	client.close();

	return {
		fallback: 'blocking',
		paths: uniqueCategories.map((category) => ({
			params: { productCategory: category },
		})),
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const productCategory = context.params!.productCategory;

	const client = await MongoClient.connect(process.env.DB_CONNECTION_STRING!);
	const db = client.db();
	const productClt = db.collection('products');
	const correspondingProducts = await productClt
		.find({ category: productCategory })
		.toArray();

	client.close();
	const convertedProducts = JSON.parse(JSON.stringify(correspondingProducts)); // fix weired error

	return {
		props: {
			products: convertedProducts.map((product: Product) => ({
				...product,
				id: product._id.toString(),
			})),
		},
	};
};
