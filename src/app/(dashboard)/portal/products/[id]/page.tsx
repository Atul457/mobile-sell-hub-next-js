import Product from '@/components/page-wise/products/Product';

import { IRequestArgs } from '@/app/api/types';

export default function Product_(props: IRequestArgs<{ id: string }>) {
    return <Product id={props.params.id} />;
}
