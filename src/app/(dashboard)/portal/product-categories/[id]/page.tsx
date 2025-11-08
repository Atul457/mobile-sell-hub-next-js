import Products from '@/components/page-wise/products/Products';

import { IRequestArgs } from '@/app/api/types';

const Cattegory = (args: IRequestArgs<{ id: string }>) => {
    return <Products categoryId={args.params.id} />;
};

export default Cattegory;
