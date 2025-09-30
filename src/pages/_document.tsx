import Document, {
	DocumentContext,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';
import { resetIdCounter } from 'react-tabs';

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		resetIdCounter(); // This for React-Tab package to work properly in NextJS
		const initialProps = await Document.getInitialProps(ctx);
		return initialProps;
	}

	render() {
		return (
			<Html lang="en">
				<Head />
				<body className="selection:bg-[#fff700] selection:text-black">
					<Main />

					<NextScript />
					<div id="my-portal" suppressHydrationWarning></div>
				</body>
			</Html>
		);
	}
}

export default MyDocument;
