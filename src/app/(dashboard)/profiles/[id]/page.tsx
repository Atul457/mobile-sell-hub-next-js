
import ViewProfile from '@/components/page-wise/users/[id]/ViewProfile'

import { IRequestArgs } from '@/app/api/types'

const Profile_ = (props: IRequestArgs<{ id: string }>) => {
    return <ViewProfile id={props.params.id} />
}

export default Profile_
