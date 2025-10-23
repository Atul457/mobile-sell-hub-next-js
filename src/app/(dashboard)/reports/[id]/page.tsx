import Report from '@/components/page-wise/reports/[id]/Report'

import { IRequestArgs } from '@/app/api/types'

const Report_ = (args: IRequestArgs<{ id: string }>) => {
  return <Report id={args.params.id} />
}

export default Report_
