import { baseTemplate } from './base.template'
import { forgotPasswordTemplate } from './forgotPassword.template'
import { invitationTemplate } from './invitation.template'

const mailTemplates = {
  forgotPassword: {
    ...forgotPasswordTemplate,
    template: baseTemplate.template
      .replace(baseTemplate.keysToReplace.content, forgotPasswordTemplate.template)
      .replace(baseTemplate.keysToReplace.subject, forgotPasswordTemplate.subject)
  },
  invitation: {
    ...invitationTemplate,
    template: baseTemplate.template
      .replace(baseTemplate.keysToReplace.content, invitationTemplate.template)
      .replace(baseTemplate.keysToReplace.subject, invitationTemplate.subject)
  }
}

export { mailTemplates }

