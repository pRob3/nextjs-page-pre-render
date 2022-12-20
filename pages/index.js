import path from 'path';
import Link from 'next/link';

function HomePage(props) {
  const { products } = props;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

export async function getStaticProps(context) {
  console.log('(Re-)Generating...');

  const fs = require('fs').promises;
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    return {
      redirect: {
        destination: '/no-data', // path to redirect to
      },
    };
  }

  if (data.products.length === 0) {
    return {
      notFound: true, // 404 page
    };
  }

  return {
    props: {
      products: data.products,
    },
    revalidate: 10, // in seconds (only in production)
  };
}

export default HomePage;
