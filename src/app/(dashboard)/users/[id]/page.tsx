import User from '@/components/page-wise/users/[id]/User'

import { IRequestArgs } from '@/app/api/types'

const User_ = (props: IRequestArgs<{ id: string }>) => {
  return <User id={props.params.id} />
}

export default User_
