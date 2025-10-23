import { IUser } from '@/models/user.model'

import UserPreview from './UserPreview'
import CommonEntityContainer from '../common/CommonEntityContainer'

type ICommonUserDetailsProps = {
  user: IUser
  title?: string
}

const CommonUserDetails = (props: ICommonUserDetailsProps) => {
  return (
    <CommonEntityContainer title={props.title ?? 'User Details'}>
      <UserPreview type='user' user={props.user} />
    </CommonEntityContainer>
  )
}

export default CommonUserDetails
