import { MAIL } from '@/constants/mail.const'

const template = `<p>
Dear [USER_NAME],
</p>
<br>
<p style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-bottom: 24px;">
Your sample - [REPORT_ID] for [TEST_NAME] has been rejected by our lab due to damage incurred during transit.
</p>
<p style="font-family: 'Poppins', sans-serif;mso-line-height-rule: exactly;margin: 0;">
Please resubmit your sample, ensuring it is packaged securely to prevent damage during transportation.
</p>
<br>
`

const reportRejectedTemplate = {
  template,
  subject: MAIL.SUBJECTS.SAMPLE_REJECTED,
  keysToReplace: {
    userName: '[USER_NAME]',
    reportId: '[REPORT_ID]',
    testName: '[TEST_NAME]'
  }
}

export { reportRejectedTemplate }
