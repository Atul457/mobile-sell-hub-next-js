import Tags from '@/components/page-wise/tags/Tags';

import { IRequestArgs } from '@/app/api/types';

const Cattegory = (args: IRequestArgs<{ id: string }>) => {
    return <Tags categoryId={args.params.id} />;
};

export default Cattegory;
