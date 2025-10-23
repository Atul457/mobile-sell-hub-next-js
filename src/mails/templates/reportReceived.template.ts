import { MAIL } from '@/constants/mail.const'

const template = `
<p style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin-bottom: 0; font-size: 16px; font-weight: 400;">
   Dear [USER_NAME],
</p>
<br>
<p style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-bottom: 24px;">
    Your sample report - [REPORT_ID] for [TEST_NAME] has been received at the lab and is being processed.
</p>
<p style="font-family: 'Poppins', sans-serif; mso-line-height-rule: exactly; margin: 0; margin-top: 24px; margin-bottom: 24px;">
   We will notify you via email once your report is ready for download. You can track your report's status and access more information by logging into your account.
</p>
`

const reportReceivedTemplate = {
  template,
  subject: MAIL.SUBJECTS.SAMPLE_RECIEVED,
  keysToReplace: {
    userName: '[USER_NAME]',
    reportId: '[REPORT_ID]',
    testName: '[TEST_NAME]'
  }
}

export { reportReceivedTemplate }
