import { baseTemplate } from './base.template'
import { forgotPasswordTemplate } from './forgotPassword.template'
import { invitationTemplate } from './invitation.template'
import { reportProcessedTemplate } from './reportProcessed.template'
import { reportReceivedTemplate } from './reportReceived.template'
import { reportRejectedTemplate } from './reportRejected.template'

const mailTemplates = {
  forgotPassword: {
    ...forgotPasswordTemplate,
    template: baseTemplate.template
      .replace(baseTemplate.keysToReplace.content, forgotPasswordTemplate.template)
      .replace(baseTemplate.keysToReplace.subject, forgotPasswordTemplate.subject)
  },
  reportReceived: {
    ...reportReceivedTemplate,
    template: baseTemplate.template
      .replace(baseTemplate.keysToReplace.content, reportReceivedTemplate.template)
      .replace(baseTemplate.keysToReplace.subject, reportReceivedTemplate.subject)
  },
  reportProcessed: {
    ...reportProcessedTemplate,
    template: baseTemplate.template
      .replace(baseTemplate.keysToReplace.content, reportProcessedTemplate.template)
      .replace(baseTemplate.keysToReplace.subject, reportProcessedTemplate.subject)
  },
  reportRejected: {
    ...reportRejectedTemplate,
    template: baseTemplate.template
      .replace(baseTemplate.keysToReplace.content, reportRejectedTemplate.template)
      .replace(baseTemplate.keysToReplace.subject, reportRejectedTemplate.subject)
  },
  invitation: {
    ...invitationTemplate,
    template: baseTemplate.template
      .replace(baseTemplate.keysToReplace.content, invitationTemplate.template)
      .replace(baseTemplate.keysToReplace.subject, invitationTemplate.subject)
  }
}

export { mailTemplates }
